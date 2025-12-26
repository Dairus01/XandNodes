'use client';

import dynamic from 'next/dynamic';
import { PNode } from '@/types/pnode';
import { useEffect, useState, useRef } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

// Dynamically import Globe with no SSR to avoid window is not defined
const Globe = dynamic(() => import('react-globe.gl'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-[500px] w-full bg-card text-primary animate-pulse">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-cyan-700 border-l-transparent animate-spin" />
                <span className="text-xs font-mono tracking-widest uppercase text-cyan-500/70">Initializing Holographic Map...</span>
            </div>
        </div>
    )
});

interface NetworkGlobeProps {
    nodes: PNode[];
}

export function NetworkGlobe({ nodes }: NetworkGlobeProps) {
    const [mounted, setMounted] = useState(false);
    const [windowWidth, setWindowWidth] = useState(1000);
    const containerRef = useRef<HTMLDivElement>(null);
    const globeRef = useRef<any>(null);

    // Handle window resize to update globe width
    useEffect(() => {
        setMounted(true);
        setWindowWidth(window.innerWidth);

        const handleResize = () => {
            if (containerRef.current) {
                setWindowWidth(containerRef.current.clientWidth);
            }
        };

        // Initial measure
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Set auto-rotate once globe is ready
    useEffect(() => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.6;
            globeRef.current.pointOfView({ altitude: 2.5 }, 1000);
        }
    }, [mounted]);

    // Create points data
    const gData = nodes
        .filter(n => n.location && n.location.lat && n.location.lng)
        .map(node => ({
            lat: node.location.lat,
            lng: node.location.lng,
            size: node.status === 'active' ? 0.5 : 0.3,
            color: node.status === 'active'
                ? '#06b6d4' // cyan-500
                : node.status === 'syncing'
                    ? '#eab308' // yellow-500 
                    : '#ef4444', // red-500
            name: node.moniker,
            ip: node.ipAddress,
            city: node.location.city,
            country: node.location.country,
            status: node.status
        }));

    if (!mounted) return null;

    return (
        <Card className="relative overflow-hidden border-border bg-card/80 backdrop-blur-sm shadow-2xl mb-8">
            {/* Grid overlay for 'Command Center' feel */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />

            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                <Badge variant="outline" className="w-fit bg-background/80 backdrop-blur-md border-primary/30 text-primary shadow-sm">
                    <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Live Network Map
                </Badge>
                <div className="text-[10px] sm:text-xs text-slate-500 font-mono bg-black/40 px-2 py-1 rounded w-fit border border-white/5">
                    {gData.length} NODES ONLINE
                </div>
            </div>

            <div ref={containerRef} className="h-[450px] w-full cursor-move relative z-1 overflow-hidden">
                <Globe
                    ref={globeRef}
                    width={windowWidth}
                    height={450}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    // Using a solid dark background instead of specific star image to blend better
                    backgroundColor="#0a1039"
                    pointsData={gData}
                    pointLat="lat"
                    pointLng="lng"
                    pointColor="color"
                    pointAltitude={0.01}
                    pointRadius="size"
                    pointsMerge={true} // Performance optimization
                    pointResolution={2}
                    atmosphereColor="#06b6d4"
                    atmosphereAltitude={0.15}
                    onPointHover={(point: any) => {
                        // Change cursor on hover
                        if (containerRef.current) {
                            containerRef.current.style.cursor = point ? 'pointer' : 'grab';
                        }
                    }}
                    pointLabel={(point: any) => `
            <div class="font-sans text-xs bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 p-3 rounded-lg shadow-xl text-slate-200">
              <div class="font-bold text-cyan-400 mb-1 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full ${point.status === 'active' ? 'bg-cyan-500' : 'bg-red-500'}"></span>
                ${point.name}
              </div>
              <div class="text-slate-400">${point.city}, ${point.country}</div>
              <div class="text-[10px] text-slate-600 font-mono mt-1">${point.ip}</div>
            </div>
          `}
                />
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 z-10 hidden sm:flex gap-4 p-2 rounded-lg bg-card/90 backdrop-blur-sm border border-border pointer-events-none shadow-lg">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Syncing</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Offline</span>
                </div>
            </div>
        </Card>
    );
}
