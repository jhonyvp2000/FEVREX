"use server";

import { z } from "zod";
import { db, orders, bankAccounts, orderEvents } from "@fevrex/db";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MockRateProvider } from "@fevrex/lib";

const rateProvider = new MockRateProvider();

const CreateOrderSchema = z.object({
    amountSend: z.number().positive(),
    orderType: z.enum(["BUY", "SELL"]), // BUY USD (User Sends PEN), SELL USD (User Sends USD)
    originAccountId: z.string().uuid(),
    destinationAccountId: z.string().uuid(),
});

export async function createOrder(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: { form: ["Unauthorized"] } };

    // const data = Object.fromEntries(formData.entries()); 
    // Handling FormData for generic objects might need manual parsing or z.preprocess
    // Simplified: expecting correct input from client action wrapper

    // Here we assume the client component calls this with structured data or we parse inputs
    // Let's implement valid formData parsing:
    const orderType = formData.get("orderType") as "BUY" | "SELL";
    const amountSend = parseFloat(formData.get("amount") as string);
    const originAccountId = formData.get("originAccountId") as string;
    const destinationAccountId = formData.get("destinationAccountId") as string;

    const parsed = CreateOrderSchema.safeParse({ orderType, amountSend, originAccountId, destinationAccountId });

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
    }

    // Get fresh rate
    const rates = await rateProvider.getRates();
    // BUY USD: User sends PEN. Rate is sell rate (e.g. 3.75). Receive USD = PEN / Rate
    // SELL USD: User sends USD. Rate is buy rate (e.g. 3.72). Receive PEN = USD * Rate

    const rate = orderType === "BUY" ? rates.sell : rates.buy;
    const amountReceive = orderType === "BUY" ? (amountSend / rate) : (amountSend * rate);

    let newOrderId: string;

    try {
        const [order] = await db.insert(orders).values({
            userId: session.user.id,
            orderType,
            amountSend: amountSend.toString(),
            amountReceive: amountReceive.toFixed(2), // Rounding?
            exchangeRate: rate.toString(),
            originAccountId,
            destinationAccountId,
            status: "CREATED",
            // expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
        }).returning({ id: orders.id });

        newOrderId = order.id;

        await db.insert(orderEvents).values({
            orderId: newOrderId,
            status: "CREATED",
            metadata: "User created order via web",
        });

    } catch (e) {
        console.error(e);
        return { error: { form: ["Order creation failed"] } };
    }

    redirect(`/dashboard/orders/${newOrderId}`);
}

export async function confirmPayment(orderId: string, formData: FormData) {
    const opNumber = formData.get("paymentProofRef") as string;
    if (!opNumber) return { error: "Operation number required" };

    await db.update(orders)
        .set({ status: "PENDING_PAYMENT_CONFIRMATION", paymentProofRef: opNumber })
        .where(eq(orders.id, orderId));

    await db.insert(orderEvents).values({
        orderId: orderId,
        status: "PENDING_PAYMENT_CONFIRMATION",
        metadata: `Op Number: ${opNumber}`,
    });

    revalidatePath(`/dashboard/orders/${orderId}`);
}
