import Link from "next/link";

export default function PrescriptionsPage() {
  return (
    <main className="shell pageWrap">
      <span className="eyebrow">Member dashboard</span>
      <h1>My prescriptions</h1>
      <p className="leadSmall">
        View active medications, refill status and recent prescription activity.
      </p>

      <div className="infoGrid">
        <article className="infoCard">
          <h3>Atorvastatin 20 mg</h3>
          <p>90-day supply - Processing</p>
          <Link className="textButton" href="/dashboard/orders/atorvastatin">Track order -&gt;</Link>
        </article>

        <article className="infoCard">
          <h3>Lisinopril 10 mg</h3>
          <p>30-day supply - Refill available</p>
          <div className="cardActionRow">
            <Link className="textButton" href="/dashboard/prescriptions/lisinopril-10mg">View details -&gt;</Link>
            <Link className="textButton" href="/dashboard/prescriptions/lisinopril-10mg/refill">Refill now -&gt;</Link>
          </div>
        </article>

        <article className="infoCard">
          <h3>Metformin ER 500 mg</h3>
          <p>90-day supply - Active</p>
          <Link className="textButton" href="/dashboard/prescriptions">View details -&gt;</Link>
        </article>
      </div>

      <p style={{ marginTop: "30px" }}>
        <Link href="/dashboard" className="textButton">
          &lt;- Back to dashboard
        </Link>
      </p>
    </main>
  );
}
