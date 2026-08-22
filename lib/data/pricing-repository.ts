import type { MedicationPriceQuote, MedicationPricingSearch } from "@/lib/domain/pricing";

export interface PricingRepository {
  searchMedicationPrices(search: MedicationPricingSearch): Promise<MedicationPriceQuote[]>;
}
