import { Badge } from "@/components/ui/badge";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";

export const metadata = {
  title: "Architecture - XandNodes Documentation",
  description: "Technical architecture and design of XandNodes",
};

export default function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="outline" className="mb-4">Platform</Badge>
        <h1 className="text-4xl font-bold mb-4">Architecture Overview</h1>
        <p className="text-xl text-muted-foreground">
          Technical architecture, data flow, and system design of XandNodes
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-primary">System Architecture</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          An overview of the end-to-end data flow from the client browser to the Xandeum decentralized network.
          Built with resilience, performance, and real-time observability in mind.
        </p>
        <ArchitectureDiagram />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>

          <h3 className="text-lg font-semibold mb-3 border-l-2 border-primary pl-3">Frontend</h3>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li>• <strong>Next.js 16.1+:</strong> React framework with App Router</li>
            <li>• <strong>React 19:</strong> Latest React with Server Components</li>
            <li>• <strong>TypeScript 5:</strong> Type-safe development</li>
            <li>• <strong>Tailwind CSS 4:</strong> Utility-first styling</li>
            <li>• <strong>Framer Motion:</strong> Advanced UI animations</li>
            <li>• <strong>Recharts 3:</strong> Data visualization</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3 border-l-2 border-amber-500 pl-3">Data Layer</h3>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li>• <strong>TanStack React Query v5:</strong> Server state management</li>
            <li>• <strong>Axios:</strong> HTTP client with interceptors</li>
            <li>• <strong>Circuit Breaker Pattern:</strong> Fault tolerance</li>
            <li>• <strong>Smart Caching:</strong> 60s stale time, no auto-refetch</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-primary">Key Components</h2>

          <h3 className="text-lg font-semibold mb-3">PNodeClient</h3>
          <p className="mb-3 text-sm text-muted-foreground">Core API client with resilience patterns:</p>
          <ul className="space-y-2 text-muted-foreground mb-6 text-sm">
            <li>• 5-second timeout per request</li>
            <li>• Circuit breaker tracks failing nodes</li>
            <li>• Parallel execution across endpoints</li>
            <li>• No retry logic (fail fast)</li>
            <li>• Automatic data validation</li>
          </ul>

          <h3 className="text-lg font-semibold mb-3">Intelligence Layer</h3>
          <p className="mb-3 text-sm text-muted-foreground">AI-powered analytics:</p>
          <ul className="space-y-2 text-muted-foreground mb-6 text-sm">
            <li>• <code className="bg-muted px-2 py-1 rounded text-xs">assessNetworkRisk()</code> - Risk analysis</li>
            <li>• <code className="bg-muted px-2 py-1 rounded text-xs">calculateNetworkHealth()</code> - Health scoring</li>
            <li>• Client-side computation using useMemo</li>
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Request Lifecycle</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: "01", title: "User Action", desc: "User triggers data fetch via navigation or refresh" },
            { step: "02", title: "Query Hook", desc: "React Query calls PNodeClient via custom hooks" },
            { step: "03", title: "Parallel pRPC", desc: "8 endpoints queried simultaneously with circuit breaker" },
            { step: "04", title: "Transform & Cache", desc: "Raw data transformed to PNode type and cached for 60s" }
          ].map((item) => (
            <div key={item.step} className="p-4 bg-muted/30 rounded-xl border border-border/50">
              <span className="text-primary font-bold text-xs opacity-50 tracking-tighter">{item.step}</span>
              <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/50 rounded-2xl p-6 border border-border">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          Design Architecture Principles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="font-semibold text-sm mb-1">Fail Fast</p>
            <p className="text-xs text-muted-foreground italic">5s timeout, no retries to maintain UI responsiveness.</p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-1">Resilience</p>
            <p className="text-xs text-muted-foreground italic">Circuit breaker prevents cascading network failures.</p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-1">Decentralization</p>
            <p className="text-xs text-muted-foreground italic">Avoids single point of failure by querying 8 independent nodes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
