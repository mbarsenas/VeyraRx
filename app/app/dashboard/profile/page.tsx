import Link from "next/link";
export default function ProfilePage() {
  return <main className="shell pageWrap">
    <span className="eyebrow">Member dashboard</span><h1>Profile</h1>
    <p className="leadSmall">Manage contact information, communication preferences and account settings.</p>
    <div className="toolCard">
      <label>Email</label><input value="mark@example.com" readOnly />
      <label>Phone</label><input value="(210) 555-0148" readOnly />
      <label>Preferred communication</label><input value="Email" readOnly />
    </div>
    <p><Link href="/dashboard" className="textButton">← Back to dashboard</Link></p>
  </main>
}
