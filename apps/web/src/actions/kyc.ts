"use server";

import { z } from "zod";
import { db, userProfiles } from "@fevrex/db";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const KYCSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    documentType: z.enum(["DNI", "CE", "PASSPORT"]),
    documentNumber: z.string().min(8),
    phone: z.string().min(9),
});

export async function submitKYC(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: { form: ["Unauthorized"] } };

    const data = Object.fromEntries(formData.entries());
    const parsed = KYCSchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
    }

    const { firstName, lastName, documentType, documentNumber, phone } = parsed.data;

    try {
        await db.update(userProfiles)
            .set({
                firstName,
                lastName,
                documentType: documentType as any,
                documentNumber,
                phone,
                kycStatus: "IN_REVIEW", // Or VERIFIED immediately for dev/MVP
            })
            .where(eq(userProfiles.userId, session.user.id));

        revalidatePath("/dashboard");
        revalidatePath("/kyc");
    } catch (err) {
        console.error(err);
        return { error: { form: ["Failed to submit KYC"] } };
    }

    redirect("/dashboard");
}
