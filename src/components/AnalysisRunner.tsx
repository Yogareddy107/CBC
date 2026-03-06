'use client';

import { useEffect, useState } from 'react';
import { runAnalysis } from '@/app/analyze/actions';
import { AnalysisReport } from '@/components/AnalysisReport';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { AnalysisResult } from '@/lib/llm/client';

interface AnalysisRunnerProps {
    analysisId: string;
    repoUrl: string;
    initialStatus: string;
}

export function AnalysisRunner({ analysisId, repoUrl, initialStatus }: AnalysisRunnerProps) {
    const [status, setStatus] = useState(initialStatus);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'pending' || status === 'running') {
            const execute = async () => {
                try {
                    const res = await runAnalysis(analysisId, repoUrl);
                    if (res.success && res.data) {
                        setResult(res.data as unknown as AnalysisResult);
                        setStatus('completed');
                    } else {
                        setError(res.error || "Analysis failed.");
                        setStatus('failed');
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : "An unexpected error occurred.");
                    setStatus('failed');
                }
            };
            execute();
        }
    }, [analysisId, repoUrl, status]);

    if (status === 'completed' && result) {
        return <AnalysisReport data={result} repoUrl={repoUrl} />;
    }

    if (status === 'failed' || error) {
        return (
            <div className="p-8 text-center border border-dashed border-destructive/40 rounded-xl bg-destructive/5 space-y-4">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                <p className="text-destructive font-bold text-xl">Analysis Failed</p>
                <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    {error || "Something went wrong while analyzing this repository."}
                </p>
                <Button asChild variant="outline">
                    <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight">
                    {status === 'pending' ? 'Preparing Analysis...' : 'Analyzing Repository...'}
                </h2>
                <p className="text-sm text-muted-foreground italic">
                    This usually takes around 30-60 seconds. Grab a coffee, we&apos;re mapping the territory.
                </p>
            </div>
        </div>
    );
}
