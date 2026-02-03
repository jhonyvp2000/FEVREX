"use server";

import { db, orders, orderEvents } from "@fevrex/db";
import { eq } from "drizzle-orm";
// import { auth } from "@/auth"; // Check role
import { revalidatePath } from "next/cache";

// We should check role here ideally
export async function adminConfirmReceived(orderId: string) {
    await db.update(orders)
        .set({ status: "PAYMENT_CONFIRMED" }) // Or PAYOUT_IN_PROGRESS directly if manual
        .where(eq(orders.id, orderId));

    await db.insert(orderEvents).values({
        orderId,
        status: "PAYMENT_CONFIRMED",
        metadata: "Admin confirmed receipt",
    });

    revalidatePath(`/dashboard/orders/${orderId}`);
    revalidatePath(`/dashboard`);
}

export async function adminMarkCompleted(orderId: string) {
    await db.update(orders)
        .set({ status: "COMPLETED" })
        .where(eq(orders.id, orderId));

    await db.insert(orderEvents).values({
        orderId,
        status: "COMPLETED",
        metadata: "Admin marked as completed (payout done)",
    });

    revalidatePath(`/dashboard/orders/${orderId}`);
    revalidatePath(`/dashboard`);
}
