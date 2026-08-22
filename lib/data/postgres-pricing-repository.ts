import type { PricingRepository } from "@/lib/data/pricing-repository";
import type { MedicationPriceQuote, MedicationPricingSearch } from "@/lib/domain/pricing";
import type { SqlExecutor } from "@/lib/data/postgres-member-repository";

type PriceRow = {
  id: string;
  product_id: string;
  medication_name: string;
  generic_name: string | null;
  strength: string;
  dosage_form: string;
  package_description: string | null;
  quantity: number;
  days_supply: number | null;
  pharmacy_id: string;
  pharmacy_name: string;
  address_line1: string | null;
  city: string;
  state: string;
  postal_code: string | null;
  network_status: string | null;
  cash_price_cents: number | null;
  negotiated_price_cents: number | null;
  member_estimated_cost_cents: number | null;
  copay_cents: number | null;
  coinsurance_percent: string | number | null;
  deductible_applies: boolean;
  formulary_tier: string | null;
  coverage_status: string | null;
  fulfillment_type: string;
  pricing_source: string;
  quoted_at: string;
};

const money = (cents: number | null) => cents == null ? null : `$${(cents / 100).toFixed(2)}`;

export function createPostgresPricingRepository(sql: SqlExecutor): PricingRepository {
  return {
    async searchMedicationPrices(search: MedicationPricingSearch): Promise<MedicationPriceQuote[]> {
      const medication = search.medication.trim();
      const strength = search.strength?.trim() ?? "";
      const quantity = search.quantity ?? null;

      if (!medication) return [];

      const rows = await sql<PriceRow>(
        `SELECT q.id,
                d.id AS product_id,
                d.name AS medication_name,
                d.generic_name,
                d.strength,
                d.dosage_form,
                d.package_description,
                q.quantity,
                q.days_supply,
                p.id AS pharmacy_id,
                p.name AS pharmacy_name,
                p.address_line1,
                p.city,
                p.state,
                p.postal_code,
                COALESCE(q.network_status, p.network_status) AS network_status,
                q.cash_price_cents,
                q.negotiated_price_cents,
                q.member_estimated_cost_cents,
                q.copay_cents,
                q.coinsurance_percent,
                q.deductible_applies,
                q.formulary_tier,
                q.coverage_status,
                q.fulfillment_type,
                q.pricing_source,
                q.quoted_at::text
           FROM medication_price_quotes q
           JOIN drug_products d ON d.id = q.product_id
           JOIN pharmacies p ON p.id = q.pharmacy_id
          WHERE (d.name ILIKE $1 OR d.generic_name ILIKE $1)
            AND ($2 = '' OR d.strength ILIKE $2)
            AND ($3::int IS NULL OR q.quantity = $3::int)
          ORDER BY q.member_estimated_cost_cents NULLS LAST,
                   q.negotiated_price_cents NULLS LAST,
                   p.name`,
        [`%${medication}%`, strength ? `%${strength}%` : "", quantity]
      );

      return rows.map((row) => ({
        id: row.id,
        productId: row.product_id,
        medicationName: row.medication_name,
        genericName: row.generic_name,
        strength: row.strength,
        dosageForm: row.dosage_form,
        packageDescription: row.package_description,
        quantity: row.quantity,
        daysSupply: row.days_supply,
        pharmacyId: row.pharmacy_id,
        pharmacyName: row.pharmacy_name,
        pharmacyAddress: row.address_line1 ?? "Address unavailable",
        pharmacyCityStateZip: [row.city, row.state, row.postal_code].filter(Boolean).join(" "),
        networkStatus: row.network_status ?? "Unknown",
        cashPrice: money(row.cash_price_cents),
        negotiatedPrice: money(row.negotiated_price_cents),
        memberEstimatedCost: money(row.member_estimated_cost_cents),
        copay: money(row.copay_cents),
        coinsurancePercent: row.coinsurance_percent == null ? null : Number(row.coinsurance_percent),
        deductibleApplies: row.deductible_applies,
        formularyTier: row.formulary_tier,
        coverageStatus: row.coverage_status,
        fulfillmentType: row.fulfillment_type,
        pricingSource: row.pricing_source,
        quotedAt: row.quoted_at,
      }));
    },
  };
}
