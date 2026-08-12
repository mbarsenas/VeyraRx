export type PrescriptionStatus = "Processing" | "Refill available" | "Active";

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
};

export const member = {
  firstName: "Mark",
  lastInitial: "B.",
  initials: "MB",
  memberIdLast4: "4821",
  plan: {
    name: "VeyraChoice Plus",
    rxBin: "610014",
    rxGroup: "VYR365",
    effectiveDate: "Jan 1, 2026",
    deductibleUsed: 620,
    deductibleTotal: 1500,
  },
  preferredPharmacy: {
    name: "H-E-B Pharmacy",
    location: "San Antonio, TX",
    distance: "2.4 miles away",
  },
  potentialSavings: 38,
};

export const prescriptions: Prescription[] = [
  {
    id: "rx-atorvastatin-20",
    slug: "atorvastatin-20mg",
    name: "Atorvastatin",
    strength: "20 mg",
    supply: "90-day supply",
    status: "Processing",
    rxNumber: "RX-784291",
    prescriber: "Dr. Amanda Chen",
    quantity: "90 tablets",
    refillsRemaining: 3,
    lastFill: "May 14, 2026",
    nextRefill: "Aug 12, 2026",
    pharmacy: "VeyraRx Home Delivery",
    coverageTier: "Tier 1 - Generic",
    estimatedCost: "$12.00",
    primaryActionLabel: "Track order",
    primaryActionHref: "/dashboard/orders/atorvastatin",
  },
  {
    id: "rx-lisinopril-10",
    slug: "lisinopril-10mg",
    name: "Lisinopril",
    strength: "10 mg",
    supply: "30-day supply",
    status: "Refill available",
    rxNumber: "RX-552104",
    prescriber: "Dr. Marcus Reed",
    quantity: "30 tablets",
    refillsRemaining: 2,
    lastFill: "Jul 12, 2026",
    nextRefill: "Now eligible",
    pharmacy: "H-E-B Pharmacy",
    coverageTier: "Tier 1 - Generic",
    estimatedCost: "$8.00",
    primaryActionLabel: "Refill now",
    primaryActionHref: "/dashboard/prescriptions/lisinopril-10mg/refill",
  },
  {
    id: "rx-metformin-er-500",
    slug: "metformin-er-500mg",
    name: "Metformin ER",
    strength: "500 mg",
    supply: "90-day supply",
    status: "Active",
    rxNumber: "RX-318822",
    prescriber: "Dr. Sophia Patel",
    quantity: "180 tablets",
    refillsRemaining: 4,
    lastFill: "Jun 20, 2026",
    nextRefill: "Sep 18, 2026",
    pharmacy: "H-E-B Pharmacy",
    coverageTier: "Tier 1 - Generic",
    estimatedCost: "$10.00",
    primaryActionLabel: "View details",
    primaryActionHref: "/dashboard/prescriptions/metformin-er-500mg",
  },
];

export const recentActivity = [
  { title: "Atorvastatin order is processing", time: "Today - 6:42 PM" },
  { title: "Lisinopril refill became available", time: "Aug 10 - 9:15 AM" },
  { title: "Preferred pharmacy updated", time: "Aug 4 - 2:03 PM" },
];
