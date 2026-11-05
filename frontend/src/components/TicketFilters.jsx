import React from 'react';

export const TicketFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  onReset,
  totalCount,
  filteredCount,
}) => {
  const isFiltered =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    priorityFilter !== 'ALL';

  return (
    <div className="bg-white border border-[#dce5ef] rounded-xl p-4 shadow-sm mb-5 space-y-3">
      {/* Top row: Search input + Category & Priority dropdowns */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tickets by ID (#12), title, or keyword..."
            className="w-full pl-9 pr-3.5 py-2 border border-[#b8c4d1] rounded-lg text-xs text-[#1f2937] placeholder-[#94a3b8] focus:outline-none focus:border-[#1769aa] focus:ring-2 focus:ring-[#1769aa]/15"
          />
          <span className="absolute left-3 top-2.5 text-xs text-[#94a3b8]">🔍</span>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2 text-xs text-[#94a3b8] hover:text-[#1f2937]"
            >
              &times;
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 border border-[#b8c4d1] rounded-lg text-xs text-[#334d66] bg-white focus:outline-none focus:border-[#1769aa]"
          >
            <option value="ALL">All Categories</option>
            <option value="HARDWARE">Hardware</option>
            <option value="SOFTWARE">Software</option>
            <option value="NETWORK">Network</option>
            <option value="ACCOUNT_ACCESS">Account Access</option>
            <option value="OTHER">Other</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="px-3 py-2 border border-[#b8c4d1] rounded-lg text-xs text-[#334d66] bg-white focus:outline-none focus:border-[#1769aa]"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Bottom row: Status tabs + Results count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#f1f5f9]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors ${
                statusFilter === s
                  ? 'bg-[#12355b] text-white'
                  : 'bg-[#f8fafc] border border-[#e2e8f0] text-[#526477] hover:bg-slate-200'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-[#718193]">
          <span>
            Showing <strong className="text-[#173b5f]">{filteredCount}</strong> of {totalCount}
          </span>
          {isFiltered && (
            <button
              onClick={onReset}
              className="text-[#1769aa] font-bold hover:underline text-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

