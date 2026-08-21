import type { ActivityItem, MemberSummary, Prescription } from "@/lib/domain/member";
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

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const dateLabel = (value: string | null) => value ?? "Not available";

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
  };
}
