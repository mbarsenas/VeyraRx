import type { ClaimAccumulators, MemberClaim, ClaimStatus } from "@/lib/domain/claim";
import { resolveAuthenticatedMemberId } from "@/lib/data/authenticated-member";
import { neonSqlExecutor } from "@/lib/data/neon-sql";

type ClaimRow = {
  id: string;
  prescription_id: string | null;
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
  reversal_of_claim_id: string | null;
  reversal_of_claim_reference: string | null;
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
    prescriptionId: row.prescription_id ?? undefined,
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
    reversalOfClaimId: row.reversal_of_claim_id ?? undefined,
    reversalOfClaimReference: row.reversal_of_claim_reference ?? undefined,
  };
}

const claimSelect = `SELECT mc.id, mc.prescription_id, mc.claim_reference, mc.medication_name, mc.strength, mc.quantity, mc.days_supply,
                            mc.pharmacy_name, mc.service_date, mc.status, mc.transaction_type,
                            mc.submitted_amount_cents, mc.allowed_amount_cents, mc.plan_paid_cents,
                            mc.member_responsibility_cents, mc.deductible_cents, mc.copay_cents,
                            mc.coinsurance_cents, mc.reject_code, mc.reject_message,
                            mc.reversal_of_claim_id, original.claim_reference AS reversal_of_claim_reference
                       FROM member_claims mc
                  LEFT JOIN member_claims original ON original.id = mc.reversal_of_claim_id`;

export async function getAuthenticatedMemberClaims(): Promise<MemberClaim[]> {
  const memberId = await resolveAuthenticatedMemberId();
  const rows = await neonSqlExecutor<ClaimRow>(`${claimSelect}\n      WHERE mc.member_id = $1\n      ORDER BY mc.service_date DESC, mc.adjudicated_at DESC NULLS LAST`, [memberId]);
  return rows.map(mapClaim);
}

export async function getAuthenticatedMemberClaimById(id: string): Promise<MemberClaim | undefined> {
  const memberId = await resolveAuthenticatedMemberId();
  const rows = await neonSqlExecutor<ClaimRow>(`${claimSelect}\n      WHERE mc.id = $1 AND mc.member_id = $2\n      LIMIT 1`, [id, memberId]);
  return rows[0] ? mapClaim(rows[0]) : undefined;
}

export async function getAuthenticatedMemberClaimAccumulators(): Promise<ClaimAccumulators> {
  const memberId = await resolveAuthenticatedMemberId();
  const rows = await neonSqlExecutor<ClaimAccumulators>(
    `SELECT COALESCE(SUM(CASE WHEN status = 'Paid' THEN deductible_cents ELSE 0 END), 0)::int AS "deductibleCents",
            COALESCE(SUM(CASE WHEN status = 'Paid' THEN member_responsibility_cents ELSE 0 END), 0)::int AS "outOfPocketCents"
       FROM member_claims
      WHERE member_id = $1`,
    [memberId]
  );
  return rows[0] ?? { deductibleCents: 0, outOfPocketCents: 0 };
}
