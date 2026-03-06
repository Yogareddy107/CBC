import { db } from '@/lib/db';
import { analyses as analysesTable } from '@/lib/db/schema';
import { createSessionClient } from '@/lib/appwrite';
import { notFound } from 'next/navigation';
import { AnalysisReport } from '@/components/AnalysisReport';
import { AnalysisRunner } from '@/components/AnalysisRunner';
import { AnalysisResult } from '@/lib/llm/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ShareReportButton } from '@/components/ShareReportButton';
import { eq } from 'drizzle-orm';

interface ReportPageProps {
    params: {
        id: string;
    };
}

export default async function ReportPage({ params: paramsPromise }: ReportPageProps) {
    const params = await paramsPromise;
    let user: { id: string, email: string } | null = null;
    try {
        const { account } = await createSessionClient();
        const appwriteUser = await account.get();
        user = {
            id: appwriteUser.$id,
            email: appwriteUser.email,
        };
    } catch {
        // User might not be logged in
    }



    // Fetch analysis using Drizzle
    const [analysis] = await db.select()
        .from(analysesTable)
        .where(eq(analysesTable.id, params.id))
        .limit(1);

    if (!analysis) {
        notFound();
    }

    const isCompleted = analysis.status === 'completed';
    const result = analysis.result as AnalysisResult | null;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Navbar user={user} />

            <div className="border-b border-border/40 bg-secondary/5">
                <div className="max-w-4xl mx-auto px-6 py-3 flex justify-between items-center">
                    <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-3 h-3" />
                        {user ? 'Back to Dashboard' : 'Back to Home'}
                    </Link>
                    <ShareReportButton />
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {isCompleted && result ? (
                    <AnalysisReport data={result} repoUrl={analysis.repo_url} />
                ) : (
                    <AnalysisRunner
                        analysisId={analysis.id}
                        repoUrl={analysis.repo_url}
                        initialStatus={analysis.status || 'pending'}
                    />
                )}
            </main>
        </div>
    );
}

