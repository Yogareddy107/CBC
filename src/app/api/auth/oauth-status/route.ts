import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite';

export async function GET() {
    try {
        const { account } = await createAdminClient();

        // Try to get OAuth identity list to see what's configured
        const providers = await account.listIdentities?.() ?? [];

        return NextResponse.json({
            status: 'ok',
            providers,
            endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
            projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
        });
    } catch (error: any) {
        console.error('OAuth status check error:', error);
        return NextResponse.json({
            status: 'error',
            message: error.message,
            code: error.code,
        }, { status: 500 });
    }
}
