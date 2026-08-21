import Link from "next/link";
import MemberTopbar from "@/components/member/MemberTopbar";
import { prescriptions } from "@/lib/mock-data/member";

export default function PrescriptionsPage() {
  return (
    <>
      <MemberTopbar eyebrow="Prescriptions" title="My prescriptions" description="View active medications, refill status, costs and prescription history." />
      <div className="infoGrid">
        {prescriptions.map((prescription) => (
          <article className="infoCard" key={prescription.id}>
            <span className={prescription.status === "Refill available" ? "statusChip attention" : prescription.status === "Processing" ? "statusChip processing" : "statusChip"}>{prescription.status}</span>
            <h3>{prescription.name} {prescription.strength}</h3>
            <p>{prescription.supply} · {prescription.pharmacy}</p>
            <div className="cardActionRow">
              <Link className="textButton" href={`/dashboard/prescriptions/${prescription.slug}`}>View details -&gt;</Link>
              {prescription.primaryActionLabel !== "View details" ? <Link className="textButton" href={prescription.primaryActionHref}>{prescription.primaryActionLabel} -&gt;</Link> : null}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
