export type CoverageTier = {
  name: string;
  description: string;
  retail30: string;
  retail90: string;
  home90: string;
};

export type MemberBenefits = {
  deductibleUsed: number;
  deductibleTotal: number;
  outOfPocketUsed: number;
  outOfPocketMax: number;
  planYear: string;
  coverageTiers: CoverageTier[];
};
