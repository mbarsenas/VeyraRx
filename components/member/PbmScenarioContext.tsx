import Link from "next/link";
import type { PbmDemoScenario } from "@/lib/demo/pbm-scenarios";

export default function PbmScenarioContext({ scenario }: { scenario: PbmDemoScenario }) {
  const e = scenario.economics;
  return (
    <article className="panelCard pbmScenarioContext">
      <div className="panelHeader">
        <div>
          <span className="eyebrow">{scenario.memberLabel} · PBM evaluation</span>
          <h2>{scenario.title}</h2>
          <p className="railText">{scenario.summary}</p>
        </div>
        <Link className="textButton" href="/dashboard/reviewer-scenarios">Change scenario</Link>
      </div>
      <div className="pbmTagRow">
        {scenario.highlights.map((highlight) => <span className="pbmTag" key={highlight}>{highlight}</span>)}
      </div>
      <div className="scenarioEconomicsGrid">
        <div><span>Medication</span><strong>{e.medication}</strong></div>
        <div><span>Formulary / coverage</span><strong>{e.formularyTier} · {e.coverageStatus}</strong></div>
        <div><span>Network</span><strong>{e.networkStatus}</strong></div>
        <div><span>Plan-negotiated amount</span><strong>{e.negotiatedAmount}</strong></div>
        <div><span>Deductible applied</span><strong>{e.deductibleApplied}</strong></div>
        <div><span>Plan paid</span><strong>{e.planPaid}</strong></div>
        <div><span>Member responsibility</span><strong>{e.memberResponsibility}</strong></div>
        <div><span>Cost share</span><strong>{e.copayOrCoinsurance}</strong></div>
      </div>
      <div className="costContextBox">
        <strong>Scenario interpretation</strong>
        <p>{e.accumulatorContext} {e.utilizationManagement !== "None" ? `Utilization management: ${e.utilizationManagement}.` : "No utilization-management requirement in this scenario."}</p>
      </div>
    </article>
  );
}
