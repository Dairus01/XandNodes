'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  Code2,
  Rocket,
  Server,
  Users,
  Database,
  GitBranch
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", icon: BookOpen },
      { title: "Quick Start", href: "/docs/guides/quick-start", icon: Rocket },
    ],
  },
  {
    title: "User Guides",
    items: [
      { title: "Platform Guide", href: "/docs/guides/platform-guide", icon: Users },
      { title: "Understanding Metrics", href: "/docs/guides/metrics", icon: Database },
    ],
  },
  {
    title: "Platform",
    items: [
      { title: "Deployment", href: "/docs/platform/deployment", icon: Server },
      { title: "Architecture", href: "/docs/platform/architecture", icon: GitBranch },
    ],
  },
  {
    title: "API & Integration",
    items: [
      { title: "API Reference", href: "/docs/api/reference", icon: Code2 },
      { title: "Integration Guide", href: "/docs/api/integration", icon: FileText },
    ],
  },
];

interface DocsSidebarProps {
  onNavigate?: () => void;
}

export function DocsSidebar({ onNavigate }: DocsSidebarProps = {}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-background/50 dark:bg-black/20 backdrop-blur-xl h-full overflow-y-auto">
      <nav className="p-4 sm:p-6 space-y-8">
        {navigation.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4 pl-3">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-r-full text-sm transition-all duration-200 border-l-2 group",
                        isActive
                          ? "bg-primary/10 border-primary text-primary font-medium shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)]"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 flex-shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
