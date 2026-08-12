import Link from "next/link";

export default function MetforminDetailsPage() {
  return (
    <main className="shell pageWrap">
      <Link href="/dashboard/prescriptions" className="textButton">&lt;- Back to prescriptions</Link>
      <span className="eyebrow" style={{display:"block",marginTop:"24px"}}>Prescription details</span>
      <h1>Metformin ER 500 mg</h1>
      <p className="leadSmall">90-day supply - Active</p>

      <div className="detailGrid">
        <article className="panelCard">
          <h2>Prescription</h2>
          <div className="benefitItem"><span>Rx number</span><strong>RX-582430</strong></div>
          <div className="benefitItem"><span>Prescriber</span><strong>Dr. Priya Shah</strong></div>
          <div className="benefitItem"><span>Quantity</span><strong>180 tablets</strong></div>
          <div className="benefitItem"><span>Refills remaining</span><strong>3</strong></div>
          <div className="benefitItem"><span>Last filled</span><strong>Jun 28, 2026</strong></div>
          <div className="benefitItem"><span>Next refill eligible</span><strong>Sep 24, 2026</strong></div>
        </article>

        <article className="panelCard">
          <h2>Coverage & cost</h2>
          <div className="benefitItem"><span>Pharmacy</span><strong>H-E-B Pharmacy</strong></div>
          <div className="benefitItem"><span>Coverage tier</span><strong>Tier 1</strong></div>
          <div className="benefitItem"><span>Estimated cost</span><strong>$10.00</strong></div>
          <div className="cardActionRow" style={{marginTop:"18px"}}>
            <Link className="button secondary" href="/pricing">Price options</Link>
          </div>
        </article>
      </div>

      <article className="panelCard" style={{marginTop:"20px"}}>
        <h2>Fill history</h2>
        <div className="benefitItem"><span>Jun 28, 2026</span><strong>180 tablets - $10.00</strong></div>
        <div className="benefitItem"><span>Mar 29, 2026</span><strong>180 tablets - $10.00</strong></div>
      </article>
    </main>
  );
}
