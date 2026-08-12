import Link from "next/link";

export default function MessagesPage() {
  return (
    <main className="shell pageWrap">
      <span className="eyebrow">Member dashboard</span>
      <h1>Messages</h1>
      <p className="leadSmall">
        Secure member messages and pharmacy-benefit notifications will appear here.
      </p>

      <div className="toolCard">
        <strong>No new messages</strong>
        <p className="railText">You are all caught up.</p>
      </div>

      <p>
        <Link href="/dashboard" className="textButton">
          &lt;- Back to dashboard
        </Link>
      </p>
    </main>
  );
}
