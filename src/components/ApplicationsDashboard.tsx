import React, { useState } from 'react';
import { RentalApplication, ApplicationStatus } from '../types';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  ArrowRight, 
  Building2, 
  MessageSquare, 
  ShieldCheck, 
  AlertCircle,
  FileCheck,
  Check,
  X
} from 'lucide-react';

interface ApplicationsDashboardProps {
  applications: RentalApplication[];
  userRole: 'tenant' | 'landlord';
  onUpdateStatus: (appId: string, status: ApplicationStatus, tourDateTime?: string, notes?: string) => void;
  onOpenLease: (applicationId: string) => void;
  onOpenChat: (propertyId: string, applicantName: string) => void;
}

const STATUS_STEPS: { key: ApplicationStatus; label: string; desc: string }[] = [
  { key: 'submitted', label: '1. Submitted', desc: 'Application received' },
  { key: 'under_review', label: '2. Document Review', desc: 'Income & background check' },
  { key: 'tour_scheduled', label: '3. Walkthrough Tour', desc: 'In-person inspection' },
  { key: 'approved', label: '4. Landlord Approved', desc: 'Ready for lease signing' },
  { key: 'lease_signed', label: '5. Lease Executed', desc: 'Keys ready for move-in' }
];

export const ApplicationsDashboard: React.FC<ApplicationsDashboardProps> = ({
  applications,
  userRole,
  onUpdateStatus,
  onOpenLease,
  onOpenChat
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(applications[0]?.id || null);
  const [tourInput, setTourInput] = useState('2026-10-02 at 3:00 PM CST');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">Approved</span>;
      case 'lease_signed':
        return <span className="text-xs font-semibold text-blue-800 bg-blue-100 border border-blue-300 px-2.5 py-0.5 rounded">Lease Signed</span>;
      case 'tour_scheduled':
        return <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">Tour Scheduled</span>;
      case 'under_review':
        return <span className="text-xs font-semibold text-neutral-700 bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded">Under Review</span>;
      case 'rejected':
        return <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">Declined</span>;
      default:
        return <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded">Submitted</span>;
    }
  };

  const getStepProgressIndex = (status: ApplicationStatus): number => {
    if (status === 'rejected') return -1;
    if (status === 'submitted') return 0;
    if (status === 'under_review') return 1;
    if (status === 'tour_scheduled') return 2;
    if (status === 'approved' || status === 'lease_generated') return 3;
    if (status === 'lease_signed') return 4;
    return 0;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Metrics */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold text-blue-800 bg-blue-100/80 border border-blue-300 px-2.5 py-0.5 rounded tracking-wide uppercase">
                Hunt & Hold Platform
              </span>
              <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded tracking-wide uppercase">
                {userRole === 'landlord' ? 'Landlord Console' : 'Applicant Portal'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Hunt & Hold Applications Dashboard
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Real-time monitoring of tenant verifications, voucher certificates, tour scheduling, and lease execution.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
              <span className="text-xs text-blue-700 font-medium block">Active</span>
              <span className="text-xl font-bold font-mono tabular-nums text-blue-900">{applications.length}</span>
            </div>
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
              <span className="text-xs text-red-700 font-medium block">Tours</span>
              <span className="text-xl font-bold font-mono tabular-nums text-red-900">
                {applications.filter(a => a.status === 'tour_scheduled').length}
              </span>
            </div>
            <div className="bg-neutral-50 border border-neutral-200 p-3 rounded-xl">
              <span className="text-xs text-neutral-600 font-medium block">Approved</span>
              <span className="text-xl font-bold font-mono tabular-nums text-neutral-900">
                {applications.filter(a => a.status === 'approved' || a.status === 'lease_signed').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Applications List, Right Detail & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Applications List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
              {userRole === 'landlord' ? 'Incoming Applicants' : 'Submitted Applications'} ({applications.length})
            </h2>
          </div>

          <div className="space-y-2.5">
            {applications.map(app => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-xl border bg-white cursor-pointer transition-all duration-150 ${
                    isSelected 
                      ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xs' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {app.applicantName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1">
                          {userRole === 'landlord' ? app.applicantName : app.propertyTitle}
                        </h3>
                        <p className="text-xs text-neutral-500 truncate max-w-[200px]">
                          {userRole === 'landlord' ? app.propertyTitle : app.propertyAddress}
                        </p>
                      </div>
                    </div>

                    {getStatusBadge(app.status)}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span className="font-mono tabular-nums text-neutral-900 font-semibold">
                      ${app.propertyRent}/mo
                    </span>
                    {app.voucherHolder && (
                      <span className="text-red-600 font-medium">✓ Voucher Holder (${app.voucherSubsidyAmount}/mo)</span>
                    )}
                    <span>
                      {new Date(app.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Application Detail & Progress Tracker */}
        {selectedApp ? (
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusBadge(selectedApp.status)}
                    <span className="text-xs text-neutral-400">
                      ID: <span className="font-mono">{selectedApp.id}</span>
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    {selectedApp.propertyTitle}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {selectedApp.propertyAddress} · Rent: <span className="font-mono tabular-nums font-semibold text-neutral-800">${selectedApp.propertyRent}/mo</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenChat(selectedApp.propertyId, selectedApp.applicantName)}
                    className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Secure Message</span>
                  </button>
                </div>
              </div>

              {/* Real-time Status Tracker Timeline */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-xs font-bold text-neutral-800 block mb-4">
                  Application Verification & Pipeline
                </span>

                <div className="relative">
                  {/* Connection Line */}
                  <div className="hidden sm:block absolute top-3.5 left-4 right-4 h-0.5 bg-neutral-200" />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {STATUS_STEPS.map((step, idx) => {
                      const currentProgress = getStepProgressIndex(selectedApp.status);
                      const isComplete = currentProgress > idx;
                      const isCurrent = currentProgress === idx;

                      return (
                        <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 relative">
                          <div 
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors z-10 ${
                              isComplete 
                                ? 'bg-blue-600 text-white shadow-xs' 
                                : isCurrent 
                                  ? 'bg-red-600 text-white ring-4 ring-red-100' 
                                  : 'bg-white text-neutral-400 border border-neutral-300'
                            }`}
                          >
                            {isComplete ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <div>
                            <span className={`text-xs font-semibold block leading-tight ${isCurrent ? 'text-red-700' : 'text-neutral-700'}`}>
                              {step.label}
                            </span>
                            <span className="text-[10px] text-neutral-400 hidden sm:block mt-0.5">
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedApp.tourDateTime && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2.5 text-xs text-red-900">
                    <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                    <div>
                      <span className="font-semibold">Walkthrough Tour Scheduled: </span>
                      <span>{selectedApp.tourDateTime}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Applicant Financial Profile & Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-2">
                  <span className="text-xs font-bold text-neutral-900 block mb-1">
                    Applicant Identity & Employment
                  </span>
                  <div className="text-xs text-neutral-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Applicant:</span>
                      <span className="font-semibold text-neutral-900">{selectedApp.applicantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Contact Email:</span>
                      <span className="font-mono">{selectedApp.applicantEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Phone:</span>
                      <span>{selectedApp.applicantPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Employer:</span>
                      <span>{selectedApp.employerName} ({selectedApp.jobTitle})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Household Size:</span>
                      <span>{selectedApp.householdSize} Member(s)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-2">
                  <span className="text-xs font-bold text-neutral-900 block mb-1">
                    Financial Verification & Subsidy
                  </span>
                  <div className="text-xs text-neutral-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Monthly Gross Income:</span>
                      <span className="font-mono font-semibold text-neutral-900">${selectedApp.monthlyIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Credit Score Tier:</span>
                      <span>{selectedApp.creditScoreRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Housing Voucher:</span>
                      <span className={selectedApp.voucherHolder ? "text-red-600 font-bold" : "text-neutral-600"}>
                        {selectedApp.voucherHolder ? `Yes (Covering $${selectedApp.voucherSubsidyAmount}/mo)` : 'None (Self-paying)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Verification Status:</span>
                      <span className="text-blue-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Hunt & Hold Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Statement */}
              {selectedApp.messageToLandlord && (
                <div>
                  <span className="text-xs font-bold text-neutral-900 block mb-1">
                    Applicant Introduction:
                  </span>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 leading-relaxed italic">
                    "{selectedApp.messageToLandlord}"
                  </div>
                </div>
              )}

              {/* Landlord Action Bar */}
              <div className="pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-neutral-500">
                  Application submitted {new Date(selectedApp.submittedAt).toLocaleDateString()}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {userRole === 'landlord' && (
                    <>
                      {selectedApp.status !== 'tour_scheduled' && selectedApp.status !== 'approved' && selectedApp.status !== 'lease_signed' && (
                        <button
                          type="button"
                          onClick={() => setShowScheduleModal(true)}
                          className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5 text-red-600" />
                          <span>Schedule Tour</span>
                        </button>
                      )}

                      {selectedApp.status !== 'approved' && selectedApp.status !== 'lease_signed' && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(selectedApp.id, 'approved')}
                          className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Applicant</span>
                        </button>
                      )}
                    </>
                  )}

                  {/* Create or View Digital Lease Agreement */}
                  <button
                    type="button"
                    onClick={() => onOpenLease(selectedApp.id)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>
                      {selectedApp.status === 'lease_signed' 
                        ? 'View Executed Lease' 
                        : 'Generate / Sign Digital Lease'}
                    </span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-500">
            No application selected.
          </div>
        )}

      </div>

      {/* Tour Scheduling Modal */}
      {showScheduleModal && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-neutral-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">Schedule In-Person Walkthrough</h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-600">
              Invite <strong>{selectedApp.applicantName}</strong> to view <strong>{selectedApp.propertyTitle}</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Walkthrough Date & Time
              </label>
              <input
                type="text"
                value={tourInput}
                onChange={(e) => setTourInput(e.target.value)}
                placeholder="e.g. 2026-10-02 at 3:00 PM CST"
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus(selectedApp.id, 'tour_scheduled', tourInput);
                  setShowScheduleModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs"
              >
                Confirm & Notify Applicant
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
