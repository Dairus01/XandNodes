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
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <img
                src="/logo.png"
                alt="XandNodes Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                XandNodes
              </span>
            </div>
          </Link>
          <nav className="flex items-center justify-center gap-0.5 sm:gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-foreground hover:text-primary text-[10px] sm:text-xs md:text-sm px-1.5 sm:px-3 h-8 sm:h-9",
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
                  "text-foreground hover:text-primary text-[10px] sm:text-xs md:text-sm px-1.5 sm:px-3 h-8 sm:h-9",
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
                  "text-foreground hover:text-primary text-[10px] sm:text-xs md:text-sm px-1.5 sm:px-3 h-8 sm:h-9",
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
                  "text-foreground hover:text-primary text-[10px] sm:text-xs md:text-sm px-1.5 sm:px-3 h-8 sm:h-9",
                  isActive('/docs') && "bg-muted"
                )}
              >
                Docs
              </Button>
            </Link>
            <div className="ml-1 sm:ml-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
