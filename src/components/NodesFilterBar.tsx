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
    <div className="w-full bg-card p-3 sm:p-4 rounded-lg border border-border dark:border-slate-800/60 mb-6">
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 items-stretch xl:items-center justify-between">

        {/* Search Input */}
        <div className="relative w-full xl:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-background border border-border dark:border-slate-800 rounded-md text-sm text-foreground dark:text-slate-200 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:flex xl:flex-wrap items-center gap-2 sm:gap-3 w-full xl:w-auto">

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-2 sm:px-3 bg-background border border-border dark:border-slate-800 rounded-md text-[13px] sm:text-sm text-foreground dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="at_risk">At Risk</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-10 px-2 sm:px-3 bg-background border border-border dark:border-slate-800 rounded-md text-[13px] sm:text-sm text-foreground dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          >
            <option value="all">All Countries</option>
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
            className="h-10 px-2 sm:px-3 bg-background border border-border dark:border-slate-800 rounded-md text-[13px] sm:text-sm text-foreground dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          >
            <option value="all">All Versions</option>
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
            className="h-10 px-2 sm:px-3 bg-background border border-border dark:border-slate-800 rounded-md text-[13px] sm:text-sm text-foreground dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          >
            <option value="all">All Storage</option>
            <option value="high">&gt; 80% Used</option>
            <option value="medium">40-80% Used</option>
            <option value="low">&lt; 40% Used</option>
          </select>

          {/* Action Buttons */}
          <div className="col-span-2 flex items-center gap-2 mt-1 sm:mt-0 xl:w-auto">
            <button
              className="flex-1 xl:flex-none h-10 px-4 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-md transition-all shadow-lg active:scale-95"
            >
              Apply
            </button>

            <button
              onClick={onReset}
              className="xl:flex-none h-10 px-3 flex items-center justify-center gap-2 text-muted-foreground dark:text-slate-400 hover:text-foreground dark:hover:text-white transition-all text-sm font-medium border border-border dark:border-slate-800 rounded-md hover:bg-muted/50 active:scale-95"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="md:inline hidden">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
