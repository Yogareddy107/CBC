'use server';

import { createAdminClient, createSessionClient } from '@/lib/appwrite';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { ID } from 'node-appwrite';
import { isAdminEmail } from '@/lib/admin';
import { z } from 'zod';

const AuthSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export async function signInWithEmail(formData: FormData) {
    const rawEmail = (formData.get('email') as string)?.toLowerCase();
    const rawPassword = formData.get('password') as string;

    // Validate input
    const validated = AuthSchema.safeParse({ email: rawEmail, password: rawPassword });
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    const { email, password } = validated.data;

    try {
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        // return flag indicating whether the user is an admin
        const isAdmin = isAdminEmail(email);
        return { success: true, isAdmin };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function signUpWithEmail(formData: FormData) {
    const rawEmail = (formData.get('email') as string)?.toLowerCase();
    const rawPassword = formData.get('password') as string;
    const rawName = formData.get('name') as string || rawEmail.split('@')[0];

    // Validate input
    const validated = AuthSchema.safeParse({ email: rawEmail, password: rawPassword });
    if (!validated.success) {
        return { error: validated.error.issues[0].message };
    }

    const { email, password } = validated.data;
    const name = rawName.trim().substring(0, 100); // Sanitize name length

    try {
        const { account } = await createAdminClient();
        await account.create(ID.unique(), email, password, name);

        // Log them in immediately after sign up
        return await signInWithEmail(formData);
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function signOut() {
    try {
        const { account } = await createSessionClient();

        (await cookies()).delete("appwrite-session");
        await account.deleteSession("current");
    } catch (error) {
        // Even if session delete fails on server, we clear the cookie
        (await cookies()).delete("appwrite-session");
    }

    redirect("/");
}

// GitHub OAuth implementation - handled client-side now
// See @/lib/appwrite-client.ts for signInWithGitHubClient()

// Google OAuth implementation - handled client-side now
// See @/lib/appwrite-client.ts for signInWithGoogleClient()

