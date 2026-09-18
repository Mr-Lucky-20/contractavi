import React, { useState } from 'react';
import { X, GitCompare, ArrowUpDown, CheckCircle, ExternalLink, MapPin } from 'lucide-react';
import VerificationBadge from '../common/VerificationBadge';

export const MaterialCompareMatrix = ({
  isOpen,
  onClose,
  vendors = [],
  initialVendor,
}) => {
  const [selectedType, setSelectedType] = useState('Cement');

  if (!isOpen) return null;

  const materialsList = ['Cement', 'Steel/Saria', 'Bricks', 'Sand', 'Aggregate'];

  // Extract entries for the selected material across all vendors
  const comparisonRows = [];
  for (const v of vendors) {
    const item = (v.inventory || []).find(
      (it) => it.materialType.toLowerCase() === selectedType.toLowerCase()
    );
    if (item) {
      comparisonRows.push({
        vendorName: v.storeName,
        contact: v.contact,
        distanceKm: v.distanceKm,
        verification: v.verification,
        rating: v.rating,
        brand: item.brand,
        spec: item.spec,
        unitPrice: item.unitPrice,
        unit: item.unit,
        stockStatus: item.stockStatus,
        flashDeal: item.flashDeal,
      });
    }
  }

  // Sort by unit price ascending
  comparisonRows.sort((a, b) => a.unitPrice - b.unitPrice);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-[2px]">
      <div className="relative w-full max-w-4xl bg-[#FFFFFF] border border-cement rounded-2xl shadow-modal max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-cement bg-[#FDFBF7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-raw-umber" />
            <div>
              <h2 className="font-headline font-bold text-base sm:text-lg text-charcoal tracking-tight">
                Rate Comparison Matrix
              </h2>
              <p className="text-xs text-charcoal-muted font-mono">
                Direct site procurement price comparison
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-cement text-charcoal-muted hover:text-charcoal hover:bg-[#F2EFE9] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 border-b border-cement bg-[#F9F8F6] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-mono uppercase text-charcoal-muted mr-1 whitespace-nowrap">
            MATERIAL:
          </span>
          {materialsList.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedType(m)}
              className={`px-3 py-1.5 text-xs font-mono border whitespace-nowrap transition-all rounded-lg ${
                selectedType === m
                  ? 'bg-charcoal text-white border-charcoal font-bold shadow-xs'
                  : 'bg-white text-charcoal border-cement hover:border-raw-umber hover:bg-[#F7F2EB]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1">
          {comparisonRows.length === 0 ? (
            <div className="text-center py-10 font-mono text-sm text-charcoal-muted">
              No registered suppliers currently stock {selectedType} in this operational zone.
            </div>
          ) : (
            <>
              {/* Mobile View: Stacked Cards */}
              <div className="block sm:hidden space-y-3 font-mono text-xs">
                {comparisonRows.map((row, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 border border-cement space-y-2.5 rounded-xl shadow-xs ${
                      idx === 0 ? 'bg-[#EDF7ED]/30 border-[#2E7D32]/40' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-full ${
                            idx === 0
                              ? 'bg-[#2E7D32] text-white'
                              : 'bg-[#E2DFD8] text-charcoal'
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-charcoal text-sm">{row.vendorName}</div>
                          <div className="text-[10px] text-charcoal-muted">{row.contact}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-headline font-bold text-base text-charcoal tabular-nums">
                          {formatPrice(row.unitPrice)}
                        </div>
                        <div className="text-[10px] text-charcoal-muted">per {row.unit}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-cement/60">
                      <div>
                        <span className="font-semibold text-charcoal">{row.brand}</span>
                        <span className="text-charcoal-muted text-[10px] block">{row.spec}</span>
                      </div>
                      <div className="flex items-center gap-1 text-raw-umber font-semibold whitespace-nowrap">
                        <MapPin className="w-3 h-3" />
                        {row.distanceKm} km
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase font-medium border rounded-full ${
                          row.stockStatus === 'In Stock'
                            ? 'bg-[#EDF7ED] border-[#2E7D32]/30 text-[#2E7D32]'
                            : 'bg-[#FFF4E5] border-[#FF9800]/40 text-[#E65100]'
                        }`}
                      >
                        {row.stockStatus}
                      </span>
                      <VerificationBadge verification={row.verification} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Comparison Table */}
              <div className="hidden sm:block border border-cement rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F2EFE9] border-b border-cement font-mono text-[11px] text-charcoal-muted uppercase">
                    <tr>
                      <th className="py-2.5 px-3 font-medium">Rank & Supplier</th>
                      <th className="py-2.5 px-3 font-medium">Brand / Grade</th>
                      <th className="py-2.5 px-3 font-medium">Distance</th>
                      <th className="py-2.5 px-3 font-medium">Unit Price</th>
                      <th className="py-2.5 px-3 font-medium">Stock Status</th>
                      <th className="py-2.5 px-3 font-medium text-right">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cement font-mono">
                    {comparisonRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-[#FDFBF7] ${
                          idx === 0 ? 'bg-[#EDF7ED]/40' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-full ${
                                idx === 0
                                  ? 'bg-[#2E7D32] text-white'
                                  : 'bg-[#E2DFD8] text-charcoal'
                              }`}
                            >
                              #{idx + 1}
                            </span>
                            <div>
                              <div className="font-bold text-charcoal">{row.vendorName}</div>
                              <div className="text-[10px] text-charcoal-muted">{row.contact}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-charcoal">{row.brand}</div>
                          <div className="text-[10px] text-charcoal-muted">{row.spec}</div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-raw-umber font-semibold">
                            <MapPin className="w-3 h-3" />
                            {row.distanceKm} km
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-headline font-bold text-sm text-charcoal tabular-nums">
                            {formatPrice(row.unitPrice)}
                          </div>
                          <div className="text-[10px] text-charcoal-muted">per {row.unit}</div>
                          {row.flashDeal?.active && (
                            <span className="text-[9px] text-[#8B5A2B] font-bold block">
                              Deal -{row.flashDeal.discountPercent}%
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-medium border rounded-full ${
                              row.stockStatus === 'In Stock'
                                ? 'bg-[#EDF7ED] border-[#2E7D32]/30 text-[#2E7D32]'
                                : 'bg-[#FFF4E5] border-[#FF9800]/40 text-[#E65100]'
                            }`}
                          >
                            {row.stockStatus}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <VerificationBadge verification={row.verification} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-cement bg-[#FDFBF7] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-mono text-center sm:text-left">
          <span className="text-charcoal-muted">
            *All rates subject to GST and transit freight.
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-charcoal text-white uppercase tracking-wider text-xs font-bold hover:bg-raw-umber transition-colors rounded-lg shadow-xs"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialCompareMatrix;
