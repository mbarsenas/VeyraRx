import Link from "next/link";
import MemberTopbar from "@/components/member/MemberTopbar";
import { formularyMedications } from "@/lib/mock-data/benefits";

export default function FormularyPage() {
  return (
    <>
      <MemberTopbar
        eyebrow="Benefits & coverage"
        title="Medication formulary"
        description="Review sample medication coverage, tiers and estimated member costs."
      />

      <article className="panelCard">
        <div className="panelHeader">
          <div><span className="eyebrow">Covered medications</span><h2>Your formulary</h2></div>
          <Link className="textButton" href="/dashboard/benefits">Back to benefits</Link>
        </div>

        {formularyMedications.map((drug) => (
          <div className="benefitItem" key={`${drug.name}-${drug.strength}`}>
            <span>{drug.name} {drug.strength}</span>
            <strong>{drug.tier} - {drug.status} - {drug.estimatedCost}</strong>
          </div>
        ))}
      </article>

      <p className="demoDisclosure">Prototype formulary only. Coverage may vary by plan, diagnosis, quantity, pharmacy and authorization criteria.</p>
    </>
  );
}
