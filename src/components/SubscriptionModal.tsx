import React, { useState } from 'react';
import { X, ShieldCheck, Check, Sparkles, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'tenant' | 'landlord';
  isTenantSubActive: boolean;
  isLandlordSubActive: boolean;
  onToggleTenantSub: (active: boolean) => void;
  onToggleLandlordSub: (active: boolean) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  userRole,
  isTenantSubActive,
  isLandlordSubActive,
  onToggleTenantSub,
  onToggleLandlordSub
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'tenant' | 'landlord'>(userRole);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9812');
  const [cardExp, setCardExp] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('883');
  const [isActivating, setIsActivating] = useState(false);
  const [justActivated, setJustActivated] = useState(false);

  if (!isOpen) return null;

  const isCurrentPlanActive = selectedPlan === 'tenant' ? isTenantSubActive : isLandlordSubActive;

  const handleSubscribe = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      if (selectedPlan === 'tenant') {
        onToggleTenantSub(true);
      } else {
        onToggleLandlordSub(true);
      }
      setJustActivated(true);
      try {
        confetti({ particleCount: 70, spread: 70 });
      } catch (e) {}
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Premium Verification Services</h2>
              <p className="text-xs text-neutral-500">Fast-track trusted applications & verified landlord accreditation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Plan Selector Buttons */}
          <div className="grid grid-cols-2 gap-2 bg-neutral-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedPlan('tenant')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                selectedPlan === 'tenant'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Tenant Verified Pass ($4.99/mo)
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('landlord')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                selectedPlan === 'landlord'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Landlord Premier Shield ($9.99/mo)
            </button>
          </div>

          {/* Plan Showcase Card */}
          {selectedPlan === 'tenant' ? (
            <div className="p-5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-base font-bold text-blue-950">Tenant Fast-Track Verification Pass</h3>
                  <p className="text-xs text-blue-800">For prospective renters & voucher holders seeking priority housing</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono tabular-nums text-blue-950">$4.99</span>
                  <span className="text-xs text-neutral-500 block">/ month</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-neutral-700 pt-2 border-t border-blue-200/60">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-700 shrink-0" />
                  <span><strong>Verified Income & Voucher Badge:</strong> Instant pre-approval marker on all applications.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-700 shrink-0" />
                  <span><strong>Zero Application Fees:</strong> Apply to all Hunt & Hold listings without repeated screening fees.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-700 shrink-0" />
                  <span><strong>Priority Landlord Review:</strong> Placed at top of landlord's applicant queue.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-700 shrink-0" />
                  <span><strong>Offline Vault Access:</strong> Save and cache unlimited homes for offline viewing.</span>
                </li>
              </ul>
            </div>
          ) : (
            <div className="p-5 bg-red-50/60 rounded-xl border border-red-200 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-base font-bold text-red-950">Landlord Premier Shield</h3>
                  <p className="text-xs text-red-800">For owners & non-profit housing providers listing vacant homes</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono tabular-nums text-red-950">$9.99</span>
                  <span className="text-xs text-neutral-500 block">/ month</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-neutral-700 pt-2 border-t border-red-200/60">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-red-600 shrink-0" />
                  <span><strong>Verified Landlord Gold Badge:</strong> County deed & ownership authenticity badge.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-red-600 shrink-0" />
                  <span><strong>Featured Map Placement:</strong> Vacant listings highlighted in red/blue on regional map.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-red-600 shrink-0" />
                  <span><strong>Digital Lease Management:</strong> Unlimited E-Sign compliant lease generation & storage.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-red-600 shrink-0" />
                  <span><strong>Automated Rent Reminders:</strong> Built-in tenant reminder dispatch and payment ledger.</span>
                </li>
              </ul>
            </div>
          )}

          {/* Payment Card Simulation */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-800">Payment Information (Simulated)</span>
              <span className="text-neutral-400 flex items-center gap-1 font-mono text-[11px]">
                <Lock className="w-3 h-3 text-blue-600" /> 256-Bit SSL Encrypted
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-neutral-500 mb-0.5">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-neutral-50 font-mono"
                  />
                  <CreditCard className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-500 mb-0.5">Expires / CVC</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-1/2 px-2 py-1.5 text-xs border border-neutral-300 rounded bg-neutral-50 font-mono text-center"
                  />
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-1/2 px-2 py-1.5 text-xs border border-neutral-300 rounded bg-neutral-50 font-mono text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status feedback */}
          {justActivated && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                Success! Your <strong>{selectedPlan === 'tenant' ? 'Tenant Verification Pass' : 'Landlord Premier Shield'}</strong> is now active.
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-neutral-500">Cancel subscription at any time</span>
            
            <button
              type="button"
              disabled={isActivating}
              onClick={handleSubscribe}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2 ${
                selectedPlan === 'tenant'
                  ? 'bg-blue-700 hover:bg-blue-800 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isActivating ? 'Processing...' : isCurrentPlanActive ? 'Renew / Update Pass' : 'Activate Verified Subscription'}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
