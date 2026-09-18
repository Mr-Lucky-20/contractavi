import React, { useState } from 'react';
import { X, Lock, Building, Mail, Phone, MapPin, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGeo } from '../../context/GeoContext';
import { validatePhone, validateEmail } from '../../utils/validation';

export const OwnerAuthModal = ({ isOpen, onClose }) => {
  const { login, register, loading, authError, setAuthError } = useAuth();
  const { coordinates } = useGeo();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [fieldErrors, setFieldErrors] = useState({});

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('bhilai.steel@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register Form State
  const [regData, setRegData] = useState({
    storeName: '',
    contactPerson: '',
    contact: '',
    email: '',
    password: '',
    physicalAddress: '',
    city: 'Bhilai',
    pincode: '490026',
    gstNumber: '',
    operationalRadiusKm: 45,
    latitude: coordinates.lat,
    longitude: coordinates.lng,
  });

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      onClose();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const emailCheck = validateEmail(regData.email);
    if (!emailCheck.isValid) {
      setFieldErrors((prev) => ({ ...prev, email: emailCheck.error }));
      return;
    }

    const phoneCheck = validatePhone(regData.contact);
    if (!phoneCheck.isValid) {
      setFieldErrors((prev) => ({ ...prev, contact: phoneCheck.error }));
      return;
    }

    const result = await register({
      ...regData,
      email: emailCheck.email,
      contact: phoneCheck.formatted,
      latitude: parseFloat(regData.latitude) || coordinates.lat,
      longitude: parseFloat(regData.longitude) || coordinates.lng,
    });
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/50 backdrop-blur-[3px]">
      <div className="relative w-full max-w-md bg-[#FFFFFF] border border-cement rounded-2xl shadow-modal p-5 sm:p-6 text-charcoal max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cement mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F7F2EB] border border-[#B48A63]/30 rounded-xl text-raw-umber">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg text-charcoal">
                Supplier Portal
              </h2>
              <span className="font-mono text-[10px] text-charcoal-muted uppercase tracking-wider">
                Vendor Account Management
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-cement rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-[#F2EFE9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 border border-cement p-1 rounded-xl bg-[#F2EFE9] mb-4 font-mono text-xs">
          <button
            onClick={() => {
              setMode('login');
              setAuthError(null);
              setFieldErrors({});
            }}
            className={`py-1.5 uppercase font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-charcoal text-white shadow-sm' : 'text-charcoal hover:bg-white/60'
            }`}
          >
            Supplier Login
          </button>
          <button
            onClick={() => {
              setMode('register');
              setAuthError(null);
              setFieldErrors({});
            }}
            className={`py-1.5 uppercase font-bold rounded-lg transition-all ${
              mode === 'register' ? 'bg-charcoal text-white shadow-sm' : 'text-charcoal hover:bg-white/60'
            }`}
          >
            Register Yard
          </button>
        </div>

        {/* Error Callout */}
        {authError && (
          <div className="p-3 mb-3 bg-[#FDEDED] border border-[#C62828]/30 rounded-xl text-[#C62828] text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Mode: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5 font-mono text-xs">
            {/* Demo credentials tip */}
            <div className="p-3 bg-[#F7F2EB] border border-[#B48A63]/30 rounded-xl text-[11px] text-charcoal">
              <span className="font-bold text-raw-umber uppercase block mb-1">
                Demo Supplier Accounts:
              </span>
              <div>Email: <span className="font-bold">bhilai.steel@example.com</span></div>
              <div>Password: <span className="font-bold">password123</span></div>
              <div className="text-[10px] text-charcoal-muted mt-1">
                (Or try <span className="font-semibold">mahanadi.materials@example.com</span> / <span className="font-semibold">password123</span>)
              </div>
            </div>

            <div>
              <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                Registered Supplier Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal focus:ring-1 focus:ring-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                Account Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal focus:ring-1 focus:ring-charcoal"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-charcoal text-white uppercase tracking-wider font-bold rounded-lg hover:bg-raw-umber transition-all disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Authenticating...' : 'Sign In To Supplier Hub'}
              </button>
            </div>
          </form>
        )}

        {/* Mode: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                Business / Store Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vardhman Steel & Building Depot"
                value={regData.storeName}
                onChange={(e) => setRegData({ ...regData, storeName: e.target.value })}
                className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Manager Name"
                  value={regData.contactPerson}
                  onChange={(e) => setRegData({ ...regData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                />
              </div>
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98261 12345"
                  value={regData.contact}
                  onChange={(e) => {
                    setRegData({ ...regData, contact: e.target.value });
                    if (fieldErrors.contact) setFieldErrors((p) => ({ ...p, contact: null }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none ${
                    fieldErrors.contact ? 'border-alert-stale bg-red-50/20' : 'border-cement focus:border-charcoal'
                  }`}
                />
                {fieldErrors.contact && (
                  <p className="text-[10px] text-alert-stale mt-1 font-semibold">
                    {fieldErrors.contact}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  Login Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="store@domain.com"
                  value={regData.email}
                  onChange={(e) => {
                    setRegData({ ...regData, email: e.target.value });
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: null }));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none ${
                    fieldErrors.email ? 'border-alert-stale bg-red-50/20' : 'border-cement focus:border-charcoal'
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-[10px] text-alert-stale mt-1 font-semibold">
                    {fieldErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 chars"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                Physical Yard Address *
              </label>
              <input
                type="text"
                required
                placeholder="Plot/Gala Number, Road, Industrial Area"
                value={regData.physicalAddress}
                onChange={(e) => setRegData({ ...regData, physicalAddress: e.target.value })}
                className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={regData.city}
                  onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                />
              </div>
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  value={regData.pincode}
                  onChange={(e) => setRegData({ ...regData, pincode: e.target.value })}
                  className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  Operational Radius (km)
                </label>
                <input
                  type="number"
                  min="5"
                  max="150"
                  value={regData.operationalRadiusKm}
                  onChange={(e) => setRegData({ ...regData, operationalRadiusKm: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                />
              </div>
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  GST Identification (Optional)
                </label>
                <input
                  type="text"
                  placeholder="22AAAAA0000A1Z5"
                  value={regData.gstNumber}
                  onChange={(e) => setRegData({ ...regData, gstNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#8B5A2B] text-white uppercase tracking-wider font-bold rounded-lg hover:bg-[#724921] transition-all disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Creating Account...' : 'Complete Yard Registration'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-cement flex items-center gap-2 text-[10px] font-mono text-charcoal-muted">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
          <span>Secure login for verified building material suppliers.</span>
        </div>
      </div>
    </div>
  );
};

export default OwnerAuthModal;
