export type CoverageTier = {
  name: string;
  description: string;
  retail30: string;
  retail90: string;
  home90: string;
};

export type FormularyMedication = {
  name: string;
  strength: string;
  tier: string;
  status: "Covered" | "Prior authorization" | "Not covered";
  estimatedCost: string;
};

export const benefitSummary = {
  outOfPocketUsed: 910,
  outOfPocketMax: 4000,
  deductibleUsed: 620,
  deductibleTotal: 1500,
  planYear: "Jan 1 - Dec 31, 2026",
};

export const coverageTiers: CoverageTier[] = [
  { name: "Tier 1", description: "Preferred generic medications", retail30: "$10", retail90: "$25", home90: "$20" },
  { name: "Tier 2", description: "Preferred brand medications", retail30: "$35", retail90: "$90", home90: "$75" },
  { name: "Tier 3", description: "Non-preferred brand medications", retail30: "$70", retail90: "$180", home90: "$150" },
  { name: "Specialty", description: "Specialty and complex therapies", retail30: "20%", retail90: "N/A", home90: "N/A" },
];

export const formularyMedications: FormularyMedication[] = [
  { name: "Atorvastatin", strength: "20 mg", tier: "Tier 1", status: "Covered", estimatedCost: "$12.00" },
  { name: "Lisinopril", strength: "10 mg", tier: "Tier 1", status: "Covered", estimatedCost: "$8.00" },
  { name: "Metformin ER", strength: "500 mg", tier: "Tier 1", status: "Covered", estimatedCost: "$10.00" },
  { name: "Ozempic", strength: "2 mg/3 mL", tier: "Tier 2", status: "Prior authorization", estimatedCost: "$35.00" },
];

export const priorAuthorizations = [
  {
    medication: "Ozempic 2 mg/3 mL",
    status: "Action may be required",
    requirement: "Clinical criteria and prescriber documentation",
    lastUpdated: "Aug 18, 2026",
  },
];
