'use client';

import { useMemo } from "react";
import Link from "next/link";
import { useAllPNodes, useNetworkStats } from "@/lib/hooks";
import { Header } from "@/components/Header";
import { NetworkStatsDisplay } from "@/components/NetworkStats";
import { NetworkHealthGrade } from "@/components/NetworkHealthGrade";
import { NodeCard } from "@/components/NodeCard";
import { InsightsPanel } from "@/components/InsightsPanel";
import { AtRiskNodesCard } from "@/components/AtRiskNodesCard";
import { HealthScoreBreakdown } from "@/components/HealthScoreBreakdown";
import { VersionDistribution } from "@/components/VersionDistribution";
import { ExportButtons } from "@/components/ExportButtons";
import { GeographicDistribution } from "@/components/GeographicDistribution";
import { TopPerformers } from "@/components/TopPerformers";
import { NetworkStatsGridSkeleton, NodeGridSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Globe2, Gauge, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

const NetworkMap = dynamic(
  () => import("@/components/NetworkMap").then((mod) => mod.NetworkMap),
  { ssr: false }
);
import {
  generateNetworkEvents,
  assessNetworkRisk,
  calculateNetworkHealth,
} from "@/lib/intelligence";

export default function Home() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useNetworkStats();
  const { data: nodes, isLoading: nodesLoading, error: nodesError } = useAllPNodes();

  // Generate intelligent insights
  const networkEvents = useMemo(() => {
    if (!stats || !nodes) return [];
    return generateNetworkEvents(stats, nodes);
  }, [stats, nodes]);

  const riskAssessment = useMemo(() => {
    if (!nodes) return {
      atRiskCount: 0,
      atRiskNodes: [],
      criticalCount: 0,
      warningCount: 0,
      riskCategories: { storage: 0, uptime: 0, version: 0, latency: 0 },
    };
    return assessNetworkRisk(nodes);
  }, [nodes]);

  const healthBreakdown = useMemo(() => {
    if (!stats || !nodes) return {
      availability: 0,
      versionHealth: 0,
      distribution: 0,
      storageHealth: 0,
      uptimeHealth: 0,
      performanceHealth: 0,
      totalScore: 0,
    };
    return calculateNetworkHealth(stats, nodes);
  }, [stats, nodes]);

  const isLoading = statsLoading || nodesLoading;

  if (statsError || nodesError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Data</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {statsError?.message || nodesError?.message || 'An unknown error occurred'}
        </p>
      </div>
    );
  }

  // Get top nodes by health score
  const topNodes = nodes
    ?.filter(node => node.status === 'active')
    .sort((a, b) => (b.healthScore || 0) - (a.healthScore || 0))
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">

        {/* Interactive 2D Network Map */}
        {nodes && (
          <section className="mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-[350px] sm:h-[450px] lg:h-[600px] w-full">
              <NetworkMap nodes={nodes} />
            </div>
          </section>
        )}

        {/* Network Health Grade - Hero Section */}
        {!isLoading && stats && (
          <section className="mb-6 sm:mb-8">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="md:col-span-1">
                <NetworkHealthGrade stats={stats} />
              </div>
              <div className="md:col-span-1 lg:col-span-3">
                <div className="h-full flex flex-col justify-center">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">
                    Network Overview
                  </h2>
                  <NetworkStatsDisplay stats={stats} />
                </div>
              </div>
            </div>
          </section>
        )}

        {isLoading && (
          <section className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">
              Network Overview
            </h2>
            <NetworkStatsGridSkeleton />
          </section>
        )}

        {/* Intelligence Layer - Phase 1 */}
        <section className="mb-6 sm:mb-8">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {/* Insights Panel */}
            <div className="lg:col-span-2">
              <InsightsPanel events={networkEvents} />
            </div>

            {/* At Risk Nodes */}
            <div className="lg:col-span-1">
              <AtRiskNodesCard assessment={riskAssessment} />
            </div>
          </div>
        </section>

        {/* Intelligence Layer - Phase 2 */}
        <section className="mb-6 sm:mb-8">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Health Score Breakdown */}
            <div>
              <HealthScoreBreakdown health={healthBreakdown} />
            </div>

            {/* Version Intelligence */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-50">
                Version Intelligence
              </h2>
              {nodes && <VersionDistribution nodes={nodes} />}
            </div>
          </div>
        </section>

        {/* Geographic & Performance Analytics */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">
            Network Analytics
          </h2>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {nodes && <GeographicDistribution nodes={nodes} />}
            {nodes && <TopPerformers nodes={nodes} />}
          </div>
        </section>

        {/* Top Performing Nodes */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              Top Performing Nodes
            </h2>
            <Link href="/nodes">
              <Button variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto">
                View All Nodes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <NodeGridSkeleton count={8} />
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {topNodes?.map((node) => (
                <NodeCard key={node.publicKey} node={node} />
              ))}
            </div>
          )}
        </section>

        {/* Data Export - Phase 3 */}
        {nodes && stats && (
          <section className="mt-12">
            <Card>
              <CardContent className="p-6">
                <ExportButtons nodes={nodes} stats={stats} />
              </CardContent>
            </Card>
          </section>
        )}

        {/* Additional Info - Redesigned to match screenshot */}
        <section className="mt-12 sm:mt-16 lg:mt-20">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-foreground/90">
            About Xandeum pNodes
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 sm:mb-10 max-w-4xl leading-relaxed">
            Xandeum pNodes are decentralized storage provider nodes that form the backbone Xandeum layer.
            Each pNode contributes storage capacity, bandwidth, and compute power to create a resilient,
            high performance storage network.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Decentralized Card */}
            <div className="bg-card/30 backdrop-blur-sm p-5 sm:p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300">
              <div className="mb-4 sm:mb-6 h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Globe2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground">Decentralized</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Distributed globally across multiple countries and regions.
              </p>
            </div>

            {/* High Performance Card */}
            <div className="bg-card/30 backdrop-blur-sm p-5 sm:p-8 rounded-2xl border border-border/50 hover:border-secondary/30 transition-all duration-300">
              <div className="mb-4 sm:mb-6 h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Gauge className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground">High Performance</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Low latency and high bandwidth for fast data access.
              </p>
            </div>

            {/* Scalable Card */}
            <div className="bg-card/30 backdrop-blur-sm p-5 sm:p-8 rounded-2xl border border-border/50 hover:border-accent/30 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="mb-4 sm:mb-6 h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground">Scalable</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Growing capacity to exabyte-scale storage.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 sm:mt-16 bg-card">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                XandNodes
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                Xandeum pNode Network Explorer
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Live Data
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
