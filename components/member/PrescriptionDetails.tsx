import Link from "next/link";
import PbmScenarioContext from "@/components/member/PbmScenarioContext";
import type { Prescription } from "../../lib/mock-data/member";
import type { PbmDemoScenario } from "@/lib/demo/pbm-scenarios";

type PrescriptionDetailsProps = {
  prescription: Prescription;
  scenario?: PbmDemoScenario;
};

function inferUtilizationManagement(prescription: Prescription) {
  const combined = `${prescription.coverageTier} ${prescription.status}`.toLowerCase();
  if (combined.includes("prior authorization")) return "Prior authorization applies";
  if (combined.includes("step")) return "Step therapy applies";
  if (combined.includes("quantity")) return "Quantity limit applies";
  return "No utilization-management flag in this demo scenario";
}

export default function PrescriptionDetails({ prescription, scenario }: PrescriptionDetailsProps) {
  const suffix = scenario ? `?scenario=${scenario.id}` : "";

  return (
    <main className="shell pageWrap">
      <Link href={`/dashboard/prescriptions${suffix}`} className="textButton">
        ← Back to prescriptions
      </Link>

      {scenario && <PbmScenarioContext scenario={scenario} />}

      <span className="eyebrow" style={{ display: "block", marginTop: "24px" }}>
        Prescription details
      </span>
      <h1>
        {prescription.name} {prescription.strength}
      </h1>
      <p className="leadSmall">
        {prescription.supply} · {prescription.status}
      </p>

      <div className="pbmTagRow">
        <span className="pbmTag good">{prescription.coverageTier}</span>
        <span className="pbmTag">{prescription.pharmacy}</span>
        <span className="pbmTag">{inferUtilizationManagement(prescription)}</span>
      </div>

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
          <h2>Coverage & member cost</h2>
          <div className="benefitItem"><span>Dispensing pharmacy</span><strong>{prescription.pharmacy}</strong></div>
          <div className="benefitItem"><span>Formulary / benefit tier</span><strong>{prescription.coverageTier}</strong></div>
          <div className="benefitItem"><span>Estimated member responsibility</span><strong>{prescription.estimatedCost}</strong></div>
          <div className="benefitItem"><span>Utilization management</span><strong>{inferUtilizationManagement(prescription)}</strong></div>

          <div className="costContextBox">
            <strong>Evaluation cost context</strong>
            <p>This amount is based on synthetic benefit data. A production member cost would be determined from current eligibility, formulary rules, network status, accumulators and claim adjudication.</p>
          </div>

          <div className="cardActionRow" style={{ marginTop: "18px" }}>
            <Link className="button primary" href={`${prescription.primaryActionHref}${suffix}`}>
              {prescription.primaryActionLabel}
            </Link>
            <Link className="button secondary" href={`/pricing${suffix}`}>Compare price options</Link>
          </div>
        </article>
      </div>

      <article className="panelCard" style={{ marginTop: "20px" }}>
        <h2>Fill history</h2>
        <p className="railText">Synthetic paid-fill history for evaluation. Amounts shown are prior member-paid amounts in this demo scenario.</p>
        {prescription.fillHistory.map((fill) => (
          <div className="benefitItem" key={`${prescription.id}-${fill.date}`}>
            <span>{fill.date}</span>
            <strong>{fill.quantity} · {fill.cost}</strong>
          </div>
        ))}
      </article>
    </main>
  );
}
