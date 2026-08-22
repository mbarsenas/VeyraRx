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

export type PriorAuthorization = {
  medication: string;
  status: string;
  requirement: string;
  lastUpdated: string;
};

export type MemberBenefits = {
  deductibleUsed: number;
  deductibleTotal: number;
  outOfPocketUsed: number;
  outOfPocketMax: number;
  planYear: string;
  coverageTiers: CoverageTier[];
};
