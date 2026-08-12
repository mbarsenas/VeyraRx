import Link from "next/link";

export default function AtorvastatinDetailsPage() {
  return (
    <main className="workflowPage">
      <div className="workflowShell">
        <Link href="/dashboard/prescriptions" className="workflowBack">&lt;- Back to prescriptions</Link>
        <div className="workflowHeader">
          <span className="eyebrow">Prescription details</span>
          <h1>Atorvastatin 20 mg</h1>
          <p>90-day supply · Processing</p>
        </div>

        <section className="workflowCard">
          <div className="reviewRows">
            <div><span>Rx number</span><strong>RX-ATV-204821</strong></div>
            <div><span>Prescriber</span><strong>Dr. Elena Ramirez</strong></div>
            <div><span>Quantity</span><strong>90 tablets</strong></div>
            <div><span>Refills remaining</span><strong>1</strong></div>
            <div><span>Last fill</span><strong>May 15, 2026</strong></div>
            <div><span>Next refill eligibility</span><strong>Aug 13, 2026</strong></div>
            <div><span>Preferred pharmacy</span><strong>VeyraRx Home Delivery</strong></div>
            <div><span>Coverage tier</span><strong>Tier 1 generic</strong></div>
            <div><span>Estimated member cost</span><strong>$12.00</strong></div>
          </div>

          <div className="workflowActions">
            <Link className="button secondary" href="/dashboard/orders/atorvastatin">Track order</Link>
            <Link className="button secondary" href="/pricing">Price options</Link>
          </div>
        </section>

        <section className="workflowCard" style={{ marginTop: "20px" }}>
          <span className="eyebrow">Fill history</span>
          <h2>Recent fills</h2>
          <div className="reviewRows compactReview">
            <div><span>May 15, 2026</span><strong>90 tablets · $12.00</strong></div>
            <div><span>Feb 14, 2026</span><strong>90 tablets · $12.00</strong></div>
          </div>
        </section>
      </div>
    </main>
  );
}
