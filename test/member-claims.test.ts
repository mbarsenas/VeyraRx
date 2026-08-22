import assert from "node:assert/strict";
import test from "node:test";
import { createMemberClaimsRepository } from "../lib/data/member-claims-repository";

const paidClaim = {
  id: "claim-member-a",
  claim_reference: "CLM-001",
  medication_name: "Atorvastatin",
  strength: "20 mg",
  quantity: 30,
  days_supply: 30,
  pharmacy_name: "SmarteRX Home Delivery",
  service_date: "2026-08-01",
  status: "Paid" as const,
  transaction_type: "Paid",
  submitted_amount_cents: 1800,
  allowed_amount_cents: 1200,
  plan_paid_cents: 400,
  member_responsibility_cents: 800,
  deductible_cents: 0,
  copay_cents: 800,
  coinsurance_cents: 0,
  reject_code: null,
  reject_message: null,
};

test("Data API claim history uses a PostgREST-safe select and authenticated member filter", async () => {
  const calls: Array<{ select: string; filters?: string[]; order?: string }> = [];
  const repository = createMemberClaimsRepository({
    resolveMemberId: async () => "member-a",
    isDataApi: () => true,
    selectFromDataApi: async <T>(_table: string, select: string, filters?: string[], order?: string) => {
      calls.push({ select, filters, order });
      return [paidClaim] as T[];
    },
    executeSql: async () => { throw new Error("Direct SQL must not run in Data API mode"); },
  });

  const claims = await repository.list();

  assert.deepEqual(calls[0]?.filters, ["member_id=eq.member-a"]);
  assert.equal(calls[0]?.order, "service_date.desc");
  assert.doesNotMatch(calls[0]?.select ?? "", /\s/);
  assert.equal(claims[0]?.id, "claim-member-a");
});

test("Data API claim detail requires both claim and authenticated member IDs", async () => {
  let capturedFilters: string[] | undefined;
  const repository = createMemberClaimsRepository({
    resolveMemberId: async () => "member-a",
    isDataApi: () => true,
    selectFromDataApi: async <T>(_table: string, _select: string, filters?: string[]) => {
      capturedFilters = filters;
      return [] as T[];
    },
    executeSql: async () => { throw new Error("Direct SQL must not run in Data API mode"); },
  });

  const claim = await repository.findById("claim-owned-by-member-b");

  assert.deepEqual(capturedFilters, ["id=eq.claim-owned-by-member-b", "member_id=eq.member-a"]);
  assert.equal(claim, undefined);
});

test("Postgres fallback retains member scoping for local development", async () => {
  const calls: Array<{ statement: string; params?: unknown[] }> = [];
  const repository = createMemberClaimsRepository({
    resolveMemberId: async () => "member-a",
    isDataApi: () => false,
    selectFromDataApi: async () => { throw new Error("Data API must not run in Postgres mode"); },
    executeSql: async <T>(statement: string, params?: unknown[]) => {
      calls.push({ statement, params });
      return [] as T[];
    },
  });

  await repository.findById("claim-a");

  assert.match(calls[0]?.statement ?? "", /WHERE id = \$1 AND member_id = \$2/);
  assert.deepEqual(calls[0]?.params, ["claim-a", "member-a"]);
});
