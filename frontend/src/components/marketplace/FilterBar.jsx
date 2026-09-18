import React from 'react';
import {
  ArrowUpDown,
  MapPin,
  Star,
  Zap,
  Search,
} from 'lucide-react';

export const MATERIAL_CATEGORIES = [
  { id: 'All', label: 'All Materials', icon: '🏗️' },
  { id: 'Cement', label: 'Cement', icon: '🧱' },
  { id: 'Steel/Saria', label: 'Steel/TMT', icon: '⛓️' },
  { id: 'Bricks', label: 'Bricks/Blocks', icon: '🧱' },
  { id: 'Sand', label: 'Sand', icon: '⏳' },
  { id: 'Aggregate', label: 'Aggregate', icon: '🪨' },
];

export const SORT_OPTIONS = [
  { id: 'distance_asc', label: 'Closest Distance', icon: MapPin },
  { id: 'price_asc', label: 'Lowest Price', icon: ArrowUpDown },
  { id: 'rating_desc', label: 'Highest Rated', icon: Star },
  { id: 'flash_deals', label: 'Flash Deals', icon: Zap },
];

export const FilterBar = ({
  selectedMaterial,
  setSelectedMaterial,
  selectedSort,
  setSelectedSort,
  selectedRadius,
  setSelectedRadius,
  searchQuery,
  setSearchQuery,
  totalResults = 0,
}) => {
  return (
    <div className="w-full bg-[#FDFBF7] border-b border-cement py-3 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Material Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
          {MATERIAL_CATEGORIES.map((cat) => {
            const isActive = selectedMaterial === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedMaterial(cat.id)}
                className={`px-3 py-1.5 text-xs font-mono whitespace-nowrap border transition-all flex-shrink-0 rounded-xl shadow-xs ${
                  isActive
                    ? 'bg-charcoal text-[#F9F8F6] border-charcoal font-semibold shadow-sm'
                    : 'bg-white text-charcoal border-cement hover:border-raw-umber hover:bg-[#F7F2EB]'
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sorting Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1 border-t border-cement">
          {/* Search bar */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor, brand (Tata, UltraTech), or area..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-cement text-charcoal placeholder:text-charcoal-muted font-mono rounded-xl focus:outline-none focus:border-charcoal shadow-xs"
            />
          </div>

          {/* Desktop Sort Buttons */}
          <div className="hidden sm:flex sm:col-span-5 items-center gap-1 overflow-x-auto">
            {SORT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = selectedSort === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedSort(opt.id)}
                  className={`px-2.5 py-1.5 text-[11px] font-mono flex items-center gap-1 whitespace-nowrap border transition-all rounded-lg shadow-xs ${
                    isActive
                      ? 'bg-[#8B5A2B] text-white border-[#8B5A2B] font-bold shadow-xs'
                      : 'bg-white text-charcoal border-cement hover:bg-[#F2EFE9]'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isActive ? 'text-white' : 'text-raw-umber'}`} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Sort Dropdown & Radius row */}
          <div className="flex sm:hidden items-center gap-2">
            <div className="flex-1">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-cement text-charcoal rounded-lg focus:outline-none focus:border-charcoal shadow-xs"
              >
                <option value="distance_asc">Sort: Nearest First</option>
                <option value="price_asc">Sort: Lowest Price</option>
                <option value="rating_desc">Sort: Highest Rated</option>
                <option value="flash_deals">Sort: Flash Deals</option>
              </select>
            </div>

            <div className="w-28 flex-shrink-0">
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-cement text-charcoal rounded-lg focus:outline-none focus:border-charcoal shadow-xs"
              >
                <option value={15}>15 km radius</option>
                <option value={25}>25 km radius</option>
                <option value={35}>35 km radius</option>
                <option value={50}>50 km radius</option>
                <option value={100}>100 km radius</option>
              </select>
            </div>
          </div>

          {/* Desktop Radius Selector */}
          <div className="hidden sm:flex sm:col-span-2 items-center justify-end gap-1.5">
            <span className="text-[11px] font-mono text-charcoal-muted uppercase">Radius:</span>
            <select
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(Number(e.target.value))}
              className="px-2.5 py-1.5 text-xs font-mono bg-white border border-cement text-charcoal rounded-lg focus:outline-none focus:border-charcoal shadow-xs"
            >
              <option value={15}>15 km</option>
              <option value={25}>25 km</option>
              <option value={35}>35 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-charcoal-muted pt-0.5">
          <span className="font-semibold text-charcoal">
            {totalResults} {totalResults === 1 ? 'Supplier found' : 'Suppliers found'}
          </span>
          <span className="text-[10px]">Within {selectedRadius} km</span>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
