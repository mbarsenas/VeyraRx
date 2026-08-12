import Link from "next/link";

export default function AtorvastatinOrderPage() {
  return (
    <main className="workflowPage">
      <div className="workflowShell">
        <Link href="/dashboard" className="workflowBack">
          &lt;- Back to dashboard
        </Link>

        <div className="workflowHeader">
          <span className="eyebrow">Order tracking</span>
          <h1>Atorvastatin 20 mg</h1>
          <p>Order VYR-883921 - 90-day supply</p>
        </div>

        <section className="workflowCard">
          <div className="orderHero">
            <div>
              <span className="statusChip processing">Processing</span>
              <h2>Estimated arrival Aug 14</h2>
              <p>Your prescription is being prepared for shipment.</p>
            </div>
            <div className="orderPackage">Rx</div>
          </div>

          <div className="orderTimeline">
            <div className="orderStep complete">
              <span></span>
              <div><strong>Order received</strong><small>Aug 11 - 5:58 PM</small></div>
            </div>
            <div className="orderStep complete">
              <span></span>
              <div><strong>Prescription verified</strong><small>Aug 11 - 6:21 PM</small></div>
            </div>
            <div className="orderStep current">
              <span></span>
              <div><strong>Processing</strong><small>Medication is being prepared</small></div>
            </div>
            <div className="orderStep">
              <span></span>
              <div><strong>Shipped</strong><small>Tracking information will appear here</small></div>
            </div>
            <div className="orderStep">
              <span></span>
              <div><strong>Delivered</strong><small>Expected Aug 14</small></div>
            </div>
          </div>

          <div className="reviewRows compactReview">
            <div><span>Medication</span><strong>Atorvastatin 20 mg</strong></div>
            <div><span>Quantity</span><strong>90 tablets</strong></div>
            <div><span>Delivery</span><strong>Standard home delivery</strong></div>
            <div><span>Estimated member cost</span><strong>$12.00</strong></div>
          </div>

          <div className="workflowActions">
            <Link className="button primary" href="/dashboard">Return to dashboard</Link>
          </div>
        </section>

        <p className="demoDisclosure">
          Prototype tracking data only. This page is not connected to a pharmacy fulfillment system.
        </p>
      </div>
    </main>
  );
}
