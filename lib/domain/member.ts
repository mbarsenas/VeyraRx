export type PrescriptionStatus = "Processing" | "Refill available" | "Active";

export type FillHistoryItem = {
  date: string;
  quantity: string;
  cost: string;
};

export type Prescription = {
  id: string;
  slug: string;
  name: string;
  strength: string;
  supply: string;
  status: PrescriptionStatus;
  rxNumber: string;
  prescriber: string;
  quantity: string;
  refillsRemaining: number;
  lastFill: string;
  nextRefill: string;
  pharmacy: string;
  coverageTier: string;
  estimatedCost: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  fillHistory: FillHistoryItem[];
};

export type MemberPlan = {
  name: string;
  rxBin: string;
  rxGroup: string;
  effectiveDate: string;
  deductibleUsed: number;
  deductibleTotal: number;
};

export type PreferredPharmacySummary = {
  name: string;
  location: string;
  distance: string;
};

export type MemberSummary = {
  firstName: string;
  lastInitial: string;
  initials: string;
  memberIdLast4: string;
  plan: MemberPlan;
  preferredPharmacy: PreferredPharmacySummary;
  potentialSavings: number;
};

export type ActivityItem = {
  title: string;
  time: string;
};
