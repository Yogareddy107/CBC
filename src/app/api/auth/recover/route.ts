import { NextRequest, NextResponse } from 'next/server';
import { Client, Account } from 'node-appwrite';

export async function POST(request: NextRequest) {
  try {
    const { email, redirectUrl } = await request.json();
    if (!email || !redirectUrl) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // We use a regular client (no API key) to trigger recovery
    // This is a public-facing action in Appwrite
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    const account = new Account(client);

    // Appwrite's createRecovery takes (email, url)
    await account.createRecovery(email, redirectUrl);

    return NextResponse.json({ success: true, message: 'Recovery email sent (if the address exists).' });
  } catch (error: any) {
    console.error('Recovery error:', error);
    return NextResponse.json({ error: error.message || 'Failed to initiate recovery' }, { status: 500 });
  }
}
