import React, { useState } from 'react';
import { LeaseAgreement } from '../types';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Printer, 
  PenTool, 
  Lock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LeaseManagementModalProps {
  lease: LeaseAgreement | null;
  userRole: 'tenant' | 'landlord';
  onClose: () => void;
  onSignLease: (leaseId: string, role: 'tenant' | 'landlord', signature: string) => void;
}

export const LeaseManagementModal: React.FC<LeaseManagementModalProps> = ({
  lease,
  userRole,
  onClose,
  onSignLease
}) => {
  const [signatureName, setSignatureName] = useState(
    userRole === 'tenant' ? (lease?.tenantName || 'Jordan Taylor') : (lease?.landlordName || 'Elena Rostova')
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!lease) return null;

  const isAlreadySignedByRole = userRole === 'tenant' ? lease.tenantSigned : lease.landlordSigned;
  const isFullyExecuted = lease.tenantSigned && lease.landlordSigned;

  const handleSign = () => {
    if (!signatureName.trim() || !agreedToTerms) return;
    onSignLease(lease.id, userRole, signatureName.trim());
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // confetti fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">Standard Residential Lease Agreement</h2>
                {isFullyExecuted ? (
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    Fully Executed
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    Pending Signatures
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                Hunt & Hold Fair Housing Standard Agreement · Lease #{lease.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print or Save PDF"
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-neutral-800 text-xs sm:text-sm">
          
          {/* Official Document Banner */}
          <div className="border-b-2 border-neutral-900 pb-4 text-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 uppercase">
              Affordable Housing Residential Lease Agreement
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Governed by the Texas Fair Housing Act & Hunt & Hold Community Housing Quality Standards
            </p>
          </div>

          {/* Section 1: Parties */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              1. Contracting Parties & Premises
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <div>
                <span className="font-semibold text-neutral-500 block mb-0.5">LANDLORD / PROVIDER:</span>
                <span className="text-sm font-bold text-neutral-900 block">{lease.landlordName}</span>
                <span className="text-neutral-500">Verified Housing Provider</span>
              </div>
              <div>
                <span className="font-semibold text-neutral-500 block mb-0.5">TENANT / OCCUPANT:</span>
                <span className="text-sm font-bold text-neutral-900 block">{lease.tenantName}</span>
                <span className="text-neutral-500">Hunt & Hold Verified Resident</span>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-neutral-200">
                <span className="font-semibold text-neutral-500 block mb-0.5">LEASED PREMISES:</span>
                <span className="text-sm font-bold text-neutral-900">{lease.propertyTitle}</span>
                <p className="text-neutral-600">{lease.propertyAddress}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Terms */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              2. Financial Terms & Payment Schedule
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="text-[11px] text-blue-800 font-semibold block">Monthly Rent</span>
                <span className="text-lg font-bold font-mono tabular-nums text-blue-950">${lease.monthlyRent}</span>
                <span className="text-[10px] text-blue-700 block mt-0.5">Due 1st of month</span>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                <span className="text-[11px] text-neutral-600 font-semibold block">Security Deposit</span>
                <span className="text-lg font-bold font-mono tabular-nums text-neutral-900">${lease.securityDeposit}</span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Held in escrow</span>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                <span className="text-[11px] text-neutral-600 font-semibold block">Lease Term</span>
                <span className="text-lg font-bold font-mono tabular-nums text-neutral-900">{lease.termMonths} Months</span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">Fixed rate</span>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                <span className="text-[11px] text-neutral-600 font-semibold block">Start Date</span>
                <span className="text-base font-bold font-mono text-neutral-900">{lease.startDate}</span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">To {lease.endDate}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Covenants & Utilities */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              3. Utilities & Fair Housing Covenants
            </h3>
            <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-2 text-xs leading-relaxed text-neutral-700">
              <p>
                <strong>Utilities Allocation: </strong>
                {lease.utilitiesResponsibility}
              </p>
              <p>
                <strong>Affordable Housing Protection: </strong>
                The Landlord agrees to accept rent payments tendered through Housing Choice Vouchers (Section 8) or municipal emergency assistance funds without imposing surcharge fees or discriminatory barriers.
              </p>
              <p>
                <strong>Automated Payment Reminders: </strong>
                Tenant will receive digital automated payment notifications 5 calendar days prior to each due date. A statutory 5-day grace period is provided prior to any late fee assessment.
              </p>
            </div>
          </div>

          {/* Section 4: House Rules */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              4. Community Rules & Maintenance Standards
            </h3>
            <ul className="list-disc list-inside space-y-1.5 p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700">
              {lease.rules.map((rule, idx) => (
                <li key={idx} className="leading-relaxed">{rule}</li>
              ))}
            </ul>
          </div>

          {/* Section 5: Electronic Signatures Pad */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              5. Certified Electronic Signatures
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Landlord Signature Box */}
              <div className={`p-4 rounded-xl border ${
                lease.landlordSigned ? 'bg-blue-50/50 border-blue-200' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-900">Landlord Signature</span>
                  {lease.landlordSigned && (
                    <span className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>

                {lease.landlordSigned ? (
                  <div className="space-y-1">
                    <div className="font-serif italic text-xl text-blue-900 border-b border-blue-300 pb-1">
                      {lease.landlordSignature || lease.landlordName}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono block">
                      Signed: {lease.landlordSignedAt ? new Date(lease.landlordSignedAt).toLocaleString() : 'Executed'}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-neutral-500 italic py-3 text-center border border-dashed border-neutral-300 rounded-lg">
                    Awaiting Landlord Signature
                  </div>
                )}
              </div>

              {/* Tenant Signature Box */}
              <div className={`p-4 rounded-xl border ${
                lease.tenantSigned ? 'bg-blue-50/50 border-blue-200' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-900">Tenant Signature</span>
                  {lease.tenantSigned && (
                    <span className="text-xs font-semibold text-blue-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>

                {lease.tenantSigned ? (
                  <div className="space-y-1">
                    <div className="font-serif italic text-xl text-blue-900 border-b border-blue-300 pb-1">
                      {lease.tenantSignature || lease.tenantName}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono block">
                      Signed: {lease.tenantSignedAt ? new Date(lease.tenantSignedAt).toLocaleString() : 'Executed'}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-neutral-500 italic py-3 text-center border border-dashed border-neutral-300 rounded-lg">
                    Awaiting Tenant Signature
                  </div>
                )}
              </div>

            </div>

            {/* Signing Action Box for active user */}
            {!isAlreadySignedByRole && (
              <div className="p-4 bg-white rounded-xl border-2 border-red-300 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-red-700 text-xs font-bold">
                  <PenTool className="w-4 h-4" />
                  <span>Execute Digital Signature as {userRole === 'tenant' ? 'Tenant' : 'Landlord'}</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Type Full Legal Name for Signature:
                  </label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="Full Legal Name"
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 font-serif"
                  />
                  {signatureName && (
                    <div className="mt-2 p-2 bg-neutral-50 border border-neutral-200 rounded font-serif italic text-xl text-blue-900 text-center">
                      {signatureName}
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-xs text-neutral-700">
                    I acknowledge that typing my name constitutes a legally binding electronic signature under the U.S. E-SIGN Act and agree to all terms above.
                  </span>
                </label>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={!signatureName.trim() || !agreedToTerms}
                    onClick={handleSign}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Affix Legal Signature</span>
                  </button>
                </div>
              </div>
            )}

            {isFullyExecuted && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-blue-950">
                <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0" />
                <div>
                  <span className="font-bold block">Lease Agreement Fully Executed & Active</span>
                  <span>Both parties have completed electronic signing. Automated rent reminders are synchronized with the tenant portal.</span>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <span className="text-xs text-neutral-500 hidden sm:inline">
            Hunt & Hold Digital Lease System · SHA-256 Verified
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
