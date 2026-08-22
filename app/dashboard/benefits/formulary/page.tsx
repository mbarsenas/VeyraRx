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
        description="Review formulary status, benefit tier, utilization-management status and illustrative member cost."
      />

      <article className="panelCard">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">Plan formulary</span>
            <h2>Medication coverage</h2>
            <p className="railText">Formulary placement can affect member cost and may include prior authorization, step therapy or quantity-limit requirements.</p>
          </div>
          <Link className="textButton" href="/dashboard/benefits">Back to benefits</Link>
        </div>

        {formularyMedications.length > 0 ? formularyMedications.map((drug) => (
          <article className="formularyRow" key={`${drug.name}-${drug.strength}`}>
            <div>
              <strong>{drug.name} {drug.strength}</strong>
              <span>{drug.tier}</span>
            </div>
            <div className="formularyMeta">
              <span className={drug.status === "Covered" ? "statusChip processing" : "statusChip attention"}>{drug.status}</span>
              <strong>{drug.estimatedCost}</strong>
              <small>Illustrative member cost</small>
            </div>
          </article>
        )) : (
          <p className="railText">No formulary medications are available for this plan.</p>
        )}
      </article>

      <article className="panelCard" style={{ marginTop: "20px" }}>
        <span className="eyebrow">How to read this</span>
        <h2>Coverage status is not the same as a final claim result</h2>
        <p className="railText">A medication may be on formulary and still require utilization management. Final member responsibility depends on active eligibility, benefit stage, pharmacy, quantity, day supply and claim adjudication.</p>
      </article>

      <p className="demoDisclosure">Synthetic formulary data only. Coverage may vary by plan, diagnosis, quantity, day supply, pharmacy network and utilization-management criteria.</p>
    </>
  );
}
