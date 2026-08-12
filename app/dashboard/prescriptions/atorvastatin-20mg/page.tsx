import Link from "next/link";

export default function AtorvastatinDetailsPage() {
  return (
    <main className="shell pageWrap">
      <Link href="/dashboard/prescriptions" className="textButton">&lt;- Back to prescriptions</Link>
      <span className="eyebrow" style={{display:"block",marginTop:"24px"}}>Prescription details</span>
      <h1>Atorvastatin 20 mg</h1>
      <p className="leadSmall">90-day supply - Processing</p>

      <div className="detailGrid">
        <article className="panelCard">
          <h2>Prescription</h2>
          <div className="benefitItem"><span>Rx number</span><strong>RX-204871</strong></div>
          <div className="benefitItem"><span>Prescriber</span><strong>Dr. Laura Chen</strong></div>
          <div className="benefitItem"><span>Quantity</span><strong>90 tablets</strong></div>
          <div className="benefitItem"><span>Refills remaining</span><strong>1</strong></div>
          <div className="benefitItem"><span>Last filled</span><strong>May 16, 2026</strong></div>
          <div className="benefitItem"><span>Next refill eligible</span><strong>Aug 14, 2026</strong></div>
        </article>

        <article className="panelCard">
          <h2>Coverage & cost</h2>
          <div className="benefitItem"><span>Pharmacy</span><strong>VeyraRx Home Delivery</strong></div>
          <div className="benefitItem"><span>Coverage tier</span><strong>Tier 1</strong></div>
          <div className="benefitItem"><span>Estimated cost</span><strong>$12.00</strong></div>
          <div className="cardActionRow" style={{marginTop:"18px"}}>
            <Link className="button primary" href="/dashboard/orders/atorvastatin">Track order</Link>
            <Link className="button secondary" href="/pricing">Price options</Link>
          </div>
        </article>
      </div>

      <article className="panelCard" style={{marginTop:"20px"}}>
        <h2>Fill history</h2>
        <div className="benefitItem"><span>May 16, 2026</span><strong>90 tablets - $12.00</strong></div>
        <div className="benefitItem"><span>Feb 15, 2026</span><strong>90 tablets - $12.00</strong></div>
      </article>
    </main>
  );
}
