import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
  title: "Platform Guide - XandNodes Documentation",
  description: "Learn how to use XandNodes effectively",
};

export default function PlatformGuidePage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">User Guide</Badge>
        <h1 className="text-4xl font-bold mb-4">Platform Guide</h1>
        <p className="text-xl text-muted-foreground">
          Complete guide to using XandNodes for pNode network analysis
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
        <p className="mb-4">The XandNodes command center provides a real-time, high-fidelity view of the Xandeum pNode network topology.</p>

        <h3 className="text-lg font-semibold mb-3">Live Network Pulse</h3>
        <p className="mb-4">The header features a letter-grade health score (A-F) based on our proprietary 6-component algorithm, alongside 5 critical network KPIs:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>Total Nodes:</strong> Comprehensive count of discovered pNodes.</li>
          <li>• <strong>Storage Capacity:</strong> Aggregated byte-scale storage across the fleet.</li>
          <li>• <strong>Network Uptime:</strong> High-precision network-wide availability average.</li>
          <li>• <strong>Decentralization:</strong> Resiliency score based on provider diversity.</li>
          <li>• <strong>Active Countries:</strong> Real-time count of unique geographic jurisdictions.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Global Map Visualizer</h3>
        <p className="mb-4 text-muted-foreground">
          A 2D interactive map plotting every active pNode. Hover over nodes to see theirmoniker, status, and health score in real-time.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Tactical Intelligence</h2>
        <p className="mb-4">The dashboard utilizes two primary intelligence components to proactively monitor network health:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-xl bg-card border border-border">
            <h4 className="font-bold mb-2 flex items-center gap-2">Insights Feed</h4>
            <p className="text-sm text-muted-foreground">
              An event-driven feed that monitors for capacity milestones, version compliance warnings, and performance degradation in real-time.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-red-500">Risk Assessment</h4>
            <p className="text-sm text-muted-foreground">
              Categorizes nodes into 4 critical risk vectors: Storage Saturation, Uptime Instability, Version Desync, and High Latency.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Node Exploration</h2>
        <p className="mb-4 text-muted-foreground">The Nodes section translates raw gossip data into a structured, searchable interface for deep network inspection.</p>

        <h3 className="text-lg font-semibold mb-3">Search & Tactical Filters</h3>
        <p className="mb-3">Quickly isolate nodes using our multi-index search bar:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>Moniker/Public Key:</strong> Identify specific infrastructure providers.</li>
          <li>• <strong>Geographic Search:</strong> Filter by city, country, or region (e.g., "Germany").</li>
          <li>• <strong>Status Filter:</strong> Isolate nodes that are <code>Active</code>, <code>Inactive</code>, or <code>Syncing</code>.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Dynamic Sorting</h3>
        <p className="mb-3">Reorder the network based on performance priority:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>Health Score:</strong> Most reliable and efficient nodes.</li>
          <li>• <strong>Storage Capacity:</strong> Largest data providers first.</li>
          <li>• <strong>Network Latency:</strong> Fastest responding nodes (edge nodes).</li>
          <li>• <strong>Uptime:</strong> Historical stability rankings.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Node Intelligence Profiles</h2>
        <p className="mb-4 text-muted-foreground">Detailed view for individual pNodes, including real-time performance and historical reliability.</p>

        <h3 className="text-lg font-semibold mb-3">Identity & Location</h3>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>Moniker & Pubkey:</strong> Unique identifier in the Xandeum network.</li>
          <li>• <strong>Physical Location:</strong> City, Region, and Country with precise GPS coordinates.</li>
          <li>• <strong>Version Tracking:</strong> Real-time software version reporting.</li>
          <li>• <strong>Network Info:</strong> IP address and port mapping.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Historical Performance Charts</h3>
        <p className="mb-4">Monitor node behavior over 24h, 7d, 30d, and 90d timeframes:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>Uptime Consistency:</strong> Track stability over time.</li>
          <li>• <strong>Latency Trends:</strong> Identify response time spikes.</li>
          <li>• <strong>Storage Growth:</strong> Monitor data accumulation rates.</li>
          <li>• <strong>Bandwidth Throughput:</strong> Analyze data transfer efficiency.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Staking & Economics</h3>
        <p className="mb-4 text-muted-foreground">If available, the profile displays staking weights, total tokens committed, and accumulated rewards for the node.</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Intelligence & Analytics</h2>
        <p className="mb-6 leading-relaxed">
          The XandNodes <strong>Intelligence Dashboard</strong> (/analytics) is a dedicated command center for high-level network topology and stress analysis.
        </p>

        <h3 className="text-lg font-semibold mb-3">Network Pulse (Radar)</h3>
        <p className="mb-4">
          Visualizes the 6 core health metrics in a single radar diagram. This helps identify if the network is balanced across Uptime, Availability, Performance, Versioning, Storage, and Distribution.
        </p>

        <h3 className="text-lg font-semibold mb-3">Latency & Performance Profiles</h3>
        <p className="mb-4 text-muted-foreground">
          Advanced histograms group nodes by response time tiers, exposing "tail latency" issues that might be hidden by simple network averages.
        </p>

        <h3 className="text-lg font-semibold mb-3">Vulnerability Matrix</h3>
        <p className="mb-4 text-muted-foreground">
          A proactive risk assessment tool that categorizes failing nodes by their specific risk vector (e.g., "Critical Storage" vs "Version Desync").
        </p>

        <h3 className="text-lg font-semibold mb-3">Geographic Distribution</h3>
        <p className="mb-4 text-muted-foreground">
          Real-time tracking of country-level node concentration, providing a mathematical decentralization score to ensure network resilience.
        </p>

        <h3 className="text-lg font-semibold mb-3">Version Adoption Funnel</h3>
        <p className="mb-4 text-muted-foreground">
          Monitors the migration of pNodes to the latest software release, ensuring the network is synchronized and compatible.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Data Export</h2>
        <p className="mb-4">Export network data for offline analysis:</p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• <strong>CSV Format:</strong> Import into Excel, Google Sheets, or data analysis tools</li>
          <li>• <strong>JSON Format:</strong> Use in scripts, APIs, or custom applications</li>
          <li>• <strong>Network Stats:</strong> Export complete network overview</li>
          <li>• <strong>Node Data:</strong> Export filtered node lists</li>
        </ul>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Pro Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Use search + filters together for precise node discovery</li>
          <li>• Check the Intelligence Panel regularly for network health updates</li>
          <li>• Export data periodically to track network growth over time</li>
          <li>• Compare health scores across different countries for insights</li>
          <li>• Monitor version distribution to identify when upgrades are needed</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Learn about <Link href="/docs/guides/metrics" className="text-primary hover:underline">Metrics and Health Scoring</Link></li>
          <li>• Explore the <Link href="/docs/api/reference" className="text-primary hover:underline">API Reference</Link> for integrations</li>
          <li>• Deploy your own instance with the <Link href="/docs/platform/deployment" className="text-primary hover:underline">Deployment Guide</Link></li>
        </ul>
      </div>
    </div>
  );
}
