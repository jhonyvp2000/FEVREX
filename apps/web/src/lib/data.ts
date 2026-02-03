import { db, userProfiles, users } from "@fevrex/db";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getUserProfile = cache(async (userId: string) => {
    const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);
    return profile;
});
