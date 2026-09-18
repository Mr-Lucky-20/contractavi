import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Eye,
  Edit3,
  Sliders,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PriceUpdateEngine from './PriceUpdateEngine';
import VendorCard from '../marketplace/VendorCard';

export const OwnerInventoryView = ({ onSwitchToMarketplace }) => {
  const { owner } = useAuth();
  const [activeTab, setActiveTab] = useState('engine'); // 'engine' or 'preview'
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!owner) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Supplier Profile Header Card */}
      <div className="bg-[#FFFFFF] border border-cement rounded-2xl shadow-card p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 bg-[#F2EFE9] border border-cement text-charcoal rounded-full">
              VERIFIED MATERIAL SUPPLIER
            </span>
            {owner.gstNumber && (
              <span className="font-mono text-[10px] text-charcoal-muted px-2.5 py-0.5 border border-cement bg-white rounded-full">
                GSTIN: {owner.gstNumber}
              </span>
            )}
            <span className="font-mono text-[10px] text-raw-umber px-2.5 py-0.5 border border-[#B48A63]/30 bg-[#F7F2EB] rounded-full">
              RADIUS: {owner.operationalRadiusKm || 35} KM
            </span>
          </div>

          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-charcoal tracking-tight">
            {owner.storeName}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-charcoal-muted pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-raw-umber" />
              {owner.physicalAddress}, {owner.city} ({owner.pincode})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-raw-umber" />
              {owner.contact} ({owner.contactPerson})
            </span>
          </div>
        </div>

        {/* View Switcher / Quick Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('engine')}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-wider font-semibold border flex items-center gap-1.5 transition-all rounded-lg shadow-xs ${
              activeTab === 'engine'
                ? 'bg-charcoal text-[#F9F8F6] border-charcoal'
                : 'bg-white text-charcoal border-cement hover:bg-[#F2EFE9]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Price Engine
          </button>

          <button
            onClick={onSwitchToMarketplace}
            className="px-4 py-2 bg-white text-charcoal border border-cement font-mono text-xs uppercase tracking-wider hover:border-charcoal hover:bg-[#F2EFE9] transition-all flex items-center gap-1.5 rounded-lg shadow-xs"
          >
            <span>Live Marketplace</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === 'engine' && (
        <PriceUpdateEngine onPricesUpdated={() => setRefreshTrigger((prev) => prev + 1)} />
      )}
    </div>
  );
};

export default OwnerInventoryView;
