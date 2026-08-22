"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { pbmDemoScenarios } from "@/lib/demo/pbm-scenarios";

export default function PbmScenarioPanel() {
  const [activeId, setActiveId] = useState(pbmDemoScenarios[0].id);
  const active = useMemo(() => pbmDemoScenarios.find((scenario) => scenario.id === activeId) ?? pbmDemoScenarios[0], [activeId]);

  return (
    <section className="pbmScenarioPanel">
      <div className="pbmScenarioHeader">
        <div>
          <span className="eyebrow">PBM reviewer scenarios</span>
          <h2>Explore benefit situations</h2>
          <p className="railText">Use these synthetic scenarios as guided review paths. They are designed to surface different PBM concepts without introducing live member data.</p>
        </div>
      </div>

      <div className="pbmScenarioTabs" role="tablist" aria-label="PBM reviewer scenarios">
        {pbmDemoScenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            className={scenario.id === active.id ? "pbmScenarioTab active" : "pbmScenarioTab"}
            onClick={() => setActiveId(scenario.id)}
          >
            <span>{scenario.memberLabel}</span>
            <strong>{scenario.title}</strong>
          </button>
        ))}
      </div>

      <article className="panelCard pbmScenarioDetail">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">{active.memberLabel}</span>
            <h2>{active.title}</h2>
          </div>
          <span className="statusChip processing">Synthetic</span>
        </div>
        <p className="railText">{active.summary}</p>
        <div className="costContextBox">
          <strong>What the reviewer should evaluate</strong>
          <p>{active.focus}</p>
        </div>
        <div className="pbmTagRow">
          {active.highlights.map((highlight) => <span className="pbmTag" key={highlight}>{highlight}</span>)}
        </div>
        <div className="cardActionRow" style={{ marginTop: "16px" }}>
          {active.routes.map((route, index) => (
            <Link className={index === 0 ? "button primary" : "button secondary"} href={route} key={route}>
              {index === 0 ? "Start scenario" : `Open ${route.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ?? "view"}`}
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
}
