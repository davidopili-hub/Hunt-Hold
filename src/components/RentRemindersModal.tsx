import React, { useState } from 'react';
import { RentReminder } from '../types';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Building2, 
  Calendar, 
  AlertCircle,
  Receipt,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RentRemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: RentReminder[];
  onMarkPaid: (reminderId: string, method: string) => void;
  onSavePreferences?: (leadDays: number, methods: ('email' | 'in_app' | 'browser')[]) => void;
}

export const RentRemindersModal: React.FC<RentRemindersModalProps> = ({
  isOpen,
  onClose,
  reminders,
  onMarkPaid
}) => {
  const [leadDays, setLeadDays] = useState(5);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyBrowser, setNotifyBrowser] = useState(true);
  const [selectedReminderForPay, setSelectedReminderForPay] = useState<RentReminder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'ach' | 'voucher' | 'card'>('ach');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<{ id: string; code: string; date: string } | null>(null);
  const [testAlertFired, setTestAlertFired] = useState(false);

  if (!isOpen) return null;

  const handlePay = (reminder: RentReminder) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const methodName = paymentMethod === 'ach' 
        ? 'Direct Bank ACH Transfer (0% Fee)' 
        : paymentMethod === 'voucher' 
          ? 'Section 8 Voucher Direct Subsidy Disbursement' 
          : 'Debit Card Payment';
      onMarkPaid(reminder.id, methodName);
      setPaidReceipt({
        id: reminder.id,
        code: `HH-RCP-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString()
      });
      setSelectedReminderForPay(null);
      try {
        confetti({ particleCount: 50, spread: 50 });
      } catch (e) {}
    }, 900);
  };

  const handleTriggerTestReminder = () => {
    setTestAlertFired(true);
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setTimeout(() => setTestAlertFired(false), 4000);
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
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Automated Rent Payment Reminders</h2>
              <p className="text-xs text-neutral-500">Configure reminder lead-time schedules and record rent payments</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Notification Preferences Card */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">
                Reminder Timing & Channels
              </span>
              <button
                type="button"
                onClick={handleTriggerTestReminder}
                className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 underline"
              >
                Send Test Notification
              </button>
            </div>

            {testAlertFired && (
              <div className="p-3 bg-red-600 text-white rounded-lg text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Simulated Alert: Rent of $980 is due in 5 days (Oct 1). Zero late fees if paid on time!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Notice Schedule:
                </label>
                <select
                  value={leadDays}
                  onChange={(e) => setLeadDays(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-blue-300 rounded-lg text-neutral-800 focus:ring-2 focus:ring-blue-600"
                >
                  <option value={7}>7 Days Before Due Date</option>
                  <option value={5}>5 Days Before (Recommended)</option>
                  <option value={3}>3 Days Before</option>
                  <option value={1}>1 Day Before</option>
                </select>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="block font-semibold text-neutral-700">Delivery Channels:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyInApp}
                    onChange={(e) => setNotifyInApp(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>In-App Header Bell & Dashboard Alert</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Automated Email Summary</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyBrowser}
                    onChange={(e) => setNotifyBrowser(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Browser Push Notifications</span>
                </label>
              </div>
            </div>
          </div>

          {/* Payment Ledger Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Upcoming & Past Rent Bills
            </h3>

            <div className="space-y-2.5">
              {reminders.map(rem => (
                <div 
                  key={rem.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    rem.isPaid 
                      ? 'bg-neutral-50/60 border-neutral-200' 
                      : 'bg-white border-red-300 ring-1 ring-red-200 shadow-2xs'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">{rem.propertyTitle}</span>
                      {rem.isPaid ? (
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          Paid
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                          Payment Due
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500">
                      Due Date: <span className="font-semibold text-neutral-800">{rem.dueDate}</span> · Notice: {rem.leadDaysNotice} days prior
                    </div>
                    {rem.isPaid && rem.receiptNumber && (
                      <div className="text-[11px] text-neutral-400 font-mono">
                        Receipt: {rem.receiptNumber} · Paid on {rem.paidDate} ({rem.paymentMethod})
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono tabular-nums text-neutral-900">
                        ${rem.amount}
                      </div>
                      <span className="text-[10px] text-neutral-400">Monthly Lease</span>
                    </div>

                    {!rem.isPaid && (
                      <button
                        type="button"
                        onClick={() => setSelectedReminderForPay(rem)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                      >
                        Pay Rent
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pay Rent Modal Overlay */}
          {selectedReminderForPay && (
            <div className="p-4 bg-white rounded-xl border-2 border-red-400 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                  Complete Rent Payment
                </span>
                <button 
                  onClick={() => setSelectedReminderForPay(null)}
                  className="text-xs text-neutral-400 hover:text-neutral-700"
                >
                  Cancel
                </button>
              </div>

              <div className="text-xs text-neutral-700">
                Paying rent for <strong>{selectedReminderForPay.propertyTitle}</strong>:
                <div className="text-xl font-bold font-mono tabular-nums text-neutral-900 mt-1">
                  ${selectedReminderForPay.amount}.00
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-800 block">Select Payment Channel:</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ach')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      paymentMethod === 'ach' 
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold' 
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600 mb-1" />
                    <span>Bank ACH Transfer</span>
                    <span className="text-[10px] block text-neutral-400 font-normal">0% Fee (Free)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('voucher')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      paymentMethod === 'voucher' 
                        ? 'border-red-600 bg-red-50 text-red-900 font-semibold' 
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <Receipt className="w-4 h-4 text-red-600 mb-1" />
                    <span>Voucher Credit</span>
                    <span className="text-[10px] block text-neutral-400 font-normal">Direct subsidy sync</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      paymentMethod === 'card' 
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold' 
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600 mb-1" />
                    <span>Debit Card</span>
                    <span className="text-[10px] block text-neutral-400 font-normal">Instant ledger update</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handlePay(selectedReminderForPay)}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                >
                  {isProcessing ? 'Processing Transfer...' : `Confirm & Authorize $${selectedReminderForPay.amount}`}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <span>Automated ledger sync with landlord escrow account</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
