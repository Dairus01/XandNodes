'use client';

import { useEffect, useState, useMemo, useRef, memo } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap, Popup, ZoomControl } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PNode } from '@/types/pnode';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface NetworkMapProps {
    nodes: PNode[];
}

// -----------------------------------------------------------------------------
// Sub-components for Performance Optimization
// -----------------------------------------------------------------------------

// Controls the map view (Zoom/Pan) when an active node is selected
function MapController({ selectedNode }: { selectedNode: PNode | null }) {
    const map = useMap();

    useEffect(() => {
        if (selectedNode && selectedNode.location.lat && selectedNode.location.lng) {
            // Shorter duration for snappier feel
            map.flyTo([selectedNode.location.lat, selectedNode.location.lng], 6, {
                animate: true,
                duration: 1.2
            });
        }
    }, [selectedNode, map]);

    return null;
}

// Renders the static "dots" for all nodes. 
// Memoized to prevent re-rendering all 200+ markers when one is clicked.
const StaticNodeMarkers = memo(function StaticNodeMarkers({
    nodes,
    onNodeClick
}: {
    nodes: PNode[],
    onNodeClick: (node: PNode) => void
}) {
    return (
        <>
            {nodes.filter(n => n.location?.lat && n.location?.lng).map((node) => {
                const isActive = node.status === 'active';
                const isSyncing = node.status === 'syncing';
                const color = isActive ? '#06b6d4' : isSyncing ? '#eab308' : '#ef4444';

                return (
                    <CircleMarker
                        key={node.publicKey}
                        center={[node.location.lat, node.location.lng]}
                        radius={5} // Slightly larger hit target
                        pathOptions={{
                            fillColor: color,
                            fillOpacity: 0.7,
                            color: 'transparent',
                            weight: 0,
                        }}
                        eventHandlers={{
                            click: () => onNodeClick(node),
                            mouseover: (e) => { e.target.setStyle({ fillOpacity: 1 }); },
                            mouseout: (e) => { e.target.setStyle({ fillOpacity: 0.7 }); }
                        }}
                    />
                );
            })}
        </>
    );
});

// Renders ONLY the currently active node details (Popup & Highlight Ring)
// This separates the "Popup rendering" from the "Map rendering"
function ActiveNodeOverlay({ node, onClose }: { node: PNode | null, onClose: () => void }) {
    const markerRef = useRef<L.CircleMarker>(null);

    // Auto-open popup when node changes
    useEffect(() => {
        if (node && markerRef.current) {
            // Small timeout to ensure render frame is ready
            setTimeout(() => {
                markerRef.current?.openPopup();
            }, 10);
        }
    }, [node]);

    if (!node || !node.location?.lat || !node.location.lng) return null;

    const isActive = node.status === 'active';
    const isSyncing = node.status === 'syncing';
    const color = isActive ? '#06b6d4' : isSyncing ? '#eab308' : '#ef4444';

    return (
        <CircleMarker
            ref={markerRef}
            center={[node.location.lat, node.location.lng]}
            radius={8}
            pathOptions={{
                fillColor: color,
                fillOpacity: 1,
                color: '#ffffff',
                weight: 2,
                className: 'leaflet-interactive'
            }}
        >
            <Popup
                className="custom-popup"
                closeButton={false}
                offset={[30, -25]}
                maxWidth={320}
                minWidth={300}
                autoPan={false} // Disable autoPan here to let MapController handle the smooth flyTo
            >
                {/* The connecting line - visual only */}
                <div className="absolute -left-[30px] bottom-[20px] w-[35px] h-[1px] bg-cyan-500/50 origin-right rotate-[-25deg] pointer-events-none" />
                <div className="absolute -left-[32px] bottom-[14px] w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_cyan] pointer-events-none z-50" />

                <div className="bg-[#050505]/95 backdrop-blur-xl border border-white/10 text-slate-200 p-0 rounded-xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden relative group">
                    {/* Top colored accent line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-transparent" />

                    <div className="p-5 space-y-4">

                        {/* Header: PubKey & ID */}
                        <div>
                            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">
                                Public Identity Key
                            </div>
                            <div className="font-mono text-sm text-cyan-50 truncate w-full bg-black/50 p-2 rounded border border-white/5">
                                {node.publicKey}
                            </div>
                        </div>

                        {/* Location & Status */}
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">
                                    Location
                                </div>
                                <div className="text-base font-bold text-white flex items-center gap-2">
                                    <span className="text-xl leading-none">
                                        {/* Map country code to emoji flag manually or use a library. For now simple placeholder or text is safer if no lib. */}
                                        🌍
                                    </span>
                                    {node.location.city}, {node.location.country}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">
                                    Status
                                </div>
                                <Badge variant="outline" className={`${node.status === 'active' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50' :
                                    node.status === 'syncing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50' :
                                        'bg-red-500/10 text-red-400 border-red-500/50'
                                    } uppercase text-[10px] tracking-wider px-2 py-0.5`}>
                                    {node.status}
                                </Badge>
                            </div>
                        </div>

                        {/* IP Address */}
                        <div>
                            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">
                                Network Address
                            </div>
                            <div className="font-mono text-xs text-slate-300">
                                {node.ipAddress}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-white/5 p-3 flex items-center justify-between border-t border-white/5">
                        <Button size="sm" variant="ghost" className="h-8 text-xs font-normal text-slate-400 hover:text-white" onClick={onClose}>
                            Dismiss
                        </Button>
                        <Link href={`/nodes/${node.publicKey}`}>
                            <Button size="sm" className="h-8 text-xs bg-white text-black hover:bg-slate-200 font-medium">
                                View Operations
                            </Button>
                        </Link>
                    </div>
                </div>
            </Popup>
        </CircleMarker>
    );
}


// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function NetworkMap({ nodes }: NetworkMapProps) {
    const [activeNode, setActiveNode] = useState<PNode | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const activeNodesCount = useMemo(() => nodes.filter(n => n.status === 'active').length, [nodes]);

    if (!mounted) {
        return (
            <div className="h-[600px] w-full bg-slate-950 flex items-center justify-center border border-white/10 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
                <div className="flex flex-col items-center gap-4 text-cyan-500 animate-pulse">
                    <div className="w-12 h-12 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-cyan-700 border-l-transparent animate-spin" />
                    <span className="font-mono text-xs uppercase tracking-widest">Initializing Tactical Map...</span>
                </div>
            </div>
        );
    }

    return (
        <Card className="relative overflow-hidden border-border dark:border-cyan-500/20 bg-card dark:bg-slate-950 shadow-2xl h-[600px] group">

            {/* UI Overlays */}
            <div className="absolute top-4 left-4 z-[500] flex flex-col gap-2 pointer-events-none">
                <Card className="bg-background/90 dark:bg-black/90 backdrop-blur-md border-border dark:border-white/10 p-3 w-[200px] pointer-events-auto shadow-xl dark:shadow-2xl">
                    <h3 className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-wider mb-2">Node Status</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-foreground dark:text-slate-200">
                                <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]"></span>
                                Online
                            </div>
                            <span className="font-mono text-cyan-600 dark:text-cyan-500">{activeNodesCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-foreground dark:text-slate-200">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                Syncing
                            </div>
                            <span className="font-mono text-yellow-600 dark:text-yellow-500">{nodes.filter(n => n.status === 'syncing').length}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-foreground dark:text-slate-200">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                Offline
                            </div>
                            <span className="font-mono text-red-600 dark:text-red-500">{nodes.filter(n => n.status === 'inactive').length}</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-border dark:border-white/10 text-[10px] text-muted-foreground dark:text-slate-500">
                        {nodes.length} nodes visible
                    </div>
                </Card>
            </div>

            {/* Map Component */}
            <MapContainer
                center={[20, 0]}
                zoom={2.5}
                minZoom={2}
                maxZoom={12}
                scrollWheelZoom={true}
                zoomControl={false}
                className="h-full w-full bg-background"
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <MapController selectedNode={activeNode} />
                <ZoomControl position="bottomleft" />

                {/* Layer 1: Static Dots (Optimized) */}
                <StaticNodeMarkers nodes={nodes} onNodeClick={setActiveNode} />

                {/* Layer 2: Active Overlay (High Detail) */}
                <ActiveNodeOverlay node={activeNode} onClose={() => setActiveNode(null)} />

            </MapContainer>

            {/* Global Search Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] w-full max-w-md px-4 pointer-events-none">
                <div className="relative group pointer-events-auto">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                    <div className="relative flex items-center bg-background/80 dark:bg-black/80 backdrop-blur-md border border-border dark:border-white/15 rounded-full px-4 py-2.5 shadow-2xl transition-all group-hover:border-primary/30 dark:group-hover:border-white/30">
                        <Search className="w-4 h-4 text-muted-foreground dark:text-slate-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Search nodes by pubkey, address, or location..."
                            className="bg-transparent border-none outline-none text-foreground dark:text-slate-200 placeholder:text-muted-foreground dark:placeholder:text-slate-500 text-xs sm:text-sm w-full font-mono"
                        />
                    </div>
                </div>
            </div>

            <GlobalLeafletStyles />
        </Card>
    );
}

// Global styles trigger for leaflet popup overrides
const GlobalLeafletStyles = () => (
    <style jsx global>{`
        .leaflet-interactive {
            cursor: pointer !important;
        }
        .leaflet-popup-content-wrapper {
            background: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
            border-radius: 0 !important;
            overflow: visible !important;
        }
        .leaflet-popup-content {
            margin: 0 !important;
            width: auto !important;
        }
        .leaflet-popup-tip-container {
            display: none !important;
        }
        .leaflet-container {
            background: var(--background) !important;
            font-family: inherit;
        }
        .leaflet-control-zoom {
            border: none !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        .leaflet-control-zoom a {
            background-color: var(--card) !important;
            color: var(--muted-foreground) !important;
            border-bottom: 1px solid var(--border) !important;
        }
        .leaflet-control-zoom a:hover {
            background-color: var(--muted) !important;
            color: var(--foreground) !important;
        }
    `}</style>
);
