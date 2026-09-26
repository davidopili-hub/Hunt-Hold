import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { PropertyListing } from '../types';
import { Navigation, Locate, ZoomIn, ZoomOut } from 'lucide-react';

interface InteractiveMapProps {
  listings: PropertyListing[];
  selectedListing: PropertyListing | null;
  onSelectListing: (listing: PropertyListing) => void;
  userCoords: { lat: number; lng: number } | null;
  onLocateUser: () => void;
  radiusMiles: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  listings,
  selectedListing,
  onSelectListing,
  userCoords,
  onLocateUser,
  radiusMiles
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center on Austin affordable housing cluster
    const initialLat = userCoords?.lat || 30.288;
    const initialLng = userCoords?.lng || -97.725;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false,
    });

    // Use CartoDB Voyager tiles for modern, clean, legible cartography
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when listings change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing property markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    listings.forEach(listing => {
      // Create custom price pill HTML marker
      const isSelected = selectedListing?.id === listing.id;
      const htmlContent = `
        <div class="custom-map-pin ${isSelected ? 'active' : ''} ${listing.incomeRestricted ? 'subsidized' : ''}">
          $${listing.rentMonthly}
        </div>
      `;

      const customIcon = L.divIcon({
        html: htmlContent,
        className: 'custom-div-icon',
        iconSize: [60, 26],
        iconAnchor: [30, 13]
      });

      const marker = L.marker([listing.lat, listing.lng], { icon: customIcon }).addTo(map);

      // Popup content
      const popupHtml = `
        <div style="width: 220px; font-family: inherit;">
          <img src="${listing.images[0]}" alt="${listing.title}" style="width: 100%; height: 110px; object-fit: cover; display: block;" />
          <div style="padding: 10px 12px;">
            <div style="font-size: 11px; color: #059669; font-weight: 600; margin-bottom: 2px;">
              ${listing.acceptsVouchers ? '✓ Section 8 Accepted' : listing.propertyType}
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1.2; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${listing.title}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
              ${listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} Beds`} · ${listing.bathrooms} Bath · ${listing.neighborhood}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 6px;">
              <span style="font-family: monospace; font-size: 14px; font-weight: 700; color: #0f172a;">$${listing.rentMonthly}/mo</span>
              <span style="font-size: 11px; font-weight: 600; color: #059669; cursor: pointer;">View details &rarr;</span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        autoPan: true
      });

      marker.on('click', () => {
        onSelectListing(listing);
      });

      markersRef.current[listing.id] = marker;
    });

  }, [listings, selectedListing, onSelectListing]);

  // Center on selected listing
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedListing) return;

    map.flyTo([selectedListing.lat, selectedListing.lng], 14, {
      duration: 0.8
    });

    const targetMarker = markersRef.current[selectedListing.id];
    if (targetMarker) {
      targetMarker.openPopup();
    }
  }, [selectedListing]);

  // Update user location pin and radius circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userCoords) {
      // Remove old user marker
      if (userMarkerRef.current) userMarkerRef.current.remove();
      if (radiusCircleRef.current) radiusCircleRef.current.remove();

      // Create animated user pin
      const userIcon = L.divIcon({
        html: '<div class="custom-user-location-pin"></div>',
        className: 'user-location-wrapper',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .addTo(map)
        .bindTooltip("You are here", { permanent: false, direction: 'top' });

      // Radius in meters
      const radiusMeters = radiusMiles * 1609.34;
      radiusCircleRef.current = L.circle([userCoords.lat, userCoords.lng], {
        radius: radiusMeters,
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(map);
    }
  }, [userCoords, radiusMiles]);

  return (
    <div className="relative w-full h-full min-h-[380px] bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={onLocateUser}
          title="Find Affordable Homes Near My Location"
          className="p-2.5 bg-white rounded-lg shadow-sm border border-neutral-200 text-neutral-700 hover:text-emerald-700 hover:bg-neutral-50 transition-colors"
        >
          <Locate className="w-4 h-4" />
        </button>

        <div className="flex flex-col bg-white rounded-lg shadow-sm border border-neutral-200 divide-y divide-neutral-100 overflow-hidden">
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomIn()}
            title="Zoom In"
            className="p-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => mapInstanceRef.current?.zoomOut()}
            title="Zoom Out"
            className="p-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-neutral-200 text-[11px] text-neutral-600 shadow-xs flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 inline-block" />
          <span>Market Affordable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
          <span>Subsidized / Income-Cap</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
          <span>Your Location</span>
        </div>
      </div>
    </div>
  );
};
