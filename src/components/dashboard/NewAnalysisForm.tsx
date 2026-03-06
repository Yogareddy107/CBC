'use client';

import { useState, useEffect } from 'react';
import { Github, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createAnalysis } from '@/app/analyze/actions';
import { useRouter, useSearchParams } from 'next/navigation';

export function NewAnalysisForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const urlParam = searchParams.get('url');
        if (urlParam) {
            setUrl(urlParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || loading) return;

        setLoading(true);
        try {
            const res = await createAnalysis(url);
            if (res.id) {
                router.push(`/report/${res.id}`);
            }
        } catch (err) {
            console.error("Analysis creation failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Github className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <Input
                    name="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/owner/repository"
                    className="h-16 pl-12 pr-4 text-lg bg-secondary/20 border-border/60 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-xl shadow-sm"
                    required
                />
            </div>
            <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl shadow-md border border-primary/20"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin mr-2 w-4 h-4" />
                        Initializing...
                    </>
                ) : (
                    'Analyze Repository'
                )}
            </Button>
        </form>
    );
}
