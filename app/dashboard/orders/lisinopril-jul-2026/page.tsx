import { notFound } from "next/navigation";
import OrderDetails from "@/components/member/OrderDetails";
import { getAuthenticatedMemberOrderBySlug } from "@/lib/data/member-orders";

export default async function LisinoprilOrderPage() {
  const order = await getAuthenticatedMemberOrderBySlug("lisinopril-jul-2026");
  if (!order) notFound();
  return <OrderDetails order={order} />;
}
