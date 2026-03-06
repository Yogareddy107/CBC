'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

export function ShareReportButton() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setStatus('copied');
        window.setTimeout(() => setStatus('idle'), 2000);
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch (error) {
      console.error('Failed to copy report link', error);
      setStatus('error');
      window.setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const label = status === 'copied' ? 'Copied!' : status === 'error' ? 'Error' : 'Share';

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground gap-2 h-8 text-xs"
      onClick={handleShare}
      aria-label="Share report link"
    >
      <Share2 className="w-3 h-3" />
      {label}
    </Button>
  );
}
