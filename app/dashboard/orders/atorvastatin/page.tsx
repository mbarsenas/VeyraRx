import OrderDetails from "@/components/member/OrderDetails";
import { getOrderBySlug } from "@/lib/mock-data/orders";

export default function AtorvastatinOrderPage() {
  const order = getOrderBySlug("atorvastatin");
  if (!order) return null;
  return <OrderDetails order={order} />;
}
