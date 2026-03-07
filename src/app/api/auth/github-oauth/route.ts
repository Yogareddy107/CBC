import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite';
import { OAuthProvider } from 'node-appwrite';

export async function GET(request: NextRequest) {
    try {
        const { account } = await createAdminClient();

        const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
        const protocol = request.headers.get('x-forwarded-proto') || 'https';
        const fallbackOrigin = host ? `${protocol}://${host}` : request.nextUrl.origin;

        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        const origin = appUrl || fallbackOrigin;
        const redirectUrl = `${origin}/auth/github-callback`;

        console.log('GitHub OAuth Request:', {
            provider: 'github',
            redirectUrl,
            success: `${redirectUrl}?success=true`,
            failure: `${redirectUrl}?failure=true`,
        });

        // Create OAuth token URL
        const loginUrl = await account.createOAuth2Token(
            OAuthProvider.Github,
            `${redirectUrl}?success=true`,
            `${redirectUrl}?failure=true`
        );

        console.log('GitHub OAuth URL Created:', loginUrl);
        return NextResponse.json({ url: loginUrl });
    } catch (error: any) {
        console.error('GitHub OAuth error:', {
            message: error.message,
            code: error.code,
            type: error.type,
            response: error.response,
        });
        return NextResponse.json(
            {
                error: error.message || 'Failed to initiate GitHub login',
                code: error.code,
                type: error.type
            },
            { status: 500 }
        );
    }
}
