import Link from "next/link";
import MemberTopbar from "@/components/member/MemberTopbar";
import PbmScenarioContext from "@/components/member/PbmScenarioContext";
import { getMemberRepository } from "@/lib/data";
import { getAuthenticatedMemberClaims } from "@/lib/data/member-claims";
import { getPbmDemoScenario } from "@/lib/demo/pbm-scenarios";

export default async function PrescriptionsPage({ searchParams }: { searchParams: Promise<{ scenario?: string }> }) {
  const { scenario: scenarioId } = await searchParams;
  const scenario = getPbmDemoScenario(scenarioId);
  const suffix = scenarioId ? `?scenario=${scenario.id}` : "";
  const repository = getMemberRepository();
  const [prescriptions, claims] = await Promise.all([
    repository.getPrescriptions(),
    getAuthenticatedMemberClaims(),
  ]);

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
            {claims.some((claim) => claim.prescriptionId === prescription.id) ? (
              <p><Link className="textButton" href={`/dashboard/claims/${claims.find((claim) => claim.prescriptionId === prescription.id)!.id}`}>View latest related claim</Link></p>
            ) : null}
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
