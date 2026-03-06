import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface UserPlan {
  plan: 'free' | 'pro';
  isActive: boolean;
  expiresAt: Date | null;
  daysRemaining: number | null;
}

/**
 * Get user's current plan, checking for expiration
 * If subscription expired, automatically downgrade to free
 */
export async function getUserPlan(userId: string): Promise<UserPlan> {
  try {
    const userSubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.user_id, userId))
      .limit(1);

    if (userSubs.length === 0) {
      // No subscription found, user is on free plan
      return {
        plan: 'free',
        isActive: false,
        expiresAt: null,
        daysRemaining: null,
      };
    }

    const sub = userSubs[0];
    const now = new Date();
    const expirationTime = sub.current_period_end ? sub.current_period_end * 1000 : null; // Convert Unix timestamp to ms
    const expiresAt = expirationTime ? new Date(expirationTime) : null;

    // Check if subscription is expired
    const isExpired = expiresAt && now > expiresAt;

    if (isExpired) {
      // Downgrade to free plan
      await db
        .update(subscriptions)
        .set({
          plan: 'free',
          status: 'expired',
        })
        .where(eq(subscriptions.user_id, userId));

      return {
        plan: 'free',
        isActive: false,
        expiresAt: expiresAt,
        daysRemaining: 0,
      };
    }

    // Plan is still active
    const daysRemaining = expiresAt
      ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      plan: (sub.plan || 'free') as 'free' | 'pro',
      isActive: sub.status === 'active' && !isExpired,
      expiresAt: expiresAt,
      daysRemaining: daysRemaining,
    };
  } catch (error) {
    console.error('Error getting user plan:', error);
    // Fail open - return free plan on error
    return {
      plan: 'free',
      isActive: false,
      expiresAt: null,
      daysRemaining: null,
    };
  }
}

/**
 * Check if user has an active pro plan
 */
export async function isProUser(userId: string): Promise<boolean> {
  const userPlan = await getUserPlan(userId);
  return userPlan.plan === 'pro' && userPlan.isActive;
}

/**
 * Get days remaining on plan (returns 0 for free plan)
 */
export async function getDaysRemaining(userId: string): Promise<number> {
  const userPlan = await getUserPlan(userId);
  return userPlan.daysRemaining || 0;
}

/**
 * Format plan display info
 */
export function formatPlanInfo(plan: UserPlan): string {
  if (plan.plan === 'free' || !plan.isActive) {
    if (plan.expiresAt) {
      return `Free Plan (Pro plan expired on ${plan.expiresAt.toLocaleDateString()})`;
    }
    return 'Free Plan';
  }

  if (plan.daysRemaining === 1) {
    return `Pro Plan - Expires tomorrow`;
  }

  if (plan.daysRemaining === 0) {
    return `Pro Plan - Expires today`;
  }

  return `Pro Plan - ${plan.daysRemaining} days remaining`;
}
