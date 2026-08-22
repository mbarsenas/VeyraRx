import type { MemberClaim, ClaimStatus } from "@/lib/domain/claim";
import { resolveAuthenticatedMemberId } from "@/lib/data/authenticated-member";
import { neonSqlExecutor } from "@/lib/data/neon-sql";

type ClaimRow = {
  id: string;
  claim_reference: string;
  medication_name: string;
  strength: string | null;
  quantity: string | number | null;
  days_supply: number | null;
  pharmacy_name: string | null;
  service_date: string;
  status: ClaimStatus;
  transaction_type: string;
  submitted_amount_cents: number;
  allowed_amount_cents: number;
  plan_paid_cents: number;
  member_responsibility_cents: number;
  deductible_cents: number;
  copay_cents: number;
  coinsurance_cents: number;
  reject_code: string | null;
  reject_message: string | null;
};

function money(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function date(value: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

function mapClaim(row: ClaimRow): MemberClaim {
  return {
    id: row.id,
    claimReference: row.claim_reference,
    medicationName: row.medication_name,
    strength: row.strength ?? undefined,
    quantity: row.quantity == null ? undefined : Number(row.quantity),
    daysSupply: row.days_supply ?? undefined,
    pharmacyName: row.pharmacy_name ?? undefined,
    serviceDate: date(row.service_date),
    status: row.status,
    transactionType: row.transaction_type,
    submittedAmount: money(row.submitted_amount_cents),
    allowedAmount: money(row.allowed_amount_cents),
    planPaid: money(row.plan_paid_cents),
    memberResponsibility: money(row.member_responsibility_cents),
    deductible: money(row.deductible_cents),
    copay: money(row.copay_cents),
    coinsurance: money(row.coinsurance_cents),
    rejectCode: row.reject_code ?? undefined,
    rejectMessage: row.reject_message ?? undefined,
  };
}

const claimSelect = `SELECT id, claim_reference, medication_name, strength, quantity, days_supply,
                            pharmacy_name, service_date, status, transaction_type,
                            submitted_amount_cents, allowed_amount_cents, plan_paid_cents,
                            member_responsibility_cents, deductible_cents, copay_cents,
                            coinsurance_cents, reject_code, reject_message
                       FROM member_claims`;

export async function getAuthenticatedMemberClaims(): Promise<MemberClaim[]> {
  const memberId = await resolveAuthenticatedMemberId();
  const rows = await neonSqlExecutor<ClaimRow>(`${claimSelect}\n      WHERE member_id = $1\n      ORDER BY service_date DESC, adjudicated_at DESC NULLS LAST`, [memberId]);
  return rows.map(mapClaim);
}

export async function getAuthenticatedMemberClaimById(id: string): Promise<MemberClaim | undefined> {
  const memberId = await resolveAuthenticatedMemberId();
  const rows = await neonSqlExecutor<ClaimRow>(`${claimSelect}\n      WHERE id = $1 AND member_id = $2\n      LIMIT 1`, [id, memberId]);
  return rows[0] ? mapClaim(rows[0]) : undefined;
}
