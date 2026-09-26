import React, { useState } from 'react';
import { PropertyListing, PropertyType } from '../types';
import { X, Building2, Check, Plus, Image as ImageIcon } from 'lucide-react';

interface PostVacancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated: (listing: PropertyListing) => void;
}

const PRESET_PHOTOS = [
  { label: 'Townhouse Exterior', url: '/src/assets/images/hero_affordable_home_1790422576308.jpg' },
  { label: 'Apartment Interior', url: '/src/assets/images/apartment_cozy_interior_1790422589794.jpg' },
  { label: 'Suburban House', url: '/src/assets/images/house_suburban_exterior_1790422606271.jpg' },
  { label: 'Studio Loft', url: '/src/assets/images/studio_loft_apartment_1790422618809.jpg' }
];

export const PostVacancyModal: React.FC<PostVacancyModalProps> = ({
  isOpen,
  onClose,
  onListingCreated
}) => {
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('East Austin');
  const [city, setCity] = useState('Austin');
  const [zipCode, setZipCode] = useState('78702');
  const [rentMonthly, setRentMonthly] = useState<number>(890);
  const [securityDeposit, setSecurityDeposit] = useState<number>(450);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [sqft, setSqft] = useState<number>(650);
  const [availableDate, setAvailableDate] = useState('Immediate');
  const [acceptsVouchers, setAcceptsVouchers] = useState(true);
  const [incomeRestricted, setIncomeRestricted] = useState(false);
  const [maxIncome, setMaxIncome] = useState<number>(50000);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(true);
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>(['Water', 'Trash & Recycling']);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Energy-Efficient Appliances', 
    'Transit Access within 200m', 
    'Pet Friendly'
  ]);
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTOS[0].url);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const toggleUtility = (util: string) => {
    setSelectedUtilities(prev => 
      prev.includes(util) ? prev.filter(u => u !== util) : [...prev, util]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address) return;

    // Generate random jitter near Austin core for map pin placement
    const latOffset = (Math.random() - 0.5) * 0.08;
    const lngOffset = (Math.random() - 0.5) * 0.08;

    const newListing: PropertyListing = {
      id: `prop_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || `Clean and well-maintained ${propertyType.toLowerCase()} available for rent in ${neighborhood}. Close to municipal transit, grocery stores, and community facilities. Section 8 and local vouchers welcomed.`,
      propertyType,
      address: address.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: 'TX',
      zipCode: zipCode.trim(),
      lat: 30.27 + latOffset,
      lng: -97.74 + lngOffset,
      rentMonthly: Number(rentMonthly),
      securityDeposit: Number(securityDeposit),
      utilitiesIncluded: selectedUtilities.length > 0,
      utilitiesList: selectedUtilities.length > 0 ? selectedUtilities : ['Tenant arranges utilities directly'],
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqft: Number(sqft),
      acceptsVouchers,
      incomeRestricted,
      maxHouseholdIncome: incomeRestricted ? Number(maxIncome) : undefined,
      status: 'vacant',
      availableDate,
      images: [selectedPhoto, PRESET_PHOTOS[1].url],
      amenities: selectedAmenities,
      landlordId: 'landlord_1',
      landlordName: 'Elena Rostova',
      landlordCompany: 'Civic Housing Trust & Residences',
      landlordVerified: true,
      landlordRating: 4.95,
      landlordBadge: 'Gold Deed Verified',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onListingCreated(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Blue & White */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Post Vacant Property</h2>
              <p className="text-xs text-neutral-500">List an affordable house or apartment for verified local applicants</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          
          {/* Title & Type */}
          <div className="space-y-3">
            <div>
              <label htmlFor="property-title" className="block text-xs font-semibold text-neutral-700 mb-1">
                Property Headline / Title *
              </label>
              <input
                id="property-title"
                type="text"
                required
                placeholder="e.g. Spacious 2-Bedroom Courtyard Flat near Transit"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="property-type" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Property Type
                </label>
                <select
                  id="property-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Single Family">Single Family House</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Studio">Micro Studio</option>
                  <option value="Shared Room">Shared Community Room</option>
                </select>
              </div>

              <div>
                <label htmlFor="available-date" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Availability
                </label>
                <input
                  id="available-date"
                  type="text"
                  placeholder="Immediate or Nov 1"
                  value={availableDate}
                  onChange={(e) => setAvailableDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Location details */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
            <span className="text-xs font-semibold text-neutral-900 block">Address & Neighborhood</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="street-address" className="block text-xs text-neutral-600 mb-1">Street Address *</label>
                <input
                  id="street-address"
                  type="text"
                  required
                  placeholder="e.g. 1420 Chicon St"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label htmlFor="neighborhood" className="block text-xs text-neutral-600 mb-1">Neighborhood / Area</label>
                <input
                  id="neighborhood"
                  type="text"
                  placeholder="e.g. East Austin / Holly"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="city-input" className="block text-xs text-neutral-600 mb-1">City</label>
                <input
                  id="city-input"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white"
                />
              </div>
              <div>
                <label htmlFor="zip-code" className="block text-xs text-neutral-600 mb-1">Postal Zip Code</label>
                <input
                  id="zip-code"
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Units */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor="monthly-rent" className="block text-xs font-semibold text-neutral-700 mb-1">Monthly Rent ($)</label>
              <input
                id="monthly-rent"
                type="number"
                min="200"
                step="10"
                required
                value={rentMonthly}
                onChange={(e) => setRentMonthly(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label htmlFor="security-deposit" className="block text-xs font-semibold text-neutral-700 mb-1">Deposit ($)</label>
              <input
                id="security-deposit"
                type="number"
                min="0"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label htmlFor="bedrooms-count" className="block text-xs font-semibold text-neutral-700 mb-1">Bedrooms</label>
              <input
                id="bedrooms-count"
                type="number"
                min="0"
                max="8"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label htmlFor="bathrooms-count" className="block text-xs font-semibold text-neutral-700 mb-1">Bathrooms</label>
              <input
                id="bathrooms-count"
                type="number"
                min="1"
                step="0.5"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Affordability & Voucher Policy - Red & Blue container */}
          <div className="p-4 bg-white rounded-xl border border-red-200 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-red-700 block">Affordable Housing Covenants</span>
            
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptsVouchers}
                onChange={(e) => setAcceptsVouchers(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-xs text-neutral-800">
                <span className="font-semibold text-red-700 block">Accepts Section 8 & Housing Choice Vouchers</span>
                Landlord agrees to submit required inspection forms and participate in county subsidy programs.
              </span>
            </label>

            <div className="pt-2 border-t border-neutral-100">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incomeRestricted}
                  onChange={(e) => setIncomeRestricted(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-neutral-800">
                  <span className="font-semibold text-blue-700 block">Income-Restricted / AMI Cap Program</span>
                  Subject to Area Median Income guidelines for affordable housing preservation.
                </span>
              </label>

              {incomeRestricted && (
                <div className="mt-2 pl-6">
                  <label htmlFor="max-household-income" className="block text-[11px] text-blue-900 font-medium mb-1">Max Household Income Cap ($/year)</label>
                  <input
                    id="max-household-income"
                    type="number"
                    value={maxIncome}
                    onChange={(e) => setMaxIncome(Number(e.target.value))}
                    className="w-36 px-2.5 py-1 text-xs border border-blue-300 rounded bg-white font-mono"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Utilities Checklist */}
          <div>
            <span className="block text-xs font-semibold text-neutral-700 mb-2">Utilities Covered by Landlord:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {['Water', 'Trash & Recycling', 'Electricity', 'Cooking Gas', 'Fiber Internet', 'Solar Credits'].map(u => (
                <button
                  type="button"
                  key={u}
                  onClick={() => toggleUtility(u)}
                  className={`px-3 py-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
                    selectedUtilities.includes(u)
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-medium'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span>{u}</span>
                  {selectedUtilities.includes(u) && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Photo Selector */}
          <div>
            <span className="block text-xs font-semibold text-neutral-700 mb-2">Select Primary Property Photo:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_PHOTOS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedPhoto(p.url)}
                  className={`group relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                    selectedPhoto === p.url ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] py-1 text-center truncate px-1">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="property-description" className="block text-xs font-semibold text-neutral-700 mb-1">
              Detailed Property Description
            </label>
            <textarea
              id="property-description"
              rows={3}
              placeholder="Highlight nearby bus lines, accessibility modifications, lease terms, and building community rules..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Publish Vacancy to Map</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
