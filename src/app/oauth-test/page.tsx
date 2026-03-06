'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function OAuthTestPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const testGitHub = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await fetch('/api/auth/github-oauth');
            const data = await response.json();
            
            if (data.error) {
                setError(`GitHub OAuth Error: ${data.error}`);
                console.error('Full error:', data);
            } else if (data.url) {
                setSuccess('GitHub OAuth URL received! Redirecting...');
                console.log('OAuth URL:', data.url);
                window.location.href = data.url;
            }
        } catch (err: any) {
            setError(`Failed to get OAuth URL: ${err.message}`);
            console.error('Full error:', err);
        } finally {
            setLoading(false);
        }
    };

    const testGoogle = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await fetch('/api/auth/google-oauth');
            const data = await response.json();
            
            if (data.error) {
                setError(`Google OAuth Error: ${data.error}`);
                console.error('Full error:', data);
            } else if (data.url) {
                setSuccess('Google OAuth URL received! Redirecting...');
                console.log('OAuth URL:', data.url);
                window.location.href = data.url;
            }
        } catch (err: any) {
            setError(`Failed to get OAuth URL: ${err.message}`);
            console.error('Full error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF6] text-[#1A1A1A] py-16 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border border-[#1A1A1A]/10 p-8 shadow-sm">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">OAuth Test</h1>
                    <p className="text-[#1A1A1A]/60 mb-8">Test your OAuth providers before using on login page</p>

                    <div className="space-y-6">
                        {error && (
                            <div className="p-4 text-sm rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">Error</p>
                                    <p className="text-xs mt-1">{error}</p>
                                    <p className="text-xs mt-2 opacity-70">Check browser console (F12) for full details</p>
                                </div>
                            </div>
                        )}

                        {success && (
                            <div className="p-4 text-sm rounded-2xl bg-green-50 border border-green-100 text-green-600 flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                {success}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold mb-3">Test GitHub</h2>
                                <Button
                                    onClick={testGitHub}
                                    disabled={loading}
                                    className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                            Testing...
                                        </>
                                    ) : (
                                        'Test GitHub OAuth'
                                    )}
                                </Button>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-3">Test Google</h2>
                                <Button
                                    onClick={testGoogle}
                                    disabled={loading}
                                    className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                            Testing...
                                        </>
                                    ) : (
                                        'Test Google OAuth'
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                            <p className="font-semibold mb-2">💡 How to debug:</p>
                            <ol className="list-decimal list-inside space-y-1 text-xs">
                                <li>Open browser DevTools (F12 → Console tab)</li>
                                <li>Click the test button</li>
                                <li>Check console for detailed error logs</li>
                                <li>Look for "OAuth URL:" message if successful</li>
                                <li>Share console errors if you see Error 412</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
