import React from 'react';
import { LeaseAgreement } from '../types';
import { 
  ShieldCheck, 
  FileCheck2, 
  PenTool, 
  ArrowRight, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Home, 
  Building2 
} from 'lucide-react';

interface LeasesViewProps {
  leases: LeaseAgreement[];
  userRole: 'tenant' | 'landlord';
  onSelectLease: (lease: LeaseAgreement) => void;
  onOpenNewLease: () => void;
}

export const LeasesView: React.FC<LeasesViewProps> = ({
  leases,
  userRole,
  onSelectLease,
  onOpenNewLease
}) => {
  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Legally Compliant Digital Leases</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Built-in Lease Agreements
            </h1>
            <p className="text-sm text-neutral-600 mt-2 max-w-xl leading-relaxed">
              Standardized, fair-housing compliant residential lease agreements with integrated e-signatures, automated rent schedules, and voucher protections.
            </p>
          </div>

          {userRole === 'landlord' && (
            <button
              type="button"
              onClick={onOpenNewLease}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Lease Agreement</span>
            </button>
          )}
        </div>
      </div>

      {/* Leases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leases.map(lease => {
          const isFullySigned = lease.tenantSigned && lease.landlordSigned;
          const needsUserSignature = userRole === 'tenant' ? !lease.tenantSigned : !lease.landlordSigned;

          return (
            <div
              key={lease.id}
              onClick={() => onSelectLease(lease)}
              className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all cursor-pointer shadow-2xs group"
            >
              <div className="space-y-4">
                
                {/* Status & ID */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400">Lease #{lease.id}</span>
                  {isFullySigned ? (
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active & Fully Executed</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending E-Signatures</span>
                    </span>
                  )}
                </div>

                {/* Property & Parties */}
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-700 transition-colors">
                    {lease.propertyTitle}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">{lease.propertyAddress}</p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-neutral-600">
                    <span className="font-semibold text-neutral-800">Landlord:</span>
                    <span>{lease.landlordName}</span>
                    <span aria-hidden="true" className="text-neutral-300">·</span>
                    <span className="font-semibold text-neutral-800">Tenant:</span>
                    <span>{lease.tenantName}</span>
                  </div>
                </div>

                {/* Terms Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Monthly Rent</span>
                    <span className="font-bold font-mono tabular-nums text-neutral-900">${lease.monthlyRent}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Security Deposit</span>
                    <span className="font-bold font-mono tabular-nums text-neutral-900">${lease.securityDeposit}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Lease Term</span>
                    <span className="font-semibold text-neutral-900">{lease.termMonths} Months</span>
                  </div>
                </div>

                {/* Signature status indicators */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${lease.landlordSigned ? 'bg-blue-600' : 'bg-neutral-300'}`} />
                    <span className="text-neutral-600">Landlord: {lease.landlordSigned ? 'Signed' : 'Awaiting'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${lease.tenantSigned ? 'bg-blue-600' : 'bg-neutral-300'}`} />
                    <span className="text-neutral-600">Tenant: {lease.tenantSigned ? 'Signed' : 'Awaiting'}</span>
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                {needsUserSignature ? (
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Your Signature Required</span>
                  </span>
                ) : (
                  <span className="text-xs text-neutral-400">View terms and PDF</span>
                )}

                <button
                  type="button"
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>{needsUserSignature ? 'Review & Sign' : 'View Agreement'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
