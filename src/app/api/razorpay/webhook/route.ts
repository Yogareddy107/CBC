import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    if (!webhookSecret) {
      console.error('❌ RAZORPAY_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify the signature
    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);

    if (!isValid) {
      console.warn('⚠️ Invalid Razorpay webhook signature received');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = body.event;
    const data = body.payload;

    console.log(`Razorpay Event: ${event}`, data);

    switch (event) {
      case 'subscription.activated': {
        const subscriptionId = data.subscription?.entity?.id;
        if (subscriptionId) {
          console.log(`Subscription activated: ${subscriptionId}`);
          // Update subscription status in DB
          await db.update(subscriptions)
            .set({ status: 'active' })
            .where(eq(subscriptions.razorpay_subscription_id, subscriptionId));
        }
        break;
      }

      case 'subscription.paused': {
        const subscriptionId = data.subscription?.entity?.id;
        if (subscriptionId) {
          console.log(`Subscription paused: ${subscriptionId}`);
          await db.update(subscriptions)
            .set({ status: 'paused' })
            .where(eq(subscriptions.razorpay_subscription_id, subscriptionId));
        }
        break;
      }

      case 'subscription.cancelled': {
        const subscriptionId = data.subscription?.entity?.id;
        if (subscriptionId) {
          console.log(`Subscription cancelled: ${subscriptionId}`);
          await db.update(subscriptions)
            .set({ status: 'canceled' })
            .where(eq(subscriptions.razorpay_subscription_id, subscriptionId));
        }
        break;
      }

      case 'subscription.completed': {
        const subscriptionId = data.subscription?.entity?.id;
        if (subscriptionId) {
          console.log(`Subscription completed: ${subscriptionId}`);
          await db.update(subscriptions)
            .set({ status: 'completed' })
            .where(eq(subscriptions.razorpay_subscription_id, subscriptionId));
        }
        break;
      }

      case 'payment.authorized': {
        console.log('Payment authorized:', data.payment?.entity?.id);
        break;
      }

      case 'payment.failed': {
        console.log('Payment failed:', data.payment?.entity?.id);
        break;
      }

      default:
        console.log(`Unhandled event: ${event}`);
    }

    return NextResponse.json({
      success: true,
      message: `Event ${event} processed successfully`,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
