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
        description="See medications that may require plan approval before they can be covered."
      />

      <article className="panelCard">
        <div className="panelHeader">
          <div><span className="eyebrow">Authorization status</span><h2>Current items</h2></div>
          <Link className="textButton" href="/dashboard/benefits">Back to benefits</Link>
        </div>

        {priorAuthorizations.length > 0 ? priorAuthorizations.map((item) => (
          <div key={`${item.medication}-${item.lastUpdated}`} style={{ marginBottom: "18px" }}>
            <div className="benefitItem"><span>Medication</span><strong>{item.medication}</strong></div>
            <div className="benefitItem"><span>Status</span><strong>{item.status}</strong></div>
            <div className="benefitItem"><span>Requirement</span><strong>{item.requirement}</strong></div>
            <div className="benefitItem"><span>Last updated</span><strong>{item.lastUpdated}</strong></div>
          </div>
        )) : (
          <p className="railText">No current prior-authorization items were found for this member.</p>
        )}

        <p className="railText">Your prescriber typically submits clinical information to the plan when prior authorization is required.</p>
      </article>

      <p className="demoDisclosure">Demo authorization data only. No request has been submitted to a health plan or prescriber.</p>
    </>
  );
}
