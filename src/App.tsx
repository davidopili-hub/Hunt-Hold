/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  PropertyListing, 
  RentalApplication, 
  LeaseAgreement, 
  RentReminder, 
  SecureThread, 
  LandlordProfile, 
  ApplicationStatus,
  MessageItem 
} from './types';
import { 
  getListings, 
  addListing, 
  getApplications, 
  addApplication, 
  updateApplicationStatus, 
  getLeases, 
  signLease, 
  getReminders, 
  markReminderPaid, 
  getThreads, 
  addMessageToThread, 
  createOrGetThread, 
  getLandlords, 
  getSavedListingIds, 
  toggleSavedListing, 
  getTenantSubscription, 
  setTenantSubscription, 
  getLandlordSubscription, 
  setLandlordSubscription, 
  getOfflineSimulation, 
  setOfflineSimulation 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { OfflineBanner } from './components/OfflineBanner';
import { HousingExplorerView } from './components/HousingExplorerView';
import { ApplicationsDashboard } from './components/ApplicationsDashboard';
import { LeasesView } from './components/LeasesView';
import { LandlordDirectoryView } from './components/LandlordDirectoryView';
import { ListingDetailModal } from './components/ListingDetailModal';
import { PostVacancyModal } from './components/PostVacancyModal';
import { RentalApplicationModal } from './components/RentalApplicationModal';
import { LeaseManagementModal } from './components/LeaseManagementModal';
import { RentRemindersModal } from './components/RentRemindersModal';
import { SecureMessengerModal } from './components/SecureMessengerModal';
import { LandlordProfileModal } from './components/LandlordProfileModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SavedOfflineModal } from './components/SavedOfflineModal';

export default function App() {
  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<'explore' | 'applications' | 'leases' | 'messages' | 'landlords'>('explore');
  const [userRole, setUserRole] = useState<'tenant' | 'landlord'>('tenant');
  
  // Data State
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [leases, setLeases] = useState<LeaseAgreement[]>([]);
  const [reminders, setReminders] = useState<RentReminder[]>([]);
  const [threads, setThreads] = useState<SecureThread[]>([]);
  const [landlords, setLandlords] = useState<LandlordProfile[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isTenantSubActive, setIsTenantSubActive] = useState<boolean>(true);
  const [isLandlordSubActive, setIsLandlordSubActive] = useState<boolean>(true);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);

  // User Geolocation
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 30.275,
    lng: -97.735
  });

  // Modals State
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);
  const [isPostVacancyOpen, setIsPostVacancyOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyListing, setApplyListing] = useState<PropertyListing | null>(null);
  const [activeLeaseForModal, setActiveLeaseForModal] = useState<LeaseAgreement | null>(null);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatThreadId, setActiveChatThreadId] = useState<string | undefined>(undefined);
  const [selectedLandlordForModal, setSelectedLandlordForModal] = useState<LandlordProfile | null>(null);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isSavedOfflineOpen, setIsSavedOfflineOpen] = useState(false);

  // Load Initial Storage Data
  useEffect(() => {
    setListings(getListings());
    setApplications(getApplications());
    setLeases(getLeases());
    setReminders(getReminders());
    setThreads(getThreads());
    setLandlords(getLandlords());
    setSavedIds(getSavedListingIds());
    setIsTenantSubActive(getTenantSubscription());
    setIsLandlordSubActive(getLandlordSubscription());
    setIsOfflineSimulated(getOfflineSimulation());

    // Try HTML5 Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fallback to central Austin hub
          setUserCoords({ lat: 30.275, lng: -97.735 });
        },
        { timeout: 4000 }
      );
    }
  }, []);

  // Handlers
  const handleToggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleSavedListing(id);
    setSavedIds(getSavedListingIds());
  };

  const handleListingCreated = (newListing: PropertyListing) => {
    addListing(newListing);
    setListings(getListings());
    setSelectedListing(newListing);
  };

  const handleOpenApply = (listing: PropertyListing, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setApplyListing(listing);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = (app: RentalApplication) => {
    addApplication(app);
    setApplications(getApplications());
    setCurrentTab('applications');
  };

  const handleUpdateApplicationStatus = (
    appId: string, 
    status: ApplicationStatus, 
    tourDateTime?: string,
    notes?: string
  ) => {
    updateApplicationStatus(appId, status, tourDateTime, notes);
    setApplications(getApplications());
  };

  const handleOpenLeaseForApp = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    // Check if lease already exists
    let existingLease = leases.find(l => l.applicationId === appId || l.propertyId === app.propertyId);
    if (!existingLease) {
      // Create new draft lease
      const newLease: LeaseAgreement = {
        id: `lease_${Date.now()}`,
        applicationId: app.id,
        propertyId: app.propertyId,
        propertyTitle: app.propertyTitle,
        propertyAddress: app.propertyAddress,
        landlordId: 'landlord_1',
        landlordName: 'Elena Rostova',
        tenantId: app.applicantId,
        tenantName: app.applicantName,
        monthlyRent: app.propertyRent,
        securityDeposit: Math.round(app.propertyRent * 0.5),
        paymentDueDay: 1,
        termMonths: 12,
        startDate: '2026-10-01',
        endDate: '2027-09-30',
        utilitiesResponsibility: 'Water, municipal trash and high-speed fiber internet provided by landlord.',
        rules: [
          'Quiet hours between 10:00 PM and 7:00 AM.',
          'Zero unauthorized surcharges or discriminatory fees for voucher payments.',
          'Smoke-free premises with designated outdoor courtyard zones.',
          'Rent due on the 1st with a 5-day grace period before notification dispatch.'
        ],
        landlordSigned: userRole === 'landlord',
        landlordSignedAt: userRole === 'landlord' ? new Date().toISOString() : undefined,
        landlordSignature: userRole === 'landlord' ? 'Elena Rostova (Verified Provider)' : undefined,
        tenantSigned: userRole === 'tenant',
        tenantSignedAt: userRole === 'tenant' ? new Date().toISOString() : undefined,
        tenantSignature: userRole === 'tenant' ? app.applicantName : undefined,
        status: 'pending_tenant'
      };
      setLeases([newLease, ...leases]);
      setActiveLeaseForModal(newLease);
    } else {
      setActiveLeaseForModal(existingLease);
    }
  };

  const handleSignLease = (leaseId: string, role: 'tenant' | 'landlord', signature: string) => {
    const updated = signLease(leaseId, role, signature);
    setLeases(getLeases());
    if (updated) {
      setActiveLeaseForModal(updated);
    }
  };

  const handleMarkPaid = (reminderId: string, method: string) => {
    markReminderPaid(reminderId, method);
    setReminders(getReminders());
  };

  const handleSendMessage = (threadId: string, message: MessageItem) => {
    addMessageToThread(threadId, message);
    setThreads(getThreads());
  };

  const handleStartChatFromListing = (listing: PropertyListing) => {
    const thread = createOrGetThread(listing);
    setThreads(getThreads());
    setActiveChatThreadId(thread.id);
    setIsChatOpen(true);
  };

  const handleOpenChatFromApp = (propertyId: string, applicantName: string) => {
    const property = listings.find(l => l.id === propertyId);
    if (!property) return;
    const thread = createOrGetThread(property, 'tenant_current', applicantName);
    setThreads(getThreads());
    setActiveChatThreadId(thread.id);
    setIsChatOpen(true);
  };

  const handleViewLandlordProfile = (landlordId: string) => {
    const found = landlords.find(l => l.id === landlordId) || landlords[0];
    setSelectedLandlordForModal(found);
  };

  const handleToggleOffline = () => {
    const next = !isOfflineSimulated;
    setIsOfflineSimulated(next);
    setOfflineSimulation(next);
  };

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setUserCoords({ lat: 30.275, lng: -97.735 });
        }
      );
    }
  };

  // Saved listings for offline
  const savedListings = listings.filter(l => savedIds.includes(l.id));

  // Compute unread and pending counters
  const unreadMessagesCount = threads.reduce((acc, t) => 
    acc + (userRole === 'tenant' ? t.unreadTenant : t.unreadLandlord), 0
  );
  const pendingRemindersCount = reminders.filter(r => !r.isPaid).length;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Offline Mode Banner */}
      <OfflineBanner
        isOffline={isOfflineSimulated}
        savedCount={savedListings.length}
        onOpenSavedListings={() => setIsSavedOfflineOpen(true)}
        onToggleOffline={handleToggleOffline}
      />

      {/* Top Navigation Bar: Blue, Red, and White */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenPostVacancy={() => setIsPostVacancyOpen(true)}
        onOpenReminders={() => setIsRemindersOpen(true)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        isOfflineSimulated={isOfflineSimulated}
        onToggleOffline={handleToggleOffline}
        unreadMessagesCount={unreadMessagesCount}
        pendingRemindersCount={pendingRemindersCount}
        isPremiumVerified={userRole === 'tenant' ? isTenantSubActive : isLandlordSubActive}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Find Housing Explorer Tab */}
        {currentTab === 'explore' && (
          <HousingExplorerView
            listings={listings}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onSelectListing={(listing) => setSelectedListing(listing)}
            onOpenApply={handleOpenApply}
            selectedListing={selectedListing}
            onLocateUser={handleLocateUser}
            userCoords={userCoords}
          />
        )}

        {/* Applications Dashboard Tab */}
        {currentTab === 'applications' && (
          <ApplicationsDashboard
            applications={applications}
            userRole={userRole}
            onUpdateStatus={handleUpdateApplicationStatus}
            onOpenLease={handleOpenLeaseForApp}
            onOpenChat={handleOpenChatFromApp}
          />
        )}

        {/* Leases Overview Tab */}
        {currentTab === 'leases' && (
          <LeasesView
            leases={leases}
            userRole={userRole}
            onSelectLease={(lease) => setActiveLeaseForModal(lease)}
            onOpenNewLease={() => {
              if (applications[0]) {
                handleOpenLeaseForApp(applications[0].id);
              } else {
                setActiveLeaseForModal(leases[0]);
              }
            }}
          />
        )}

        {/* Secure Messaging Tab */}
        {currentTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden h-[750px] flex flex-col">
            <SecureMessengerModal
              isOpen={true}
              onClose={() => setCurrentTab('explore')}
              threads={threads}
              activeThreadId={activeChatThreadId}
              userRole={userRole}
              onSendMessage={handleSendMessage}
            />
          </div>
        )}

        {/* Verified Landlord Directory Tab */}
        {currentTab === 'landlords' && (
          <LandlordDirectoryView
            landlords={landlords}
            onSelectLandlord={(landlord) => setSelectedLandlordForModal(landlord)}
            onOpenSubscription={() => setIsSubscriptionOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-12 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">Hunt & Hold</span>
            <span>· Equitable Housing & Real-Time Vacancy Exchange</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-500">
            <span>Fair Housing Compliant</span>
            <span>·</span>
            <span>Section 8 Voucher Partner</span>
            <span>·</span>
            <span>256-bit Encrypted</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      
      {/* Listing Detail Modal */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onApply={(listing) => {
          setSelectedListing(null);
          handleOpenApply(listing);
        }}
        onMessageLandlord={handleStartChatFromListing}
        onViewLandlordProfile={handleViewLandlordProfile}
        isSaved={selectedListing ? savedIds.includes(selectedListing.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Post Vacant Property Modal */}
      <PostVacancyModal
        isOpen={isPostVacancyOpen}
        onClose={() => setIsPostVacancyOpen(false)}
        onListingCreated={handleListingCreated}
      />

      {/* Rental Application Submission Modal */}
      <RentalApplicationModal
        listing={applyListing}
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setApplyListing(null);
        }}
        onSubmitApplication={handleSubmitApplication}
        isTenantVerified={isTenantSubActive}
      />

      {/* Digital Lease Management Modal */}
      <LeaseManagementModal
        lease={activeLeaseForModal}
        userRole={userRole}
        onClose={() => setActiveLeaseForModal(null)}
        onSignLease={handleSignLease}
      />

      {/* Automated Rent Reminders Modal */}
      <RentRemindersModal
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        reminders={reminders}
        onMarkPaid={handleMarkPaid}
      />

      {/* Secure Messenger Floating Modal (when opened from buttons outside messages tab) */}
      {isChatOpen && currentTab !== 'messages' && (
        <SecureMessengerModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          threads={threads}
          activeThreadId={activeChatThreadId}
          userRole={userRole}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* Verified Landlord Trust Profile Modal */}
      <LandlordProfileModal
        landlord={selectedLandlordForModal}
        listings={listings}
        isOpen={Boolean(selectedLandlordForModal)}
        onClose={() => setSelectedLandlordForModal(null)}
        onSelectProperty={(listing) => {
          setSelectedLandlordForModal(null);
          setSelectedListing(listing);
        }}
        onOpenSubscription={() => {
          setSelectedLandlordForModal(null);
          setIsSubscriptionOpen(true);
        }}
      />

      {/* Premium Verification Services Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        userRole={userRole}
        isTenantSubActive={isTenantSubActive}
        isLandlordSubActive={isLandlordSubActive}
        onToggleTenantSub={(active) => {
          setIsTenantSubActive(active);
          setTenantSubscription(active);
        }}
        onToggleLandlordSub={(active) => {
          setIsLandlordSubActive(active);
          setLandlordSubscription(active);
        }}
      />

      {/* Saved Offline Listings Modal */}
      <SavedOfflineModal
        isOpen={isSavedOfflineOpen}
        onClose={() => setIsSavedOfflineOpen(false)}
        savedListings={savedListings}
        onSelectListing={(listing) => setSelectedListing(listing)}
        onRemoveSaved={handleToggleSave}
      />

    </div>
  );
}
