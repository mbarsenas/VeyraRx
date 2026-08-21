import Link from "next/link";
import type { MedicationOrder } from "@/lib/mock-data/orders";

export default function OrderDetails({ order }: { order: MedicationOrder }) {
  return (
    <>
      <Link href="/dashboard/orders" className="textButton">&lt;- Back to orders</Link>

      <div className="workflowHeader orderDetailsHeader">
        <span className="eyebrow">Order details</span>
        <h1>{order.medication} {order.strength}</h1>
        <p>Order {order.orderNumber} - {order.supply}</p>
      </div>

      <section className="workflowCard">
        <div className="orderHero">
          <div>
            <span className={order.status === "Processing" ? "statusChip processing" : "statusChip"}>{order.status}</span>
            <h2>{order.status === "Delivered" ? `Delivered ${order.deliveredDate}` : `Estimated arrival ${order.estimatedArrival}`}</h2>
            <p>{order.status === "Delivered" ? "This medication order has been completed." : "Your prescription is being prepared for shipment."}</p>
          </div>
          <div className="orderPackage">Rx</div>
        </div>

        <div className="orderTimeline">
          {order.timeline.map((step) => (
            <div className={`orderStep ${step.state === "upcoming" ? "" : step.state}`} key={step.label}>
              <span></span>
              <div><strong>{step.label}</strong><small>{step.detail}</small></div>
            </div>
          ))}
        </div>

        <div className="detailGrid orderDetailGrid">
          <article className="panelCard">
            <h2>Medication</h2>
            <div className="benefitItem"><span>Medication</span><strong>{order.medication} {order.strength}</strong></div>
            <div className="benefitItem"><span>Quantity</span><strong>{order.quantity}</strong></div>
            <div className="benefitItem"><span>Supply</span><strong>{order.supply}</strong></div>
            <div className="benefitItem"><span>Member cost</span><strong>{order.memberCost}</strong></div>
          </article>

          <article className="panelCard">
            <h2>Delivery</h2>
            <div className="benefitItem"><span>Method</span><strong>{order.deliveryMethod}</strong></div>
            <div className="benefitItem"><span>Destination</span><strong>{order.deliveryAddress}</strong></div>
            {order.carrier && <div className="benefitItem"><span>Carrier</span><strong>{order.carrier}</strong></div>}
            {order.trackingNumber && <div className="benefitItem"><span>Tracking</span><strong>{order.trackingNumber}</strong></div>}
          </article>
        </div>
      </section>

      <p className="demoDisclosure">Prototype order data only. No pharmacy fulfillment or carrier systems are connected.</p>
    </>
  );
}
