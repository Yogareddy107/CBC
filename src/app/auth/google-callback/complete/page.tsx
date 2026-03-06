'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite-client';
import { Loader2, AlertCircle } from 'lucide-react';

export default function GoogleCallbackCompletePage() {
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const checkSession = async () => {
            try {
                console.log('🔍 Google Callback: Starting session check');
                
                // Wait a bit for the session cookie to be set
                await new Promise(r => setTimeout(r, 2000));
                console.log('🔍 Google Callback: Waited 2 seconds, checking for session');
                
                // Try to get the current user
                const user = await account.get();
                console.log('✅ Google Callback: User found:', user);
                
                if (user) {
                    // Session exists, redirect to dashboard
                    setStatus('success');
                    console.log('✅ Google Callback: Redirecting to dashboard');
                    // Use window.location for a full reload so server sees the session
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 500);
                } else {
                    // No user, redirect to login
                    setStatus('error');
                    setErrorMsg('No user session found');
                    console.error('❌ Google Callback: No user returned');
                }
            } catch (error: any) {
                setStatus('error');
                const errorMessage = error?.message || error?.response?.message || 'Unknown error';
                setErrorMsg(errorMessage);
                console.error('❌ Google Callback Error:', {
                    message: error?.message,
                    code: error?.code,
                    response: error?.response,
                    fullError: error
                });
                
                // Redirect to login with detailed error
                setTimeout(() => {
                    router.push('/login?error=' + encodeURIComponent(`Google auth failed: ${errorMessage}`));
                }, 3000);
            }
        };

        checkSession();
    }, [router]);

    if (status === 'error') {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#FFFDF6]">
                <div className="flex flex-col items-center gap-6 max-w-md">
                    <AlertCircle className="text-red-500 w-12 h-12" />
                    <div className="text-center space-y-2">
                        <p className="text-[#1A1A1A] font-bold text-lg">Google Authentication Failed</p>
                        <p className="text-[#1A1A1A]/60 text-sm">{errorMsg}</p>
                        <p className="text-[#1A1A1A]/40 text-xs mt-4">Redirecting to login page...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#FFFDF6]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-[#FF7D29] w-8 h-8" />
                <p className="text-[#1A1A1A]/60 font-medium">Completing Google authentication...</p>
                <p className="text-[#1A1A1A]/40 text-xs">This may take a few seconds</p>
            </div>
        </div>
    );
}
