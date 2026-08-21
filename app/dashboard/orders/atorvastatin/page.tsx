import { notFound } from "next/navigation";
import OrderDetails from "@/components/member/OrderDetails";
import { getAuthenticatedMemberOrderBySlug } from "@/lib/data/member-orders";

export default async function AtorvastatinOrderPage() {
  const order = await getAuthenticatedMemberOrderBySlug("atorvastatin");
  if (!order) notFound();
  return <OrderDetails order={order} />;
}
