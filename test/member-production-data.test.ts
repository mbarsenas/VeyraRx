import assert from "node:assert/strict";
import test from "node:test";
import { createMemberMessagesRepository } from "../lib/data/member-messages-repository";
import { createMemberOrdersRepository } from "../lib/data/member-orders-repository";

test("Data API orders are member-scoped and enriched with pharmacy details", async () => {
  const calls: Array<{ table: string; select: string; filters?: string[]; order?: string }> = [];
  const repository = createMemberOrdersRepository({
    resolveMemberId: async () => "member-a",
    isDataApi: () => true,
    selectFromDataApi: async <T>(table: string, select: string, filters?: string[], order?: string) => {
      calls.push({ table, select, filters, order });
      if (table === "pharmacies") return [{ id: "pharmacy-a", name: "Main Pharmacy", city: "Austin", state: "TX", postal_code: "78701" }] as T[];
      return [{ id: "order-a", order_number: "RX-1", medication_name: "Atorvastatin", fulfillment_type: "Retail pickup", status: "Ready for pickup", quantity: 30, days_supply: 30, member_cost_cents: 800, placed_at: "2026-08-01", shipped_at: null, delivered_at: null, tracking_number: null, carrier: null, pharmacy_id: "pharmacy-a" }] as T[];
    },
    executeSql: async () => { throw new Error("Direct SQL must not run in Data API mode"); },
  });

  const orders = await repository.list();
  assert.deepEqual(calls[0]?.filters, ["member_id=eq.member-a"]);
  assert.equal(calls[0]?.order, "placed_at.desc");
  assert.doesNotMatch(calls[0]?.select ?? "", /\s/);
  assert.match(orders[0]?.deliveryAddress ?? "", /Main Pharmacy/);
});

test("Data API messages use member scope for reads and updates", async () => {
  const selected: Array<{ filters?: string[]; order?: string }> = [];
  const updated: Array<{ filters: string[]; values: Record<string, unknown> }> = [];
  const repository = createMemberMessagesRepository({
    resolveMemberId: async () => "member-a",
    isDataApi: () => true,
    selectFromDataApi: async <T>(_table: string, _select: string, filters?: string[], order?: string) => { selected.push({ filters, order }); return [] as T[]; },
    updateDataApi: async (_table, values, filters) => { updated.push({ values, filters }); },
    executeSql: async () => { throw new Error("Direct SQL must not run in Data API mode"); },
    now: () => new Date("2026-08-22T08:00:00.000Z"),
  });

  await repository.list();
  await repository.markRead("message-b");
  assert.deepEqual(selected[0], { filters: ["member_id=eq.member-a"], order: "sent_at.desc" });
  assert.deepEqual(updated[0]?.filters, ["id=eq.message-b", "member_id=eq.member-a"]);
  assert.equal(updated[0]?.values.read_at, "2026-08-22T08:00:00.000Z");
});

test("Postgres fallbacks retain authenticated member scoping", async () => {
  const statements: Array<{ statement: string; params?: unknown[] }> = [];
  const common = {
    resolveMemberId: async () => "member-a",
    isDataApi: () => false,
    selectFromDataApi: async () => { throw new Error("Data API must not run in Postgres mode"); },
    executeSql: async <T>(statement: string, params?: unknown[]) => { statements.push({ statement, params }); return [] as T[]; },
  };
  await createMemberOrdersRepository(common).list();
  await createMemberMessagesRepository({ ...common, updateDataApi: async () => undefined }).markRead("message-a");
  assert.match(statements[0]?.statement ?? "", /o\.member_id = \$1/);
  assert.deepEqual(statements[0]?.params, ["member-a"]);
  assert.match(statements[1]?.statement ?? "", /id = \$1 AND member_id = \$2/);
  assert.deepEqual(statements[1]?.params, ["message-a", "member-a"]);
});
