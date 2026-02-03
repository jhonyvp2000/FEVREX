import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db, users } from "@fevrex/db";
import { eq } from "drizzle-orm";

export const { auth, signIn, signOut, handlers } = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    // In real app, separate admin users or role check
                    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
                    const user = result[0];

                    if (!user) return null;

                    // Role check
                    if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") return null;

                    if (!user.passwordHash) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.passwordHash); // Assuming we reuse same users table
                    // Note: apps/admin doesn't have bcryptjs installed yet? I should check.
                    // I didn't install bcryptjs in admin. I should.

                    if (passwordsMatch) return user;
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    }
});
