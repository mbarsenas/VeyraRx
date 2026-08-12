import Link from "next/link";

export default function MetforminDetailsPage() {
  return (
    <main className="workflowPage">
      <div className="workflowShell">
        <Link href="/dashboard/prescriptions" className="workflowBack">&lt;- Back to prescriptions</Link>
        <div className="workflowHeader">
          <span className="eyebrow">Prescription details</span>
          <h1>Metformin ER 500 mg</h1>
          <p>90-day supply · Active</p>
        </div>

        <section className="workflowCard">
          <div className="reviewRows">
            <div><span>Rx number</span><strong>RX-MET-504821</strong></div>
            <div><span>Prescriber</span><strong>Dr. Elena Ramirez</strong></div>
            <div><span>Quantity</span><strong>180 tablets</strong></div>
            <div><span>Refills remaining</span><strong>3</strong></div>
            <div><span>Last fill</span><strong>Jul 2, 2026</strong></div>
            <div><span>Next refill eligibility</span><strong>Sep 30, 2026</strong></div>
            <div><span>Preferred pharmacy</span><strong>H-E-B Pharmacy</strong></div>
            <div><span>Coverage tier</span><strong>Tier 1 generic</strong></div>
            <div><span>Estimated member cost</span><strong>$9.00</strong></div>
          </div>

          <div className="workflowActions">
            <Link className="button primary" href="/dashboard/prescriptions">Refill when eligible</Link>
            <Link className="button secondary" href="/pharmacies">Transfer</Link>
            <Link className="button secondary" href="/pricing">Price options</Link>
          </div>
        </section>

        <section className="workflowCard" style={{ marginTop: "20px" }}>
          <span className="eyebrow">Fill history</span>
          <h2>Recent fills</h2>
          <div className="reviewRows compactReview">
            <div><span>Jul 2, 2026</span><strong>180 tablets · $9.00</strong></div>
            <div><span>Apr 2, 2026</span><strong>180 tablets · $9.00</strong></div>
            <div><span>Jan 2, 2026</span><strong>180 tablets · $9.00</strong></div>
          </div>
        </section>
      </div>
    </main>
  );
}
