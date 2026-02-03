"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db, users, userProfiles } from "@fevrex/db";
import { signIn } from "@/auth";

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    accountType: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export async function registerAction(prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const parsed = RegisterSchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.flatten().fieldErrors };
    }

    const { email, password, accountType } = parsed.data;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in DB
        const [newUser] = await db.insert(users).values({
            email,
            passwordHash: hashedPassword,
            role: "USER",
        }).returning({ id: users.id });

        // Create profile stub
        await db.insert(userProfiles).values({
            userId: newUser.id,
            kycStatus: "PENDING",
            // @ts-ignore - Schema update pending migration
            accountType: accountType as string || "PERSONAL",
        });

        // Login directly? Or redirect to login? Let's redirect to dashboard which triggers login/auth
        // Actually best to call signIn to create session immediately if supported in same req, or redirect to login.
        // Credentials provider signIn usually works server side but better to redirect to login page with success message or auto-login.

        // We will redirect to login for simplicity in MVP flow
        return { success: true };

    } catch (err) {
        console.error(err);
        if (err instanceof Error && err.message.includes("unique constraint")) {
            return { error: { email: ["Email already exists"] } };
        }
        return { error: { form: ["Something went wrong"] } };
    }
}

export async function loginAction(prevState: any, formData: FormData) {
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if ((error as Error).message.includes("CredentialsSignin")) {
            return { error: "Invalid credentials." };
        }
        throw error;
    }
}
