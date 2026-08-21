import Link from "next/link";
import { member } from "@/lib/mock-data/member";

export default function PharmacyCard() {
  return (
    <article className="panelCard">
      <span className="eyebrow">Preferred pharmacy</span>
      <h2>{member.preferredPharmacy.name}</h2>
      <p className="railText">{member.preferredPharmacy.location}<br />{member.preferredPharmacy.distance}</p>
      <Link href="/dashboard/pharmacy" className="textButton">Find another pharmacy -&gt;</Link>
    </article>
  );
}
