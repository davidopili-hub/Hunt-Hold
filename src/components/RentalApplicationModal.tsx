import React, { useState } from 'react';
import { PropertyListing, RentalApplication } from '../types';
import { X, FileText, CheckCircle2, ShieldCheck, DollarSign, Building2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RentalApplicationModalProps {
  listing: PropertyListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (app: RentalApplication) => void;
  isTenantVerified: boolean;
}

export const RentalApplicationModal: React.FC<RentalApplicationModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSubmitApplication,
  isTenantVerified
}) => {
  const [applicantName, setApplicantName] = useState('Jordan Taylor');
  const [applicantEmail, setApplicantEmail] = useState('jordan.taylor@civicnest.net');
  const [applicantPhone, setApplicantPhone] = useState('(512) 555-8910');
  const [householdSize, setHouseholdSize] = useState<number>(2);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(3400);
  const [creditScoreRange, setCreditScoreRange] = useState('Good (670-739)');
  const [voucherHolder, setVoucherHolder] = useState(true);
  const [voucherSubsidyAmount, setVoucherSubsidyAmount] = useState<number>(600);
  const [employerName, setEmployerName] = useState('Austin Community College');
  const [jobTitle, setJobTitle] = useState('Administrative Support Specialist');
  const [messageToLandlord, setMessageToLandlord] = useState(
    'Hello! My household is seeking stable, affordable housing close to transit and schools. We have verified employment income and an active housing voucher with complete authorization paperwork ready.'
  );

  if (!isOpen || !listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;

    const newApp: RentalApplication = {
      id: `app_${Date.now()}`,
      propertyId: listing.id,
      propertyTitle: listing.title,
      propertyAddress: `${listing.address}, ${listing.city}, ${listing.state}`,
      propertyRent: listing.rentMonthly,
      propertyImage: listing.images[0],
      applicantId: 'tenant_current',
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim(),
      applicantPhone: applicantPhone.trim(),
      householdSize: Number(householdSize),
      monthlyIncome: Number(monthlyIncome),
      creditScoreRange,
      voucherHolder,
      voucherSubsidyAmount: voucherHolder ? Number(voucherSubsidyAmount) : undefined,
      employerName: employerName.trim(),
      jobTitle: jobTitle.trim(),
      messageToLandlord: messageToLandlord.trim(),
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      applicantVerified: isTenantVerified
    };

    onSubmitApplication(newApp);
    onClose();
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Submit Rental Application</h2>
              <p className="text-xs text-neutral-500 truncate max-w-md">
                For: {listing.title} (${listing.rentMonthly}/mo)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          
          {/* Verified Badge Notice */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                <strong>Hunt & Hold Verified Tenant Pass: </strong>
                Application fee waived ($0) & expedited landlord review.
              </span>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
              1. Applicant Contact Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Household Occupants</label>
                <select
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white"
                >
                  <option value={1}>1 Person</option>
                  <option value={2}>2 People</option>
                  <option value={3}>3 People</option>
                  <option value={4}>4+ People</option>
                </select>
              </div>
            </div>
          </div>

          {/* Income & Employment */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
              2. Employment & Income Verification
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Employer / Income Source</label>
                <input
                  type="text"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Job Title / Role</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Monthly Gross Income ($)</label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Credit Score Range</label>
                <select
                  value={creditScoreRange}
                  onChange={(e) => setCreditScoreRange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white"
                >
                  <option value="Excellent (740+)">Excellent (740+)</option>
                  <option value="Good (670-739)">Good (670-739)</option>
                  <option value="Fair (580-669)">Fair (580-669)</option>
                  <option value="Building Credit (< 580)">Building Credit / No Score</option>
                </select>
              </div>
            </div>
          </div>

          {/* Housing Voucher Declaration */}
          <div className="p-4 bg-red-50/60 rounded-xl border border-red-200 space-y-3">
            <span className="text-xs font-bold text-red-900 block">3. Housing Choice Voucher / Rental Subsidy</span>
            
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={voucherHolder}
                onChange={(e) => setVoucherHolder(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-xs text-neutral-800">
                <span className="font-semibold text-red-700 block">I am a Section 8 or Government Housing Choice Voucher recipient</span>
                Hunt & Hold verified landlords accept verified vouchers without discrimination.
              </span>
            </label>

            {voucherHolder && (
              <div className="mt-2 pl-6">
                <label className="block text-[11px] text-neutral-700 font-semibold mb-1">
                  Monthly Voucher Subsidy Amount ($):
                </label>
                <input
                  type="number"
                  value={voucherSubsidyAmount}
                  onChange={(e) => setVoucherSubsidyAmount(Number(e.target.value))}
                  className="w-36 px-2.5 py-1 text-xs border border-red-300 rounded bg-white font-mono"
                />
              </div>
            )}
          </div>

          {/* Statement */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Personal Statement to Landlord ({listing.landlordName})
            </label>
            <textarea
              rows={3}
              value={messageToLandlord}
              onChange={(e) => setMessageToLandlord(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-600 leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Submit Rental Application</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
