import Link from "next/link";
import MemberTopbar from "@/components/member/MemberTopbar";
import PbmScenarioContext from "@/components/member/PbmScenarioContext";
import { prescriptions } from "@/lib/mock-data/member";
import { getPbmDemoScenario } from "@/lib/demo/pbm-scenarios";

export default async function PrescriptionsPage({ searchParams }: { searchParams: Promise<{ scenario?: string }> }) {
  const { scenario: scenarioId } = await searchParams;
  const scenario = getPbmDemoScenario(scenarioId);
  const suffix = scenarioId ? `?scenario=${scenario.id}` : "";

  return (
    <>
      <MemberTopbar eyebrow="Prescriptions" title="My prescriptions" description="View active medications, refill status, costs and prescription history." />
      {scenarioId && <PbmScenarioContext scenario={scenario} />}
      <div className="infoGrid">
        {prescriptions.map((prescription) => (
          <article className="infoCard" key={prescription.id}>
            <span className={prescription.status === "Refill available" ? "statusChip attention" : prescription.status === "Processing" ? "statusChip processing" : "statusChip"}>{prescription.status}</span>
            <h3>{prescription.name} {prescription.strength}</h3>
            <p>{prescription.supply} · {prescription.pharmacy}</p>
            <div className="cardActionRow prescriptionActions">
              <Link className="textButton" href={`/dashboard/prescriptions/${prescription.slug}${suffix}`}>View details <span aria-hidden="true">→</span></Link>
              {prescription.primaryActionLabel !== "View details" ? <Link className="textButton" href={`${prescription.primaryActionHref}${prescription.primaryActionHref.includes("?") ? "&" : "?"}${scenarioId ? `scenario=${scenario.id}` : ""}`.replace(/\?$/, "")}>{prescription.primaryActionLabel} <span aria-hidden="true">→</span></Link> : null}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
