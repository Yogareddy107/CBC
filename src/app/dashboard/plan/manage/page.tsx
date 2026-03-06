import { createSessionClient } from '@/lib/appwrite';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import CancelSubscriptionButton from '@/components/CancelSubscriptionButton';

export default async function ManageBillingPage() {
    let user;
    try {
        const { account } = await createSessionClient();
        user = await account.get();
    } catch (e) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-24">
                <p className="text-red-600">
                    You need to be signed in to manage billing. <a href="/login" className="text-primary underline">Log in</a>.
                </p>
            </div>
        );
    }

    const subs = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.user_id, user.$id))
        .orderBy(sql`${subscriptions.created_at} DESC`)
        .limit(1);

    const currentSub = subs[0] || null;

    return (
        <div className="max-w-3xl mx-auto px-6 py-24 space-y-8">
            <h1 className="text-3xl font-bold">Manage Billing</h1>

            {!currentSub ? (
                <p>
                    You don&apos;t have an active subscription.{' '}
                    <a href="/dashboard/plan" className="text-primary underline">
                        Choose a plan
                    </a>
                    .
                </p>
            ) : (
                <div className="space-y-4">
                    <p>Status: {currentSub.status}</p>
                    <p>Amount: ${currentSub.amount?.toFixed(2)}</p>
                    <p>Next period ends: {currentSub.current_period_end ? new Date(currentSub.current_period_end).toLocaleDateString() : 'N/A'}</p>
                    {currentSub.status === 'active' && (
                        <CancelSubscriptionButton
                            userId={user.$id}
                            subscriptionId={currentSub.razorpay_subscription_id || ''}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
