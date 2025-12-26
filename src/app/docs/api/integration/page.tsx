import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/CodeBlock";
import { Terminal } from "lucide-react";

export const metadata = {
  title: "Integration Guide - XandNodes Documentation",
  description: "Learn how to integrate with pRPC and build custom features",
};

export default function IntegrationPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">API & Integration</Badge>
        <h1 className="text-4xl font-bold mb-4">Integration Guide</h1>
        <p className="text-xl text-muted-foreground">
          Practical examples for integrating pRPC and building custom features
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Building a Custom Dashboard</h2>
        <p className="mb-4">Create a custom dashboard showing specific metrics:</p>
        <CodeBlock
          code={`'use client';\n\nimport { useAllPNodes, useNetworkStats } from '@/lib/hooks';\nimport { Card } from '@/components/ui/card';\n\nexport function CustomDashboard() {\n  const { data: nodes } = useAllPNodes();\n  const { data: stats } = useNetworkStats();\n\n  // Filter high-performance nodes\n  const topNodes = nodes\n    ?.filter(n => n.healthScore > 90)\n    .slice(0, 10);\n\n  // Calculate custom metric\n  const avgStorageUsage = nodes?.reduce(\n    (acc, node) => acc + node.storage.usagePercentage, 0\n  ) / (nodes?.length || 1);\n\n  return (\n    <div>\n      <h1>My Custom Dashboard</h1>\n\n      <Card>\n        <h2>Top 10 Nodes (Health > 90)</h2>\n        {topNodes?.map(node => (\n          <div key={node.publicKey}>\n            {node.moniker}: {node.healthScore}\n          </div>\n        ))}\n      </Card>\n\n      <Card>\n        <h2>Network Metrics</h2>\n        <p>Total Nodes: {stats?.totalNodes}</p>\n        <p>Avg Storage Usage: {avgStorageUsage.toFixed(1)}%</p>\n      </Card>\n    </div>\n  );\n}`}
          language="tsx"
          title="CustomDashboard.tsx"
          showLineNumbers
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Filtering and Searching Nodes</h2>
        <CodeBlock
          code={`import { useAllPNodes } from '@/lib/hooks';\nimport { useState, useMemo } from 'react';\n\nexport function NodeSearch() {\n  const { data: nodes } = useAllPNodes();\n  const [search, setSearch] = useState('');\n  const [minHealth, setMinHealth] = useState(0);\n\n  // Filter and sort nodes\n  const filteredNodes = useMemo(() => {\n    if (!nodes) return [];\n\n    return nodes\n      .filter(node =>\n        node.moniker.toLowerCase().includes(search.toLowerCase()) &&\n        node.healthScore >= minHealth\n      )\n      .sort((a, b) => b.healthScore - a.healthScore);\n  }, [nodes, search, minHealth]);\n\n  return (\n    <div>\n      <input\n        type="text"\n        placeholder="Search by moniker..."\n        value={search}\n        onChange={(e) => setSearch(e.target.value)}\n      />\n\n      <input\n        type="range"\n        min="0"\n        max="100"\n        value={minHealth}\n        onChange={(e) => setMinHealth(Number(e.target.value))}\n      />\n      <span>Min Health: {minHealth}</span>\n\n      <div>\n        Found {filteredNodes.length} nodes\n      </div>\n    </div>\n  );\n}`}
          language="tsx"
          title="NodeSearch.tsx"
          showLineNumbers
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Building Custom Analytics</h2>
        <CodeBlock
          code={`import { useAllPNodes } from '@/lib/hooks';\nimport { useMemo } from 'react';\n\nexport function GeoAnalytics() {\n  const { data: nodes } = useAllPNodes();\n\n  const analytics = useMemo(() => {\n    if (!nodes) return null;\n\n    // Group by country\n    const byCountry = nodes.reduce((acc, node) => {\n      const country = node.location.country;\n      if (!acc[country]) {\n        acc[country] = {\n          count: 0,\n          totalStorage: 0,\n          avgHealth: 0,\n        };\n      }\n      acc[country].count++;\n      acc[country].totalStorage += node.storage.total;\n      acc[country].avgHealth += node.healthScore;\n      return acc;\n    }, {} as Record<string, any>);\n\n    // Calculate averages\n    Object.values(byCountry).forEach((data: any) => {\n      data.avgHealth /= data.count;\n    });\n\n    // Sort by count\n    const sorted = Object.entries(byCountry)\n      .sort(([, a]: any, [, b]: any) => b.count - a.count);\n\n    return sorted;\n  }, [nodes]);\n\n  return (\n    <div>\n      <h2>Nodes by Country</h2>\n      {analytics?.map(([country, data]: [string, any]) => (\n        <div key={country}>\n          <strong>{country}</strong>: {data.count} nodes,\n          Avg Health: {data.avgHealth.toFixed(1)}\n        </div>\n      ))}\n    </div>\n  );\n}`}
          language="tsx"
          title="GeoAnalytics.tsx"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Real-time Monitoring</h2>
        <p className="mb-4">Set up monitoring with custom refresh intervals:</p>
        <CodeBlock
          code={`import { useAllPNodes } from '@/lib/hooks';\nimport { useEffect } from 'react';\n\nexport function RealTimeMonitor() {\n  const { data: nodes, refetch } = useAllPNodes();\n\n  // Custom refresh interval (30 seconds)\n  useEffect(() => {\n    const interval = setInterval(() => {\n      refetch();\n    }, 30000);\n\n    return () => clearInterval(interval);\n  }, [refetch]);\n\n  // Monitor for critical nodes\n  const criticalNodes = nodes?.filter(node =>\n    node.uptime < 95 ||\n    node.storage.usagePercentage > 90 ||\n    node.performance.avgLatency > 200\n  );\n\n  return (\n    <div>\n      <h2>Critical Nodes Alert</h2>\n      {criticalNodes?.length === 0 ? (\n        <p>All nodes healthy</p>\n      ) : (\n        criticalNodes?.map(node => (\n          <div key={node.publicKey} className="alert">\n            {node.moniker}:\n            {node.uptime < 95 && ' Low uptime'}\n            {node.storage.usagePercentage > 90 && ' High storage'}\n            {node.performance.avgLatency > 200 && ' High latency'}\n          </div>\n        ))\n      )}\n    </div>\n  );\n}`}
          language="tsx"
          title="RealTimeMonitor.tsx"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Custom Data Export</h2>
        <CodeBlock
          code={`import { useAllPNodes } from '@/lib/hooks';\n\nexport function CustomExport() {\n  const { data: nodes } = useAllPNodes();\n\n  const exportFilteredNodes = () => {\n    // Filter nodes\n    const filtered = nodes?.filter(n => n.healthScore > 80);\n\n    // Create custom CSV\n    const headers = ['Moniker', 'Country', 'Health', 'Uptime'];\n    const rows = filtered?.map(n => [\n      n.moniker,\n      n.location.country,\n      n.healthScore,\n      n.uptime,\n    ]);\n\n    const csv = [\n      headers.join(','),\n      ...rows.map(row => row.join(',Handle')), \n    ].join('\\n');\n\n    // Download\n    const blob = new Blob([csv], { type: 'text/csv' });\n    const url = URL.createObjectURL(blob);\n    const a = document.createElement('a');\n    a.href = url;\n    a.download = 'high-health-nodes.csv';\n    a.click();\n  };\n\n  return (\n    <button onClick={exportFilteredNodes}>\n      Export High Health Nodes\n    </button>\n  );\n}`}
          language="tsx"
          title="CustomExport.tsx"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Building Alerts</h2>
        <CodeBlock
          code={`import { useAllPNodes } from '@/lib/hooks';\nimport { useEffect } from 'react';\n\nexport function NodeAlerts() {\n  const { data: nodes } = useAllPNodes();\n\n  useEffect(() => {\n    if (!nodes) return;\n\n    // Check for nodes with issues\n    nodes.forEach(node => {\n      if (node.uptime < 90) {\n        console.warn(\`Low uptime alert: \${node.moniker}\`);\n        // Could send notification here\n      }\n\n      if (node.storage.usagePercentage > 95) {\n        console.error(\`Storage critical: \${node.moniker}\`);\n        // Could trigger email/webhook\n      }\n    });\n  }, [nodes]);\n\n  return <div>Monitoring {nodes?.length} nodes...</div>;\n}`}
          language="tsx"
          title="NodeAlerts.tsx"
          showLineNumbers
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Integration with External APIs</h2>
        <p className="mb-4">Combine XandNodes data with external services:</p>
        <CodeBlock
          code={`import { useAllPNodes } from '@/lib/hooks';\n\nexport async function enrichNodeData(publicKey: string) {\n  // Get node from XandNodes\n  const client = getPNodeClient();\n  const node = await client.getPNodeDetails(publicKey);\n\n  // Enrich with external data\n  const geoData = await fetch(\n    \`https://api.ipgeolocation.io/ipgeo?ip=\${node.ipAddress}\`\n  ).then(r => r.json());\n\n  return {\n    ...node,\n    enriched: {\n      isp: geoData.isp,\n      continent: geoData.continent_name,\n      currency: geoData.currency,\n    },\n  };\n}`}
          language="typescript"
          title="enrichNodeData.ts"
        />
      </div>

      <div className="bg-muted rounded-lg p-6 border border-border">
        <h3 className="font-semibold mb-3">Best Practices</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Use React Query hooks instead of direct PNodeClient calls</li>
          <li>• Leverage useMemo for expensive calculations</li>
          <li>• Respect the 60s cache - don't over-refetch</li>
          <li>• Handle loading and error states properly</li>
          <li>• Use TypeScript for type safety</li>
          <li>• Test with real pNode data before deploying</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Review <a href="/docs/api/reference" className="text-primary hover:underline">API Reference</a> for complete type definitions</li>
          <li>• Check <a href="/docs/platform/architecture" className="text-primary hover:underline">Architecture</a> to understand data flow</li>
          <li>• See <a href="/docs/platform/deployment" className="text-primary hover:underline">Deployment</a> to publish your custom features</li>
        </ul>
      </div>
    </div>
  );
}
