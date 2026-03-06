import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cancelRazorpaySubscription as razorpayCancel } from '@/lib/razorpay';

export async function POST(req: Request) {
    try {
        const { userId, subscriptionId } = await req.json();
        if (!userId || !subscriptionId) {
            return NextResponse.json({ error: 'missing parameters' }, { status: 400 });
        }

        // double check subscription belongs to user
        const subs = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.id, subscriptionId))
            .limit(1);
        const sub = subs[0];
        if (!sub || sub.user_id !== userId || !sub.razorpay_subscription_id) {
            return NextResponse.json({ error: 'subscription not found' }, { status: 404 });
        }

        // ask Razorpay to cancel (id is non-null now)
        await razorpayCancel(sub.razorpay_subscription_id);

        // update our record
        await db
            .update(subscriptions)
            .set({ status: 'canceled' })
            .where(eq(subscriptions.id, sub.id));

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error('cancel subscription error', e);
        return NextResponse.json({ error: e.message || 'unknown error' }, { status: 500 });
    }
}
