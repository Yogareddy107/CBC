import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite';

export async function POST(request: NextRequest) {
  try {
    const { userId, secret, password } = await request.json();
    if (!userId || !secret || !password) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const { account } = await createAdminClient();

    // Complete the recovery by updating the password
    await account.updateRecovery(userId, secret, password);

    return NextResponse.json({ success: true, message: 'Password updated' });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
