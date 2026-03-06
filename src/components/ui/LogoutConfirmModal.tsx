'use client';

import { LogOut, X } from 'lucide-react';
import { Button } from './button';
import { useEffect, useState } from 'react';

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export function LogoutConfirmModal({ isOpen, onClose, onConfirm, isLoading }: LogoutConfirmModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 fade-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20">
                        <LogOut className="w-6 h-6 text-destructive" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-bold tracking-tight">Confirm Logout</h2>
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to sign out of your account? Any unsaved analysis progress might be lost.
                        </p>
                    </div>

                    <div className="flex flex-col w-full gap-2 pt-2">
                        <Button
                            variant="destructive"
                            className="w-full font-semibold"
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing out..." : "Yes, Sign Out"}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
