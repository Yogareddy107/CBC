'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite-client';
import { Loader2, AlertCircle } from 'lucide-react';

export default function SessionRecoveryPage() {
    const router = useRouter();

    useEffect(() => {
        const recoverSession = async () => {
            try {
                console.log('🔄 Session recovery: Checking for OAuth session...');
                
                // Check if we have a valid session
                const user = await account.get();
                console.log('✅ OAuth session found for:', user.email);
                
                // Session is valid, redirect to dashboard
                router.push('/dashboard');
            } catch (error: any) {
                console.error('❌ No valid session found:', error?.message);
                
                // No valid session, redirect to login
                router.push('/login?error=' + encodeURIComponent('Session expired. Please log in again.'));
            }
        };

        // Give browser a moment to ensure cookies are available
        setTimeout(recoverSession, 500);
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#FFFDF6]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-[#FF7D29] w-8 h-8" />
                <p className="text-[#1A1A1A]/60 font-medium">Recovering your session...</p>
            </div>
        </div>
    );
}
