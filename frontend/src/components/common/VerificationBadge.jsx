import React from 'react';
import { ShieldCheck, AlertTriangle, Clock } from 'lucide-react';

export const VerificationBadge = ({ verification, className = '' }) => {
  if (!verification) return null;

  const { badgeText, isStale, daysAgo } = verification;

  if (isStale) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDEDED] border border-[#C62828]/30 text-[#C62828] text-xs font-mono font-medium rounded-full ${className}`}
        title="Supplier has not synchronized daily rates within the past 24 hours. Call to verify quotes before site dispatch."
      >
        <AlertTriangle className="w-3.5 h-3.5 text-[#C62828] flex-shrink-0" />
        <span className="tracking-tight">{badgeText || `Prices last updated ${daysAgo || 1} days ago`}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDF7ED] border border-[#2E7D32]/30 text-[#2E7D32] text-xs font-mono font-medium rounded-full ${className}`}
      title="Daily prices verified and synchronized by certified material supplier within last 24 hours."
    >
      <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32] flex-shrink-0" />
      <span className="tracking-tight">{badgeText}</span>
    </div>
  );
};

export default VerificationBadge;
