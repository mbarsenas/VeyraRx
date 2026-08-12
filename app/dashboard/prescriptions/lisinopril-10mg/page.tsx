import Link from "next/link";

export default function LisinoprilDetailsPage() {
  return (
    <main className="shell pageWrap">
      <Link href="/dashboard/prescriptions" className="textButton">&lt;- Back to prescriptions</Link>
      <span className="eyebrow" style={{display:"block",marginTop:"24px"}}>Prescription details</span>
      <h1>Lisinopril 10 mg</h1>
      <p className="leadSmall">30-day supply - Refill available</p>

      <div className="detailGrid">
        <article className="panelCard">
          <h2>Prescription</h2>
          <div className="benefitItem"><span>Rx number</span><strong>RX-361204</strong></div>
          <div className="benefitItem"><span>Prescriber</span><strong>Dr. Samuel Ortiz</strong></div>
          <div className="benefitItem"><span>Quantity</span><strong>30 tablets</strong></div>
          <div className="benefitItem"><span>Refills remaining</span><strong>2</strong></div>
          <div className="benefitItem"><span>Last filled</span><strong>Jul 12, 2026</strong></div>
          <div className="benefitItem"><span>Refill eligible</span><strong>Now</strong></div>
        </article>

        <article className="panelCard">
          <h2>Coverage & cost</h2>
          <div className="benefitItem"><span>Pharmacy</span><strong>H-E-B Pharmacy</strong></div>
          <div className="benefitItem"><span>Coverage tier</span><strong>Tier 1</strong></div>
          <div className="benefitItem"><span>Estimated cost</span><strong>$8.00</strong></div>
          <div className="cardActionRow" style={{marginTop:"18px"}}>
            <Link className="button primary" href="/dashboard/prescriptions/lisinopril-10mg/refill">Refill now</Link>
            <Link className="button secondary" href="/pricing">Price options</Link>
          </div>
        </article>
      </div>

      <article className="panelCard" style={{marginTop:"20px"}}>
        <h2>Fill history</h2>
        <div className="benefitItem"><span>Jul 12, 2026</span><strong>30 tablets - $8.00</strong></div>
        <div className="benefitItem"><span>Jun 12, 2026</span><strong>30 tablets - $8.00</strong></div>
        <div className="benefitItem"><span>May 13, 2026</span><strong>30 tablets - $8.00</strong></div>
      </article>
    </main>
  );
}
