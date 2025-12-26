'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    // Ensure we're mounted before displaying to avoid hydration mismatch
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="w-9 h-9">
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            ) : (
                <Sun className="h-4 w-4 text-orange-500 transition-colors" />
            )}
        </Button>
    );
}
