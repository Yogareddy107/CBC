import { Suspense } from 'react';
import { db } from '@/lib/db';
import { analyses as analysesTable } from '@/lib/db/schema';
import { createSessionClient } from '@/lib/appwrite';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Github, ExternalLink, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { NewAnalysisForm } from '@/components/dashboard/NewAnalysisForm';
import { desc, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
    let user: { $id: string, email: string } | null = null;
    try {
        const { account } = await createSessionClient();
        const appwriteUser = await account.get();
        user = {
            $id: appwriteUser.$id,
            email: appwriteUser.email,
        };
    } catch (e) {
        // Session verification failed, check if this is an OAuth session
        const cookieStore = await cookies();
        const cookieNames = Array.from(cookieStore.getAll()).map(c => c.name);
        
        console.log('⚠️ Session check failed in dashboard. Available cookies:', cookieNames);
        console.log('Error:', (e as any)?.message);
        
        // If we have any appwrite-related cookies, we might have a valid OAuth session
        // but the cookie wasn't set properly. Redirect to a session recovery page.
        const hasSession = cookieNames.some(name => 
            name.includes('appwrite') || name.includes('session')
        );
        
        if (hasSession) {
            // We have Appwrite session data but createSessionClient failed
            // This might be an OAuth session - redirect to a recovery page
            redirect('/auth/session-recovery');
        }
        
        // No session found at all
        redirect('/login');
    }


    // Fetch recent analyses using Drizzle
    const analyses = await db.select()
        .from(analysesTable)
        .where(eq(analysesTable.user_id, user.$id))
        .orderBy(desc(analysesTable.created_at))
        .limit(5);

    return (
        <div className="max-w-4xl mx-auto px-6 py-20 space-y-24">
            {/* New Analysis Section */}
            <section className="space-y-10 text-center">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">New Analysis</h1>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Enter a public GitHub repository URL to begin the architectural analysis.
                    </p>
                </div>

                <Suspense fallback={<div className="h-10 animate-pulse bg-secondary/20 rounded-xl" />}>
                    <NewAnalysisForm />
                </Suspense>
            </section>

            {/* Recent Analyses Section */}
            <section className="space-y-6 pt-12 border-t border-border/20">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Recent Analyses</h2>
                    <Link href="/dashboard/history" className="text-xs font-medium text-primary hover:underline">
                        View all history
                    </Link>
                </div>

                {!analyses || analyses.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-border/40 rounded-2xl bg-secondary/5">
                        <p className="text-sm text-muted-foreground">No analysis history yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {analyses.map((analysis) => {
                            const repoName = analysis.repo_url.split('/').pop() || analysis.repo_url;
                            const date = analysis.created_at ? new Date(analysis.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            }) : 'N/A';

                            return (
                                <Link
                                    key={analysis.id}
                                    href={`/report/${analysis.id}`}
                                    className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border/40 hover:border-primary/30 hover:bg-secondary/10 transition-all shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-secondary/30 flex items-center justify-center border border-border/10">
                                            <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                                    {repoName}
                                                </span>
                                                <Badge variant={analysis.status === 'completed' ? 'secondary' : analysis.status === 'failed' ? 'destructive' : 'outline'} className="text-[10px] h-4 px-1.5 font-bold uppercase tracking-wider">
                                                    {analysis.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                                                <Clock className="w-3 h-3" />
                                                {date}
                                            </div>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-colors" />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

