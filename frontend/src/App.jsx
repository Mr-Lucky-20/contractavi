import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/layout/Header';
import LocationFallback from './components/common/LocationFallback';
import GeolocationModal from './components/common/GeolocationModal';
import FilterBar from './components/marketplace/FilterBar';
import VendorCard from './components/marketplace/VendorCard';
import MaterialCompareMatrix from './components/marketplace/MaterialCompareMatrix';
import RfqModal from './components/marketplace/RfqModal';
import OwnerAuthModal from './components/portal/OwnerAuthModal';
import OwnerInventoryView from './components/portal/OwnerInventoryView';
import { useGeo } from './context/GeoContext';
import { useAuth } from './context/AuthContext';
import api from './services/api';
import {
  Layers,
  HardHat,
  RefreshCw,
  AlertCircle,
  Building,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';

export function AppContent() {
  const { coordinates, locationName } = useGeo();
  const { isAuthenticated, owner } = useAuth();

  // Navigation & View State
  const [activeView, setActiveView] = useState('marketplace'); // 'marketplace' | 'portal'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Marketplace State
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedSort, setSelectedSort] = useState('distance_asc');
  const [selectedRadius, setSelectedRadius] = useState(35);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [rfqVendor, setRfqVendor] = useState(null);
  const [compareVendor, setCompareVendor] = useState(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Fetch nearest vendors from backend
  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        lat: coordinates.lat,
        lng: coordinates.lng,
        radius: selectedRadius,
        sort: selectedSort,
      };

      if (selectedMaterial && selectedMaterial !== 'All') {
        params.material = selectedMaterial;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await api.get('/vendors/nearest', { params });
      if (res.data.success) {
        setVendors(res.data.vendors);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(
        err.response?.data?.message ||
          'Failed to connect to marketplace backend. Ensure API server is operational.'
      );
    } finally {
      setLoading(false);
    }
  }, [coordinates.lat, coordinates.lng, selectedRadius, selectedSort, selectedMaterial, searchQuery]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return (
    <div className="min-h-screen bg-bg-base text-charcoal font-body flex flex-col">
      {/* Universal Blueprint Header */}
      <Header
        activeView={activeView}
        setActiveView={(view) => {
          if (view === 'portal' && !isAuthenticated) {
            setIsAuthModalOpen(true);
          } else {
            setActiveView(view);
          }
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Geolocation Fallback Bar */}
      {activeView === 'marketplace' && <LocationFallback />}

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1 pb-16">
        {activeView === 'marketplace' ? (
          <div>
            {/* Filter & Sorting Bar */}
            <FilterBar
              selectedMaterial={selectedMaterial}
              setSelectedMaterial={setSelectedMaterial}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              selectedRadius={selectedRadius}
              setSelectedRadius={setSelectedRadius}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalResults={vendors.length}
            />

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
              {/* Error Notice */}
              {error && (
                <div className="p-4 mb-6 bg-[#FDEDED] border border-[#C62828]/30 text-[#C62828] font-mono text-xs flex items-start gap-3 rounded-2xl shadow-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold uppercase tracking-wider block">
                      Connection Notice:
                    </span>
                    <p>{error}</p>
                    <button
                      onClick={fetchVendors}
                      className="px-3 py-1 bg-white border border-[#C62828]/40 text-[#C62828] font-bold text-[11px] hover:bg-[#FDEDED] mt-2 inline-flex items-center gap-1 rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> Retry Connection
                    </button>
                  </div>
                </div>
              )}

              {/* Loading Skeleton */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-10">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="bg-white border border-cement p-6 space-y-4 animate-pulse rounded-2xl shadow-card"
                    >
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-[#F2EFE9] w-32 rounded-md"></div>
                        <div className="h-4 bg-[#F2EFE9] w-24 rounded-md"></div>
                      </div>
                      <div className="h-6 bg-[#F2EFE9] w-3/4 rounded-md"></div>
                      <div className="h-24 bg-[#F2EFE9] w-full rounded-xl"></div>
                      <div className="h-8 bg-[#F2EFE9] w-full rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : vendors.length === 0 ? (
                /* Empty state */
                <div className="bg-white border border-cement p-8 sm:p-12 text-center space-y-4 my-8 rounded-2xl shadow-card">
                  <div className="w-14 h-14 bg-[#F2EFE9] border border-cement flex items-center justify-center mx-auto text-charcoal-muted rounded-2xl shadow-xs">
                    <Layers className="w-6 h-6 text-raw-umber" />
                  </div>
                  <h3 className="font-headline font-bold text-xl text-charcoal">
                    No Registered Suppliers Within {selectedRadius} km
                  </h3>
                  <p className="text-xs text-charcoal-muted font-mono max-w-md mx-auto">
                    We could not locate any active construction suppliers stocking{' '}
                    <span className="font-bold text-charcoal">{selectedMaterial}</span> in your
                    chosen perimeter. Try expanding the operational search radius or resetting filters.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 font-mono text-xs">
                    <button
                      onClick={() => {
                        setSelectedRadius(100);
                        setSelectedMaterial('All');
                        setSearchQuery('');
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-charcoal text-white uppercase tracking-wider font-bold hover:bg-raw-umber transition-colors rounded-lg shadow-xs"
                    >
                      Expand Radius to 100 km
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMaterial('All');
                        setSearchQuery('');
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-white border border-cement text-charcoal uppercase hover:bg-[#F2EFE9] transition-colors rounded-lg shadow-xs"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              ) : (
                /* Asymmetric Blueprint Grid */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {vendors.map((vendor) => (
                    <VendorCard
                      key={vendor._id}
                      vendor={vendor}
                      selectedMaterial={selectedMaterial}
                      onOpenRfq={(v) => setRfqVendor(v)}
                      onOpenCompare={(v) => {
                        setCompareVendor(v);
                        setIsCompareOpen(true);
                      }}
                      onVendorUpdated={fetchVendors}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SUPPLIER PORTAL VIEW */
          <div>
            {isAuthenticated ? (
              <OwnerInventoryView onSwitchToMarketplace={() => setActiveView('marketplace')} />
            ) : (
              <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
                <div className="w-14 h-14 bg-white border border-cement flex items-center justify-center mx-auto rounded-2xl shadow-xs">
                  <Building className="w-7 h-7 text-raw-umber" />
                </div>
                <h2 className="font-headline font-bold text-2xl text-charcoal">
                  Construction Supplier Hub Access
                </h2>
                <p className="text-xs font-mono text-charcoal-muted max-w-md mx-auto">
                  Sign in to your registered supplier account to overwrite daily prices for core materials, synchronize time verification stamps, and receive direct contractor RFQs.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-6 py-3 bg-charcoal text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-raw-umber inline-flex items-center gap-2 rounded-lg shadow-xs transition-all"
                  >
                    <span>Sign In as Supplier</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Blueprint Footer */}
      <footer className="bg-[#FDFBF7] border-t border-cement py-6 px-4 text-xs font-mono text-charcoal-muted mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-bold text-charcoal">STRUCT // CHHATTISGARH</span>
            <span>•</span>
            <span>Hyperlocal Steel, Cement & Aggregate Procurement</span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-[11px]">
            <span>REGIONAL HUB: BILASPUR • RAIPUR • BHILAI • KORBA</span>
            <span>•</span>
            <span>SECURE B2B PROCUREMENT</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <GeolocationModal />

      <RfqModal
        isOpen={!!rfqVendor}
        vendor={rfqVendor}
        onClose={() => setRfqVendor(null)}
      />

      <MaterialCompareMatrix
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        vendors={vendors}
        initialVendor={compareVendor}
      />

      <OwnerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          // If authenticated after closing modal and in portal mode, reload
          fetchVendors();
        }}
      />
    </div>
  );
}

import { AuthProvider } from './context/AuthContext';
import { GeoProvider } from './context/GeoContext';

export default function App() {
  return (
    <AuthProvider>
      <GeoProvider>
        <AppContent />
      </GeoProvider>
    </AuthProvider>
  );
}
