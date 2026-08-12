import Link from "next/link";
import { prescriptions } from "@/lib/mock-data/member";

export default function PrescriptionsPage() {
  return (
    <main className="shell pageWrap">
      <span className="eyebrow">Member dashboard</span>
      <h1>My prescriptions</h1>
      <p className="leadSmall">View active medications, refill status and recent prescription activity.</p>

      <div className="infoGrid">
        {prescriptions.map((prescription) => (
          <article className="infoCard" key={prescription.id}>
            <h3>{prescription.name} {prescription.strength}</h3>
            <p>{prescription.supply} - {prescription.status}</p>
            <div className="cardActionRow">
              <Link className="textButton" href={`/dashboard/prescriptions/${prescription.slug}`}>
                View details -&gt;
              </Link>
              {prescription.primaryActionLabel !== "View details" && (
                <Link className="textButton" href={prescription.primaryActionHref}>
                  {prescription.primaryActionLabel} -&gt;
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      <p style={{ marginTop: "30px" }}>
        <Link href="/dashboard" className="textButton">&lt;- Back to dashboard</Link>
      </p>
    </main>
  );
}
