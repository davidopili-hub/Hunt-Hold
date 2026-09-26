import React, { useState, useMemo } from 'react';
import { PropertyListing, FilterState } from '../types';
import { ListingCard } from './ListingCard';
import { InteractiveMap } from './InteractiveMap';
import { 
  Search, 
  SlidersHorizontal, 
  Map, 
  Grid, 
  Columns, 
  Zap, 
  ShieldCheck, 
  DollarSign, 
  Check, 
  RotateCcw,
  Sparkles,
  MapPin,
  ChevronDown
} from 'lucide-react';

interface HousingExplorerViewProps {
  listings: PropertyListing[];
  savedIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelectListing: (listing: PropertyListing) => void;
  onOpenApply: (listing: PropertyListing, e: React.MouseEvent) => void;
  selectedListing: PropertyListing | null;
  onLocateUser: () => void;
  userCoords: { lat: number; lng: number } | null;
}

export const HousingExplorerView: React.FC<HousingExplorerViewProps> = ({
  listings,
  savedIds,
  onToggleSave,
  onSelectListing,
  onOpenApply,
  selectedListing,
  onLocateUser,
  userCoords
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [maxRent, setMaxRent] = useState<number>(1500);
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [onlyVouchers, setOnlyVouchers] = useState(false);
  const [onlyIncomeRestricted, setOnlyIncomeRestricted] = useState(false);
  const [onlyUtilitiesIncluded, setOnlyUtilitiesIncluded] = useState(false);
  const [onlyVerifiedLandlords, setOnlyVerifiedLandlords] = useState(false);
  const [radiusMiles, setRadiusMiles] = useState<number>(15);
  const [sortBy, setSortBy] = useState<'lowest_rent' | 'newest' | 'beds' | 'verified'>('lowest_rent');

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // Search text
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = 
          item.title.toLowerCase().includes(query) ||
          item.neighborhood.toLowerCase().includes(query) ||
          item.address.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query);
        if (!matchesText) return false;
      }

      // Max Rent
      if (item.rentMonthly > maxRent) return false;

      // Bedrooms
      if (bedrooms !== 'all') {
        if (bedrooms === '0' && item.bedrooms !== 0) return false;
        if (bedrooms === '1' && item.bedrooms !== 1) return false;
        if (bedrooms === '2' && item.bedrooms !== 2) return false;
        if (bedrooms === '3+' && item.bedrooms < 3) return false;
      }

      // Property Type
      if (propertyType !== 'all' && item.propertyType !== propertyType) return false;

      // Vouchers
      if (onlyVouchers && !item.acceptsVouchers) return false;

      // Income Restricted
      if (onlyIncomeRestricted && !item.incomeRestricted) return false;

      // Utilities Included
      if (onlyUtilitiesIncluded && !item.utilitiesIncluded) return false;

      // Verified Landlords
      if (onlyVerifiedLandlords && !item.landlordVerified) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'lowest_rent') return a.rentMonthly - b.rentMonthly;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'beds') return b.bedrooms - a.bedrooms;
      if (sortBy === 'verified') return (b.landlordVerified ? 1 : 0) - (a.landlordVerified ? 1 : 0);
      return 0;
    });
  }, [
    listings, 
    searchQuery, 
    maxRent, 
    bedrooms, 
    propertyType, 
    onlyVouchers, 
    onlyIncomeRestricted, 
    onlyUtilitiesIncluded, 
    onlyVerifiedLandlords, 
    sortBy
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setMaxRent(1500);
    setBedrooms('all');
    setPropertyType('all');
    setOnlyVouchers(false);
    setOnlyIncomeRestricted(false);
    setOnlyUtilitiesIncluded(false);
    setOnlyVerifiedLandlords(false);
    setRadiusMiles(15);
    setSortBy('lowest_rent');
  };

  const hasActiveFilters = 
    Boolean(searchQuery) || 
    maxRent < 1500 || 
    bedrooms !== 'all' || 
    propertyType !== 'all' || 
    onlyVouchers || 
    onlyIncomeRestricted || 
    onlyUtilitiesIncluded || 
    onlyVerifiedLandlords;

  return (
    <div className="space-y-4">
      
      {/* Top Search & Filter Control Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs space-y-3">
        
        {/* Main row: Search input, Filter toggle, View modes */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by neighborhood, street, or city (e.g. St. Johns, East Austin, North Loop)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-neutral-50/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            
            <button
              type="button"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border flex items-center gap-2 transition-colors ${
                showFiltersPanel || hasActiveFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-red-600" />
              )}
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('split')}
                title="Split Map & List View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'split' ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Columns className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Cards Grid View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode('map')}
                title="Full Interactive Map View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'map' ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setOnlyVouchers(!onlyVouchers)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              onlyVouchers 
                ? 'bg-red-600 border-red-700 text-white font-semibold' 
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span>Section 8 / Vouchers</span>
            {onlyVouchers && <Check className="w-3 h-3 text-white" />}
          </button>

          <button
            type="button"
            onClick={() => setOnlyIncomeRestricted(!onlyIncomeRestricted)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              onlyIncomeRestricted 
                ? 'bg-blue-700 border-blue-800 text-white font-semibold' 
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <span>Income-Capped Affordable</span>
            {onlyIncomeRestricted && <Check className="w-3 h-3 text-white" />}
          </button>

          <button
            type="button"
            onClick={() => setOnlyUtilitiesIncluded(!onlyUtilitiesIncluded)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              onlyUtilitiesIncluded 
                ? 'bg-blue-600 border-blue-700 text-white font-semibold' 
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Utilities Included</span>
          </button>

          <button
            type="button"
            onClick={() => setOnlyVerifiedLandlords(!onlyVerifiedLandlords)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              onlyVerifiedLandlords 
                ? 'bg-blue-800 border-blue-900 text-white font-semibold' 
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Verified Landlords</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-red-600 hover:underline px-2 py-1 flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <div className="ml-auto text-xs text-neutral-500 font-mono tabular-nums shrink-0">
            <strong>{filteredListings.length}</strong> {filteredListings.length === 1 ? 'home' : 'homes'} found
          </div>
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showFiltersPanel && (
          <div className="pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs animate-in slide-in-from-top-2 duration-150">
            
            {/* Max Rent Slider */}
            <div>
              <div className="flex justify-between font-semibold text-neutral-700 mb-1">
                <label htmlFor="max-rent-slider">Max Rent:</label>
                <span className="font-mono text-blue-700 tabular-nums">${maxRent} / mo</span>
              </div>
              <input
                id="max-rent-slider"
                type="range"
                min="600"
                max="2000"
                step="50"
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
                className="w-full accent-blue-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                <span>$600</span>
                <span>$1,300</span>
                <span>$2,000+</span>
              </div>
            </div>

            {/* Bedrooms selector */}
            <div>
              <label htmlFor="bedrooms-filter-select" className="block font-semibold text-neutral-700 mb-1">Bedrooms</label>
              <select
                id="bedrooms-filter-select"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-800"
              >
                <option value="all">Any Bedrooms</option>
                <option value="0">Studio</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3+">3+ Bedrooms</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label htmlFor="property-type-filter-select" className="block font-semibold text-neutral-700 mb-1">Property Type</label>
              <select
                id="property-type-filter-select"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-800"
              >
                <option value="all">All Property Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Single Family">Single Family House</option>
                <option value="Duplex">Duplex</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            {/* Sort order */}
            <div>
              <label htmlFor="sort-order-select" className="block font-semibold text-neutral-700 mb-1">Sort Results By</label>
              <select
                id="sort-order-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-800"
              >
                <option value="lowest_rent">Lowest Rent First</option>
                <option value="newest">Newest Vacancies</option>
                <option value="beds">Most Bedrooms</option>
                <option value="verified">Verified Landlord First</option>
              </select>
            </div>

          </div>
        )}

      </div>

      {/* Main View Area: Split, Grid, or Map */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Bottom: Listings Grid */}
          <div className="lg:col-span-6 space-y-4">
            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-3">
                <span className="text-sm font-semibold text-neutral-800 block">No matching housing listings</span>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try adjusting your rent budget or clearing specific voucher filters to see more available options.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-blue-700 text-white text-xs font-semibold rounded-lg hover:bg-blue-800"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredListings.map(item => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    isSaved={savedIds.includes(item.id)}
                    onToggleSave={onToggleSave}
                    onSelect={onSelectListing}
                    onOpenApply={onOpenApply}
                    isSelected={selectedListing?.id === item.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Sticky Interactive Map */}
          <div className="lg:col-span-6 sticky top-20 h-[650px]">
            <InteractiveMap
              listings={filteredListings}
              selectedListing={selectedListing}
              onSelectListing={onSelectListing}
              userCoords={userCoords}
              onLocateUser={onLocateUser}
              radiusMiles={radiusMiles}
            />
          </div>

        </div>
      )}

      {viewMode === 'grid' && (
        <div className="space-y-4">
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-500 text-xs">
              No matching housing options found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(item => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  isSaved={savedIds.includes(item.id)}
                  onToggleSave={onToggleSave}
                  onSelect={onSelectListing}
                  onOpenApply={onOpenApply}
                  isSelected={selectedListing?.id === item.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === 'map' && (
        <div className="h-[750px] w-full">
          <InteractiveMap
            listings={filteredListings}
            selectedListing={selectedListing}
            onSelectListing={onSelectListing}
            userCoords={userCoords}
            onLocateUser={onLocateUser}
            radiusMiles={radiusMiles}
          />
        </div>
      )}

    </div>
  );
};
