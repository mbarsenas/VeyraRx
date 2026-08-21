import OrderDetails from "@/components/member/OrderDetails";
import { getOrderBySlug } from "@/lib/mock-data/orders";

export default function LisinoprilOrderPage() {
  const order = getOrderBySlug("lisinopril-jul-2026");
  if (!order) return null;
  return <OrderDetails order={order} />;
}
