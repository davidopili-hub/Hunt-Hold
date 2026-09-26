import React from 'react';
import { 
  Building2, 
  MapPin, 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  Bell, 
  PlusCircle, 
  WifiOff, 
  Wifi, 
  Sparkles,
  Users
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'explore' | 'applications' | 'leases' | 'messages' | 'landlords';
  setCurrentTab: (tab: 'explore' | 'applications' | 'leases' | 'messages' | 'landlords') => void;
  userRole: 'tenant' | 'landlord';
  setUserRole: (role: 'tenant' | 'landlord') => void;
  onOpenPostVacancy: () => void;
  onOpenReminders: () => void;
  onOpenSubscription: () => void;
  isOfflineSimulated: boolean;
  onToggleOffline: () => void;
  unreadMessagesCount: number;
  pendingRemindersCount: number;
  isPremiumVerified: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  onOpenPostVacancy,
  onOpenReminders,
  onOpenSubscription,
  isOfflineSimulated,
  onToggleOffline,
  unreadMessagesCount,
  pendingRemindersCount,
  isPremiumVerified
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single Brand element */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('explore')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-800 transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-blue-700 transition-colors">
                  Hunt & Hold
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                  Affordable Housing
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('explore')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'explore'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-neutral-600 hover:text-blue-700 hover:bg-neutral-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Find Housing</span>
            </button>

            <button
              onClick={() => setCurrentTab('applications')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 relative ${
                currentTab === 'applications'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-neutral-600 hover:text-blue-700 hover:bg-neutral-50'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Applications</span>
            </button>

            <button
              onClick={() => setCurrentTab('leases')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'leases'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-neutral-600 hover:text-blue-700 hover:bg-neutral-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Leases</span>
            </button>

            <button
              onClick={() => setCurrentTab('messages')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 relative ${
                currentTab === 'messages'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-neutral-600 hover:text-blue-700 hover:bg-neutral-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Secure Chat</span>
              {unreadMessagesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-600" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('landlords')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentTab === 'landlords'
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'text-neutral-600 hover:text-blue-700 hover:bg-neutral-50'
              }`}
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Verified Providers</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Offline Simulation Toggle */}
            <button
              onClick={onToggleOffline}
              title={isOfflineSimulated ? "Currently in Offline Mode (Serving Cached Listings)" : "Simulate Offline Mode"}
              className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                isOfflineSimulated 
                  ? 'bg-red-50 border-red-300 text-red-700 font-semibold' 
                  : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {isOfflineSimulated ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-red-600" />
                  <span className="hidden sm:inline">Offline Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Online</span>
                </>
              )}
            </button>

            {/* Rent Reminder Bell */}
            <button
              onClick={onOpenReminders}
              title="Automated Rent Payment Reminders"
              className="relative p-2 rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {pendingRemindersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {pendingRemindersCount}
                </span>
              )}
            </button>

            {/* Verification Pass / Subscription Button */}
            <button
              onClick={onOpenSubscription}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors ${
                isPremiumVerified
                  ? 'bg-blue-600 border-blue-700 text-white shadow-xs'
                  : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden lg:inline">
                {isPremiumVerified ? 'Verified Pass' : 'Get Verified'}
              </span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-xs">
              <button
                onClick={() => setUserRole('tenant')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  userRole === 'tenant'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Tenant
              </button>
              <button
                onClick={() => setUserRole('landlord')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  userRole === 'landlord'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Landlord
              </button>
            </div>

            {/* Post Vacant House Button - High visual punch with Red / Blue styling */}
            <button
              onClick={onOpenPostVacancy}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 sm:px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Post Vacancy</span>
              <span className="sm:hidden">Post</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-neutral-100 text-xs text-neutral-600">
          <button
            onClick={() => setCurrentTab('explore')}
            className={`flex flex-col items-center py-1 ${currentTab === 'explore' ? 'text-blue-700 font-semibold' : ''}`}
          >
            <MapPin className="w-4 h-4 mb-0.5" />
            <span>Search</span>
          </button>
          <button
            onClick={() => setCurrentTab('applications')}
            className={`flex flex-col items-center py-1 ${currentTab === 'applications' ? 'text-blue-700 font-semibold' : ''}`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span>Applications</span>
          </button>
          <button
            onClick={() => setCurrentTab('leases')}
            className={`flex flex-col items-center py-1 ${currentTab === 'leases' ? 'text-blue-700 font-semibold' : ''}`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            <span>Leases</span>
          </button>
          <button
            onClick={() => setCurrentTab('messages')}
            className={`flex flex-col items-center py-1 relative ${currentTab === 'messages' ? 'text-blue-700 font-semibold' : ''}`}
          >
            <MessageSquare className="w-4 h-4 mb-0.5" />
            <span>Chat</span>
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-600" />
            )}
          </button>
          <button
            onClick={() => setCurrentTab('landlords')}
            className={`flex flex-col items-center py-1 ${currentTab === 'landlords' ? 'text-blue-700 font-semibold' : ''}`}
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span>Landlords</span>
          </button>
        </div>

      </div>
    </header>
  );
};
