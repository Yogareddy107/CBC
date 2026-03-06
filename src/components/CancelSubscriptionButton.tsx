"use client";

import { useState } from 'react';

export default function CancelSubscriptionButton({
    userId,
    subscriptionId,
}: {
    userId: string;
    subscriptionId: string;
}) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel your subscription?')) return;
        setLoading(true);
        try {
            const res = await fetch('/api/razorpay/cancel-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, subscriptionId }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Subscription cancelled.');
            } else {
                setMessage(data?.error || 'Failed to cancel');
            }
        } catch (err) {
            console.error(err);
            setMessage('Error cancelling');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white rounded-md"
            >
                {loading ? 'Cancelling…' : 'Cancel Subscription'}
            </button>
            {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>
    );
}
