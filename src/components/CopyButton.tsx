'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';

interface CopyButtonProps {
    content: string;
    className?: string;
}

export function CopyButton({ content, className }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all ${className}`}
            onClick={handleCopy}
            title="Copy to clipboard"
        >
            {copied ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </Button>
    );
}
