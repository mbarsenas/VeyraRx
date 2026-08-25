export type ClaimStatus = "Paid" | "Rejected" | "Reversed" | "Pending";

export type MemberClaim = {
  id: string;
  prescriptionId?: string;
  claimReference: string;
  medicationName: string;
  strength?: string;
  quantity?: number;
  daysSupply?: number;
  pharmacyName?: string;
  serviceDate: string;
  status: ClaimStatus;
  transactionType: string;
  submittedAmount: string;
  allowedAmount: string;
  planPaid: string;
  memberResponsibility: string;
  deductible: string;
  copay: string;
  coinsurance: string;
  rejectCode?: string;
  rejectMessage?: string;
  reversalOfClaimId?: string;
  reversalOfClaimReference?: string;
};

export type ClaimAccumulators = {
  deductibleCents: number;
  outOfPocketCents: number;
};
