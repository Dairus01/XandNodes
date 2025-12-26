'use client';

import { useState, useMemo } from "react";
import { useAllPNodes, useNetworkStats } from "@/lib/hooks";
import { Header } from "@/components/Header";
import { NodesTable } from "@/components/NodesTable";
import { NodesFilterBar } from "@/components/NodesFilterBar";
import { assessNetworkRisk } from "@/lib/intelligence";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PNode } from "@/types/pnode";

type SortField = 'moniker' | 'uptime' | 'storage' | 'latency' | 'healthScore' | 'status' | 'location' | 'version';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive' | 'syncing' | 'at_risk';

const ITEMS_PER_PAGE = 20;

export default function NodesPage() {
  const { data: nodes, isLoading, error } = useAllPNodes();
  const { data: stats } = useNetworkStats();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [versionFilter, setVersionFilter] = useState('all');
  const [storageFilter, setStorageFilter] = useState('all');

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('uptime'); // Screenshot implies default decreasing uptime? or specific order.
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Derived Options
  const availableLocations = useMemo(() => {
    if (!nodes) return [];
    const countries = new Set(nodes.map(n => n.location.country).filter(Boolean));
    return Array.from(countries).sort();
  }, [nodes]);

  const availableVersions = useMemo(() => {
    if (!nodes) return [];
    const versions = new Set(nodes.map(n => n.version).filter(Boolean));
    return Array.from(versions).sort().reverse(); // Newest first usually
  }, [nodes]);

  // Filter and Sort Logic
  const filteredAndSortedNodes = useMemo(() => {
    if (!nodes) return [];

    let filtered = [...nodes];
    const riskAssessment = assessNetworkRisk(nodes);
    const atRiskPublicKeys = new Set(riskAssessment.atRiskNodes.map(n => n.publicKey));

    // 1. Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        node =>
          node.moniker.toLowerCase().includes(query) ||
          node.publicKey.toLowerCase().includes(query) ||
          node.location.city.toLowerCase().includes(query) ||
          node.location.country.toLowerCase().includes(query)
      );
    }

    // 2. Status Filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'at_risk') {
        filtered = filtered.filter(node => atRiskPublicKeys.has(node.publicKey));
      } else {
        filtered = filtered.filter(node => node.status === statusFilter);
      }
    }

    // 3. Location Filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(node => node.location.country === locationFilter);
    }

    // 4. Version Filter
    if (versionFilter !== 'all') {
      filtered = filtered.filter(node => node.version === versionFilter);
    }

    // 5. Storage Filter
    if (storageFilter !== 'all') {
      filtered = filtered.filter(node => {
        const usage = node.storage.usagePercentage;
        if (storageFilter === 'high') return usage > 80;
        if (storageFilter === 'medium') return usage >= 40 && usage <= 80;
        if (storageFilter === 'low') return usage < 40;
        return true;
      });
    }

    // 6. Sorting
    filtered.sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortField) {
        case 'moniker':
          aVal = a.moniker.toLowerCase();
          bVal = b.moniker.toLowerCase();
          break;
        case 'uptime':
          aVal = a.uptime;
          bVal = b.uptime;
          break;
        case 'storage':
          aVal = a.storage.usagePercentage;
          bVal = b.storage.usagePercentage;
          break;
        case 'latency':
          // Sort by lowest latency being "better" usually, but generic sort logic:
          aVal = a.performance.avgLatency;
          bVal = b.performance.avgLatency;
          break;
        case 'healthScore':
          aVal = a.healthScore || 0;
          bVal = b.healthScore || 0;
          break;
        case 'status':
          // active > syncing > inactive
          const statusRank = { active: 3, syncing: 2, inactive: 1 };
          aVal = statusRank[a.status] || 0;
          bVal = statusRank[b.status] || 0;
          break;
        case 'location':
          aVal = a.location.country;
          bVal = b.location.country;
          break;
        case 'version':
          aVal = a.version;
          bVal = b.version;
          break;
        default:
          return 0;
      }

      // Handle numerical vs string comparison
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      } else {
        // For numbers (uptime, score)
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [nodes, searchQuery, statusFilter, locationFilter, versionFilter, storageFilter, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedNodes.length / ITEMS_PER_PAGE);
  const paginatedNodes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedNodes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedNodes, currentPage]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field as SortField);
      setSortDirection('desc');
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setLocationFilter('all');
    setVersionFilter('all');
    setStorageFilter('all');
    setSortField('uptime');
    setSortDirection('desc');
    setCurrentPage(1);
  };

  // Reset pagination when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, locationFilter, versionFilter, storageFilter]);


  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Nodes</h1>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-cyan-500/30">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-[1600px]">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Nodes List</h1>
          <p className="text-muted-foreground">Explore and monitor decentralized storage provider nodes.</p>
        </div>

        {/* Filters */}
        <NodesFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          versionFilter={versionFilter}
          setVersionFilter={setVersionFilter}
          storageFilter={storageFilter}
          setStorageFilter={setStorageFilter}
          availableLocations={availableLocations}
          availableVersions={availableVersions}
          onReset={handleReset}
        />

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-12 bg-slate-800/50 rounded animate-pulse"></div>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-800/30 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-slate-400">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredAndSortedNodes.length)}-
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedNodes.length)} of {filteredAndSortedNodes.length} nodes
            </div>

            <NodesTable
              nodes={paginatedNodes}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Simplified pagination for now (1, 2, 3 ... N) */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to show window around current page could be added, simply showing first 5 or logic here
                    // Let's do simple sliding window
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = currentPage - 3 + i;
                    }
                    if (pageNum > totalPages) return null; // Should not happen with min logic but cleaning up

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${currentPage === pageNum
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="flex items-center justify-center w-8 text-slate-500">...</span>
                  )}
                  {totalPages > 5 && currentPage < totalPages - 2 && ( // show last page
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white`}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}

            <div className="mt-8 text-right text-xs text-slate-500">
              <p>XandNodes • Xandeum pNode Network Explorer</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

