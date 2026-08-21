import Link from "next/link";
import type { MedicationOrder } from "@/lib/domain/order";

export default function OrderCard({ order }: { order: MedicationOrder }) {
  const statusClass = order.status === "Processing" ? "statusChip processing" : "statusChip";
  const completed = order.status === "Delivered" || order.status === "Cancelled";

  return (
    <article className="panelCard orderCard">
      <div className="panelHeader">
        <div>
          <span className="eyebrow">{completed ? "Completed order" : "In progress"}</span>
          <h2>{order.medication}</h2>
        </div>
        <span className={statusClass}>{order.status}</span>
      </div>

      <div className="benefitItem"><span>Order</span><strong>{order.orderNumber}</strong></div>
      <div className="benefitItem"><span>Supply</span><strong>{order.supply}</strong></div>
      <div className="benefitItem"><span>Order date</span><strong>{order.orderDate}</strong></div>
      <div className="benefitItem"><span>Member cost</span><strong>{order.memberCost}</strong></div>
      {order.deliveredDate && <div className="benefitItem"><span>Delivered</span><strong>{order.deliveredDate}</strong></div>}

      <Link className="button primary full" href={`/dashboard/orders/${order.slug}`}>
        {completed ? "View order" : "Track order"}
      </Link>
    </article>
  );
}
