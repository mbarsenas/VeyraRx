import Link from "next/link";
import type { MedicationOrder } from "@/lib/domain/order";

export default function OrderDetails({ order }: { order: MedicationOrder }) {
  const timeline = order.timeline ?? [];

  return (
    <>
      <Link href="/dashboard/orders" className="textButton">&lt;- Back to orders</Link>

      <div className="workflowHeader orderDetailsHeader">
        <span className="eyebrow">Order details</span>
        <h1>{order.medication}</h1>
        <p>Order {order.orderNumber} - {order.supply}</p>
      </div>

      <section className="workflowCard">
        <div className="orderHero">
          <div>
            <span className={order.status === "Processing" ? "statusChip processing" : "statusChip"}>{order.status}</span>
            <h2>
              {order.status === "Delivered"
                ? `Delivered ${order.deliveredDate ?? ""}`
                : order.status === "Shipped"
                  ? "Your order is on the way"
                  : order.status === "Ready for pickup"
                    ? "Ready for pickup"
                    : order.status === "Cancelled"
                      ? "Order cancelled"
                      : "Order is being prepared"}
            </h2>
            <p>
              {order.status === "Delivered"
                ? "This medication order has been completed."
                : order.status === "Cancelled"
                  ? "This medication order is no longer being fulfilled."
                  : "Track the latest fulfillment status below."}
            </p>
          </div>
          <div className="orderPackage">Rx</div>
        </div>

        <div className="orderTimeline">
          {timeline.map((step) => (
            <div className={`orderStep ${step.state === "upcoming" ? "" : step.state}`} key={`${step.label}-${step.detail}`}>
              <span></span>
              <div><strong>{step.label}</strong><small>{step.detail}</small></div>
            </div>
          ))}
        </div>

        <div className="detailGrid orderDetailGrid">
          <article className="panelCard">
            <h2>Medication</h2>
            <div className="benefitItem"><span>Medication</span><strong>{order.medication}</strong></div>
            <div className="benefitItem"><span>Quantity</span><strong>{order.quantity}</strong></div>
            <div className="benefitItem"><span>Supply</span><strong>{order.supply}</strong></div>
            <div className="benefitItem"><span>Member cost</span><strong>{order.memberCost}</strong></div>
            <div className="benefitItem"><span>Order date</span><strong>{order.orderDate}</strong></div>
          </article>

          <article className="panelCard">
            <h2>Delivery</h2>
            <div className="benefitItem"><span>Method</span><strong>{order.deliveryMethod}</strong></div>
            {order.deliveryAddress && <div className="benefitItem"><span>Destination</span><strong>{order.deliveryAddress}</strong></div>}
            {order.shippedDate && <div className="benefitItem"><span>Shipped</span><strong>{order.shippedDate}</strong></div>}
            {order.deliveredDate && <div className="benefitItem"><span>Delivered</span><strong>{order.deliveredDate}</strong></div>}
            {order.carrier && <div className="benefitItem"><span>Carrier</span><strong>{order.carrier}</strong></div>}
            {order.trackingNumber && <div className="benefitItem"><span>Tracking</span><strong>{order.trackingNumber}</strong></div>}
          </article>
        </div>
      </section>

      <p className="demoDisclosure">Demo order records are stored in Neon. No live pharmacy fulfillment or carrier systems are connected yet.</p>
    </>
  );
}
