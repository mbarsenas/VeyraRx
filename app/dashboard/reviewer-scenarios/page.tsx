import Link from "next/link";
import MemberTopbar from "@/components/member/MemberTopbar";
import { pbmDemoScenarios } from "@/lib/demo/pbm-scenarios";

export default function ReviewerScenariosPage() {
  return (
    <>
      <MemberTopbar
        eyebrow="PBM evaluation"
        title="Reviewer scenarios"
        description="Four synthetic benefit situations designed to surface different pharmacy-benefit concepts for expert review."
      />

      <div className="memberPageGrid">
        {pbmDemoScenarios.map((scenario) => (
          <article className="panelCard" key={scenario.id}>
            <div className="panelHeader">
              <div>
                <span className="eyebrow">{scenario.memberLabel}</span>
                <h2>{scenario.title}</h2>
              </div>
              <span className="statusChip processing">Synthetic</span>
            </div>
            <p className="railText">{scenario.summary}</p>
            <div className="costContextBox">
              <strong>Review objective</strong>
              <p>{scenario.focus}</p>
            </div>
            <div className="pbmTagRow">
              {scenario.highlights.map((highlight) => <span className="pbmTag" key={highlight}>{highlight}</span>)}
            </div>
            <div className="cardActionRow" style={{ marginTop: "16px" }}>
              {scenario.routes.map((route, index) => (
                <Link className={index === 0 ? "button primary" : "button secondary"} href={route} key={route}>
                  {index === 0 ? "Start scenario" : `Open ${route.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ?? "view"}`}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>

      <article className="panelCard" style={{ marginTop: "20px" }}>
        <span className="eyebrow">Reviewer note</span>
        <h2>Scenario data model</h2>
        <p className="railText">
          The current evaluation build uses one linked synthetic member record for interactive persistence. These scenarios are guided PBM review lenses rather than separate live identities, so the reviewer can assess benefit concepts without weakening RLS or creating artificial auth accounts.
        </p>
      </article>
    </>
  );
}
