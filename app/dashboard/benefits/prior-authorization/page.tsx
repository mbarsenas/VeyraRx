import Link from "next/link";
import MemberTopbar from "@/components/member/MemberTopbar";
import { getMemberRepository } from "@/lib/data";

export default async function PriorAuthorizationPage() {
  const priorAuthorizations = await getMemberRepository().getPriorAuthorizations();

  return (
    <>
      <MemberTopbar
        eyebrow="Benefits & coverage"
        title="Prior authorization"
        description="Track medication requests that require clinical review before plan coverage can be determined."
      />

      <article className="panelCard">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">Utilization management</span>
            <h2>Current authorization activity</h2>
            <p className="railText">Prior authorization is a coverage review. It does not guarantee payment, a specific member cost or dispensing until the pharmacy claim is adjudicated.</p>
          </div>
          <Link className="textButton" href="/dashboard/benefits">Back to benefits</Link>
        </div>

        {priorAuthorizations.length > 0 ? priorAuthorizations.map((item) => (
          <article className="paItem" key={`${item.medication}-${item.lastUpdated}`}>
            <div className="panelHeader">
              <div>
                <span className="eyebrow">Medication request</span>
                <h2>{item.medication}</h2>
              </div>
              <span className={item.status.toLowerCase().includes("approved") ? "statusChip processing" : "statusChip attention"}>{item.status}</span>
            </div>
            <div className="benefitItem"><span>Clinical requirement</span><strong>{item.requirement}</strong></div>
            <div className="benefitItem"><span>Last status update</span><strong>{item.lastUpdated}</strong></div>
            <div className="benefitItem"><span>Typical next step</span><strong>Prescriber or plan review</strong></div>
          </article>
        )) : (
          <p className="railText">No current prior-authorization activity was found for this member.</p>
        )}
      </article>

      <article className="panelCard" style={{ marginTop: "20px" }}>
        <span className="eyebrow">Member guidance</span>
        <h2>What usually happens next</h2>
        <p className="railText">When prior authorization is required, the prescriber generally submits diagnosis and clinical information to the plan or PBM for review. The final coverage decision may approve, deny or request additional information, and the pharmacy claim still determines the final member responsibility.</p>
      </article>

      <p className="demoDisclosure">Synthetic authorization data only. No request has been submitted to a health plan, PBM, pharmacy or prescriber.</p>
    </>
  );
}
