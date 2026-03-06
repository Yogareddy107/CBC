'use client';

import React, { useEffect, useRef, useState } from 'react';
import '@/app/globals.reveal.css';

export function Reveal({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}>
            {children}
        </div>
    );
}
