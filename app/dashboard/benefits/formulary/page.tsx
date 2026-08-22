import Link from "next/link";
import MemberTopbar from "@/components/member/MemberTopbar";
import { getMemberRepository } from "@/lib/data";

export default async function FormularyPage() {
  const formularyMedications = await getMemberRepository().getFormularyMedications();

  return (
    <>
      <MemberTopbar
        eyebrow="Benefits & coverage"
        title="Medication formulary"
        description="Review medication coverage, tiers and estimated member costs."
      />

      <article className="panelCard">
        <div className="panelHeader">
          <div><span className="eyebrow">Covered medications</span><h2>Your formulary</h2></div>
          <Link className="textButton" href="/dashboard/benefits">Back to benefits</Link>
        </div>

        {formularyMedications.length > 0 ? formularyMedications.map((drug) => (
          <div className="benefitItem" key={`${drug.name}-${drug.strength}`}>
            <span>{drug.name} {drug.strength}</span>
            <strong>{drug.tier} - {drug.status} - {drug.estimatedCost}</strong>
          </div>
        )) : (
          <p className="railText">No formulary medications are available for this plan.</p>
        )}
      </article>

      <p className="demoDisclosure">Demo formulary data only. Coverage may vary by plan, diagnosis, quantity, pharmacy and authorization criteria.</p>
    </>
  );
}
