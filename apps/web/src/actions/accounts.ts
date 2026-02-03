"use server";

import { z } from "zod";
import { db, bankAccounts } from "@fevrex/db";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const AccountSchema = z.object({
    alias: z.string().min(1),
    bankName: z.string().min(1),
    currency: z.enum(["PEN", "USD"]),
    accountNumber: z.string().min(10), // Basic length check
    cci: z.string().optional(),
});

export async function addBankAccount(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: { form: ["Unauthorized"] } };

    const data = Object.fromEntries(formData.entries());
    const parsed = AccountSchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
    }

    const { alias, bankName, currency, accountNumber, cci } = parsed.data;

    try {
        await db.insert(bankAccounts).values({
            userId: session.user.id,
            alias,
            bankName,
            currency,
            accountNumber,
            cci: cci || undefined,
            isVerified: true, // Auto-verify for MVP
        });

        revalidatePath("/dashboard/accounts");
        revalidatePath("/dashboard");
    } catch (err) {
        console.error(err);
        return { error: { form: ["Failed to add account"] } };
    }

    redirect("/dashboard/accounts");
}

export async function deleteBankAccount(accountId: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    await db.delete(bankAccounts).where(and(eq(bankAccounts.id, accountId), eq(bankAccounts.userId, session.user.id)));
    revalidatePath("/dashboard/accounts");
}
