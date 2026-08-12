import Link from "next/link";
import type { Prescription } from "../../lib/mock-data/member";

type PrescriptionDetailsProps = {
  prescription: Prescription;
};

export default function PrescriptionDetails({ prescription }: PrescriptionDetailsProps) {
  return (
    <main className="shell pageWrap">
      <Link href="/dashboard/prescriptions" className="textButton">
        &lt;- Back to prescriptions
      </Link>

      <span className="eyebrow" style={{ display: "block", marginTop: "24px" }}>
        Prescription details
      </span>
      <h1>
        {prescription.name} {prescription.strength}
      </h1>
      <p className="leadSmall">
        {prescription.supply} - {prescription.status}
      </p>

      <div className="detailGrid">
        <article className="panelCard">
          <h2>Prescription</h2>
          <div className="benefitItem"><span>Rx number</span><strong>{prescription.rxNumber}</strong></div>
          <div className="benefitItem"><span>Prescriber</span><strong>{prescription.prescriber}</strong></div>
          <div className="benefitItem"><span>Quantity</span><strong>{prescription.quantity}</strong></div>
          <div className="benefitItem"><span>Refills remaining</span><strong>{prescription.refillsRemaining}</strong></div>
          <div className="benefitItem"><span>Last filled</span><strong>{prescription.lastFill}</strong></div>
          <div className="benefitItem"><span>Next refill eligible</span><strong>{prescription.nextRefill}</strong></div>
        </article>

        <article className="panelCard">
          <h2>Coverage & cost</h2>
          <div className="benefitItem"><span>Pharmacy</span><strong>{prescription.pharmacy}</strong></div>
          <div className="benefitItem"><span>Coverage tier</span><strong>{prescription.coverageTier}</strong></div>
          <div className="benefitItem"><span>Estimated cost</span><strong>{prescription.estimatedCost}</strong></div>
          <div className="cardActionRow" style={{ marginTop: "18px" }}>
            <Link className="button primary" href={prescription.primaryActionHref}>
              {prescription.primaryActionLabel}
            </Link>
            <Link className="button secondary" href="/pricing">Price options</Link>
          </div>
        </article>
      </div>

      <article className="panelCard" style={{ marginTop: "20px" }}>
        <h2>Fill history</h2>
        {prescription.fillHistory.map((fill) => (
          <div className="benefitItem" key={`${prescription.id}-${fill.date}`}>
            <span>{fill.date}</span>
            <strong>{fill.quantity} - {fill.cost}</strong>
          </div>
        ))}
      </article>
    </main>
  );
}
