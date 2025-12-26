import { Badge } from "@/components/ui/badge";
import { Activity, Zap, ShieldAlert, Layers } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "Understanding Metrics - XandNodes Documentation",
  description: "Learn how XandNodes calculates health scores and metrics",
};

export default function MetricsPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">User Guide</Badge>
        <h1 className="text-4xl font-bold mb-4">Understanding Metrics</h1>
        <p className="text-xl text-muted-foreground">
          Deep dive into health scores, performance metrics, and network analytics
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Health Score System</h2>
        <p className="mb-4">
          XandNodes uses a sophisticated 6-component scoring system optimized for network reliability,
          storage efficiency, and geographic decentralization.
        </p>

        <h3 className="text-lg font-semibold mb-3">Score Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-muted/50 rounded-xl border border-border">
            <p className="font-bold mb-1 flex items-center justify-between">
              Uptime Health <span>25%</span>
            </p>
            <p className="text-sm text-muted-foreground italic mb-2">Primary Reliability Metric</p>
            <p className="text-sm text-muted-foreground">
              Exponential growth curve based on total uptime seconds. Reaches optimal score after 7 days of continuous operation.
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-xl border border-border">
            <p className="font-bold mb-1 flex items-center justify-between">
              Availability <span>25%</span>
            </p>
            <p className="text-sm text-muted-foreground italic mb-2">Network Utility Metric</p>
            <p className="text-sm text-muted-foreground">
              Real-time check of active node status. Measures the percentage of nodes currently capable of serving Solana dApp data.
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-xl border border-border">
            <p className="font-bold mb-1 flex items-center justify-between">
              Performance <span>17%</span>
            </p>
            <p className="text-sm text-muted-foreground italic mb-2">User Experience Metric</p>
            <p className="text-sm text-muted-foreground">
              Dynamic score based on average network latency. Optimized at &lt;100ms, with gradual degradation up to 500ms.
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-xl border border-border">
            <p className="font-bold mb-1 flex items-center justify-between">
              Version Health <span>12.5%</span>
            </p>
            <p className="text-sm text-muted-foreground italic mb-2">Consensus Metric</p>
            <p className="text-sm text-muted-foreground">
              Measures network-wide alignment with the latest software release. Critical for security and feature compatibility.
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-xl border border-border">
            <p className="font-bold mb-1 flex items-center justify-between">
              Storage Health <span>12.5%</span>
            </p>
            <p className="text-sm text-muted-foreground italic mb-2">Resource Metric</p>
            <p className="text-sm text-muted-foreground">
              Optimal utilization between 60-80%. Ensures nodes are active data providers without nearing critical capacity thresholds.
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-xl border border-border">
            <p className="font-bold mb-1 flex items-center justify-between">
              Distribution <span>8%</span>
            </p>
            <p className="text-sm text-muted-foreground italic mb-2">Decentralization Metric</p>
            <p className="text-sm text-muted-foreground">
              Measures geographic diversity. Prevents centralization risks by incentivizing node deployment across unique countries.
            </p>
          </div>
        </div>

        <CodeBlock
          code={`Score = (Uptime × 0.25) + (Availability × 0.25) + (Performance × 0.17) + (Version × 0.125) + (Storage × 0.125) + (Distribution × 0.08)`}
          language="math"
          title="Scoring Algorithm"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Network Health Grade</h2>
        <p className="mb-4">
          The letter grade system provides quick assessment based on composite scoring:
        </p>

        <div className="space-y-3 mb-6">
          <div className="border-l-4 border-primary pl-4">
            <p className="font-semibold">A+ / A (90-100 points)</p>
            <p className="text-sm text-muted-foreground">
              Excellent: Uptime 99%+, latency &lt;50ms, active nodes &gt;90%, optimal storage
            </p>
          </div>
          <div className="border-l-4 border-primary/60 pl-4">
            <p className="font-semibold">B (70-89 points)</p>
            <p className="text-sm text-muted-foreground">
              Good: Uptime 95%+, latency &lt;100ms, active nodes 80-90%, good storage management
            </p>
          </div>
          <div className="border-l-4 border-primary/30 pl-4">
            <p className="font-semibold">C (50-69 points)</p>
            <p className="text-sm text-muted-foreground">
              Fair: Uptime 90%+, latency &lt;200ms, monitoring recommended
            </p>
          </div>
          <div className="border-l-4 border-muted-foreground pl-4">
            <p className="font-semibold">D / F (&lt;50 points)</p>
            <p className="text-sm text-muted-foreground">
              Poor: Low uptime, high latency, or critical storage/availability issues
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Performance Metrics Explained</h2>

        <h3 className="text-lg font-semibold mb-3">Uptime</h3>
        <p className="mb-3 text-muted-foreground">
          Percentage of time a node is online and responsive. Calculated as:
        </p>
        <CodeBlock
          code={`Uptime = (Time Online / Total Time) × 100`}
          language="math"
          title="Uptime Calculation"
        />
        <ul className="space-y-1 text-sm text-muted-foreground mb-6">
          <li>• 99%+ = Exceptional (less than 7 hours downtime per month)</li>
          <li>• 95-99% = Very good (1-2 days downtime per month)</li>
          <li>• 90-95% = Good (2-3 days downtime per month)</li>
          <li>• &lt;90% = Needs improvement</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Latency</h3>
        <p className="mb-3 text-muted-foreground">
          Average time for a node to respond to requests, measured in milliseconds (ms):
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground mb-6">
          <li>• &lt;50ms = Excellent (local/nearby node)</li>
          <li>• 50-100ms = Very good (regional node)</li>
          <li>• 100-200ms = Good (distant node)</li>
          <li>• 200-500ms = Fair (international node)</li>
          <li>• &gt;500ms = Poor (very distant or overloaded)</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Storage Efficiency</h3>
        <p className="mb-3 text-muted-foreground">
          How well storage capacity is utilized:
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground mb-6">
          <li>• 60-80% used = Optimal (room to grow, actively used)</li>
          <li>• 40-60% used = Good (some capacity available)</li>
          <li>• &lt;40% used = Underutilized (wasted capacity)</li>
          <li>• &gt;80% used = High utilization (may need expansion soon)</li>
          <li>• &gt;90% used = Critical (expansion recommended)</li>
        </ul>

        <h3 className="text-lg font-semibold mb-3">Success Rate</h3>
        <p className="mb-3 text-muted-foreground">
          Percentage of successful operations vs. total operations:
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground mb-6">
          <li>• 99%+ = Excellent (very reliable)</li>
          <li>• 95-99% = Good (occasional failures)</li>
          <li>• 90-95% = Fair (frequent failures)</li>
          <li>• &lt;90% = Poor (unreliable node)</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Network Intelligence & Analytics</h2>
        <p className="mb-6 text-muted-foreground leading-relaxed">
          The XandNodes Analytics dashboard provides deep-level insights derived from raw pNode gossip data, helping operators and users visualize network stress and health vectors.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-muted/30 border border-border">
            <h4 className="font-bold flex items-center gap-2 mb-2 text-primary">
              <Activity className="h-4 w-4" />
              Network Pulse (Radar)
            </h4>
            <p className="text-xs text-muted-foreground">
              Visualizes the 6 core health metrics in a single radar diagram to assess network balance.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-muted/30 border border-border">
            <h4 className="font-bold flex items-center gap-2 mb-2 text-cyan-500">
              <Zap className="h-4 w-4" />
              Latency Profiles
            </h4>
            <p className="text-xs text-muted-foreground">
              Distributes nodes into performance tiers to identify regional bottlenecks.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-muted/30 border border-border">
            <h4 className="font-bold flex items-center gap-2 mb-2 text-red-500">
              <ShieldAlert className="h-4 w-4" />
              Vulnerability Matrix
            </h4>
            <p className="text-xs text-muted-foreground">
              Identifies specific failure categories (Storage, Uptime, etc.) for at-risk nodes.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-muted/30 border border-border">
            <h4 className="font-bold flex items-center gap-2 mb-2 text-emerald-500">
              <Layers className="h-4 w-4" />
              Version Consensus
            </h4>
            <p className="text-xs text-muted-foreground">
              Tracks the software upgrade lifecycle across the entire fleet.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Decentralization Score</h2>
        <p className="mb-4 text-muted-foreground">
          Measures geographic distribution and network resilience (0-100):
        </p>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li>• Based on number of unique countries and regions</li>
          <li>• Considers distribution evenness (not just total countries)</li>
          <li>• Higher scores indicate better fault tolerance</li>
          <li>• 90+ = Highly decentralized</li>
          <li>• 70-89 = Well distributed</li>
          <li>• 50-69 = Moderately distributed</li>
          <li>• &lt;50 = Centralized (concentration risk)</li>
        </ul>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Key Takeaways</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Storage and availability are weighted highest (60% combined)</li>
          <li>• Health scores update every 30 seconds with live data</li>
          <li>• Geographic diversity improves network resilience</li>
          <li>• Version health ensures network-wide compatibility</li>
          <li>• All metrics are calculated from real pNode data via pRPC</li>
        </ul>
      </div>
    </div>
  );
}
