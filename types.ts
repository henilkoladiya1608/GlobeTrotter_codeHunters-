export type LanguageCode =
  | "en"
  | "hi"
  | "bn"
  | "ta"
  | "te"
  | "mr"
  | "gu"
  | "kn"
  | "ml"
  | "pa"
  | "or";

export type Region =
  | "All"
  | "North India"
  | "South India"
  | "West India"
  | "East & North East"
  | "Central India"
  | "Islands";

export type TripStatus = "Booked" | "Planning" | "In Progress" | "Completed" | "Draft";

export type ActivityCategory =
  | "Transit"
  | "Sightseeing"
  | "Food"
  | "Adventure"
  | "Culture"
  | "Spiritual"
  | "Stay"
  | "Relaxation"
  | "Shopping";

export interface Activity {
  id: string;
  time: string;
  title: string;
  location: string;
  category: ActivityCategory;
  description: string;
  estimatedCostINR: number;
  duration?: string;
  bookingRef?: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface DayItinerary {
  dayNumber: number;
  dateStr?: string;
  title: string;
  theme?: string;
  activities: Activity[];
}

export type ExpenseCategory =
  | "Transport"
  | "Accommodation"
  | "Meals & Dining"
  | "Activities"
  | "Shopping"
  | "Others";

export type PaymentMethod =
  | "UPI / GPay / PhonePe"
  | "UPI"
  | "Credit / Debit Card"
  | "Credit Card"
  | "Debit Card"
  | "Cash (INR)"
  | "Cash"
  | "Net Banking";

export interface TripExpense {
  id: string;
  date: string;
  title: string;
  category: ExpenseCategory;
  amountINR: number;
  paymentMethod: PaymentMethod;
  paidBy?: string;
  receiptNote?: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  state: string;
  region: Region;
  startDate: string;
  endDate: string;
  durationDays: number;
  budgetINR: number;
  spentINR: number;
  status: TripStatus;
  coverImage: string;
  description: string;
  travelersCount: number;
  tags: string[];
  days: DayItinerary[];
  expenses: TripExpense[];
  savedNotes?: string;
  collaborators?: string[];
  createdAt: string;
}

export interface Destination {
  id: string;
  name: string;
  state: string;
  region: Region;
  tagline: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  rating: number;
  reviewCount: number;
  costIndex: "₹" | "₹₹" | "₹₹₹";
  avgDailyCostINR: number;
  bestTimeToVisit: string;
  idealDuration: string;
  travelStyles: string[];
  topAttractions: string[];
  signatureCuisine: string[];
  localTransitTips: string[];
  localLanguage: string;
  localPhrases: { phrase: string; meaning: string; pronunciation: string }[];
  isFeatured?: boolean;
}

export interface Experience {
  id: string;
  title: string;
  destination: string;
  state: string;
  region: Region;
  category: "Culture & History" | "Food & Drink" | "Adventure" | "Spiritual & Wellness" | "Nature & Wildlife";
  coverImage: string;
  priceINR: number;
  duration: string;
  rating: number;
  reviews: number;
  description: string;
  includes: string[];
  bestTime: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  homeCity: string;
  bio: string;
  language: LanguageCode;
  currency: string;
  travelInterests: string[];
  savedDestinationIds: string[];
  emailNotifications: boolean;
  budgetAlerts: boolean;
}

export type ViewType =
  | "explore"
  | "my-trips"
  | "trip-detail"
  | "destinations"
  | "experiences"
  | "budget"
  | "ai-planner"
  | "settings"
  | "auth"
  | "login"
  | "signup";
