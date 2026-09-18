import React from 'react';
import { MapPin, Shield, Navigation, Compass, X } from 'lucide-react';
import { useGeo, PRESET_HUBS } from '../../context/GeoContext';

export const GeolocationModal = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    requestBrowserLocation,
    setCityManually,
    geoError,
    geoPermission,
  } = useGeo();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/40 backdrop-blur-[2px]">
      <div className="relative w-full max-w-lg bg-[#FDFBF7] border border-cement rounded-2xl shadow-modal p-4 sm:p-6 text-charcoal max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-cement mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-raw-umber" />
            <span className="font-mono text-xs uppercase tracking-widest text-charcoal-muted">
              LOCATION SETUP
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-charcoal-muted hover:text-charcoal p-1.5 rounded-lg hover:bg-[#F2EFE9] transition-colors"
            aria-label="Dismiss modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#F2EFE9] border border-cement rounded-xl flex-shrink-0">
              <MapPin className="w-5 h-5 text-raw-umber" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg sm:text-xl text-charcoal tracking-tight">
                Find Nearest Suppliers & Yards
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
                Allow location access to calculate accurate distances to cement depots, steel yards, and quarries near your job site.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-[#F7F2EB] border border-[#B48A63]/30 rounded-xl flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-raw-umber flex-shrink-0 mt-0.5" />
            <div className="text-xs text-charcoal leading-snug">
              <span className="font-bold text-raw-umber uppercase tracking-wider block mb-0.5">
                Location Privacy
              </span>
              Your location is only used to compute straight-line distance to nearby yards. We never store or track your personal location.
            </div>
          </div>

          {geoError && (
            <div className="p-3 bg-[#FDEDED] border border-alert-stale/40 text-alert-stale text-xs font-mono rounded-xl">
              {geoError}
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={requestBrowserLocation}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-charcoal text-[#F9F8F6] text-xs uppercase font-mono tracking-wider font-semibold hover:bg-raw-umber transition-all border border-charcoal rounded-lg shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              Use Current Location
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 bg-transparent border border-cement text-xs uppercase font-mono tracking-wider text-charcoal hover:bg-[#F2EFE9] transition-all rounded-lg"
            >
              Set Manually
            </button>
          </div>

          <div className="pt-3 border-t border-cement">
            <div className="text-[11px] font-mono uppercase tracking-widest text-charcoal-muted mb-2">
              Or Select District / Hub:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_HUBS.map((hub) => (
                <button
                  key={hub.id}
                  onClick={() => setCityManually(hub)}
                  className="px-3 py-1 text-xs border border-cement hover:border-raw-umber hover:bg-[#F7F2EB] transition-colors font-mono rounded-full shadow-xs"
                >
                  {hub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeolocationModal;
