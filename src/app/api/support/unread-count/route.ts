import { NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/appwrite';
import { db } from '@/lib/db';
import { messages } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    // Count unread admin messages for this user
    const [result] = await db.select({
      unread: sql`COUNT(*)`
    })
      .from(messages)
      .where(
        sql`${messages.sender_type} = 'admin' AND ${messages.status} = 'unread' AND ${messages.conversation_id} IN (SELECT id FROM conversations WHERE user_id = ${user.$id})`
      );

    return NextResponse.json({ unread: Number(result.unread) || 0 });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json({ unread: 0 });
  }
}
