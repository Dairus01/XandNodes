'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

import Image from "next/image";

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
              <img
                src="/logo.png"
                alt="XandNodes Logo"
                className="h-9 w-9 sm:h-11 sm:w-11 object-contain flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                XandNodes
              </span>
            </div>
          </Link>
          <nav className="flex gap-1 sm:gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-foreground hover:text-primary text-xs sm:text-sm px-2 sm:px-4",
                  isActive('/') && !pathname.includes('/nodes') && !pathname.includes('/docs') && "bg-muted"
                )}
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/nodes">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-foreground hover:text-primary text-xs sm:text-sm px-2 sm:px-4",
                  isActive('/nodes') && "bg-muted"
                )}
              >
                Nodes
              </Button>
            </Link>
            <Link href="/analytics">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-foreground hover:text-primary text-xs sm:text-sm px-2 sm:px-4",
                  isActive('/analytics') && "bg-muted"
                )}
              >
                Analytics
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-foreground hover:text-primary text-xs sm:text-sm px-2 sm:px-4",
                  isActive('/docs') && "bg-muted"
                )}
              >
                Docs
              </Button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
