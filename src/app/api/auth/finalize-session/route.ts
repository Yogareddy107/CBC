import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        // Get all cookies from the request
        const cookieHeader = request.headers.get('cookie') || '';
        console.log('🔍 Finalize session - cookies present:', cookieHeader.split(';').length > 0);
        
        // Try to get the current session from cookies
        // Appwrite should have set a session cookie during OAuth
        const { account } = await createAdminClient();
        
        // Try to list sessions to see if one exists
        try {
            // Use account to verify we have an active session
            // This might work if OAuth properly set the cookie
            const currentSession = await account.listSessions();
            console.log('✅ Active sessions found:', currentSession.total);
        } catch (e) {
            console.log('⚠️ Could not list sessions');
        }
        
        return NextResponse.json({
            success: true,
            message: 'Session finalized'
        });
    } catch (error: any) {
        console.error('Session finalization error:', error);
        return NextResponse.json(
            { error: 'Failed to finalize session', details: error.message },
            { status: 500 }
        );
    }
}
