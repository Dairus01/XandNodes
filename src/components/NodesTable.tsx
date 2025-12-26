import Link from "next/link";
import { formatBytes, truncatePublicKey } from "@/lib/utils";
import { ChevronRight, Server, AlertTriangle } from "lucide-react";
import { PNode } from "@/types/pnode";

interface NodesTableProps {
    nodes: PNode[];
    sortField: string;
    sortDirection: "asc" | "desc";
    onSort: (field: string) => void;
}

export function NodesTable({ nodes, sortField, sortDirection, onSort }: NodesTableProps) {
    const getSortIcon = (field: string) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "syncing":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "inactive":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-slate-500/10 text-slate-500 border-slate-500/20";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Active';
            case 'syncing': return 'Syncing';
            case 'inactive': return 'Inactive';
            default: return status;
        }
    }

    // Helper to determine if a node is "At Risk" for display purposes (if we wanted to show it in a tooltip or alongside status)
    // But per instructions we prioritize the main status color.

    return (
        <div className="w-full overflow-hidden rounded-lg border border-border dark:border-slate-800 bg-card">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border dark:border-slate-800 bg-muted/50 dark:bg-[#0A0f18]">
                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-foreground dark:hover:text-white transition-colors" onClick={() => onSort("status")}>
                                Status {getSortIcon("status")}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-foreground dark:hover:text-white transition-colors" onClick={() => onSort("moniker")}>
                                Node ID/Name {getSortIcon("moniker")}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-foreground dark:hover:text-white transition-colors" onClick={() => onSort("location")}>
                                Location {getSortIcon("location")}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-foreground dark:hover:text-white transition-colors" onClick={() => onSort("version")}>
                                Version {getSortIcon("version")}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-foreground dark:hover:text-white transition-colors" onClick={() => onSort("uptime")}>
                                Uptime {getSortIcon("uptime")}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-foreground dark:hover:text-white transition-colors" onClick={() => onSort("latency")}>
                                Latency {getSortIcon("latency")}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-foreground dark:hover:text-white transition-colors" onClick={() => onSort("storage")}>
                                Storage (Used / Total) {getSortIcon("storage")}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-foreground dark:hover:text-white transition-colors" onClick={() => onSort("healthScore")}>
                                Score {getSortIcon("healthScore")}
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground dark:text-slate-400 uppercase tracking-wider">

                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 dark:divide-slate-800/50">
                        {nodes.map((node) => (
                            <tr key={node.publicKey} className="hover:bg-muted/50 dark:hover:bg-slate-900/50 transition-colors group">
                                {/* Status */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(node.status)}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${node.status === 'active' ? 'bg-green-500' : node.status === 'syncing' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                        {getStatusLabel(node.status)}
                                    </span>
                                </td>

                                {/* Node ID / Name */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded bg-muted dark:bg-slate-800 flex items-center justify-center text-primary dark:text-cyan-500 mr-3">
                                            <Server className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-foreground dark:text-slate-200 group-hover:text-primary dark:group-hover:text-cyan-400 transition-colors">
                                                {node.moniker}
                                            </div>
                                            <div className="text-xs text-muted-foreground dark:text-slate-500 font-mono">
                                                {truncatePublicKey(node.publicKey)}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Location */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {/* Placeholder for Flag - simple text for now or maybe we define a map later */}
                                        <span className="text-lg mr-2" role="img" aria-label={node.location.country}>
                                            {/* We could implement a country code to flag emoji helper here later */}
                                            🌍
                                        </span>
                                        <div className="text-sm text-foreground dark:text-slate-300">
                                            {node.location.city}, <span className="text-muted-foreground dark:text-slate-500">{node.location.countryCode}</span>
                                        </div>
                                    </div>
                                </td>

                                {/* Version */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground dark:text-slate-300">
                                    {node.version}
                                </td>

                                {/* Uptime */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground dark:text-slate-300 font-mono">
                                    {node.uptime.toFixed(2)}%
                                </td>

                                {/* Latency */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground dark:text-slate-300 font-mono">
                                    {node.performance.avgLatency.toFixed(0)}ms
                                </td>

                                {/* Storage */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground dark:text-slate-300 font-mono">
                                    <div className="flex flex-col">
                                        <span>{formatBytes(node.storage.used)} / {formatBytes(node.storage.total)}</span>
                                        <div className="w-24 h-1 bg-muted dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-primary dark:bg-cyan-500" style={{ width: `${Math.min(node.storage.usagePercentage, 100)}%` }}></div>
                                        </div>
                                    </div>
                                </td>

                                {/* Score */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground dark:text-slate-300 font-mono">
                                    {node.healthScore ? `${node.healthScore}/100` : '-'}
                                </td>

                                {/* Action */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/nodes/${node.ipAddress}`} className="text-muted-foreground dark:text-slate-500 hover:text-primary dark:hover:text-cyan-400 transition-colors inline-block p-1">
                                        <ChevronRight className="h-5 w-5" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {nodes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground dark:text-slate-500">
                    <AlertTriangle className="h-10 w-10 mb-3 opacity-50" />
                    <p>No nodes found matching your filters.</p>
                </div>
            )}
        </div>
    );
}
