import { 
  PropertyListing, 
  RentalApplication, 
  LeaseAgreement, 
  RentReminder, 
  SecureThread, 
  LandlordProfile,
  MessageItem
} from '../types';
import { 
  INITIAL_LISTINGS, 
  INITIAL_APPLICATIONS, 
  INITIAL_LEASES, 
  INITIAL_REMINDERS, 
  INITIAL_THREADS, 
  INITIAL_LANDLORDS 
} from '../data/mockData';

const KEYS = {
  LISTINGS: 'civicnest_listings_v1',
  APPLICATIONS: 'civicnest_applications_v1',
  LEASES: 'civicnest_leases_v1',
  REMINDERS: 'civicnest_reminders_v1',
  THREADS: 'civicnest_threads_v1',
  LANDLORDS: 'civicnest_landlords_v1',
  SAVED_IDS: 'civicnest_saved_listings_v1',
  USER_ROLE: 'civicnest_user_role_v1',
  TENANT_SUB: 'civicnest_tenant_sub_v1',
  LANDLORD_SUB: 'civicnest_landlord_sub_v1',
  OFFLINE_SIM: 'civicnest_offline_sim_v1'
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Storage parse error for ${key}:`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Storage save error for ${key}:`, e);
  }
}

// Listings
export function getListings(): PropertyListing[] {
  return getStored<PropertyListing[]>(KEYS.LISTINGS, INITIAL_LISTINGS);
}

export function saveListings(listings: PropertyListing[]): void {
  setStored(KEYS.LISTINGS, listings);
}

export function addListing(listing: PropertyListing): void {
  const current = getListings();
  const updated = [listing, ...current];
  saveListings(updated);
}

export function updateListing(id: string, partial: Partial<PropertyListing>): void {
  const current = getListings();
  const updated = current.map(item => item.id === id ? { ...item, ...partial } : item);
  saveListings(updated);
}

// Applications
export function getApplications(): RentalApplication[] {
  return getStored<RentalApplication[]>(KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
}

export function saveApplications(apps: RentalApplication[]): void {
  setStored(KEYS.APPLICATIONS, apps);
}

export function addApplication(app: RentalApplication): void {
  const current = getApplications();
  saveApplications([app, ...current]);
}

export function updateApplicationStatus(
  appId: string, 
  status: RentalApplication['status'], 
  tourDateTime?: string,
  landlordNotes?: string
): void {
  const current = getApplications();
  const updated = current.map(app => {
    if (app.id === appId) {
      return {
        ...app,
        status,
        ...(tourDateTime ? { tourDateTime } : {}),
        ...(landlordNotes ? { landlordNotes } : {})
      };
    }
    return app;
  });
  saveApplications(updated);
}

// Leases
export function getLeases(): LeaseAgreement[] {
  return getStored<LeaseAgreement[]>(KEYS.LEASES, INITIAL_LEASES);
}

export function saveLeases(leases: LeaseAgreement[]): void {
  setStored(KEYS.LEASES, leases);
}

export function addLease(lease: LeaseAgreement): void {
  const current = getLeases();
  saveLeases([lease, ...current]);
}

export function signLease(leaseId: string, role: 'tenant' | 'landlord', signature: string): LeaseAgreement | null {
  const current = getLeases();
  let updatedLease: LeaseAgreement | null = null;
  const updated = current.map(lease => {
    if (lease.id === leaseId) {
      const now = new Date().toISOString();
      if (role === 'tenant') {
        const isBothSigned = lease.landlordSigned;
        updatedLease = {
          ...lease,
          tenantSigned: true,
          tenantSignedAt: now,
          tenantSignature: signature,
          status: isBothSigned ? 'active' : 'pending_landlord'
        };
        return updatedLease;
      } else {
        const isBothSigned = lease.tenantSigned;
        updatedLease = {
          ...lease,
          landlordSigned: true,
          landlordSignedAt: now,
          landlordSignature: signature,
          status: isBothSigned ? 'active' : 'pending_tenant'
        };
        return updatedLease;
      }
    }
    return lease;
  });
  saveLeases(updated);
  return updatedLease;
}

// Rent Reminders
export function getReminders(): RentReminder[] {
  return getStored<RentReminder[]>(KEYS.REMINDERS, INITIAL_REMINDERS);
}

export function saveReminders(reminders: RentReminder[]): void {
  setStored(KEYS.REMINDERS, reminders);
}

export function markReminderPaid(reminderId: string, method: string): RentReminder | null {
  const current = getReminders();
  let updatedRem: RentReminder | null = null;
  const updated = current.map(r => {
    if (r.id === reminderId) {
      updatedRem = {
        ...r,
        isPaid: true,
        paidDate: new Date().toISOString().split('T')[0],
        paymentMethod: method,
        receiptNumber: `CN-RCP-${Math.floor(100000 + Math.random() * 900000)}`
      };
      return updatedRem;
    }
    return r;
  });
  saveReminders(updated);
  return updatedRem;
}

export function addReminder(reminder: RentReminder): void {
  const current = getReminders();
  saveReminders([reminder, ...current]);
}

// Secure Messaging Threads
export function getThreads(): SecureThread[] {
  return getStored<SecureThread[]>(KEYS.THREADS, INITIAL_THREADS);
}

export function saveThreads(threads: SecureThread[]): void {
  setStored(KEYS.THREADS, threads);
}

export function addMessageToThread(threadId: string, message: MessageItem): void {
  const current = getThreads();
  const updated = current.map(t => {
    if (t.id === threadId) {
      return {
        ...t,
        messages: [...t.messages, message],
        lastUpdated: new Date().toISOString(),
        unreadTenant: message.senderRole === 'landlord' ? t.unreadTenant + 1 : t.unreadTenant,
        unreadLandlord: message.senderRole === 'tenant' ? t.unreadLandlord + 1 : t.unreadLandlord
      };
    }
    return t;
  });
  saveThreads(updated);
}

export function createOrGetThread(
  property: PropertyListing,
  tenantId: string = 'tenant_current',
  tenantName: string = 'Jordan Taylor'
): SecureThread {
  const threads = getThreads();
  const existing = threads.find(t => t.propertyId === property.id && t.tenantId === tenantId);
  if (existing) return existing;

  const newThread: SecureThread = {
    id: `thread_${Date.now()}`,
    propertyId: property.id,
    propertyTitle: property.title,
    propertyAddress: `${property.address}, ${property.city}`,
    tenantId,
    tenantName,
    landlordId: property.landlordId,
    landlordName: property.landlordName,
    lastUpdated: new Date().toISOString(),
    unreadTenant: 0,
    unreadLandlord: 1,
    messages: [
      {
        id: `msg_init_${Date.now()}`,
        senderId: tenantId,
        senderName: tenantName,
        senderRole: 'tenant',
        text: `Hello ${property.landlordName}, I am very interested in "${property.title}". Is this vacant unit still available for an affordable housing application?`,
        timestamp: new Date().toISOString(),
        isEncrypted: true
      }
    ]
  };

  saveThreads([newThread, ...threads]);
  return newThread;
}

// Landlord Profiles
export function getLandlords(): LandlordProfile[] {
  return getStored<LandlordProfile[]>(KEYS.LANDLORDS, INITIAL_LANDLORDS);
}

export function saveLandlords(landlords: LandlordProfile[]): void {
  setStored(KEYS.LANDLORDS, landlords);
}

// Saved Listings for Offline Access
export function getSavedListingIds(): string[] {
  return getStored<string[]>(KEYS.SAVED_IDS, ['prop_1', 'prop_2']);
}

export function toggleSavedListing(id: string): boolean {
  const current = getSavedListingIds();
  let updated: string[];
  let isSaved = false;
  if (current.includes(id)) {
    updated = current.filter(item => item !== id);
    isSaved = false;
  } else {
    updated = [...current, id];
    isSaved = true;
  }
  setStored(KEYS.SAVED_IDS, updated);
  return isSaved;
}

// Subscriptions
export function getTenantSubscription(): boolean {
  return getStored<boolean>(KEYS.TENANT_SUB, true);
}

export function setTenantSubscription(active: boolean): void {
  setStored(KEYS.TENANT_SUB, active);
}

export function getLandlordSubscription(): boolean {
  return getStored<boolean>(KEYS.LANDLORD_SUB, true);
}

export function setLandlordSubscription(active: boolean): void {
  setStored(KEYS.LANDLORD_SUB, active);
}

// Offline Mode Simulation
export function getOfflineSimulation(): boolean {
  return getStored<boolean>(KEYS.OFFLINE_SIM, false);
}

export function setOfflineSimulation(active: boolean): void {
  setStored(KEYS.OFFLINE_SIM, active);
}

// Distance Calculation (Haversine formula in miles)
export function calculateDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}
