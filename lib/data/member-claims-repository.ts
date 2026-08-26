import type { MemberClaim, ClaimStatus } from "@/lib/domain/claim";

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
  };
}

const claimSelect = `SELECT id, prescription_id, claim_reference, medication_name, strength, quantity, days_supply,
                            pharmacy_name, service_date, status, transaction_type,
                            submitted_amount_cents, allowed_amount_cents, plan_paid_cents,
                            member_responsibility_cents, deductible_cents, copay_cents,
                            coinsurance_cents, reject_code, reject_message, reversal_of_claim_id
                       FROM member_claims`;

const claimColumns = [
  "id", "prescription_id", "claim_reference", "medication_name", "strength", "quantity", "days_supply",
  "pharmacy_name", "service_date", "status", "transaction_type", "submitted_amount_cents",
  "allowed_amount_cents", "plan_paid_cents", "member_responsibility_cents", "deductible_cents",
  "copay_cents", "coinsurance_cents", "reject_code", "reject_message", "reversal_of_claim_id",
].join(",");

type ClaimDataApiSelect = <T>(table: string, select: string, filters?: string[], order?: string, limit?: number) => Promise<T[]>;
type ClaimSqlExecutor = <T = Record<string, unknown>>(statement: string, params?: unknown[]) => Promise<T[]>;

type MemberClaimsDependencies = {
  resolveMemberId: () => Promise<string>;
  isDataApi: () => boolean;
  selectFromDataApi: ClaimDataApiSelect;
  executeSql: ClaimSqlExecutor;
};

function eq(value: string) {
  return `eq.${encodeURIComponent(value)}`;
}

export function createMemberClaimsRepository(dependencies: MemberClaimsDependencies) {
  async function list(): Promise<MemberClaim[]> {
    const memberId = await dependencies.resolveMemberId();
    const rows = dependencies.isDataApi()
      ? await dependencies.selectFromDataApi<ClaimRow>("member_claims", claimColumns, [`member_id=${eq(memberId)}`], "service_date.desc")
      : await dependencies.executeSql<ClaimRow>(`${claimSelect}\n      WHERE member_id = $1\n      ORDER BY service_date DESC, adjudicated_at DESC NULLS LAST`, [memberId]);
    const references = new Map(rows.map((row) => [row.id, row.claim_reference]));
    return rows.map((row) => ({ ...mapClaim(row), reversalOfClaimReference: row.reversal_of_claim_id ? references.get(row.reversal_of_claim_id) : undefined }));
  }

  async function findById(id: string): Promise<MemberClaim | undefined> {
    const memberId = await dependencies.resolveMemberId();
    const rows = dependencies.isDataApi()
      ? await dependencies.selectFromDataApi<ClaimRow>("member_claims", claimColumns, [`id=${eq(id)}`, `member_id=${eq(memberId)}`], undefined, 1)
      : await dependencies.executeSql<ClaimRow>(`${claimSelect}\n      WHERE id = $1 AND member_id = $2\n      LIMIT 1`, [id, memberId]);
    if (!rows[0]) return undefined;
    const claim = mapClaim(rows[0]);
    if (!rows[0].reversal_of_claim_id) return claim;
    const originalRows = dependencies.isDataApi()
      ? await dependencies.selectFromDataApi<Pick<ClaimRow, "claim_reference">>("member_claims", "claim_reference", [`id=${eq(rows[0].reversal_of_claim_id)}`, `member_id=${eq(memberId)}`], undefined, 1)
      : await dependencies.executeSql<Pick<ClaimRow, "claim_reference">>("SELECT claim_reference FROM member_claims WHERE id = $1 AND member_id = $2 LIMIT 1", [rows[0].reversal_of_claim_id, memberId]);
    return { ...claim, reversalOfClaimReference: originalRows[0]?.claim_reference };
  }

  async function accumulators(): Promise<{ deductibleCents: number; outOfPocketCents: number }> {
    const memberId = await dependencies.resolveMemberId();
    if (dependencies.isDataApi()) {
      const rows = await dependencies.selectFromDataApi<Pick<ClaimRow, "deductible_cents" | "member_responsibility_cents">>(
        "member_claims", "deductible_cents,member_responsibility_cents", [`member_id=${eq(memberId)}`, "status=eq.Paid"]
      );
      return rows.reduce((total, row) => ({
        deductibleCents: total.deductibleCents + row.deductible_cents,
        outOfPocketCents: total.outOfPocketCents + row.member_responsibility_cents,
      }), { deductibleCents: 0, outOfPocketCents: 0 });
    }
    const rows = await dependencies.executeSql<{ deductibleCents: number; outOfPocketCents: number }>(
      `SELECT COALESCE(SUM(CASE WHEN status = 'Paid' THEN deductible_cents ELSE 0 END), 0)::int AS "deductibleCents",
              COALESCE(SUM(CASE WHEN status = 'Paid' THEN member_responsibility_cents ELSE 0 END), 0)::int AS "outOfPocketCents"
         FROM member_claims WHERE member_id = $1`, [memberId]
    );
    return rows[0] ?? { deductibleCents: 0, outOfPocketCents: 0 };
  }

  return { list, findById, accumulators };
}
