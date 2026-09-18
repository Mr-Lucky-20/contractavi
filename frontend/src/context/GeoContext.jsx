import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Key Chhattisgarh industrial and construction hubs
export const PRESET_HUBS = [
  { id: 'bilaspur', name: 'Bilaspur, CG', state: 'Chhattisgarh', lat: 22.0797, lng: 82.1409, pincode: '495001' },
  { id: 'raipur', name: 'Raipur (Capital Hub), CG', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, pincode: '492001' },
  { id: 'bhilai', name: 'Bhilai / Durg (Steel City), CG', state: 'Chhattisgarh', lat: 21.2167, lng: 81.4333, pincode: '490001' },
  { id: 'korba', name: 'Korba (Power & Ash), CG', state: 'Chhattisgarh', lat: 22.3595, lng: 82.7501, pincode: '495677' },
  { id: 'raigarh', name: 'Raigarh (Steel Corridor), CG', state: 'Chhattisgarh', lat: 21.8974, lng: 83.3950, pincode: '496001' },
  { id: 'rajnandgaon', name: 'Rajnandgaon, CG', state: 'Chhattisgarh', lat: 21.0970, lng: 81.0375, pincode: '491441' },
];

const GeoContext = createContext(null);

export const GeoProvider = ({ children }) => {
  // Default to Bilaspur / Raipur Chhattisgarh epicenter
  const [coordinates, setCoordinates] = useState({
    lat: PRESET_HUBS[0].lat,
    lng: PRESET_HUBS[0].lng,
  });
  const [locationName, setLocationName] = useState(PRESET_HUBS[0].name);
  const [pincode, setPincode] = useState(PRESET_HUBS[0].pincode);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [geoPermission, setGeoPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [hasPrompted, setHasPrompted] = useState(false);

  // Request browser Geolocation
  const requestBrowserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoPermission('denied');
      setGeoError('HTML5 Geolocation is not supported by this browser.');
      return;
    }

    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        // In-memory assignment - transient telemetry
        setCoordinates({ lat: latitude, lng: longitude });
        setIsGpsActive(true);
        setGeoPermission('granted');
        setLocationName(`GPS Position (±${Math.round(accuracy)}m)`);
        setIsModalOpen(false);
      },
      (error) => {
        console.warn('[GeoContext] Geolocation request blocked or failed:', error.message);
        setGeoPermission('denied');
        setIsGpsActive(false);
        setGeoError(error.message || 'Location permission denied.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Set city manually
  const setCityManually = (hub) => {
    setCoordinates({ lat: hub.lat, lng: hub.lng });
    setLocationName(hub.name);
    setPincode(hub.pincode);
    setIsGpsActive(false);
    setGeoError(null);
    setIsModalOpen(false);
  };

  // Set custom pincode or city name
  const setCustomLocation = (customName, customPincode) => {
    // Look up in preset hubs or default
    const matched = PRESET_HUBS.find(
      (h) =>
        h.name.toLowerCase().includes(customName.toLowerCase()) ||
        h.pincode === customPincode ||
        customName.toLowerCase().includes(h.id)
    );

    if (matched) {
      setCityManually(matched);
    } else {
      setCoordinates({ lat: 21.2514, lng: 81.6296 });
      setLocationName(customName || 'Chhattisgarh Regional Hub');
      setPincode(customPincode || '492001');
      setIsGpsActive(false);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (!hasPrompted) {
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: 'geolocation' })
          .then((result) => {
            setGeoPermission(result.state);
            if (result.state === 'prompt') {
              setIsModalOpen(true);
            } else if (result.state === 'granted') {
              requestBrowserLocation();
            }
          })
          .catch(() => {
            setIsModalOpen(true);
          });
      } else {
        setIsModalOpen(true);
      }
      setHasPrompted(true);
    }
  }, [hasPrompted, requestBrowserLocation]);

  return (
    <GeoContext.Provider
      value={{
        coordinates,
        locationName,
        pincode,
        isGpsActive,
        geoPermission,
        geoError,
        isModalOpen,
        setIsModalOpen,
        requestBrowserLocation,
        setCityManually,
        setCustomLocation,
      }}
    >
      {children}
    </GeoContext.Provider>
  );
};

export const useGeo = () => {
  const context = useContext(GeoContext);
  if (!context) {
    throw new Error('useGeo must be used within a GeoProvider');
  }
  return context;
};
