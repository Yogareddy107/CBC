import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)

    // OAuth parameters from Appwrite redirect
    const userId = searchParams.get('userId')
    const secret = searchParams.get('secret')
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const next = searchParams.get('next') ?? '/dashboard'

    try {
        // If we have userId and secret from OAuth callback, create session
        if (userId && secret) {
            const { account } = await createAdminClient();
            
            // Create a session with the OAuth credentials
            const session = await account.createSession(userId, secret);
            
            (await cookies()).set('appwrite-session', session.secret, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: true,
            });

            return NextResponse.redirect(`${origin}${next}`)
        }

        // Fallback: try standard session check
        const { account } = await createAdminClient();
        try {
            const user = await account.get();
            if (user) {
                return NextResponse.redirect(`${origin}${next}`)
            }
        } catch (e) {
            // No session yet
        }
    } catch (e: any) {
        console.error('OAuth callback error:', e);
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(e.message || 'Authentication failed')}`)
    }

    // return the user to login if authentication failed
    return NextResponse.redirect(`${origin}/login?error=Authentication required`)
}

