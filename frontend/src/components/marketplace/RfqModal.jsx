import React, { useState } from 'react';
import { X, Send, CheckCircle2, Building, AlertCircle } from 'lucide-react';
import { validatePhone } from '../../utils/validation';

export const RfqModal = ({ isOpen, onClose, vendor }) => {
  const [formData, setFormData] = useState({
    contractorName: '',
    phone: '',
    siteAddress: '',
    materialType: 'Cement',
    quantity: 100,
    deliveryDate: '',
    projectNotes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !vendor) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.contractorName || !formData.phone || !formData.siteAddress) {
      setError('Please complete Contractor Name, Phone, and Site Address.');
      return;
    }

    const phoneCheck = validatePhone(formData.phone);
    if (!phoneCheck.isValid) {
      setError(phoneCheck.error);
      return;
    }

    setError(null);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-charcoal/50 backdrop-blur-[3px]">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] border border-cement rounded-2xl shadow-modal p-5 sm:p-6 text-charcoal max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-cement mb-4">
          <div>
            <span className="text-[10px] font-mono text-raw-umber uppercase tracking-widest block">
              SUPPLIER INQUIRY
            </span>
            <h2 className="font-headline font-bold text-lg text-charcoal">
              Request Site Quote (RFQ)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-cement rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-[#F2EFE9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 font-mono">
            <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto" />
            <h3 className="font-headline font-bold text-xl text-charcoal">
              RFQ Dispatched to {vendor.storeName}
            </h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              Your inquiry reference <span className="font-bold text-charcoal">#RFQ-{Math.floor(100000 + Math.random() * 900000)}</span> has been routed directly to {vendor.contactPerson} ({vendor.contact}).
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-5 py-2 bg-charcoal text-white font-mono text-xs uppercase tracking-wider hover:bg-raw-umber"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
            <div className="p-3 bg-[#FDFBF7] border border-cement rounded-xl">
              <div className="text-[11px] text-charcoal-muted">Target Supplier:</div>
              <div className="font-bold text-charcoal text-sm">{vendor.storeName}</div>
              <div className="text-[11px] text-raw-umber font-semibold mt-0.5">
                Operational Radius: {vendor.operationalRadiusKm || 35} km | Direct Contact: {vendor.contact}
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-[#FDEDED] border border-[#C62828]/30 rounded-xl text-[#C62828] text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  Contractor / Firm Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contractorName}
                  onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
                  placeholder="e.g. Apex Infra Projects"
                  className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                />
              </div>
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  Site Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98261 12345"
                  className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  Material Type
                </label>
                <select
                  value={formData.materialType}
                  onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
                  className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                >
                  <option value="Cement">Cement (PPC/OPC 53G)</option>
                  <option value="Steel/Saria">Steel / TMT Fe-550D</option>
                  <option value="Bricks">Bricks / AAC Blocks</option>
                  <option value="Sand">M-Sand / River Sand</option>
                  <option value="Aggregate">Aggregate 10mm/20mm</option>
                </select>
              </div>
              <div>
                <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                  Required Quantity (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                Physical Site Delivery Address *
              </label>
              <textarea
                rows="2"
                required
                value={formData.siteAddress}
                onChange={(e) => setFormData({ ...formData, siteAddress: e.target.value })}
                placeholder="Plot / Project Address, Landmark, Pincode..."
                className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
              ></textarea>
            </div>

            <div>
              <label className="block text-charcoal-muted mb-1 uppercase text-[10px] font-semibold">
                Additional Dispatch Notes / Grade Specs
              </label>
              <input
                type="text"
                value={formData.projectNotes}
                onChange={(e) => setFormData({ ...formData, projectNotes: e.target.value })}
                placeholder="e.g. Unloading crane required at site by 08:00 AM"
                className="w-full px-3 py-2 border border-cement rounded-lg bg-white focus:outline-none focus:border-charcoal"
              />
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-cement rounded-lg text-charcoal hover:bg-[#F2EFE9] text-center transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-charcoal text-white uppercase tracking-wider font-bold rounded-lg hover:bg-raw-umber transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Submit RFQ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RfqModal;
