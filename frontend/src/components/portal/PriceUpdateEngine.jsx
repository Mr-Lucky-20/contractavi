import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Zap,
  Clock,
  X,
  PackagePlus,
} from 'lucide-react';
import api from '../../services/api';
import VerificationBadge from '../common/VerificationBadge';

const STANDARD_CATEGORIES = [
  { id: 'Cement', label: 'Cement', defaultUnit: 'Bag (50kg)', defaultMin: 50 },
  { id: 'Steel/Saria', label: 'Steel / TMT', defaultUnit: 'Metric Ton', defaultMin: 1 },
  { id: 'Bricks', label: 'Bricks / AAC Blocks', defaultUnit: 'Per Piece', defaultMin: 1000 },
  { id: 'Sand', label: 'Sand (M-Sand / River)', defaultUnit: 'Cubic Foot (cu.ft)', defaultMin: 200 },
  { id: 'Aggregate', label: 'Aggregate (Gitti)', defaultUnit: 'Cubic Foot (cu.ft)', defaultMin: 200 },
  { id: 'Other', label: 'Other Construction Material', defaultUnit: 'Unit', defaultMin: 1 },
];

export const PriceUpdateEngine = ({ onPricesUpdated }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Add Material Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addingMaterial, setAddingMaterial] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    materialCategory: 'Cement',
    customType: '',
    brand: '',
    spec: '',
    unitPrice: '',
    unit: 'Bag (50kg)',
    stockStatus: 'In Stock',
    minOrderQty: 50,
    flashDealActive: false,
    discountPercent: 5,
  });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inventory/my-inventory');
      if (res.data.success) {
        setInventory(res.data.items);
        const timestamps = res.data.items.map((i) => new Date(i.lastUpdatedTimestamp).getTime());
        if (timestamps.length > 0) {
          const maxTime = new Date(Math.max(...timestamps));
          setLastSyncTime(maxTime);
        }
      }
    } catch (err) {
      console.error('Failed to load supplier inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handlePriceChange = (id, newPrice) => {
    setInventory((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, unitPrice: parseFloat(newPrice) || 0 } : item
      )
    );
  };

  const handleStockChange = (id, newStatus) => {
    setInventory((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, stockStatus: newStatus } : item
      )
    );
  };

  const handleFlashToggle = (id, active) => {
    setInventory((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              flashDeal: {
                ...item.flashDeal,
                active,
                discountPercent: active ? item.flashDeal?.discountPercent || 5 : 0,
              },
            }
          : item
      )
    );
  };

  const handleFlashDiscountChange = (id, discount) => {
    setInventory((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              flashDeal: {
                ...item.flashDeal,
                discountPercent: Math.min(80, Math.max(0, parseInt(discount, 10) || 0)),
              },
            }
          : item
      )
    );
  };

  const handleBulkSync = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const payload = {
        items: inventory.map((item) => ({
          id: item._id,
          unitPrice: item.unitPrice,
          stockStatus: item.stockStatus,
          flashDealActive: item.flashDeal?.active || false,
          discountPercent: item.flashDeal?.discountPercent || 0,
          bannerText: item.flashDeal?.bannerText || '',
        })),
      };

      const res = await api.post('/inventory/bulk-update', payload);
      if (res.data.success) {
        const now = new Date();
        setLastSyncTime(now);
        setStatusMessage({
          type: 'success',
          text: `Daily rates synchronized successfully at ${now.toLocaleTimeString()}. All listings updated.`,
        });
        fetchInventory();
        if (onPricesUpdated) onPricesUpdated();
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to sync rates.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSingleSync = async (item) => {
    setSaving(true);
    try {
      const res = await api.put(`/inventory/${item._id}`, {
        unitPrice: item.unitPrice,
        stockStatus: item.stockStatus,
        flashDeal: item.flashDeal,
      });
      if (res.data.success) {
        setStatusMessage({
          type: 'success',
          text: `Updated ${item.materialType} price to ₹${item.unitPrice}.`,
        });
        fetchInventory();
        if (onPricesUpdated) onPricesUpdated();
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || `Failed to update ${item.materialType}.`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    const matched = STANDARD_CATEGORIES.find((c) => c.id === categoryId);
    setNewMaterial((prev) => ({
      ...prev,
      materialCategory: categoryId,
      unit: matched ? matched.defaultUnit : prev.unit,
      minOrderQty: matched ? matched.defaultMin : prev.minOrderQty,
    }));
  };

  const handleAddMaterialSubmit = async (e) => {
    e.preventDefault();
    setAddingMaterial(true);
    try {
      const finalType =
        newMaterial.materialCategory === 'Other'
          ? newMaterial.customType.trim()
          : newMaterial.materialCategory;

      if (!finalType) {
        alert('Please specify the material name.');
        setAddingMaterial(false);
        return;
      }

      if (!newMaterial.brand.trim()) {
        alert('Please specify the brand or mill name.');
        setAddingMaterial(false);
        return;
      }

      const price = parseFloat(newMaterial.unitPrice);
      if (isNaN(price) || price <= 0) {
        alert('Please enter a valid positive unit price.');
        setAddingMaterial(false);
        return;
      }

      const payload = {
        materialType: finalType,
        brand: newMaterial.brand.trim(),
        spec: newMaterial.spec.trim() || `${finalType} standard spec`,
        unitPrice: price,
        unit: newMaterial.unit.trim() || 'Unit',
        stockStatus: newMaterial.stockStatus,
        minOrderQty: Number(newMaterial.minOrderQty) || 1,
        flashDeal: {
          active: newMaterial.flashDealActive,
          discountPercent: Number(newMaterial.discountPercent) || 0,
          bannerText: newMaterial.flashDealActive ? 'Special Yard Rate' : '',
        },
      };

      const res = await api.post('/inventory', payload);
      if (res.data.success) {
        setIsAddModalOpen(false);
        setStatusMessage({
          type: 'success',
          text: `Added ${payload.brand} (${payload.materialType}) to your yard catalog!`,
        });
        fetchInventory();
        if (onPricesUpdated) onPricesUpdated();

        // Reset form
        setNewMaterial({
          materialCategory: 'Cement',
          customType: '',
          brand: '',
          spec: '',
          unitPrice: '',
          unit: 'Bag (50kg)',
          stockStatus: 'In Stock',
          minOrderQty: 50,
          flashDealActive: false,
          discountPercent: 5,
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add new material.');
    } finally {
      setAddingMaterial(false);
    }
  };

  const handleDeleteItem = async (item) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${item.brand || item.materialType} from your listing?`
      )
    ) {
      return;
    }

    try {
      const res = await api.delete(`/inventory/${item._id}`);
      if (res.data.success) {
        setStatusMessage({
          type: 'success',
          text: `${item.materialType} removed from yard listing.`,
        });
        fetchInventory();
        if (onPricesUpdated) onPricesUpdated();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove material.');
    }
  };

  const getOverallVerification = () => {
    if (!lastSyncTime) return null;
    const diffHours = (new Date().getTime() - lastSyncTime.getTime()) / (1000 * 60 * 60);
    const timeStr = lastSyncTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    if (diffHours < 24) {
      return {
        badgeText: `Verified Today at ${timeStr}`,
        isStale: false,
      };
    } else {
      const days = Math.floor(diffHours / 24);
      return {
        badgeText: `Prices last updated ${days} days ago`,
        isStale: true,
        daysAgo: days,
      };
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF] border border-cement rounded-2xl shadow-card overflow-hidden">
      {/* Top Bar */}
      <div className="p-4 sm:p-6 border-b border-cement bg-[#FDFBF7] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#8B5A2B] rounded-full inline-block"></span>
            <span className="font-mono text-[10px] text-charcoal-muted uppercase tracking-widest font-semibold">
              SUPPLIER MATERIAL MANAGEMENT
            </span>
          </div>
          <h2 className="font-headline font-bold text-xl sm:text-2xl text-charcoal tracking-tight mt-1">
            Yard Inventory & Rates
          </h2>
          <p className="text-xs text-charcoal-muted font-mono mt-1">
            Update unit prices, adjust stock levels, or add new building materials to your catalog.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <VerificationBadge verification={getOverallVerification()} />

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-white border border-charcoal text-charcoal font-mono text-xs uppercase tracking-wider font-bold rounded-lg hover:bg-[#F2EFE9] transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-raw-umber" />
            <span>Add Material</span>
          </button>

          <button
            onClick={handleBulkSync}
            disabled={saving || loading}
            className="px-5 py-2.5 bg-charcoal text-[#F9F8F6] border border-charcoal font-mono text-xs uppercase tracking-wider font-bold rounded-lg hover:bg-raw-umber hover:border-raw-umber transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
            <span>Sync All Rates</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 mx-4 sm:mx-6 mt-4 border rounded-xl font-mono text-xs flex items-center justify-between gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-[#EDF7ED] border-[#2E7D32]/30 text-[#2E7D32]'
              : 'bg-[#FDEDED] border-[#C62828]/30 text-[#C62828]'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="p-1 hover:opacity-75"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="py-16 text-center font-mono text-xs text-charcoal-muted">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-raw-umber" />
            Loading yard materials...
          </div>
        ) : inventory.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-cement rounded-2xl space-y-3 font-mono">
            <PackagePlus className="w-10 h-10 text-raw-umber mx-auto" />
            <div className="font-bold text-sm text-charcoal">No materials currently in your yard</div>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              Add core construction materials such as Cement, Steel/Saria, Bricks, or Sand to start receiving direct contractor orders.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-charcoal text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-raw-umber transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add First Material
            </button>
          </div>
        ) : (
          <>
            {/* Mobile View: Stacked Cards */}
            <div className="block sm:hidden space-y-3.5">
              {inventory.map((item) => (
                <div
                  key={item._id}
                  className="p-4 bg-white border border-cement rounded-xl shadow-sm space-y-3 font-mono text-xs"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-cement/60 pb-2.5">
                    <div>
                      <div className="font-bold text-charcoal text-sm">{item.materialType}</div>
                      <div className="text-[11px] text-charcoal font-semibold mt-0.5">{item.brand}</div>
                      <div className="text-[10px] text-charcoal-muted mt-0.5">{item.spec}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] text-charcoal-muted uppercase bg-[#F2EFE9] px-2 py-0.5 border border-cement rounded-md flex-shrink-0 font-medium">
                        per {item.unit}
                      </span>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-1 text-charcoal-muted hover:text-alert-stale transition-colors"
                        title="Delete material"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase text-charcoal-muted mb-1 font-semibold">
                        Unit Price (₹)
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-charcoal">₹</span>
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handlePriceChange(item._id, e.target.value)}
                          className="w-full px-2 py-1.5 border border-cement rounded-lg bg-white font-headline font-bold text-sm text-charcoal tabular-nums focus:outline-none focus:border-raw-umber"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-charcoal-muted mb-1 font-semibold">
                        Stock Status
                      </label>
                      <select
                        value={item.stockStatus}
                        onChange={(e) => handleStockChange(item._id, e.target.value)}
                        className="w-full px-2 py-1.5 border border-cement rounded-lg bg-white font-mono text-xs text-charcoal focus:outline-none focus:border-charcoal"
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Limited Stock">Limited Stock</option>
                        <option value="Bulk Available">Bulk Available</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-cement/40">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.flashDeal?.active || false}
                        onChange={(e) => handleFlashToggle(item._id, e.target.checked)}
                        className="rounded border-cement text-raw-umber focus:ring-0"
                      />
                      <span className="text-[11px] text-charcoal font-semibold">
                        Flash Deal
                      </span>
                    </label>

                    {item.flashDeal?.active && (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="80"
                          value={item.flashDeal.discountPercent || 5}
                          onChange={(e) =>
                            handleFlashDiscountChange(item._id, e.target.value)
                          }
                          className="w-12 px-1.5 py-0.5 text-xs border border-cement rounded bg-white font-mono text-charcoal text-center focus:outline-none focus:border-raw-umber"
                        />
                        <span className="text-[10px] text-raw-umber font-bold">% OFF</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSingleSync(item)}
                    disabled={saving}
                    className="w-full py-2 bg-white border border-cement rounded-lg text-charcoal font-mono text-xs uppercase tracking-wider font-semibold hover:border-charcoal hover:bg-[#F2EFE9] transition-colors"
                  >
                    Push {item.materialType} Rate
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop View: Table Grid */}
            <div className="hidden sm:block border border-cement rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F2EFE9] border-b border-cement font-mono text-[11px] text-charcoal-muted uppercase">
                  <tr>
                    <th className="py-3 px-3.5 font-semibold">Material Code</th>
                    <th className="py-3 px-3.5 font-semibold">Brand & Specs</th>
                    <th className="py-3 px-3.5 font-semibold">Daily Unit Price (₹)</th>
                    <th className="py-3 px-3.5 font-semibold">Inventory Status</th>
                    <th className="py-3 px-3.5 font-semibold">Flash Deal / Bulk</th>
                    <th className="py-3 px-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cement font-mono">
                  {inventory.map((item) => (
                    <tr key={item._id} className="hover:bg-[#FDFBF7] transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-charcoal text-sm">
                          {item.materialType}
                        </div>
                        <span className="text-[10px] text-charcoal-muted uppercase bg-[#F2EFE9] px-1.5 py-0.5 rounded border border-cement/60">
                          per {item.unit}
                        </span>
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-charcoal">{item.brand}</div>
                        <div className="text-[10px] text-charcoal-muted">{item.spec}</div>
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-charcoal">₹</span>
                          <input
                            type="number"
                            step="any"
                            min="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handlePriceChange(item._id, e.target.value)}
                            className="w-28 px-2.5 py-1.5 border border-cement rounded-lg bg-white font-headline font-bold text-sm text-charcoal tabular-nums focus:outline-none focus:border-raw-umber"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <select
                          value={item.stockStatus}
                          onChange={(e) => handleStockChange(item._id, e.target.value)}
                          className="px-2.5 py-1.5 border border-cement rounded-lg bg-white font-mono text-xs text-charcoal focus:outline-none focus:border-charcoal"
                        >
                          <option value="In Stock">In Stock</option>
                          <option value="Limited Stock">Limited Stock</option>
                          <option value="Bulk Available">Bulk Available</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.flashDeal?.active || false}
                              onChange={(e) => handleFlashToggle(item._id, e.target.checked)}
                              className="rounded border-cement text-raw-umber focus:ring-0"
                            />
                            <span className="text-[11px] text-charcoal font-semibold">
                              Deal Active
                            </span>
                          </label>

                          {item.flashDeal?.active && (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="1"
                                max="80"
                                value={item.flashDeal.discountPercent || 5}
                                onChange={(e) =>
                                  handleFlashDiscountChange(item._id, e.target.value)
                                }
                                className="w-14 px-1.5 py-1 text-xs border border-cement rounded-md bg-white font-mono text-charcoal focus:outline-none focus:border-raw-umber"
                              />
                              <span className="text-[10px] text-raw-umber font-bold">% OFF</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSingleSync(item)}
                            disabled={saving}
                            className="px-3 py-1.5 bg-white border border-cement rounded-lg text-charcoal font-mono text-xs uppercase tracking-wider hover:border-charcoal hover:bg-[#F2EFE9] transition-colors shadow-xs"
                            title="Sync this material alone"
                          >
                            Push
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="p-1.5 border border-cement rounded-lg text-charcoal-muted hover:text-alert-stale hover:border-alert-stale/40 transition-colors"
                            title="Remove material"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-cement bg-[#FDFBF7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-[11px] text-charcoal-muted">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-raw-umber" />
          <span>
            Listings unverified for 24+ hours will display a stale rate warning to buyers.
          </span>
        </div>
      </div>

      {/* ADD MATERIAL MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/50 backdrop-blur-[3px]">
          <div className="relative w-full max-w-lg bg-[#FFFFFF] border border-cement rounded-2xl shadow-modal p-5 sm:p-6 text-charcoal max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-cement mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#F7F2EB] border border-[#B48A63]/30 rounded-xl text-raw-umber">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-charcoal">
                    Add Yard Material
                  </h3>
                  <p className="text-[11px] font-mono text-charcoal-muted">
                    List a new construction product with daily site supply rates
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 border border-cement rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-[#F2EFE9] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-3.5 font-mono text-xs">
              {/* Category Selector */}
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  Material Category *
                </label>
                <select
                  value={newMaterial.materialCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                >
                  {STANDARD_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Category input if "Other" */}
              {newMaterial.materialCategory === 'Other' && (
                <div>
                  <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                    Custom Material Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. White Cement, RMC Concrete, Stone Dust"
                    value={newMaterial.customType}
                    onChange={(e) => setNewMaterial({ ...newMaterial, customType: e.target.value })}
                    className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                  />
                </div>
              )}

              {/* Brand and Spec */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                    Brand / Manufacturer *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UltraTech, Tata Tiscon, SAIL"
                    value={newMaterial.brand}
                    onChange={(e) => setNewMaterial({ ...newMaterial, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                    Specification / Grade
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fe-550D TMT, Grade 53 PPC"
                    value={newMaterial.spec}
                    onChange={(e) => setNewMaterial({ ...newMaterial, spec: e.target.value })}
                    className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              {/* Price & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                    Daily Rate (₹) *
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-charcoal">₹</span>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      required
                      placeholder="e.g. 355"
                      value={newMaterial.unitPrice}
                      onChange={(e) => setNewMaterial({ ...newMaterial, unitPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-cement rounded-lg bg-white font-headline font-bold text-sm text-charcoal focus:outline-none focus:border-charcoal"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                    Unit of Measurement *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bag (50kg), Metric Ton"
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              {/* Stock status & Min order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                    Stock Availability
                  </label>
                  <select
                    value={newMaterial.stockStatus}
                    onChange={(e) => setNewMaterial({ ...newMaterial, stockStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Bulk Available">Bulk Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                    Min Order Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newMaterial.minOrderQty}
                    onChange={(e) => setNewMaterial({ ...newMaterial, minOrderQty: e.target.value })}
                    className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>

              {/* Flash Deal Options */}
              <div className="p-3 bg-[#FDFBF7] border border-cement rounded-xl flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMaterial.flashDealActive}
                    onChange={(e) => setNewMaterial({ ...newMaterial, flashDealActive: e.target.checked })}
                    className="rounded border-cement text-raw-umber focus:ring-0"
                  />
                  <span className="font-semibold text-charcoal">
                    Activate Flash Deal Discount
                  </span>
                </label>

                {newMaterial.flashDealActive && (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      max="80"
                      value={newMaterial.discountPercent}
                      onChange={(e) => setNewMaterial({ ...newMaterial, discountPercent: e.target.value })}
                      className="w-14 px-2 py-1 text-xs border border-cement rounded-lg bg-white text-center font-bold"
                    />
                    <span className="font-bold text-raw-umber">% OFF</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-white border border-cement rounded-lg text-charcoal hover:bg-[#F2EFE9] text-center transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingMaterial}
                  className="px-5 py-2.5 bg-charcoal text-white uppercase tracking-wider font-bold rounded-lg hover:bg-raw-umber transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {addingMaterial ? 'Adding Material...' : 'Add Material to Yard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceUpdateEngine;
