import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification parameters' },
        { status: 400 }
      );
    }

    // Verify the signature
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 401 }
      );
    }

    // Calculate expiration date: 30 days from now
    const now = new Date();
    const expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const currentPeriodEnd = Math.floor(expirationDate.getTime() / 1000); // Unix timestamp

    // Check if user already has an active subscription
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.user_id, userId))
      .limit(1);

    if (existingSubscription.length > 0) {
      // Update existing subscription
      await db
        .update(subscriptions)
        .set({
          razorpay_subscription_id: razorpay_payment_id,
          plan: 'pro',
          amount: 999, // Pro plan price
          status: 'active',
          current_period_end: currentPeriodEnd,
        })
        .where(eq(subscriptions.user_id, userId));
    } else {
      // Insert new subscription
      await db.insert(subscriptions).values({
        id: `sub_${Date.now()}`,
        user_id: userId,
        razorpay_subscription_id: razorpay_payment_id,
        plan: 'pro',
        amount: 999,
        status: 'active',
        current_period_end: currentPeriodEnd,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Plan upgraded to Pro for 30 days!',
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
