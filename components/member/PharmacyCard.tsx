import Link from "next/link";
import type { PreferredPharmacySummary } from "@/lib/domain/member";

export default function PharmacyCard({ pharmacy }: { pharmacy: PreferredPharmacySummary }) {
  return (
    <article className="panelCard">
      <span className="eyebrow">Preferred pharmacy</span>
      <h2>{pharmacy.name}</h2>
      <p className="railText">{pharmacy.location}<br />{pharmacy.distance}</p>
      <Link href="/dashboard/pharmacy" className="textButton">Find another pharmacy -&gt;</Link>
    </article>
  );
}
