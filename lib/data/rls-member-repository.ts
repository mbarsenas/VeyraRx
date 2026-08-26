import type { MemberRepository } from "@/lib/data/member-repository";
import type { ActivityItem, MemberSummary, Prescription } from "@/lib/domain/member";
import type { FormularyMedication, MemberBenefits, PriorAuthorization } from "@/lib/domain/benefits";
import type { PharmacyLocation, PharmacyNetworkStatus } from "@/lib/domain/pharmacy";
import { getCurrentMemberSession } from "@/lib/auth/session";
import { dataApiSelect, dataApiUpdate, eq } from "@/lib/data/data-api";

const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const formatDate = (value: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));

type MemberRow = {
  id: string;
  external_auth_id?: string | null;
  first_name: string;
  last_initial: string;
  initials: string;
  member_id_last4: string;
  plan_id: string;
  preferred_pharmacy_id: string | null;
  potential_savings_cents: number;
};

type PlanRow = { id: string; name: string; rx_bin: string; rx_group: string; effective_date: string; deductible_used_cents: number; deductible_total_cents: number };
type PharmacyRow = { id: string; name: string; slug: string | null; address_line1: string | null; city: string; state: string; postal_code: string | null; distance_label: string | null; phone: string | null; hours_label: string | null; network_status: PharmacyNetworkStatus; pickup: boolean; ninety_day_eligible: boolean; drive_thru: boolean };
type PrescriptionRow = { id: string; slug: string; name: string; strength: string; supply: string; status: Prescription["status"]; rx_number: string; prescriber: string; quantity: string; refills_remaining: number; last_fill: string | null; next_refill_label: string; pharmacy_name: string; coverage_tier: string; estimated_cost_cents: number; primary_action_label: string; primary_action_href: string };
type FillRow = { prescription_id: string; fill_date: string; quantity: string; cost_cents: number };
type BenefitRow = { deductible_used_cents: number; deductible_total_cents: number; out_of_pocket_used_cents: number; out_of_pocket_max_cents: number; plan_year_label: string };
type TierRow = { name: string; description: string; retail_30_label: string; retail_90_label: string; home_90_label: string };
type FormularyRow = { name: string; strength: string; tier: string; coverage_status: FormularyMedication["status"]; estimated_cost_cents: number };
type PriorAuthRow = { medication: string; status: string; requirement: string; last_updated: string };
type ActivityRow = { title: string; display_time: string };

async function getMember(): Promise<MemberRow> {
  const session = await getCurrentMemberSession();
  if (!session) throw new Error("An authenticated member session is required.");

  const rows = await dataApiSelect<MemberRow>(
    "members",
    "id,external_auth_id,first_name,last_initial,initials,member_id_last4,plan_id,preferred_pharmacy_id,potential_savings_cents",
    [`external_auth_id=${eq(session.memberId)}`],
    undefined,
    1
  );

  if (!rows[0]) {
    throw new Error("This authenticated account is not linked to a SmarteRX member record.");
  }

  return rows[0];
}

async function getPlan(planId: string): Promise<PlanRow> {
  const rows = await dataApiSelect<PlanRow>("member_plans", "id,name,rx_bin,rx_group,effective_date,deductible_used_cents,deductible_total_cents", [`id=${eq(planId)}`], undefined, 1);
  if (!rows[0]) throw new Error("Member plan was not found.");
  return rows[0];
}

async function getPrescriptionRows(memberId: string): Promise<PrescriptionRow[]> {
  return dataApiSelect<PrescriptionRow>("prescriptions", "id,slug,name,strength,supply,status,rx_number,prescriber,quantity,refills_remaining,last_fill,next_refill_label,pharmacy_name,coverage_tier,estimated_cost_cents,primary_action_label,primary_action_href", [`member_id=${eq(memberId)}`], "name.asc");
}

async function hydratePrescriptions(rows: PrescriptionRow[]): Promise<Prescription[]> {
  if (!rows.length) return [];
  const fills = await dataApiSelect<FillRow>("prescription_fills", "prescription_id,fill_date,quantity,cost_cents", [], "fill_date.desc");
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
    lastFill: row.last_fill ?? "Not available",
    nextRefill: row.next_refill_label,
    pharmacy: row.pharmacy_name,
    coverageTier: row.coverage_tier,
    estimatedCost: money(row.estimated_cost_cents),
    primaryActionLabel: row.primary_action_label,
    primaryActionHref: row.primary_action_href,
    fillHistory: fills.filter((fill) => fill.prescription_id === row.id).map((fill) => ({ date: fill.fill_date, quantity: fill.quantity, cost: money(fill.cost_cents) })),
  }));
}

export function createRlsMemberRepository(): MemberRepository {
  return {
    async getMemberSummary(): Promise<MemberSummary> {
      const member = await getMember();
      const plan = await getPlan(member.plan_id);
      const pharmacy = member.preferred_pharmacy_id
        ? (await dataApiSelect<PharmacyRow>("pharmacies", "id,name,slug,address_line1,city,state,postal_code,distance_label,phone,hours_label,network_status,pickup,ninety_day_eligible,drive_thru", [`id=${eq(member.preferred_pharmacy_id)}`], undefined, 1))[0]
        : undefined;
      return {
        firstName: member.first_name,
        lastInitial: member.last_initial,
        initials: member.initials,
        memberIdLast4: member.member_id_last4,
        plan: { name: plan.name, rxBin: plan.rx_bin, rxGroup: plan.rx_group, effectiveDate: plan.effective_date, deductibleUsed: plan.deductible_used_cents / 100, deductibleTotal: plan.deductible_total_cents / 100 },
        preferredPharmacy: { name: pharmacy?.name ?? "Not selected", location: pharmacy ? `${pharmacy.city}, ${pharmacy.state}` : "Not available", distance: pharmacy?.distance_label ?? "Distance unavailable" },
        potentialSavings: member.potential_savings_cents / 100,
      };
    },
    async getPrescriptions() {
      const member = await getMember();
      return hydratePrescriptions(await getPrescriptionRows(member.id));
    },
    async getPrescriptionBySlug(slug: string) {
      const member = await getMember();
      const rows = await getPrescriptionRows(member.id);
      const match = rows.find((row) => row.slug === slug);
      if (!match) return undefined;
      return (await hydratePrescriptions([match]))[0];
    },
    async getRecentActivity(): Promise<ActivityItem[]> {
      const member = await getMember();
      const rows = await dataApiSelect<ActivityRow>("member_activity", "title,display_time", [`member_id=${eq(member.id)}`], "occurred_at.desc", 10);
      return rows.map((row) => ({ title: row.title, time: row.display_time }));
    },
    async getBenefits(): Promise<MemberBenefits> {
      const member = await getMember();
      const rows = await dataApiSelect<BenefitRow>("member_benefits", "deductible_used_cents,deductible_total_cents,out_of_pocket_used_cents,out_of_pocket_max_cents,plan_year_label", [`member_id=${eq(member.id)}`], undefined, 1);
      if (!rows[0]) throw new Error("Benefits were not found for the authenticated member.");
      const tiers = await dataApiSelect<TierRow>("plan_coverage_tiers", "name,description,retail_30_label,retail_90_label,home_90_label", [`plan_id=${eq(member.plan_id)}`], "sort_order.asc");
      const row = rows[0];
      return { deductibleUsed: row.deductible_used_cents / 100, deductibleTotal: row.deductible_total_cents / 100, outOfPocketUsed: row.out_of_pocket_used_cents / 100, outOfPocketMax: row.out_of_pocket_max_cents / 100, planYear: row.plan_year_label, coverageTiers: tiers.map((tier) => ({ name: tier.name, description: tier.description, retail30: tier.retail_30_label, retail90: tier.retail_90_label, home90: tier.home_90_label })) };
    },
    async getFormularyMedications(): Promise<FormularyMedication[]> {
      const member = await getMember();
      const rows = await dataApiSelect<FormularyRow>("plan_formulary_medications", "name,strength,tier,coverage_status,estimated_cost_cents", [`plan_id=${eq(member.plan_id)}`], "sort_order.asc");
      return rows.map((row) => ({ name: row.name, strength: row.strength, tier: row.tier, status: row.coverage_status, estimatedCost: money(row.estimated_cost_cents) }));
    },
    async getPriorAuthorizations(): Promise<PriorAuthorization[]> {
      const member = await getMember();
      const rows = await dataApiSelect<PriorAuthRow>("member_prior_authorizations", "medication,status,requirement,last_updated", [`member_id=${eq(member.id)}`], "last_updated.desc");
      return rows.map((row) => ({ medication: row.medication, status: row.status, requirement: row.requirement, lastUpdated: formatDate(row.last_updated) }));
    },
    async getPharmacies(): Promise<PharmacyLocation[]> {
      const rows = await dataApiSelect<PharmacyRow>("pharmacies", "id,name,slug,address_line1,city,state,postal_code,distance_label,phone,hours_label,network_status,pickup,ninety_day_eligible,drive_thru", [], "name.asc");
      return rows.map((row) => ({ id: row.id, name: row.name, slug: row.slug ?? row.id, address: row.address_line1 ?? "Address unavailable", cityStateZip: `${row.city}, ${row.state}${row.postal_code ? ` ${row.postal_code}` : ""}`, distance: row.distance_label ?? "Distance unavailable", phone: row.phone ?? "Not available", hours: row.hours_label ?? "Hours unavailable", networkStatus: row.network_status, pickup: row.pickup, ninetyDayEligible: row.ninety_day_eligible, driveThru: row.drive_thru }));
    },
    async getPreferredPharmacyId(): Promise<string | null> {
      return (await getMember()).preferred_pharmacy_id;
    },
    async setPreferredPharmacy(id: string): Promise<void> {
      const member = await getMember();
      const pharmacy = (await dataApiSelect<PharmacyRow>("pharmacies", "id,name,slug,address_line1,city,state,postal_code,distance_label,phone,hours_label,network_status,pickup,ninety_day_eligible,drive_thru", [`id=${eq(id)}`], undefined, 1))[0];
      if (!pharmacy || pharmacy.network_status === "Out of network") throw new Error("The selected pharmacy is not eligible to be preferred.");
      await dataApiUpdate("members", { preferred_pharmacy_id: id, updated_at: new Date().toISOString() }, [`id=${eq(member.id)}`]);
    },
  };
}
