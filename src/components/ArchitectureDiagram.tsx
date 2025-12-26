"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Laptop,
    Server,
    Database,
    ShieldCheck,
    Activity,
    Cpu,
    Globe,
    ArrowRight,
    Code2,
    Zap,
    Network
} from "lucide-react";

const nodes = [
    {
        id: "client",
        title: "User Browser / Client",
        description: "Next.js 15 + React 19 Client UI",
        icon: Laptop,
        x: 400,
        y: 50,
        color: "#00F0FF",
    },
    {
        id: "nextjs",
        title: "Next.js App / App Router",
        description: "Server & Client Components",
        icon: Server,
        x: 400,
        y: 180,
        color: "#00F0FF",
    },
    {
        id: "management",
        title: "Data Management",
        description: "React Query + PNodeClient",
        icon: Database,
        x: 250,
        y: 330,
        color: "#FFB000",
    },
    {
        id: "api",
        title: "API Routes",
        description: "Server-side Proxy (/api/prpc)",
        icon: Code2,
        x: 550,
        y: 330,
        color: "#FFB000",
    },
    {
        id: "resilience",
        title: "Resilience Layer",
        description: "Circuit Breaker + 5s Timeout",
        icon: ShieldCheck,
        x: 400,
        y: 480,
        color: "#FF003C",
    },
    {
        id: "network",
        title: "Xandeum Network",
        description: "8 Verified pRPC Endpoints (Port 6000)",
        icon: Network,
        x: 400,
        y: 630,
        color: "#00F0FF",
    },
];

const connections = [
    { from: "client", to: "nextjs", label: "HTTPS" },
    { from: "nextjs", to: "management", label: "useAllPNodes()" },
    { from: "nextjs", to: "api", label: "Axios Request" },
    { from: "management", to: "resilience", label: "Parallel Fetch" },
    { from: "api", to: "resilience", label: "Proxy Call" },
    { from: "resilience", to: "network", label: "pRPC" },
];

export function ArchitectureDiagram() {
    return (
        <div className="relative w-full overflow-hidden bg-black/40 rounded-3xl border border-white/5 p-8 my-12 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.05)_0%,transparent_50%)]" />

            <svg
                viewBox="0 0 800 750"
                className="w-full h-auto drop-shadow-2xl"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Animated Background Gradients */}
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(0, 240, 255, 0.2)" />
                        <stop offset="100%" stopColor="rgba(0, 240, 255, 0.8)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Connections */}
                {connections.map((conn, idx) => {
                    const fromNode = nodes.find((n) => n.id === conn.from)!;
                    const toNode = nodes.find((n) => n.id === conn.to)!;

                    return (
                        <g key={`conn-${idx}`}>
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1, delay: idx * 0.2 + 0.5 }}
                                d={`M ${fromNode.x} ${fromNode.y + 40} L ${toNode.x} ${toNode.y - 40}`}
                                stroke="url(#lineGradient)"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                className="opacity-50"
                            />
                            <motion.circle
                                initial={{ offset: 0 }}
                                animate={{ offset: [0, 100] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                r="3"
                                fill="#00F0FF"
                                filter="url(#glow)"
                            >
                                <animateMotion
                                    path={`M ${fromNode.x} ${fromNode.y + 40} L ${toNode.x} ${toNode.y - 40}`}
                                    dur="3s"
                                    repeatCount="indefinite"
                                />
                            </motion.circle>

                            {/* Connection Label */}
                            <motion.text
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.2 + 1 }}
                                x={(fromNode.x + toNode.x) / 2 + 10}
                                y={(fromNode.y + toNode.y) / 2}
                                fill="rgba(255,255,255,0.4)"
                                fontSize="10"
                                className="font-mono"
                            >
                                {conn.label}
                            </motion.text>
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodes.map((node, idx) => {
                    const Icon = node.icon;
                    return (
                        <motion.g
                            key={node.id}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="cursor-pointer"
                        >
                            {/* Background Box */}
                            <rect
                                x={node.x - 120}
                                y={node.y - 40}
                                width="240"
                                height="80"
                                rx="12"
                                className="fill-black/60 stroke-white/10"
                                style={{ strokeWidth: 1 }}
                            />

                            {/* Glow Accent */}
                            <rect
                                x={node.x - 120}
                                y={node.y - 40}
                                width="240"
                                height="2"
                                rx="1"
                                fill={node.color}
                                className="opacity-50"
                            />

                            {/* Icon Background */}
                            <circle
                                cx={node.x - 90}
                                cy={node.y}
                                r="22"
                                fill={`${node.color}10`}
                                className="stroke-white/5"
                            />

                            {/* Text */}
                            <text
                                x={node.x - 60}
                                y={node.y - 8}
                                fill="white"
                                fontSize="14"
                                fontWeight="600"
                                className="font-rajdhani"
                            >
                                {node.title}
                            </text>
                            <text
                                x={node.x - 60}
                                y={node.y + 12}
                                fill="rgba(255,255,255,0.5)"
                                fontSize="11"
                            >
                                {node.description}
                            </text>

                            {/* Icon - We use a foreignObject to render Lucide component */}
                            <foreignObject x={node.x - 104} y={node.y - 14} width="28" height="28">
                                <Icon size={24} color={node.color} />
                            </foreignObject>
                        </motion.g>
                    );
                })}
            </svg>

            {/* Legend / Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-8">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#00F0FF]" />
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Interface & Network</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#FFB000]" />
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Logic & State</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#FF003C]" />
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Resilience & Safety</span>
                </div>
            </div>
        </div>
    );
}
