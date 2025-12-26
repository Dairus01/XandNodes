import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/CodeBlock";
import { Terminal } from "lucide-react";

export const metadata = {
  title: "API Reference - XandNodes Documentation",
  description: "Complete API reference for pRPC integration",
};

export default function APIReferencePage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">API & Integration</Badge>
        <h1 className="text-4xl font-bold mb-4">API Reference</h1>
        <p className="text-xl text-muted-foreground">
          Complete reference for the pRPC API and XandNodes data structures
        </p>
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-2">About pRPC</h3>
        <p className="text-sm text-muted-foreground">
          pRPC (pNode RPC) is the API protocol for communicating with Xandeum pNodes. XandNodes
          connects to 8 verified endpoints on port 6000 to retrieve real-time network data.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">pNode Endpoints</h2>
        <p className="mb-4">XandNodes uses these verified pRPC endpoints:</p>
        <CodeBlock
          code={`// Active pNode endpoints (port 6000)\n178.18.243.183:6000\n158.220.126.109:6000\n62.171.147.216:6000\n152.53.45.250:6000\n192.99.8.88:6000\n192.99.9.233:6000\n167.235.193.133:6000\n147.45.231.139:6000`}
          language="bash"
          title="pRPC Endpoints"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Data Structures</h2>

        <h3 className="text-lg font-semibold mb-3">PNode Type</h3>
        <CodeBlock
          code={`interface PNode {\n  publicKey: string;\n  moniker: string;\n  ipAddress: string;\n  version: string;\n  status: 'active' | 'inactive' | 'syncing';\n  uptime: number; // percentage (0-100)\n  storage: {\n    used: number; // bytes\n    total: number; // bytes\n    available: number; // bytes\n    usagePercentage: number; // percentage (0-100)\n  };\n  performance: {\n    avgLatency: number; // milliseconds\n    successRate: number; // percentage (0-100)\n    bandwidthMbps: number;\n    responseTime: number; // milliseconds\n    requestsPerSecond: number;\n  };\n  location: {\n    country: string;\n    countryCode: string; // ISO 3166-1 alpha-2\n    city: string;\n    region: string;\n    lat: number;\n    lng: number;\n    timezone: string;\n  };\n  lastSeen: Date;\n  stakingInfo?: {\n    staked: number;\n    weight: number;\n    rewards: number;\n    delegators: number;\n  };\n  healthScore: number; // calculated score (0-100)\n}`}
          language="typescript"
          title="PNode Interface"
          showLineNumbers
        />

        <h3 className="text-lg font-semibold mb-3">NetworkStats Type</h3>
        <CodeBlock
          code={`interface NetworkStats {\n  totalNodes: number;\n  activeNodes: number;\n  inactiveNodes: number;\n  syncingNodes: number;\n  totalStorage: number; // bytes\n  usedStorage: number; // bytes\n  availableStorage: number; // bytes\n  avgUptime: number; // percentage\n  decentralizationScore: number; // 0-100\n  networkVersion: string;\n  avgLatency: number; // milliseconds\n  totalBandwidth: number; // Mbps\n}`}
          language="typescript"
          title="NetworkStats Interface"
        />

        <h3 className="text-lg font-semibold mb-3">NetworkHealthBreakdown Type</h3>
        <CodeBlock
          code={`interface NetworkHealthBreakdown {\n  availability: number; // 0-100\n  versionHealth: number; // 0-100\n  distribution: number; // 0-100\n  storageHealth: number; // 0-100\n  totalScore: number; // weighted average\n}`}
          language="typescript"
          title="Health Breakdown Interface"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">React Query Hooks</h2>

        <h3 className="text-lg font-semibold mb-3">useAllPNodes</h3>
        <p className="mb-3 text-muted-foreground">Fetch all pNodes from the network</p>
        <CodeBlock
          code={`import { useAllPNodes } from '@/lib/hooks';\n\nfunction MyComponent() {\n  const {\n    data: nodes,\n    isLoading,\n    error,\n    refetch\n  } = useAllPNodes();\n\n  if (isLoading) return <div>Loading...</div>;\n  if (error) return <div>Error: {error.message}</div>;\n\n  return (\n    <div>\n      {nodes?.map(node => (\n        <div key={node.publicKey}>{node.moniker}</div>\n      ))}\n    </div>\n  );\n}`}
          language="tsx"
          title="Hook Usage"
          showLineNumbers
        />

        <h3 className="text-lg font-semibold mb-3">useNetworkStats</h3>
        <p className="mb-3 text-muted-foreground">Fetch network-wide statistics</p>
        <CodeBlock
          code={`import { useNetworkStats } from '@/lib/hooks';\n\nfunction Dashboard() {\n  const { data: stats, isLoading } = useNetworkStats();\n\n  return (\n    <div>\n      <h2>Total Nodes: {stats?.totalNodes}</h2>\n      <h2>Active: {stats?.activeNodes}</h2>\n      <h2>Avg Uptime: {stats?.avgUptime.toFixed(2)}%</h2>\n    </div>\n  );\n}`}
          language="tsx"
          title="Hook Usage"
        />

        <h3 className="text-lg font-semibold mb-3">usePNodeDetails</h3>
        <p className="mb-3 text-muted-foreground">Fetch specific pNode details by public key</p>
        <CodeBlock
          code={`import { usePNodeDetails } from '@/lib/hooks';\n\nfunction NodePage({ publicKey }: { publicKey: string }) {\n  const { data: node, isLoading } = usePNodeDetails(publicKey);\n\n  if (!node) return null;\n\n  return (\n    <div>\n      <h1>{node.moniker}</h1>\n      <p>Uptime: {node.uptime}%</p>\n      <p>Location: {node.location.city}, {node.location.country}</p>\n    </div>\n  );\n}`}
          language="tsx"
          title="Hook Usage"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Direct PNodeClient Usage</h2>
        <p className="mb-4">For advanced use cases, use PNodeClient directly:</p>
        <CodeBlock
          code={`import { getPNodeClient } from '@/lib/pnode-client';\n\nasync function fetchCustomData() {\n  const client = getPNodeClient();\n\n  // Get all nodes\n  const nodes = await client.getAllPNodes();\n\n  // Get network stats\n  const stats = await client.getNetworkStats();\n\n  // Get specific node\n  const node = await client.getPNodeDetails('publicKey123');\n\n  return { nodes, stats, node };\n}`}
          language="typescript"
          title="Direct Client Usage"
          showLineNumbers
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Health Score Calculation</h2>
        <p className="mb-4">Calculate network health breakdown:</p>
        <CodeBlock
          code={`import { calculateNetworkHealth } from '@/lib/intelligence';\n\nconst healthBreakdown = calculateNetworkHealth(stats, nodes);\n\n// Returns:\n// {\n//   availability: 95.2,\n//   versionHealth: 87.5,\n//   distribution: 78.3,\n//   storageHealth: 82.1,\n//   totalScore: 87\n// }`}
          language="typescript"
          title="Intelligence Helper"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Data Export Functions</h2>
        <CodeBlock
          code={`import {\n  exportNodesCSV,\n  exportNodesJSON,\n  exportNetworkStatsCSV,\n  exportNetworkStatsJSON\n} from '@/lib/export';\n\n// Export nodes to CSV\nexportNodesCSV(nodes, 'xandnodes-nodes.csv');\n\n// Export nodes to JSON\nexportNodesJSON(nodes, 'xandnodes-nodes.json');\n\n// Export network stats\nexportNetworkStatsCSV(stats, nodes, 'network-stats.csv');\nexportNetworkStatsJSON(stats, nodes, 'network-stats.json');`}
          language="typescript"
          title="Export Utilities"
          showLineNumbers
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
        <p className="mb-4">React Query provides built-in error handling:</p>
        <CodeBlock
          code={`const { data, error, isError, isLoading } = useAllPNodes();\n\nif (isError) {\n  console.error('Failed to fetch nodes:', error);\n\n  // Error types:\n  // - Network errors (timeout, connection refused)\n  // - pRPC errors (invalid response, parse errors)\n  // - Circuit breaker (all endpoints failed)\n}`}
          language="typescript"
          title="Error Handling"
        />
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Cache Configuration</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• <strong>Stale Time:</strong> 60 seconds - data considered fresh for 60s</li>
          <li>• <strong>Cache Time:</strong> 5 minutes - cached data persists for 5 minutes</li>
          <li>• <strong>Refetch:</strong> No automatic background refetch</li>
          <li>• <strong>Retry:</strong> No automatic retries (fail fast)</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Review <a href="/docs/api/integration" className="text-primary hover:underline">Integration Guide</a> for practical examples</li>
          <li>• Check <a href="/docs/platform/architecture" className="text-primary hover:underline">Architecture</a> for system design</li>
          <li>• See <a href="/docs/guides/metrics" className="text-primary hover:underline">Metrics Guide</a> for scoring formulas</li>
        </ul>
      </div>
    </div>
  );
}
