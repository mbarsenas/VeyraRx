"use server";

import { neonSqlExecutor } from "@/lib/data/neon-sql";
import { createPostgresPricingRepository } from "@/lib/data/postgres-pricing-repository";
import type { MedicationPricingSearch } from "@/lib/domain/pricing";

export async function searchMedicationPricesAction(search: MedicationPricingSearch) {
  return createPostgresPricingRepository(neonSqlExecutor).searchMedicationPrices(search);
}
