import type { MedicationOrder, OrderStatus, OrderTimelineStep } from "@/lib/domain/order";
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
  shipped_at: string | null;
  delivered_at: string | null;
  tracking_number: string | null;
  carrier: string | null;
  pharmacy_name: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
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

function formatDateTime(value: string | null): string | undefined {
  if (!value) return undefined;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function slugForOrder(row: Pick<OrderRow, "id">): string {
  if (row.id === "order-atorvastatin-aug-2026") return "atorvastatin";
  if (row.id === "order-lisinopril-jul-2026") return "lisinopril-jul-2026";
  if (row.id === "order-metformin-jun-2026") return "metformin-jun-2026";
  return row.id.replace(/^order-/, "");
}

function deliveryAddress(row: OrderRow): string | undefined {
  if (row.fulfillment_type === "Retail pickup" && row.pharmacy_name) {
    return [row.pharmacy_name, row.city, row.state].filter(Boolean).join(" - ");
  }

  const location = [row.city, row.state, row.postal_code].filter(Boolean).join(" ");
  return location || undefined;
}

function timelineForOrder(row: OrderRow): OrderTimelineStep[] {
  const placed = formatDateTime(row.placed_at) ?? "Order received";
  const shipped = formatDateTime(row.shipped_at);
  const delivered = formatDateTime(row.delivered_at);

  if (row.status === "Delivered") {
    return [
      { label: "Order received", detail: placed, state: "complete" },
      ...(shipped ? [{ label: "Shipped", detail: shipped, state: "complete" } as OrderTimelineStep] : []),
      { label: "Delivered", detail: delivered ?? "Completed", state: "complete" },
    ];
  }

  if (row.status === "Shipped") {
    return [
      { label: "Order received", detail: placed, state: "complete" },
      { label: "Shipped", detail: shipped ?? "In transit", state: "current" },
      { label: "Delivered", detail: "Pending delivery", state: "upcoming" },
    ];
  }

  if (row.status === "Ready for pickup") {
    return [
      { label: "Order received", detail: placed, state: "complete" },
      { label: "Ready for pickup", detail: row.pharmacy_name ?? "Your pharmacy", state: "current" },
      { label: "Delivered", detail: "Pending pickup", state: "upcoming" },
    ];
  }

  if (row.status === "Cancelled") {
    return [
      { label: "Order received", detail: placed, state: "complete" },
      { label: "Cancelled", detail: "This order was cancelled", state: "current" },
    ];
  }

  return [
    { label: "Order received", detail: placed, state: "complete" },
    { label: "Processing", detail: "Medication is being prepared", state: "current" },
    { label: "Shipped", detail: "Tracking information will appear here", state: "upcoming" },
    { label: "Delivered", detail: "Pending fulfillment", state: "upcoming" },
  ];
}

function mapOrder(row: OrderRow): MedicationOrder {
  return {
    id: row.id,
    slug: slugForOrder(row),
    orderNumber: row.order_number,
    medication: row.medication_name,
    quantity: row.quantity ? `${row.quantity} tablets` : "Not available",
    supply: row.days_supply ? `${row.days_supply}-day supply` : "Not available",
    status: row.status,
    orderDate: formatDate(row.placed_at) ?? "Not available",
    shippedDate: formatDate(row.shipped_at),
    deliveredDate: formatDate(row.delivered_at),
    deliveryMethod: row.fulfillment_type,
    deliveryAddress: deliveryAddress(row),
    trackingNumber: row.tracking_number ?? undefined,
    carrier: row.carrier ?? undefined,
    memberCost: formatMoney(row.member_cost_cents),
    timeline: timelineForOrder(row),
  };
}

const orderSelect = `SELECT o.id, o.order_number, o.medication_name, o.fulfillment_type, o.status,
                            o.quantity, o.days_supply, o.member_cost_cents, o.placed_at,
                            o.shipped_at, o.delivered_at, o.tracking_number, o.carrier,
                            p.name AS pharmacy_name, p.city, p.state, p.postal_code
                       FROM member_orders o
                  LEFT JOIN pharmacies p ON p.id = o.pharmacy_id`;

export async function getAuthenticatedMemberOrders(): Promise<MedicationOrder[]> {
  const memberId = await resolveAuthenticatedMemberId();
  const rows = await neonSqlExecutor<OrderRow>(
    `${orderSelect}
      WHERE o.member_id = $1
      ORDER BY o.placed_at DESC`,
    [memberId]
  );

  return rows.map(mapOrder);
}

export async function getAuthenticatedMemberOrderBySlug(slug: string): Promise<MedicationOrder | undefined> {
  const memberId = await resolveAuthenticatedMemberId();
  const rows = await neonSqlExecutor<OrderRow>(
    `${orderSelect}
      WHERE o.member_id = $1`,
    [memberId]
  );

  return rows.map(mapOrder).find((order) => order.slug === slug);
}
