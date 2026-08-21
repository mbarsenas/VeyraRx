import type { MedicationOrder, OrderStatus } from "@/lib/domain/order";
import { getCurrentMemberSession } from "@/lib/auth/session";
import { neonSqlExecutor } from "@/lib/data/neon-sql";

type OrderRow = {
  id: string;
  order_number: string;
  medication_name: string;
  fulfillment_type: string;
  status: OrderStatus;
  quantity: number | null;
  days_supply: number | null;
  member_cost_cents: number;
  placed_at: string;
  delivered_at: string | null;
  tracking_number: string | null;
  carrier: string | null;
};

async function resolveAuthenticatedMemberId(): Promise<string> {
  const session = await getCurrentMemberSession();
  if (!session) throw new Error("An authenticated member session is required.");

  const rows = await neonSqlExecutor<{ id: string }>(
    `SELECT id FROM members WHERE external_auth_id = $1 LIMIT 1`,
    [session.memberId]
  );

  if (!rows[0]?.id) {
    throw new Error("This account is not linked to a VeyraRx member record.");
  }

  return rows[0].id;
}

function formatDate(value: string | null): string | undefined {
  if (!value) return undefined;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function slugForOrder(row: OrderRow): string {
  if (row.id === "order-atorvastatin-aug-2026") return "atorvastatin";
  if (row.id === "order-lisinopril-jul-2026") return "lisinopril-jul-2026";
  if (row.id === "order-metformin-jun-2026") return "metformin-jun-2026";
  return row.id.replace(/^order-/, "");
}

export async function getAuthenticatedMemberOrders(): Promise<MedicationOrder[]> {
  const memberId = await resolveAuthenticatedMemberId();
  const rows = await neonSqlExecutor<OrderRow>(
    `SELECT id, order_number, medication_name, fulfillment_type, status,
            quantity, days_supply, member_cost_cents, placed_at, delivered_at,
            tracking_number, carrier
       FROM member_orders
      WHERE member_id = $1
      ORDER BY placed_at DESC`,
    [memberId]
  );

  return rows.map((row) => ({
    id: row.id,
    slug: slugForOrder(row),
    orderNumber: row.order_number,
    medication: row.medication_name,
    quantity: row.quantity ? `${row.quantity} tablets` : "Not available",
    supply: row.days_supply ? `${row.days_supply}-day supply` : "Not available",
    status: row.status,
    orderDate: formatDate(row.placed_at) ?? "Not available",
    deliveredDate: formatDate(row.delivered_at),
    deliveryMethod: row.fulfillment_type,
    trackingNumber: row.tracking_number ?? undefined,
    carrier: row.carrier ?? undefined,
    memberCost: formatMoney(row.member_cost_cents),
  }));
}
