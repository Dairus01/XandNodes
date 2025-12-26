import { Search, RotateCcw } from "lucide-react";

interface NodesFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  versionFilter: string;
  setVersionFilter: (version: string) => void;
  storageFilter: string;
  setStorageFilter: (storage: string) => void;
  availableLocations: string[];
  availableVersions: string[];
  onReset: () => void;
}

export function NodesFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  locationFilter,
  setLocationFilter,
  versionFilter,
  setVersionFilter,
  storageFilter,
  setStorageFilter,
  availableLocations,
  availableVersions,
  onReset,
}: NodesFilterBarProps) {
  return (
    <div className="w-full bg-card p-4 rounded-lg border border-border dark:border-slate-800/60 mb-6">
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">

        {/* Search Input */}
        <div className="relative w-full xl:w-96 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search by Node ID, Name, or Location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-border dark:border-slate-800 rounded-md text-sm text-foreground dark:text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 py-1 bg-background border border-border dark:border-slate-800 rounded-md text-sm text-foreground dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all min-w-[140px]"
          >
            <option value="all">Status (All)</option>
            <option value="active">Status (Active)</option>
            <option value="at_risk">Status (At Risk)</option>
            <option value="inactive">Status (Inactive)</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-10 px-3 py-1 bg-background border border-border dark:border-slate-800 rounded-md text-sm text-foreground dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all min-w-[160px]"
          >
            <option value="all">Location (All Countries)</option>
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Version Filter */}
          <select
            value={versionFilter}
            onChange={(e) => setVersionFilter(e.target.value)}
            className="h-10 px-3 py-1 bg-background border border-border dark:border-slate-800 rounded-md text-sm text-foreground dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all min-w-[120px]"
          >
            <option value="all">Version (All)</option>
            {availableVersions.map((ver) => (
              <option key={ver} value={ver}>
                {ver}
              </option>
            ))}
          </select>

          {/* Storage Filter */}
          <select
            value={storageFilter}
            onChange={(e) => setStorageFilter(e.target.value)}
            className="h-10 px-3 py-1 bg-background border border-border dark:border-slate-800 rounded-md text-sm text-foreground dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all min-w-[120px]"
          >
            <option value="all">Storage (Any)</option>
            <option value="high">Storage (&gt; 80%)</option>
            <option value="medium">Storage (40-80%)</option>
            <option value="low">Storage (&lt; 40%)</option>
          </select>

          {/* Apply Button (Visual mostly as filters apply instantly, but keeps UI consistent) */}
          <button
            className="h-10 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-md transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          >
            Apply Filters
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="h-10 px-3 flex items-center gap-2 text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white transition-colors text-sm font-medium ml-auto sm:ml-0"
          >
            <span className="hidden sm:inline">Reset</span>
            <RotateCcw className="w-4 h-4 sm:hidden" />
          </button>
        </div>
      </div>
    </div>
  );
}
