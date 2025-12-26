import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Code2,
  Server,
  BookOpen,
  Zap,
  Search,
  LifeBuoy,
  Users,
  Cpu,
  Activity
} from "lucide-react";


export const metadata = {
  title: "Documentation - XandNodes",
  description: "Complete documentation for XandNodes - Xandeum pNode Network Explorer",
};

export default function DocsHome() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-card dark:bg-gradient-to-br dark:from-primary/10 dark:via-black/20 dark:to-secondary/10 border border-border p-8 sm:p-12 text-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 dark:opacity-20" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 backdrop-blur-md px-4 py-1.5 uppercase tracking-widest text-xs font-semibold">
            Help Center
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground dark:text-white drop-shadow-sm">
            How can we <span className="text-primary">help you?</span>
          </h1>
          <p className="text-lg text-muted-foreground dark:text-slate-400 leading-relaxed">
            Search our comprehensive documentation for guides, API references, and troubleshooting tips.
          </p>

          <div className="relative max-w-xl mx-auto mt-8 group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-background/50 dark:bg-black/40 backdrop-blur-xl border border-border dark:border-white/10 rounded-full px-4 py-3 shadow-sm dark:shadow-2xl transition-colors hover:border-primary/50 dark:hover:bg-black/50">
              <Search className="w-5 h-5 text-muted-foreground dark:text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search for guides, metrics, or API endpoints..."
                className="flex-1 bg-transparent border-none outline-none text-foreground dark:text-slate-200 placeholder:text-muted-foreground dark:placeholder:text-slate-500 text-sm sm:text-base h-full"
              />
              <div className="hidden sm:flex text-xs text-muted-foreground dark:text-slate-600 border border-border dark:border-white/10 rounded px-1.5 py-0.5">
                Press /
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground dark:text-white">
            What is <span className="text-primary font-extrabold italic">XandNodes?</span>
          </h2>
          <div className="space-y-4 text-muted-foreground dark:text-slate-400 leading-relaxed">
            <p className="text-lg">
              XandNodes is the first of its kind <strong>Tactical Intelligence & Monitoring Command Center</strong>
              designed specifically for the Xandeum pNode Network.
            </p>
            <p>
              Built to serve as the unified source of truth for node operators and network enthusiasts,
              XandNodes provides an unprecedented level of visibility into the decentralized storage
              layer of the Xandeum ecosystem.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <h4 className="font-bold text-foreground dark:text-white mb-1 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Live Monitoring
              </h4>
              <p className="text-xs text-muted-foreground dark:text-slate-500">
                Track pNode gossip data in real-time with sub-second accuracy.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
              <h4 className="font-bold text-foreground dark:text-white mb-1 flex items-center gap-2">
                <Search className="w-4 h-4 text-secondary" />
                Deep Analytics
              </h4>
              <p className="text-xs text-muted-foreground dark:text-slate-500">
                Historical performance charts, storage trends, and latency heatmaps.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 blur-[100px] rounded-full" />

          <h3 className="text-xl font-bold mb-6 text-foreground dark:text-white border-b border-border/50 pb-4">
            Core Capabilities
          </h3>
          <ul className="space-y-4">
            {[
              { title: "Network Health Scoring", desc: "Advanced 6-metric pulse algorithm assessing Uptime, Availability, Performance, Versioning, Storage, and Distribution." },
              { title: "Network Intelligence", desc: "Dedicated analytics suite featuring Radar charts, Latency profiles, and predictive vulnerability matrices." },
              { title: "Geographic Visualizer", desc: "Interactive global map plotting the physical distribution of nodes for true decentralization analysis." },
              { title: "Storage Intelligence", desc: "Real-time tracking of committed vs. used storage across the entire provider network." }
            ].map((item, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {i + 1}
                </div>
                <div>
                  <h5 className="font-bold text-sm text-foreground dark:text-white">{item.title}</h5>
                  <p className="text-xs text-muted-foreground dark:text-slate-500 leading-normal">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Main Categories Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Popular Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Start */}
          <Link href="/docs/guides/quick-start" className="group">
            <div className="h-full bg-card dark:bg-black/20 backdrop-blur-md border border-border dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-accent/50 dark:hover:bg-white/5 hover:border-primary/50 group-hover:shadow-[0_0_30px_-10px_rgba(var(--primary),0.2)]">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground dark:text-white mb-2 group-hover:text-primary transition-colors">Quick Start</h3>
              <p className="text-muted-foreground dark:text-slate-400 text-sm mb-4">
                Get up and running with Xandeum. Installation, configuration, and your first deployment in minutes.
              </p>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                Start building <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Platform Guide */}
          <Link href="/docs/guides/platform-guide" className="group">
            <div className="h-full bg-card dark:bg-black/20 backdrop-blur-md border border-border dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-accent/50 dark:hover:bg-white/5 hover:border-blue-500/50 group-hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground dark:text-white mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">Platform Guide</h3>
              <p className="text-muted-foreground dark:text-slate-400 text-sm mb-4">
                Master the XandNodes dashboard. Learn about metrics, health scores, and data visualization tools.
              </p>
              <span className="text-blue-500 dark:text-blue-400 text-sm font-medium flex items-center gap-1">
                Explore features <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* API Reference */}
          <Link href="/docs/api/reference" className="group">
            <div className="h-full bg-card dark:bg-black/20 backdrop-blur-md border border-border dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-accent/50 dark:hover:bg-white/5 hover:border-purple-500/50 group-hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)]">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Code2 className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground dark:text-white mb-2 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">API Reference</h3>
              <p className="text-muted-foreground dark:text-slate-400 text-sm mb-4">
                Complete documentation for the pRPC API. Endpoints, authentication, and integration examples.
              </p>
              <span className="text-purple-500 dark:text-purple-400 text-sm font-medium flex items-center gap-1">
                View documentation <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Deployment */}
          <Link href="/docs/platform/deployment" className="group">
            <div className="h-full bg-card dark:bg-black/20 backdrop-blur-md border border-border dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-accent/50 dark:hover:bg-white/5 hover:border-amber-500/50 group-hover:shadow-[0_0_30px_-10px_rgba(245,158,11,0.2)]">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Server className="w-6 h-6 text-amber-500 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground dark:text-white mb-2 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">Deployment</h3>
              <p className="text-muted-foreground dark:text-slate-400 text-sm mb-4">
                Guides for deploying XandNodes to production. Docker, Vercel, Railway, and custom setups.
              </p>
              <span className="text-amber-500 dark:text-amber-400 text-sm font-medium flex items-center gap-1">
                Deploy now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Node Operation (Placeholder for future content) */}
          <Link href="#" className="group cursor-not-allowed opacity-60">
            <div className="h-full bg-card dark:bg-black/20 backdrop-blur-md border border-border dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-accent/50 dark:hover:bg-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">Node Operations</h3>
              <p className="text-muted-foreground dark:text-slate-400 text-sm mb-4">
                Running and maintaining pNodes on the Xandeum network. Best practices and rewards.
              </p>
              <span className="text-muted-foreground dark:text-slate-500 text-sm font-medium flex items-center gap-1">
                Coming soon
              </span>
            </div>
          </Link>

          {/* Community Support */}
          <a href="https://discord.gg/uqRSmmM5m" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full bg-card dark:bg-black/20 backdrop-blur-md border border-border dark:border-white/10 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-accent/50 dark:hover:bg-white/5 hover:border-pink-500/50 group-hover:shadow-[0_0_30px_-10px_rgba(236,72,153,0.2)]">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4 group-hover:bg-pink-500/20 transition-colors">
                <Users className="w-6 h-6 text-pink-500 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground dark:text-white mb-2 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">Community</h3>
              <p className="text-muted-foreground dark:text-slate-400 text-sm mb-4">
                Join our Discord server. Get help from the community, report bugs, and suggest features.
              </p>
              <span className="text-pink-500 dark:text-pink-400 text-sm font-medium flex items-center gap-1">
                Join Discord <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* Support Strip */}
      <section className="bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-full text-primary mt-1">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground dark:text-white">Can't find what you're looking for?</h3>
            <p className="text-muted-foreground dark:text-slate-400 text-sm max-w-md">
              Our support team is always ready to help. Reach out to us directly or check our status page for ongoing incidents.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <a
            href="https://xandeum.network"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-sm"
          >
            Contact Support
          </a>
          <Link
            href="/docs/guides/platform-guide"
            className="px-6 py-2.5 rounded-full bg-accent/20 dark:bg-white/5 border border-accent/20 dark:border-white/10 text-foreground dark:text-white font-medium hover:bg-accent/30 dark:hover:bg-white/10 transition-colors text-sm"
          >
            Browse All Guides
          </Link>
        </div>
      </section>
    </div>
  );
}
