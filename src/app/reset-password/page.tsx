'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

import { Suspense } from 'react';

function ResetPasswordContent() {
    const search = useSearchParams();
    const router = useRouter();
    const userId = search.get('userId') || '';
    const secret = search.get('secret') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!password) return setError('Enter a new password');
        if (password !== confirm) return setError('Passwords do not match');
        try {
            const res = await fetch('/api/auth/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, secret, password })
            });
            const data = await res.json();
            if (data?.error) setError(data.error);
            else {
                setSuccess('Password updated — you can now sign in');
                setTimeout(() => router.push('/login'), 1600);
            }
        } catch (e) {
            setError('Failed to reset password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDF6] p-6 selection:bg-[#FF7D29]/30">
            <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl shadow-[#1A1A1A]/5 border border-[#1A1A1A]/5 space-y-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Reset your password</h2>
                    <p className="text-md text-[#1A1A1A]/60 font-medium">Enter a new secure password for your account.</p>
                </div>

                {error && (
                    <div className="p-4 text-sm rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3 font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 text-sm rounded-2xl bg-green-50 border border-green-100 text-green-600 flex items-center gap-3 font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-[#1A1A1A]/60 font-bold text-xs uppercase tracking-wider ml-1">New password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={show ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pr-12 h-12 bg-white border-[#1A1A1A]/10 focus:border-[#FF7D29] focus:ring-[#FF7D29]/20 transition-all rounded-xl shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShow(s => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
                            >
                                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm" className="text-[#1A1A1A]/60 font-bold text-xs uppercase tracking-wider ml-1">Confirm password</Label>
                        <Input
                            id="confirm"
                            type={show ? 'text' : 'password'}
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            placeholder="••••••••"
                            className="h-12 bg-white border-[#1A1A1A]/10 focus:border-[#FF7D29] focus:ring-[#FF7D29]/20 transition-all rounded-xl shadow-sm"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 text-md font-bold bg-[#FF7D29] text-white hover:bg-[#FF7D29]/90 shadow-lg shadow-[#FF7D29]/20 transition-all active:scale-[0.98] rounded-2xl mt-4"
                    >
                        Set new password
                    </Button>
                </form >
            </div >
        </div >
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
