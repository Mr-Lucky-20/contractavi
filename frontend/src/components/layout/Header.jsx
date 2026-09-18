import React from 'react';
import {
  MapPin,
  Building2,
  HardHat,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useGeo } from '../../context/GeoContext';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ activeView, setActiveView, onOpenAuthModal }) => {
  const { locationName, setIsModalOpen, isGpsActive } = useGeo();
  const { owner, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full bg-[#FDFBF7] border-b border-cement sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white border border-cement p-0.5 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-xl shadow-xs">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-headline font-bold text-base sm:text-xl tracking-tight text-charcoal truncate">
                STRUCT<span className="text-raw-umber font-extrabold">//</span>CG
              </span>
              <span className="hidden xs:inline-block px-2 py-0.5 bg-[#F7F2EB] border border-[#B48A63]/30 text-raw-umber font-mono text-[9px] font-bold uppercase rounded-full">
                Chhattisgarh
              </span>
            </div>
            <p className="text-[10px] font-mono text-charcoal-muted tracking-tight hidden md:block">
              Steel, Cement & Aggregate Exchange • Bhilai | Raipur | Bilaspur
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#F2EFE9] border border-cement hover:border-raw-umber text-charcoal transition-colors group flex-shrink-0 rounded-xl shadow-xs"
          title="Change location"
        >
          <MapPin className="w-3.5 h-3.5 text-raw-umber" />
          <div className="text-left font-mono text-xs">
            <span className="text-[9px] text-charcoal-muted block uppercase tracking-wider">
              {isGpsActive ? 'Live GPS' : 'Region'}
            </span>
            <span className="font-semibold text-charcoal tracking-tight text-[11px]">
              {locationName}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <div className="flex items-center border border-cement p-1 bg-[#F2EFE9] rounded-xl">
            <button
              onClick={() => setActiveView('marketplace')}
              className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-mono font-medium uppercase tracking-wider flex items-center gap-1 transition-all rounded-lg ${
                activeView === 'marketplace'
                  ? 'bg-charcoal text-[#F9F8F6] font-bold shadow-xs'
                  : 'text-charcoal hover:bg-white/60'
              }`}
            >
              <HardHat className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Contractor</span>
              <span className="sm:hidden">Buyer</span>
            </button>
            <button
              onClick={() => setActiveView('portal')}
              className={`px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-mono font-medium uppercase tracking-wider flex items-center gap-1 transition-all rounded-lg ${
                activeView === 'portal'
                  ? 'bg-charcoal text-[#F9F8F6] font-bold shadow-xs'
                  : 'text-charcoal hover:bg-white/60'
              }`}
            >
              <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Supplier Hub</span>
              <span className="sm:hidden">Supplier</span>
            </button>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 pl-1 border-l border-cement">
              <div className="hidden lg:block text-right">
                <span className="text-[9px] text-charcoal-muted font-mono uppercase block">
                  Supplier
                </span>
                <span className="text-xs font-mono font-bold text-charcoal truncate max-w-[120px] block">
                  {owner?.storeName || 'My Yard'}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1 sm:p-1.5 border border-cement hover:border-alert-stale text-charcoal hover:text-alert-stale bg-white transition-colors rounded-lg"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3 sm:px-3.5 py-1.5 bg-[#8B5A2B] text-white border border-[#8B5A2B] text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#724921] transition-colors flex items-center gap-1 rounded-lg shadow-xs"
            >
              <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
