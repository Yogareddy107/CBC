import { CreditCard, Rocket, Check, X } from 'lucide-react';
import { analyses as analysesTable, subscriptions as subscriptionsTable } from '@/lib/db/schema';
import { count, eq, sql, and } from 'drizzle-orm';
import { createSessionClient } from '@/lib/appwrite';
import { db } from '@/lib/db';
import PlanActions from '@/components/PlanActions';

export default async function PlanPage() {
    let user;
    try {
        const { account } = await createSessionClient();
        user = await account.get();
    } catch (e) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-24">
                <p className="text-red-600">You must be signed in to view your plan. Please <a href="/login" className="text-primary underline">log in</a>.</p>
            </div>
        );
    }

    let currentSub = null;
    let currentPlanName = 'Free Usage';
    let analysesThisMonth = 0;
    let tokensUsed = 0;

    try {
        const subs = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.user_id, user.$id)).orderBy(sql`${subscriptionsTable.created_at} DESC`).limit(1);
        currentSub = subs[0] || null;
        currentPlanName = currentSub ? 'Pro' : 'Free Usage';
    } catch (e) {
        console.error('Error fetching subscriptions:', e);
    }

    try {
        // quota and token usage for the current month
        const [analysisCountResult] = await db.select({ value: count() })
            .from(analysesTable)
            .where(and(
                eq(analysesTable.user_id, user.$id),
                sql`date(${analysesTable.created_at}) >= date('now','start of month')`
            ));
        analysesThisMonth = analysisCountResult?.value || 0;

        const [charSumResult] = await db.select({ value: sql<number>`SUM(LENGTH(${analysesTable.result}))` })
            .from(analysesTable)
            .where(and(
                eq(analysesTable.user_id, user.$id),
                sql`date(${analysesTable.created_at}) >= date('now','start of month')`
            ));
        const totalChars = charSumResult?.value || 0;
        tokensUsed = Math.floor(totalChars / 4); // estimate
    } catch (e) {
        console.error('Error fetching analysis stats:', e);
    }


    return (
        <div className="max-w-3xl mx-auto px-6 py-24 space-y-12">
            <header className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Your Subscription Plan</h1>
                <p className="text-muted-foreground">Manage your billing and choose the plan that fits your engineering needs.</p>
            </header>

            <div className="p-8 border border-[#1A1A1A]/5 rounded-2xl bg-white shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-[#1A1A1A]/5 pb-8">
                    <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40">Current Plan</p>
                        <h2 className="text-2xl font-bold text-[#1A1A1A]">{currentPlanName}</h2>
                        {currentSub && (
                            <p className="text-sm text-[#666]">Since {currentSub.created_at ? new Date(currentSub.created_at).toLocaleDateString() : 'N/A'}</p>
                        )}
                    </div>
                    <a href="/dashboard/plan/manage" className="gap-2 border-[#1A1A1A]/10 hover:bg-[#F7F7F7] inline-flex items-center px-3 py-2 rounded text-sm border">
                        <CreditCard className="w-4 h-4" />
                        Manage Billing
                    </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-xl border border-[#1A1A1A]/5 bg-[#F7F7F7] space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/40">Analysis Quota</p>
                        <p className="font-semibold text-sm text-[#1A1A1A]">{analysesThisMonth} / 10 used this month</p>
                        <div className="w-full h-1 bg-[#1A1A1A]/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#FF7D29]"
                                style={{ width: `${Math.min((analysesThisMonth / 10) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-[#1A1A1A]/5 bg-[#F7F7F7] space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/40">Tokens Used</p>
                        <p className="font-semibold text-sm text-[#1A1A1A]">{tokensUsed} tokens consumed</p>
                        <div className="w-full h-1 bg-[#1A1A1A]/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#FF7D29]/40"
                                style={{ width: `${Math.min(tokensUsed / 10000 * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <section className="text-center pt-8">
                {/* pricing cards matching landing page so logged-in users can choose */}
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Free Tier Card */}
                    <div className="bg-white border border-[#1A1A1A]/5 rounded-[32px] p-10 shadow-sm flex h-full flex-col justify-between gap-8 transition-all hover:shadow-md">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-[#1A1A1A]">Free</h3>
                                <p className="text-sm font-medium text-[#1A1A1A]/50">For exploring and testing</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-[#1A1A1A]">$0</span>
                                <span className="text-sm font-medium text-[#1A1A1A]/40">/ forever</span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <p className="text-sm font-bold text-[#1A1A1A]/40 uppercase tracking-widest">Includes:</p>
                            <ul className="space-y-4">
                                {[
                                    { included: true, text: "4 deep repo analyses (lifetime)" },
                                    { included: true, text: "Architecture mapping & entry points" },
                                    { included: true, text: "Basic structural overview" },
                                    { included: false, text: "Analysis history" },
                                    { included: false, text: "Large repository support" },
                                    { included: false, text: "Priority processing" },
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                        {feature.included ? (
                                            <Check className="w-4 h-4 text-[#FF782D]" />
                                        ) : (
                                            <X className="w-4 h-4 text-[#1A1A1A]/20" />
                                        )}
                                        <span className={feature.included ? "text-[#1A1A1A]" : "text-[#1A1A1A]/40"}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {currentSub ? (
                            <button disabled className="w-full h-14 bg-[#1A1A1A]/20 text-[#1A1A1A]/50 font-bold rounded-2xl">
                                Current Plan
                            </button>
                        ) : (
                            <a href="/dashboard/plan/manage" className="w-full h-14 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white font-bold rounded-2xl transition-all flex items-center justify-center">
                                Stay on Free
                            </a>
                        )}
                    </div>

                    {/* Pro Monthly Tier Card */}
                    <div className="bg-white border border-[#1A1A1A]/5 rounded-[32px] p-10 shadow-sm flex h-full flex-col justify-between gap-8 transition-all hover:shadow-md">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-[#1A1A1A]">Pro</h3>
                                <p className="text-sm font-medium text-[#1A1A1A]/50">For engineers evaluating code daily</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-[#1A1A1A]">$10</span>
                                <span className="text-sm font-medium text-[#1A1A1A]/40">/ month</span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <p className="text-sm font-bold text-[#FF782D] uppercase tracking-widest">All Free features, plus:</p>
                            <ul className="space-y-4">
                                {[
                                    { included: true, text: "Unlimited analyses (fair use)" },
                                    { included: true, text: "Large repository support" },
                                    { included: true, text: "Detailed architecture breakdown" },
                                    { included: true, text: "Risk & complexity signals" },
                                    { included: true, text: "Analysis history" },
                                    { included: true, text: "Priority processing" },
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                        <Check className="w-4 h-4 text-[#FF782D]" />
                                        <span className="text-[#1A1A1A]">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* use PlanActions for handling upgrade/manage */}
                        <PlanActions
                            userId={user.$id}
                            currentSub={currentSub ? { plan: 'pro', status: currentSub.status || 'active' } : null}
                            planId="pro_monthly"
                            label="Upgrade to Pro Plan"
                        />
                    </div>

                    {/* Pro Yearly Tier Card (Recommended) */}
                    <div className="relative bg-white border border-[#FF782D]/20 rounded-[32px] p-10 shadow-sm flex h-full flex-col justify-between gap-8 transition-all hover:shadow-md">
                        <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#FF782D] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                            Recommended • Save 34%
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-[#1A1A1A]">Pro Yearly</h3>
                                <p className="text-sm font-medium text-[#1A1A1A]/50">For serious developers and teams</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-[#1A1A1A]">$79</span>
                                <span className="text-sm font-medium text-[#1A1A1A]/40">/ year</span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <p className="text-sm font-bold text-[#FF782D] uppercase tracking-widest">Includes everything in Pro, plus:</p>
                            <ul className="space-y-4">
                                {[
                                    { included: true, text: "Unlimited analyses" },
                                    { included: true, text: "Priority processing" },
                                    { included: true, text: "Early access to new analysis features" },
                                    { included: true, text: "Advanced repository insights" },
                                    { included: true, text: "Historical trend tracking" },
                                    { included: true, text: "Priority support" },
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                        <Check className="w-4 h-4 text-[#FF782D]" />
                                        <span className="text-[#1A1A1A]">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <PlanActions
                            userId={user.$id}
                            currentSub={currentSub ? { plan: 'pro', status: currentSub.status || 'active' } : null}
                            planId="pro_yearly"
                            label="Upgrade to Pro Yearly"
                        />
                    </div>

                    {/* Enterprise Tier Card */}
                    <div className="bg-white border border-[#1A1A1A]/5 rounded-[32px] p-10 shadow-sm flex h-full flex-col justify-between gap-8 transition-all hover:shadow-md">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-[#1A1A1A]">Enterprise</h3>
                                <p className="text-sm font-medium text-[#1A1A1A]/50">For companies and engineering teams</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-[#1A1A1A]">Custom</span>
                                <span className="text-sm font-medium text-[#1A1A1A]/40">pricing</span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            <p className="text-sm font-bold text-[#FF782D] uppercase tracking-widest">Includes everything in Pro, plus:</p>
                            <ul className="space-y-4">
                                {[
                                    { included: true, text: "Organization repository scanning" },
                                    { included: true, text: "Bulk repository analysis" },
                                    { included: true, text: "Private repository support" },
                                    { included: true, text: "Team dashboard" },
                                    { included: true, text: "API access" },
                                    { included: true, text: "Security & compliance reporting" },
                                    { included: true, text: "Dedicated support" },
                                    { included: true, text: "SLA guarantees" },
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                        <Check className="w-4 h-4 text-[#FF782D]" />
                                        <span className="text-[#1A1A1A]">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <a href="mailto:teamintrasphere@gmail.com" className="w-full h-14 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white font-bold rounded-2xl flex items-center justify-center transition-all">
                            Contact Sales
                        </a>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic">Billed once per month. Cancel anytime.</p>
            </section>
        </div>
    );
}
