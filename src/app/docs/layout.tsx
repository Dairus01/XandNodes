'use client';

import { Header } from "@/components/Header";
import { DocsSidebar } from "@/components/DocsSidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          {sidebarOpen ? 'Close' : 'Menu'}
        </Button>
      </div>

      <div className="flex relative items-start max-w-[1920px] mx-auto">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-30 lg:hidden top-[8.5rem]"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:sticky top-[8.5rem] lg:top-20 z-40 lg:z-0
          h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-5rem)]
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <DocsSidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0">
          <div className="mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12 max-w-5xl">
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
