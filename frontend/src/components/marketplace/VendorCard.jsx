import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Star,
  Truck,
  Zap,
  ArrowRight,
  GitCompare,
  X,
  Check,
} from 'lucide-react';
import VerificationBadge from '../common/VerificationBadge';
import api from '../../services/api';

export const VendorCard = ({
  vendor,
  onOpenRfq,
  onOpenCompare,
  selectedMaterial,
  onVendorUpdated,
}) => {
  const {
    _id,
    storeName,
    contactPerson,
    contact,
    physicalAddress,
    city,
    pincode,
    rating = 0,
    reviewCount = 0,
    deliveryVehicleAvailable,
    distanceKm,
    inventory = [],
    verification,
    hasFlashDeal,
  } = vendor;

  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [selectedScore, setSelectedScore] = useState(5);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [currentRating, setCurrentRating] = useState(rating);
  const [currentReviewCount, setCurrentReviewCount] = useState(reviewCount);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleRateSubmit = async () => {
    setIsSubmittingRating(true);
    try {
      const res = await api.post(`/vendors/${_id}/rate`, { score: selectedScore });
      if (res.data.success) {
        setCurrentRating(res.data.rating);
        setCurrentReviewCount(res.data.reviewCount);
        setIsRatingOpen(false);
        if (onVendorUpdated) onVendorUpdated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  return (
    <div className="w-full bg-white border border-cement rounded-2xl shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-cement bg-[#FDFBF7]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#F2EFE9] border border-cement rounded-md text-charcoal">
                ID://{_id ? _id.slice(-6).toUpperCase() : '000000'}
              </span>

              {distanceKm !== undefined && (
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-raw-umber bg-[#F7F2EB] px-2.5 py-0.5 border border-[#B48A63]/30 rounded-full">
                  <MapPin className="w-3 h-3 text-raw-umber" />
                  {distanceKm} km
                </span>
              )}

              {deliveryVehicleAvailable && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-charcoal-muted bg-[#F2EFE9] px-2 py-0.5 rounded-full">
                  <Truck className="w-3 h-3 text-charcoal-muted" />
                  Delivery Available
                </span>
              )}

              {hasFlashDeal && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FFF4E5] border border-[#FF9800]/40 text-[#E65100] text-[10px] font-mono font-bold uppercase rounded-full">
                  <Zap className="w-3 h-3 fill-[#E65100]" />
                  Flash Deal
                </span>
              )}
            </div>

            <h3 className="font-headline font-bold text-lg sm:text-xl text-charcoal tracking-tight pt-1">
              {storeName}
            </h3>
            <p className="text-xs text-charcoal-muted font-mono">
              {contactPerson} • {physicalAddress}, {city} ({pincode})
            </p>
          </div>

          <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-cement/60">
            {currentReviewCount > 0 && currentRating > 0 ? (
              <button
                onClick={() => setIsRatingOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F9F8F6] border border-cement rounded-lg hover:border-raw-umber transition-colors"
                title="Click to submit a rating"
              >
                <Star className="w-3.5 h-3.5 fill-[#8B5A2B] text-[#8B5A2B]" />
                <span className="font-headline font-bold text-xs text-charcoal">
                  {Number(currentRating).toFixed(1)}
                </span>
                <span className="text-[10px] font-mono text-charcoal-muted">
                  ({currentReviewCount} {currentReviewCount === 1 ? 'review' : 'reviews'})
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsRatingOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F9F8F6] border border-cement rounded-lg hover:border-raw-umber text-charcoal-muted hover:text-charcoal text-[10px] font-mono transition-colors"
                title="New supplier - be the first to rate"
              >
                <Star className="w-3 h-3 text-cement-dark" />
                <span>New Supplier • Rate</span>
              </button>
            )}

            <VerificationBadge verification={verification} />
          </div>
        </div>

        {isRatingOpen && (
          <div className="mt-3 p-3 bg-white border border-cement rounded-xl font-mono text-xs space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-charcoal">Rate this supplier:</span>
              <button
                onClick={() => setIsRatingOpen(false)}
                className="text-charcoal-muted hover:text-charcoal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedScore(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= selectedScore
                        ? 'fill-[#8B5A2B] text-[#8B5A2B]'
                        : 'text-cement-dark'
                    }`}
                  />
                </button>
              ))}
              <span className="font-bold text-xs text-charcoal ml-2">
                {selectedScore} / 5 Stars
              </span>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsRatingOpen(false)}
                className="px-2.5 py-1 text-[11px] border border-cement rounded-lg hover:bg-[#F2EFE9] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRateSubmit}
                disabled={isSubmittingRating}
                className="px-3 py-1 text-[11px] bg-charcoal text-white font-bold hover:bg-raw-umber transition-colors rounded-lg"
              >
                {isSubmittingRating ? 'Saving...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Material Listings */}
      <div className="p-3 sm:p-5 flex-1">
        {/* Mobile View: Stacked Cards */}
        <div className="block sm:hidden space-y-2.5">
          {inventory.map((item) => {
            const isTarget =
              selectedMaterial &&
              selectedMaterial !== 'All' &&
              item.materialType.toLowerCase() === selectedMaterial.toLowerCase();

            return (
              <div
                key={item._id || item.materialType}
                className={`p-3 border border-cement font-mono rounded-xl ${
                  isTarget ? 'bg-[#F7F2EB] border-raw-umber/40' : 'bg-[#FAFAF8]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-xs text-charcoal uppercase block">
                      {item.materialType}
                    </span>
                    <span className="text-[11px] text-charcoal font-medium">
                      {item.brand}
                    </span>
                    {item.spec && (
                      <span className="text-[10px] text-charcoal-muted block">
                        {item.spec}
                      </span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-headline font-bold text-sm text-charcoal block tabular-nums">
                      {formatPrice(item.unitPrice)}
                    </span>
                    <span className="text-[10px] text-charcoal-muted block">
                      per {item.unit}
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-cement/60 flex items-center justify-between text-[10px]">
                  <span
                    className={`px-2 py-0.5 uppercase font-medium border rounded-full ${
                      item.stockStatus === 'In Stock'
                        ? 'bg-[#EDF7ED] border-[#2E7D32]/30 text-[#2E7D32]'
                        : item.stockStatus === 'Limited Stock'
                        ? 'bg-[#FFF4E5] border-[#FF9800]/40 text-[#E65100]'
                        : 'bg-[#FDEDED] border-[#C62828]/30 text-[#C62828]'
                    }`}
                  >
                    {item.stockStatus}
                  </span>

                  {item.flashDeal?.active ? (
                    <span className="font-bold text-raw-umber">
                      -{item.flashDeal.discountPercent}% OFF
                    </span>
                  ) : (
                    <span className="text-charcoal-muted">
                      Min: {item.minOrderQty || 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop / Tablet View: High Density Table */}
        <div className="hidden sm:block border border-cement rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2EFE9] border-b border-cement font-mono text-[11px] text-charcoal-muted uppercase">
              <tr>
                <th className="py-2.5 px-3 font-medium">Material</th>
                <th className="py-2.5 px-3 font-medium">Brand & Spec</th>
                <th className="py-2.5 px-3 font-medium">Unit Rate</th>
                <th className="py-2.5 px-3 font-medium">Stock</th>
                <th className="py-2.5 px-3 font-medium text-right">Offer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cement font-mono">
              {inventory.map((item) => {
                const isTarget =
                  selectedMaterial &&
                  selectedMaterial !== 'All' &&
                  item.materialType.toLowerCase() === selectedMaterial.toLowerCase();

                return (
                  <tr
                    key={item._id || item.materialType}
                    className={`hover:bg-[#FDFBF7] transition-colors ${
                      isTarget ? 'bg-[#F7F2EB]' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-bold text-charcoal whitespace-nowrap">
                      {item.materialType}
                    </td>
                    <td className="py-2 px-3 text-charcoal">
                      <div className="font-semibold">{item.brand}</div>
                      <div className="text-[11px] text-charcoal-muted">{item.spec}</div>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="font-headline font-bold text-sm text-charcoal tabular-nums">
                        {formatPrice(item.unitPrice)}
                      </span>
                      <span className="text-[10px] text-charcoal-muted block">
                        per {item.unit}
                      </span>
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] uppercase font-semibold border rounded-full ${
                          item.stockStatus === 'In Stock'
                            ? 'bg-[#EDF7ED] border-[#2E7D32]/30 text-[#2E7D32]'
                            : item.stockStatus === 'Limited Stock'
                            ? 'bg-[#FFF4E5] border-[#FF9800]/40 text-[#E65100]'
                            : 'bg-[#FDEDED] border-[#C62828]/30 text-[#C62828]'
                        }`}
                      >
                        {item.stockStatus}
                      </span>
                      <span className="text-[10px] text-charcoal-muted block mt-0.5">
                        Min: {item.minOrderQty || 1}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      {item.flashDeal?.active ? (
                        <span className="inline-block px-2 py-0.5 bg-[#8B5A2B] text-white text-[10px] font-bold rounded-full">
                          -{item.flashDeal.discountPercent}% DEAL
                        </span>
                      ) : (
                        <span className="text-charcoal-muted text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-3 sm:p-4 bg-[#FDFBF7] border-t border-cement flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${contact}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-cement text-charcoal font-mono text-xs rounded-lg hover:border-charcoal transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-raw-umber" />
            <span className="font-semibold text-[11px] sm:text-xs">{contact}</span>
          </a>

          <button
            onClick={() => onOpenCompare(vendor)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-cement text-charcoal font-mono text-xs rounded-lg hover:border-charcoal hover:bg-[#F2EFE9] transition-colors shadow-xs"
            title="Compare rates"
          >
            <GitCompare className="w-3.5 h-3.5 text-charcoal-muted" />
            <span className="hidden sm:inline text-xs">Compare</span>
          </button>
        </div>

        <button
          onClick={() => onOpenRfq(vendor)}
          className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-charcoal text-[#F9F8F6] border border-charcoal font-mono text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-raw-umber hover:border-raw-umber transition-colors shadow-xs"
        >
          <span>Request RFQ</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default VendorCard;
