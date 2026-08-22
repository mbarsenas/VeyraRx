import type { ActivityItem, MemberSummary, Prescription } from "@/lib/domain/member";
import type { FormularyMedication, MemberBenefits, PriorAuthorization } from "@/lib/domain/benefits";
import type { MemberRepository } from "@/lib/data/member-repository";

export type SqlExecutor = <T = Record<string, unknown>>(sql: string, params?: unknown[]) => Promise<T[]>;

type MemberRow = {
  first_name: string;
  last_initial: string;
  initials: string;
  member_id_last4: string;
  plan_name: string;
  rx_bin: string;
  rx_group: string;
  effective_date: string;
  deductible_used_cents: number;
  deductible_total_cents: number;
  pharmacy_name: string | null;
  pharmacy_city: string | null;
  pharmacy_state: string | null;
  potential_savings_cents: number;
};

type PrescriptionRow = {
  id: string;
  slug: string;
  name: string;
  strength: string;
  supply: string;
  status: Prescription["status"];
  rx_number: string;
  prescriber: string;
  quantity: string;
  refills_remaining: number;
  last_fill: string | null;
  next_refill_label: string;
  pharmacy_name: string;
  coverage_tier: string;
  estimated_cost_cents: number;
  primary_action_label: string;
  primary_action_href: string;
};

type FillRow = { prescription_id: string; fill_date: string; quantity: string; cost_cents: number };
type ActivityRow = { title: string; display_time: string };
type BenefitRow = {
  deductible_used_cents: number;
  deductible_total_cents: number;
  out_of_pocket_used_cents: number;
  out_of_pocket_max_cents: number;
  plan_year_label: string;
  plan_id: string;
};
type CoverageTierRow = {
  name: string;
  description: string;
  retail_30_label: string;
  retail_90_label: string;
  home_90_label: string;
};
type FormularyRow = {
  name: string;
  strength: string;
  tier: string;
  coverage_status: FormularyMedication["status"];
  estimated_cost_cents: number;
};
type PriorAuthorizationRow = {
  medication: string;
  status: string;
  requirement: string;
  last_updated: string;
};

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const dateLabel = (value: string | null) => value ?? "Not available";
const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));

export function createPostgresMemberRepository(sql: SqlExecutor, memberId: string): MemberRepository {
  async function getPrescriptionRows(): Promise<PrescriptionRow[]> {
    return sql<PrescriptionRow>(
      `SELECT id, slug, name, strength, supply, status, rx_number, prescriber, quantity,
              refills_remaining, last_fill::text, next_refill_label, pharmacy_name,
              coverage_tier, estimated_cost_cents, primary_action_label, primary_action_href
         FROM prescriptions
        WHERE member_id = $1
        ORDER BY name`,
      [memberId]
    );
  }

  async function hydratePrescriptions(rows: PrescriptionRow[]): Promise<Prescription[]> {
    if (rows.length === 0) return [];
    const fills = await sql<FillRow>(
      `SELECT prescription_id, fill_date::text, quantity, cost_cents
         FROM prescription_fills
        WHERE prescription_id = ANY($1::text[])
        ORDER BY fill_date DESC`,
      [rows.map((row) => row.id)]
    );

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      strength: row.strength,
      supply: row.supply,
      status: row.status,
      rxNumber: row.rx_number,
      prescriber: row.prescriber,
      quantity: row.quantity,
      refillsRemaining: row.refills_remaining,
      lastFill: dateLabel(row.last_fill),
      nextRefill: row.next_refill_label,
      pharmacy: row.pharmacy_name,
      coverageTier: row.coverage_tier,
      estimatedCost: money(row.estimated_cost_cents),
      primaryActionLabel: row.primary_action_label,
      primaryActionHref: row.primary_action_href,
      fillHistory: fills
        .filter((fill) => fill.prescription_id === row.id)
        .map((fill) => ({ date: fill.fill_date, quantity: fill.quantity, cost: money(fill.cost_cents) })),
    }));
  }

  async function getPlanId(): Promise<string> {
    const rows = await sql<{ plan_id: string }>(`SELECT plan_id FROM members WHERE id = $1 LIMIT 1`, [memberId]);
    const planId = rows[0]?.plan_id;
    if (!planId) throw new Error(`Plan was not found for member '${memberId}'.`);
    return planId;
  }

  return {
    async getMemberSummary(): Promise<MemberSummary> {
      const rows = await sql<MemberRow>(
        `SELECT m.first_name, m.last_initial, m.initials, m.member_id_last4,
                p.name AS plan_name, p.rx_bin, p.rx_group, p.effective_date::text,
                p.deductible_used_cents, p.deductible_total_cents,
                ph.name AS pharmacy_name, ph.city AS pharmacy_city, ph.state AS pharmacy_state,
                m.potential_savings_cents
           FROM members m
           JOIN member_plans p ON p.id = m.plan_id
      LEFT JOIN pharmacies ph ON ph.id = m.preferred_pharmacy_id
          WHERE m.id = $1
          LIMIT 1`,
        [memberId]
      );
      const row = rows[0];
      if (!row) throw new Error(`Member '${memberId}' was not found.`);

      return {
        firstName: row.first_name,
        lastInitial: row.last_initial,
        initials: row.initials,
        memberIdLast4: row.member_id_last4,
        plan: {
          name: row.plan_name,
          rxBin: row.rx_bin,
          rxGroup: row.rx_group,
          effectiveDate: row.effective_date,
          deductibleUsed: row.deductible_used_cents / 100,
          deductibleTotal: row.deductible_total_cents / 100,
        },
        preferredPharmacy: {
          name: row.pharmacy_name ?? "Not selected",
          location: row.pharmacy_city && row.pharmacy_state ? `${row.pharmacy_city}, ${row.pharmacy_state}` : "Not available",
          distance: "Distance unavailable",
        },
        potentialSavings: row.potential_savings_cents / 100,
      };
    },

    async getPrescriptions() {
      return hydratePrescriptions(await getPrescriptionRows());
    },

    async getPrescriptionBySlug(slug: string) {
      const rows = await getPrescriptionRows();
      const match = rows.find((row) => row.slug === slug);
      if (!match) return undefined;
      return (await hydratePrescriptions([match]))[0];
    },

    async getRecentActivity(): Promise<ActivityItem[]> {
      const rows = await sql<ActivityRow>(
        `SELECT title, display_time
           FROM member_activity
          WHERE member_id = $1
          ORDER BY occurred_at DESC
          LIMIT 10`,
        [memberId]
      );
      return rows.map((row) => ({ title: row.title, time: row.display_time }));
    },

    async getBenefits(): Promise<MemberBenefits> {
      const rows = await sql<BenefitRow>(
        `SELECT b.deductible_used_cents, b.deductible_total_cents,
                b.out_of_pocket_used_cents, b.out_of_pocket_max_cents,
                b.plan_year_label, m.plan_id
           FROM member_benefits b
           JOIN members m ON m.id = b.member_id
          WHERE b.member_id = $1
          LIMIT 1`,
        [memberId]
      );
      const row = rows[0];
      if (!row) throw new Error(`Benefits were not found for member '${memberId}'.`);

      const tiers = await sql<CoverageTierRow>(
        `SELECT name, description, retail_30_label, retail_90_label, home_90_label
           FROM plan_coverage_tiers
          WHERE plan_id = $1
          ORDER BY sort_order, name`,
        [row.plan_id]
      );

      return {
        deductibleUsed: row.deductible_used_cents / 100,
        deductibleTotal: row.deductible_total_cents / 100,
        outOfPocketUsed: row.out_of_pocket_used_cents / 100,
        outOfPocketMax: row.out_of_pocket_max_cents / 100,
        planYear: row.plan_year_label,
        coverageTiers: tiers.map((tier) => ({
          name: tier.name,
          description: tier.description,
          retail30: tier.retail_30_label,
          retail90: tier.retail_90_label,
          home90: tier.home_90_label,
        })),
      };
    },

    async getFormularyMedications(): Promise<FormularyMedication[]> {
      const rows = await sql<FormularyRow>(
        `SELECT name, strength, tier, coverage_status, estimated_cost_cents
           FROM plan_formulary_medications
          WHERE plan_id = $1
          ORDER BY sort_order, name`,
        [await getPlanId()]
      );
      return rows.map((row) => ({
        name: row.name,
        strength: row.strength,
        tier: row.tier,
        status: row.coverage_status,
        estimatedCost: money(row.estimated_cost_cents),
      }));
    },

    async getPriorAuthorizations(): Promise<PriorAuthorization[]> {
      const rows = await sql<PriorAuthorizationRow>(
        `SELECT medication, status, requirement, last_updated::text
           FROM member_prior_authorizations
          WHERE member_id = $1
          ORDER BY last_updated DESC, medication`,
        [memberId]
      );
      return rows.map((row) => ({
        medication: row.medication,
        status: row.status,
        requirement: row.requirement,
        lastUpdated: formatDate(row.last_updated),
      }));
    },
  };
}
