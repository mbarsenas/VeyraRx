import Link from "next/link";

export default function LisinoprilDetailsPage() {
  return (
    <main className="workflowPage">
      <div className="workflowShell">
        <Link href="/dashboard/prescriptions" className="workflowBack">&lt;- Back to prescriptions</Link>

        <div className="workflowHeader">
          <span className="eyebrow">Prescription details</span>
          <h1>Lisinopril 10 mg</h1>
          <p>30 tablets - Take one tablet by mouth once daily.</p>
        </div>

        <section className="workflowCard prescriptionDetailsCard">
          <div className="detailsHero">
            <div>
              <span className="statusChip attention">Refill available</span>
              <h2>Active prescription</h2>
              <p className="railText">Eligible to refill now at your preferred pharmacy or by home delivery.</p>
            </div>
            <div className="rxLargeBadge">Rx</div>
          </div>

          <div className="detailsGrid">
            <div><span>Rx number</span><strong>RX-2049183</strong></div>
            <div><span>Prescriber</span><strong>Dr. Elena Ramirez</strong></div>
            <div><span>Quantity</span><strong>30 tablets</strong></div>
            <div><span>Refills remaining</span><strong>2</strong></div>
            <div><span>Last filled</span><strong>Jul 12, 2026</strong></div>
            <div><span>Next refill eligibility</span><strong>Available now</strong></div>
            <div><span>Preferred pharmacy</span><strong>H-E-B Pharmacy</strong></div>
            <div><span>Coverage tier</span><strong>Tier 1 Generic</strong></div>
            <div><span>Estimated member cost</span><strong>$8.00</strong></div>
          </div>

          <div className="detailsActions">
            <Link className="button primary" href="/dashboard/prescriptions/lisinopril-10mg/refill">Refill prescription</Link>
            <Link className="button secondary" href="/pharmacies">Transfer prescription</Link>
            <Link className="button secondary" href="/pricing">View price options</Link>
          </div>
        </section>

        <section className="workflowCard detailsSection">
          <span className="eyebrow">Fill history</span>
          <h2>Recent fills</h2>
          <div className="historyTable">
            <div className="historyRow historyHeader"><span>Date</span><span>Pharmacy</span><span>Quantity</span><span>Member cost</span></div>
            <div className="historyRow"><span>Jul 12, 2026</span><span>H-E-B Pharmacy</span><span>30</span><span>$8.00</span></div>
            <div className="historyRow"><span>Jun 12, 2026</span><span>H-E-B Pharmacy</span><span>30</span><span>$8.00</span></div>
            <div className="historyRow"><span>May 13, 2026</span><span>H-E-B Pharmacy</span><span>30</span><span>$8.00</span></div>
          </div>
        </section>

        <section className="workflowCard detailsSection">
          <span className="eyebrow">Medication information</span>
          <h2>About this medication</h2>
          <p className="railText">Lisinopril is commonly used to treat high blood pressure and certain heart conditions. Follow your prescriber's instructions and the directions on your pharmacy label.</p>
          <div className="workflowNotice">Prototype information only. This page does not replace medical advice from a licensed clinician or pharmacist.</div>
        </section>
      </div>
    </main>
  );
}
