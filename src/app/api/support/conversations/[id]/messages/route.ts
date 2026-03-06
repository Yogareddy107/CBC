import { NextRequest, NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/appwrite';
import { db } from '@/lib/db';
import { conversations, messages } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    const conversationId = params.id;

    const [conversation] = await db.select({ userId: conversations.user_id })
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    if (!conversation || conversation.userId !== user.$id) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Mark admin messages as read when the user views the conversation
    await db.update(messages)
      .set({ status: 'read' })
      .where(
        sql`${messages.conversation_id} = ${conversationId} AND ${messages.sender_type} = 'admin' AND ${messages.status} = 'unread'`
      );

    const convoMessages = await db.select().from(messages)
      .where(eq(messages.conversation_id, conversationId))
      .orderBy(messages.created_at, 'asc');

    return NextResponse.json({ messages: convoMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ messages: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();

    const conversationId = params.id;
    const body = await request.json();
    const messageText = String(body.message || '').trim();

    if (!messageText) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const [conversation] = await db.select({ userId: conversations.user_id })
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    if (!conversation || conversation.userId !== user.$id) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const [created] = await db.insert(messages).values({
      conversation_id: conversationId,
      sender_type: 'user',
      message: messageText,
      status: 'unread',
    }).returning({ id: messages.id });

    return NextResponse.json({ messageId: created?.id });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
