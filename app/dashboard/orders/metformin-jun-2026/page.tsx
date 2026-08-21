import OrderDetails from "@/components/member/OrderDetails";
import { getOrderBySlug } from "@/lib/mock-data/orders";

export default function MetforminOrderPage() {
  const order = getOrderBySlug("metformin-jun-2026");
  if (!order) return null;
  return <OrderDetails order={order} />;
}
