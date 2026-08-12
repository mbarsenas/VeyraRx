import Link from "next/link";

export default function PrescriptionsPage() {
  return (
    <main className="shell pageWrap">
      <span className="eyebrow">Member dashboard</span>
      <h1>My prescriptions</h1>
      <p className="leadSmall">View active medications, refill status and recent prescription activity.</p>
      <div className="infoGrid">
        <article className="infoCard"><h3>Atorvastatin 20 mg</h3><p>90-day supply · Processing</p><button className="textButton">Track order →</button></article>
        <article className="infoCard"><h3>Lisinopril 10 mg</h3><p>30-day supply · Refill available</p><button className="textButton">Refill now →</button></article>
        <article className="infoCard"><h3>Metformin ER 500 mg</h3><p>90-day supply · Active</p><button className="textButton">View details →</button></article>
      </div>
      <p style={{marginTop:"30px"}}><Link href="/dashboard" className="textButton">← Back to dashboard</Link></p>
    </main>
  );
}
