export type PropertyType = 'Apartment' | 'Studio' | 'Single Family' | 'Townhouse' | 'Duplex' | 'Shared Room';

export type PropertyStatus = 'vacant' | 'application_pending' | 'leased';

export interface PropertyListing {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  rentMonthly: number;
  securityDeposit: number;
  utilitiesIncluded: boolean;
  utilitiesList: string[];
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  acceptsVouchers: boolean; // Section 8 / Housing Choice Voucher
  incomeRestricted: boolean; // Affordable AMI cap
  maxHouseholdIncome?: number; // e.g. $48,000/yr
  status: PropertyStatus;
  availableDate: string;
  images: string[];
  amenities: string[];
  landlordId: string;
  landlordName: string;
  landlordCompany?: string;
  landlordVerified: boolean;
  landlordRating: number;
  landlordBadge: string;
  createdAt: string;
}

export interface LandlordProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  avatarUrl: string;
  verifiedStatus: 'verified' | 'pending' | 'basic';
  badgeTier: string;
  propertiesListedCount: number;
  responseRate: number; // e.g. 98%
  avgResponseTimeHours: number; // e.g. 1.2
  verificationDocs: {
    deedVerified: boolean;
    identityVerified: boolean;
    backgroundChecked: boolean;
    fairHousingCertified: boolean;
  };
  memberSince: string;
  rating: number;
  reviewsCount: number;
  subscriptionActive: boolean;
  subscriptionPlan?: string;
}

export type ApplicationStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'tour_scheduled' 
  | 'approved' 
  | 'lease_generated' 
  | 'lease_signed' 
  | 'rejected';

export interface RentalApplication {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyRent: number;
  propertyImage: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  householdSize: number;
  monthlyIncome: number;
  creditScoreRange: string;
  voucherHolder: boolean;
  voucherSubsidyAmount?: number;
  employerName: string;
  jobTitle: string;
  messageToLandlord: string;
  submittedAt: string;
  status: ApplicationStatus;
  tourDateTime?: string;
  landlordNotes?: string;
  leaseId?: string;
  applicantVerified: boolean;
}

export interface LeaseAgreement {
  id: string;
  applicationId?: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  landlordId: string;
  landlordName: string;
  tenantId: string;
  tenantName: string;
  monthlyRent: number;
  securityDeposit: number;
  paymentDueDay: number; // e.g. 1st of month
  termMonths: number;
  startDate: string;
  endDate: string;
  utilitiesResponsibility: string;
  rules: string[];
  landlordSigned: boolean;
  landlordSignedAt?: string;
  landlordSignature?: string;
  tenantSigned: boolean;
  tenantSignedAt?: string;
  tenantSignature?: string;
  status: 'draft' | 'pending_tenant' | 'pending_landlord' | 'active' | 'expired';
}

export interface RentReminder {
  id: string;
  leaseId: string;
  propertyTitle: string;
  propertyAddress: string;
  amount: number;
  dueDate: string;
  leadDaysNotice: number;
  reminderMethods: ('email' | 'in_app' | 'browser')[];
  isPaid: boolean;
  paidDate?: string;
  paymentMethod?: string;
  receiptNumber?: string;
}

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'tenant' | 'landlord';
  text: string;
  timestamp: string;
  attachmentName?: string;
  isEncrypted: boolean;
}

export interface SecureThread {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  tenantId: string;
  tenantName: string;
  landlordId: string;
  landlordName: string;
  messages: MessageItem[];
  lastUpdated: string;
  unreadTenant: number;
  unreadLandlord: number;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  maxRent: number;
  bedrooms: string; // 'all' | '0' | '1' | '2' | '3+'
  propertyType: string; // 'all' | PropertyType
  onlyVouchers: boolean;
  onlyIncomeRestricted: boolean;
  onlyUtilitiesIncluded: boolean;
  onlyVerifiedLandlords: boolean;
  radiusMiles: number;
  userLat?: number;
  userLng?: number;
  sortBy: 'lowest_rent' | 'newest' | 'beds' | 'verified';
}
