import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const allParams = Object.fromEntries(searchParams.entries());

    // OAuth parameters from Appwrite redirect
    const userId = searchParams.get('userId')
    const secret = searchParams.get('secret')
    const next = searchParams.get('next') ?? '/dashboard'

    console.log('🔄 GitHub OAuth callback received', {
        origin,
        params: allParams,
        hasUserId: !!userId,
        hasSecret: !!secret
    });

    try {
        if (userId && secret) {
            console.log('✅ Found userId and secret, creating session...');
            const { account } = await createAdminClient();

            // Create a session with the OAuth credentials
            const session = await account.createSession(userId, secret);
            console.log('✅ Session created successfully');

            (await cookies()).set('appwrite-session', session.secret, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            });

            console.log('✅ Cookie set, redirecting to:', next);
            return NextResponse.redirect(`${origin}${next}`)
        }

        console.warn('⚠️ Missing userId or secret from GitHub callback. Redirecting to login with error.');
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('GitHub authentication failed: Missing credentials in callback.')}`)
    } catch (e: any) {
        console.error('❌ GitHub OAuth callback error:', e);
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(e.message || 'GitHub authentication failed')}`)
    }
}
