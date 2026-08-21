import Link from "next/link";
import type { MedicationOrder } from "@/lib/mock-data/orders";

export default function OrderCard({ order }: { order: MedicationOrder }) {
  const statusClass = order.status === "Processing" ? "statusChip processing" : "statusChip";

  return (
    <article className="panelCard orderCard">
      <div className="panelHeader">
        <div>
          <span className="eyebrow">{order.status === "Delivered" ? "Completed order" : "In progress"}</span>
          <h2>{order.medication} {order.strength}</h2>
        </div>
        <span className={statusClass}>{order.status}</span>
      </div>

      <div className="benefitItem"><span>Order</span><strong>{order.orderNumber}</strong></div>
      <div className="benefitItem"><span>Supply</span><strong>{order.supply}</strong></div>
      <div className="benefitItem"><span>Order date</span><strong>{order.orderDate}</strong></div>
      <div className="benefitItem">
        <span>{order.status === "Delivered" ? "Delivered" : "Estimated arrival"}</span>
        <strong>{order.deliveredDate ?? order.estimatedArrival}</strong>
      </div>

      <Link className="button primary full" href={`/dashboard/orders/${order.slug}`}>
        {order.status === "Delivered" ? "View order" : "Track order"}
      </Link>
    </article>
  );
}
