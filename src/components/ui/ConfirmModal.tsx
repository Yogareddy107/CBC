'use client';

import { X } from 'lucide-react';
import { Button } from './button';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmModal({
    isOpen,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isLoading,
    onClose,
    onConfirm,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 fade-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="space-y-4">
                    <div className="space-y-1 text-center">
                        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>

                    <div className="flex flex-col w-full gap-2 pt-2">
                        <Button
                            variant="destructive"
                            className="w-full font-semibold"
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? `${confirmLabel}…` : confirmLabel}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
