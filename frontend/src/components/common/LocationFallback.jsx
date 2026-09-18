import React, { useState } from 'react';
import { Crosshair, Check, MapPin, Edit2 } from 'lucide-react';
import { useGeo, PRESET_HUBS } from '../../context/GeoContext';

export const LocationFallback = () => {
  const {
    locationName,
    pincode,
    isGpsActive,
    setCityManually,
    setCustomLocation,
    requestBrowserLocation,
  } = useGeo();

  const [inputVal, setInputVal] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const isZip = /^\d{6}$/.test(inputVal.trim());
    if (isZip) {
      setCustomLocation(`Pincode ${inputVal.trim()}`, inputVal.trim());
    } else {
      setCustomLocation(inputVal.trim(), '492001');
    }
    setIsEditing(false);
    setInputVal('');
  };

  return (
    <div className="w-full bg-[#F2EFE9] border-b border-cement py-1.5 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Crosshair className={`w-3.5 h-3.5 flex-shrink-0 ${isGpsActive ? 'text-[#2E7D32]' : 'text-raw-umber'}`} />
            <span className="font-mono text-charcoal-muted text-[10px] uppercase tracking-wider hidden xs:inline">
              Location:
            </span>
            <span className="font-bold text-charcoal font-mono bg-white px-2.5 py-0.5 border border-cement rounded-lg truncate text-[11px] shadow-xs">
              {locationName} {pincode ? `(${pincode})` : ''}
            </span>
            {isGpsActive && (
              <span className="text-[9px] font-mono text-[#2E7D32] bg-[#EDF7ED] px-2 py-0.5 border border-[#2E7D32]/30 rounded-full flex-shrink-0">
                GPS
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-2.5 py-0.5 bg-charcoal text-white font-mono text-[10px] uppercase rounded-md shadow-xs"
              >
                Change
              </button>
            ) : null}
            {!isGpsActive && (
              <button
                onClick={requestBrowserLocation}
                className="px-2 py-0.5 bg-white border border-cement text-[10px] font-mono rounded-md shadow-xs"
                title="Use GPS"
              >
                GPS
              </button>
            )}
          </div>
        </div>

        <div>
          {!isEditing ? (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <span className="text-charcoal-muted font-mono text-[10px] uppercase hidden md:inline">
                Districts:
              </span>
              {PRESET_HUBS.map((hub) => (
                <button
                  key={hub.id}
                  onClick={() => setCityManually(hub)}
                  className="px-2.5 py-0.5 bg-white border border-cement hover:border-raw-umber text-[10px] font-mono text-charcoal whitespace-nowrap flex-shrink-0 rounded-full transition-colors shadow-xs"
                >
                  {hub.name.split(',')[0]}
                </button>
              ))}
              <button
                onClick={() => setIsEditing(true)}
                className="hidden md:inline-block px-2.5 py-0.5 bg-charcoal text-[#F9F8F6] border border-charcoal text-[10px] font-mono uppercase tracking-wider hover:bg-raw-umber transition-colors whitespace-nowrap rounded-lg shadow-xs"
              >
                Change
              </button>
              {!isGpsActive && (
                <button
                  onClick={requestBrowserLocation}
                  className="hidden md:inline-flex px-2.5 py-0.5 bg-white border border-cement text-charcoal hover:text-raw-umber text-[10px] font-mono items-center gap-1 whitespace-nowrap rounded-full transition-colors shadow-xs"
                >
                  <MapPin className="w-3 h-3" />
                  Auto GPS
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-1.5 w-full">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="City or 6-digit Pincode..."
                className="flex-1 px-2.5 py-1 text-xs border border-cement bg-white text-charcoal font-mono placeholder:text-charcoal-muted rounded-lg focus:outline-none focus:border-charcoal shadow-xs"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1 bg-charcoal text-white font-mono text-xs uppercase hover:bg-raw-umber flex items-center gap-1 flex-shrink-0 rounded-lg shadow-xs transition-colors"
              >
                <Check className="w-3 h-3" />
                Apply
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 bg-white border border-cement text-charcoal font-mono text-xs hover:bg-[#F2EFE9] flex-shrink-0 rounded-lg transition-colors shadow-xs"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationFallback;
