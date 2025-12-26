'use client';

import { useMemo } from "react";
import { useAllPNodes, useNetworkStats } from "@/lib/hooks";
import { Header } from "@/components/Header";
import { NetworkStatsDisplay } from "@/components/NetworkStats";
import { NetworkStatsGridSkeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { calculateNetworkHealth, getVersionDistribution, assessNetworkRisk } from "@/lib/intelligence";
import { GeographicDistribution } from "@/components/GeographicDistribution";
import { Activity, ShieldAlert, Zap, HardDrive, Globe, Layers } from "lucide-react";

export default function AnalyticsPage() {
    const { data: stats, isLoading: statsLoading } = useNetworkStats();
    const { data: nodes, isLoading: nodesLoading } = useAllPNodes();

    const isLoading = statsLoading || nodesLoading;

    // 1. Radar Chart Data: Network Health Breakdown
    const radarData = useMemo(() => {
        if (!stats || !nodes) return [];
        const health = calculateNetworkHealth(stats, nodes);
        return [
            { subject: 'Availability', A: health.availability, fullMark: 100 },
            { subject: 'Version', A: health.versionHealth, fullMark: 100 },
            { subject: 'Distribution', A: health.distribution, fullMark: 100 },
            { subject: 'Storage', A: health.storageHealth, fullMark: 100 },
            { subject: 'Uptime', A: health.uptimeHealth, fullMark: 100 },
            { subject: 'Performance', A: health.performanceHealth, fullMark: 100 },
        ];
    }, [stats, nodes]);

    // 2. Latency Distribution
    const latencyData = useMemo(() => {
        if (!nodes) return [];
        const dist = {
            '0-50ms': 0,
            '51-150ms': 0,
            '151-300ms': 0,
            '301-500ms': 0,
            '500ms+': 0
        };
        nodes.forEach(n => {
            const lat = n.performance.avgLatency;
            if (lat <= 50) dist['0-50ms']++;
            else if (lat <= 150) dist['51-150ms']++;
            else if (lat <= 300) dist['151-300ms']++;
            else if (lat <= 500) dist['301-500ms']++;
            else dist['500ms+']++;
        });
        return Object.entries(dist).map(([range, count]) => ({ range, count }));
    }, [nodes]);

    // 3. Storage Utilization Distribution
    const storageData = useMemo(() => {
        if (!nodes) return [];
        const dist = {
            '0-20%': 0,
            '21-40%': 0,
            '41-60%': 0,
            '61-80%': 0,
            '81-100%': 0
        };
        nodes.forEach(n => {
            const usage = n.storage.usagePercentage;
            if (usage <= 20) dist['0-20%']++;
            else if (usage <= 40) dist['21-40%']++;
            else if (usage <= 60) dist['41-60%']++;
            else if (usage <= 80) dist['61-80%']++;
            else dist['81-100%']++;
        });
        return Object.entries(dist).map(([range, count]) => ({ range, count }));
    }, [nodes]);

    // 4. Version Distribution
    const versionData = useMemo(() => {
        if (!nodes) return [];
        return getVersionDistribution(nodes).map(v => ({
            name: v.version,
            value: v.count
        }));
    }, [nodes]);

    // 5. Risk Category Breakdown
    const riskData = useMemo(() => {
        if (!nodes) return [];
        const risk = assessNetworkRisk(nodes);
        return [
            { name: 'Storage', count: risk.riskCategories.storage, color: '#f87171' },
            { name: 'Uptime', count: risk.riskCategories.uptime, color: '#fbbf24' },
            { name: 'Version', count: risk.riskCategories.version, color: '#60a5fa' },
            { name: 'Latency', count: risk.riskCategories.latency, color: '#8b5cf6' },
        ];
    }, [nodes]);

    const COLORS = ['#00F0FF', '#FFB000', '#FF003C', '#00C49F', '#8884d8'];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 lg:py-12">
                <div className="flex flex-col gap-10">
                    {/* Hero Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-1 bg-primary rounded-full" />
                            <h1 className="text-4xl font-bold text-foreground tracking-tight">Network Intelligence</h1>
                        </div>
                        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                            Deep-level analytics and infrastructure insights across the Xandeum pNode ecosystem.
                            Real-time gossip data distilled into actionable network intelligence.
                        </p>
                    </div>

                    {!isLoading && stats && (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <NetworkStatsDisplay stats={stats} />
                        </section>
                    )}

                    {isLoading ? (
                        <NetworkStatsGridSkeleton />
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

                            {/* 1. Network Pulse (Radar) - 2 units */}
                            <Card className="xl:col-span-2 border-primary/20 bg-card/50 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-primary" />
                                        Network Pulse
                                    </CardTitle>
                                    <CardDescription>Multi-dimensional network health vector</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                            <PolarGrid stroke="var(--border)" strokeOpacity={0.5} />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--foreground)', fontSize: 11 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar
                                                name="Health Score"
                                                dataKey="A"
                                                stroke="#00F0FF"
                                                fill="#00F0FF"
                                                fillOpacity={0.4}
                                            />
                                            <RechartsTooltip
                                                contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.9)', borderColor: '#00F0FF', borderRadius: '8px' }}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* 2. Latency Distribution (Histogram) - 2 units */}
                            <Card className="xl:col-span-2 border-border/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-cyan-500" />
                                        Latency Profile
                                    </CardTitle>
                                    <CardDescription>Response time distribution across all nodes</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={latencyData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.3} />
                                            <XAxis dataKey="range" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                            <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                            <RechartsTooltip
                                                cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                                                contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.9)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                            />
                                            <Bar dataKey="count" fill="url(#latencyGradient)" radius={[4, 4, 0, 0]} />
                                            <defs>
                                                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#00F0FF" stopOpacity={0.8} />
                                                    <stop offset="100%" stopColor="#00F0FF" stopOpacity={0.2} />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* 3. Risk Assessment (Bars) - 2 units */}
                            <Card className="xl:col-span-2 border-border/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShieldAlert className="h-5 w-5 text-red-500" />
                                        Vulnerability Matrix
                                    </CardTitle>
                                    <CardDescription>Nodes failing specific health thresholds</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={riskData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" strokeOpacity={0.3} />
                                            <XAxis type="number" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                            <YAxis type="category" dataKey="name" tick={{ fill: 'var(--foreground)', fontSize: 12 }} width={80} />
                                            <RechartsTooltip
                                                contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.9)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                            />
                                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                                {riskData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* 4. Geographic Distribution (Sidebar style integrated) - 3 units */}
                            <div className="xl:col-span-3 h-full">
                                {nodes && <GeographicDistribution nodes={nodes} />}
                            </div>

                            {/* 5. Software & Storage - 3 units container */}
                            <div className="xl:col-span-3 grid gap-6 grid-cols-1">

                                {/* Storage Utilization */}
                                <Card className="border-border/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <HardDrive className="h-5 w-5 text-amber-500" />
                                            Storage Utilization
                                        </CardTitle>
                                        <CardDescription>Disk usage tiers across the pNode fleet</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={storageData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.3} />
                                                <XAxis dataKey="range" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                                <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                                                <RechartsTooltip
                                                    contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.9)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                                />
                                                <Area type="monotone" dataKey="count" stroke="#FFB000" fill="#FFB000" fillOpacity={0.2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                {/* Version Adoption (Donut) */}
                                <Card className="border-border/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Layers className="h-5 w-5 text-emerald-500" />
                                            Version Consensus
                                        </CardTitle>
                                        <CardDescription>Software version distribution and adoption</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[250px] flex items-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={versionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={8}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {versionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    contentStyle={{ backgroundColor: 'rgba(5, 5, 5, 0.9)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                                />
                                                <Legend verticalAlign="middle" align="right" layout="vertical" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="border-t border-border mt-20 bg-card/30">
                <div className="container mx-auto px-4 py-8">
                    <p className="text-sm text-center text-muted-foreground group">
                        Analytics powered by <span className="text-primary font-mono group-hover:glow">Xandeum Gossip Protocol</span> • Updated every 60 seconds
                    </p>
                </div>
            </footer>
        </div>
    );
}
