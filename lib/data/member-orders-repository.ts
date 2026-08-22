import type { MedicationOrder, OrderStatus, OrderTimelineStep } from "@/lib/domain/order";

type OrderRow = { id: string; order_number: string; medication_name: string; fulfillment_type: string; status: OrderStatus; quantity: number | null; days_supply: number | null; member_cost_cents: number; placed_at: string; shipped_at: string | null; delivered_at: string | null; tracking_number: string | null; carrier: string | null; pharmacy_id?: string | null; pharmacy_name: string | null; city: string | null; state: string | null; postal_code: string | null };
type PharmacyRow = { id: string; name: string; city: string; state: string; postal_code: string };
type SelectApi = <T>(table: string, select: string, filters?: string[], order?: string, limit?: number) => Promise<T[]>;
type Sql = <T = Record<string, unknown>>(statement: string, params?: unknown[]) => Promise<T[]>;
type Dependencies = { resolveMemberId: () => Promise<string>; isDataApi: () => boolean; selectFromDataApi: SelectApi; executeSql: Sql };
const columns = "id,order_number,medication_name,fulfillment_type,status,quantity,days_supply,member_cost_cents,placed_at,shipped_at,delivered_at,tracking_number,carrier,pharmacy_id";
const pharmacyColumns = "id,name,city,state,postal_code";
const sqlSelect = `SELECT o.id, o.order_number, o.medication_name, o.fulfillment_type, o.status, o.quantity, o.days_supply, o.member_cost_cents, o.placed_at, o.shipped_at, o.delivered_at, o.tracking_number, o.carrier, p.name AS pharmacy_name, p.city, p.state, p.postal_code FROM member_orders o LEFT JOIN pharmacies p ON p.id = o.pharmacy_id`;
const eq = (value: string) => `eq.${encodeURIComponent(value)}`;
const date = (value: string | null) => value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value)) : undefined;
const dateTime = (value: string | null) => value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(value)) : undefined;
const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
function slug(row: OrderRow) { if (row.id === "order-atorvastatin-aug-2026") return "atorvastatin"; if (row.id === "order-lisinopril-jul-2026") return "lisinopril-jul-2026"; if (row.id === "order-metformin-jun-2026") return "metformin-jun-2026"; return row.id.replace(/^order-/, ""); }
function address(row: OrderRow) { if (row.fulfillment_type === "Retail pickup" && row.pharmacy_name) return [row.pharmacy_name, row.city, row.state].filter(Boolean).join(" - "); return [row.city, row.state, row.postal_code].filter(Boolean).join(" ") || undefined; }
function timeline(row: OrderRow): OrderTimelineStep[] {
  const placed = dateTime(row.placed_at) ?? "Order received"; const shipped = dateTime(row.shipped_at); const delivered = dateTime(row.delivered_at);
  if (row.status === "Delivered") return [{ label: "Order received", detail: placed, state: "complete" }, ...(shipped ? [{ label: "Shipped", detail: shipped, state: "complete" } as OrderTimelineStep] : []), { label: "Delivered", detail: delivered ?? "Completed", state: "complete" }];
  if (row.status === "Shipped") return [{ label: "Order received", detail: placed, state: "complete" }, { label: "Shipped", detail: shipped ?? "In transit", state: "current" }, { label: "Delivered", detail: "Pending delivery", state: "upcoming" }];
  if (row.status === "Ready for pickup") return [{ label: "Order received", detail: placed, state: "complete" }, { label: "Ready for pickup", detail: row.pharmacy_name ?? "Your pharmacy", state: "current" }, { label: "Delivered", detail: "Pending pickup", state: "upcoming" }];
  if (row.status === "Cancelled") return [{ label: "Order received", detail: placed, state: "complete" }, { label: "Cancelled", detail: "This order was cancelled", state: "current" }];
  return [{ label: "Order received", detail: placed, state: "complete" }, { label: "Processing", detail: "Medication is being prepared", state: "current" }, { label: "Shipped", detail: "Tracking information will appear here", state: "upcoming" }, { label: "Delivered", detail: "Pending fulfillment", state: "upcoming" }];
}
const mapOrder = (row: OrderRow): MedicationOrder => ({ id: row.id, slug: slug(row), orderNumber: row.order_number, medication: row.medication_name, quantity: row.quantity ? `${row.quantity} tablets` : "Not available", supply: row.days_supply ? `${row.days_supply}-day supply` : "Not available", status: row.status, orderDate: date(row.placed_at) ?? "Not available", shippedDate: date(row.shipped_at), deliveredDate: date(row.delivered_at), deliveryMethod: row.fulfillment_type, deliveryAddress: address(row), trackingNumber: row.tracking_number ?? undefined, carrier: row.carrier ?? undefined, memberCost: money(row.member_cost_cents), timeline: timeline(row) });

export function createMemberOrdersRepository(dependencies: Dependencies) {
  async function list(): Promise<MedicationOrder[]> {
    const memberId = await dependencies.resolveMemberId();
    if (!dependencies.isDataApi()) return (await dependencies.executeSql<OrderRow>(`${sqlSelect} WHERE o.member_id = $1 ORDER BY o.placed_at DESC`, [memberId])).map(mapOrder);
    const orders = await dependencies.selectFromDataApi<OrderRow>("member_orders", columns, [`member_id=${eq(memberId)}`], "placed_at.desc");
    const pharmacies = await dependencies.selectFromDataApi<PharmacyRow>("pharmacies", pharmacyColumns);
    const byId = new Map(pharmacies.map((item) => [item.id, item]));
    return orders.map((order) => { const pharmacy = order.pharmacy_id ? byId.get(order.pharmacy_id) : undefined; return mapOrder({ ...order, pharmacy_name: pharmacy?.name ?? null, city: pharmacy?.city ?? null, state: pharmacy?.state ?? null, postal_code: pharmacy?.postal_code ?? null }); });
  }
  async function findBySlug(value: string) { return (await list()).find((order) => order.slug === value); }
  return { list, findBySlug };
}
