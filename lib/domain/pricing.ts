export type MedicationPriceQuote = {
  id: string;
  productId: string;
  medicationName: string;
  genericName: string | null;
  strength: string;
  dosageForm: string;
  packageDescription: string | null;
  quantity: number;
  daysSupply: number | null;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyCityStateZip: string;
  networkStatus: string;
  cashPrice: string | null;
  negotiatedPrice: string | null;
  memberEstimatedCost: string | null;
  copay: string | null;
  coinsurancePercent: number | null;
  deductibleApplies: boolean;
  formularyTier: string | null;
  coverageStatus: string | null;
  fulfillmentType: string;
  pricingSource: string;
  quotedAt: string;
};

export type MedicationPricingSearch = {
  medication: string;
  strength?: string;
  quantity?: number;
};
