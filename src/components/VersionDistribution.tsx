'use client';

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Package, AlertTriangle, CheckCircle, ChevronRight } from "lucide-react";
import { getVersionDistribution, getMostCommonVersion } from "@/lib/intelligence";
import type { PNode } from "@/types/pnode";

interface VersionDistributionProps {
  nodes: PNode[];
}

export function VersionDistribution({ nodes }: VersionDistributionProps) {
  const distribution = getVersionDistribution(nodes);
  const latestVersion = getMostCommonVersion(nodes);

  const chartData = distribution.map(item => ({
    version: item.version,
    count: item.count,
    percentage: item.percentage,
    isLatest: item.isLatest,
  }));

  const outdatedNodes = nodes.filter(n => n.version !== latestVersion);
  const versionHealthPercent = ((nodes.length - outdatedNodes.length) / nodes.length) * 100;

  const getHealthColor = () => {
    if (versionHealthPercent === 100) return 'text-green-500';
    if (versionHealthPercent >= 80) return 'text-blue-500';
    if (versionHealthPercent >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthStatus = () => {
    if (versionHealthPercent === 100) return 'Perfect';
    if (versionHealthPercent >= 80) return 'Good';
    if (versionHealthPercent >= 60) return 'Fair';
    return 'Poor';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-500" />
            <CardTitle>Version Distribution</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {versionHealthPercent === 100 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : outdatedNodes.length > 0 && (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
            <Badge variant={versionHealthPercent >= 80 ? 'default' : 'secondary'}>
              {getHealthStatus()}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Track pNode software versions across the network
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Version Health Summary */}
          {/* Version Health Summary */}
          <div className="p-4 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/20 rounded-lg">
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-2 gap-2">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-50">
                  Version Health
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nodes on latest version ({latestVersion})
                </p>
              </div>
              <div className={`text-3xl sm:text-4xl font-bold ${getHealthColor()}`}>
                {versionHealthPercent.toFixed(0)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${versionHealthPercent}%` }}
              />
            </div>
            {outdatedNodes.length > 0 && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{outdatedNodes.length} node{outdatedNodes.length !== 1 ? 's' : ''} need{outdatedNodes.length === 1 ? 's' : ''} upgrade</span>
              </p>
            )}
          </div>

          {/* Bar Chart */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-50">
              Version Breakdown:
            </h4>
            <div className="-ml-4 sm:ml-0">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ left: 0, right: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-800" />
                  <XAxis
                    dataKey="version"
                    className="text-[10px] sm:text-xs"
                    stroke="currentColor"
                    tick={{ fontSize: 10 }}
                    interval={0}
                  />
                  <YAxis
                    className="text-[10px] sm:text-xs"
                    stroke="currentColor"
                    tick={{ fontSize: 10 }}
                    width={30}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover p-3 sm:p-4 rounded-lg border border-border shadow-lg">
                            <p className="font-semibold text-foreground text-sm">
                              {data.version}
                              {data.isLatest && (
                                <Badge variant="default" className="ml-2 text-[10px]">
                                  Latest
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {data.count} node{data.count !== 1 ? 's' : ''}
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400">
                              {data.percentage.toFixed(1)}% of network
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isLatest ? '#10b981' : entry.percentage < 10 ? '#ef4444' : '#6366f1'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Version List */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-50">
              All Versions:
            </h4>
            {distribution.map(({ version, count, percentage, isLatest }) => (
              <div
                key={version}
                className="flex items-center justify-between p-3 bg-muted/50 border border-border/50 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${isLatest ? 'bg-green-500' : percentage < 10 ? 'bg-red-500' : 'bg-indigo-500'
                      }`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-medium truncate">
                        {version}
                      </span>
                      {isLatest && (
                        <Badge variant="default" className="text-[10px]">
                          Current
                        </Badge>
                      )}
                      {!isLatest && percentage < 10 && (
                        <Badge variant="destructive" className="text-[10px]">
                          Deprecated
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <p className="text-sm font-semibold">
                    {count}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Outdated Nodes Action */}
          {outdatedNodes.length > 0 && (
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    Upgrade Recommended
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {outdatedNodes.length} pNode{outdatedNodes.length !== 1 ? 's are' : ' is'} outdated.
                    Upgrade to {latestVersion}.
                  </p>
                </div>
                <Link href="/nodes" className="w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto flex-shrink-0">
                    View Nodes
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Network Synchronization Status */}
          {versionHealthPercent === 100 ? (
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-start gap-2 text-green-900 dark:text-green-100">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Perfect Synchronization</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    All pNodes are running {latestVersion}.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
