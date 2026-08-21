import { notFound } from "next/navigation";
import OrderDetails from "@/components/member/OrderDetails";
import { getAuthenticatedMemberOrderBySlug } from "@/lib/data/member-orders";

export default async function MetforminOrderPage() {
  const order = await getAuthenticatedMemberOrderBySlug("metformin-jun-2026");
  if (!order) notFound();
  return <OrderDetails order={order} />;
}
