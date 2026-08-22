import Link from "next/link";
import { getAuthenticatedMemberClaims } from "@/lib/data/member-claims";

export const dynamic = "force-dynamic";

export default async function ClaimsPage() {
  const claims = await getAuthenticatedMemberClaims();

  return (
    <main>
      <section className="dashboard-page-header">
        <p className="eyebrow">CLAIMS</p>
        <h1>Pharmacy claims</h1>
        <p>Review processed pharmacy claims, plan payments and your member responsibility.</p>
      </section>

      <section className="dashboard-card">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">CLAIM HISTORY</p>
            <h2>Recent pharmacy claims</h2>
          </div>
        </div>

        {claims.length === 0 ? (
          <div className="empty-state">
            <h3>No pharmacy claims yet</h3>
            <p>Processed pharmacy claims will appear here when claim data is available for your member account.</p>
          </div>
        ) : (
          <div className="claims-list">
            {claims.map((claim) => (
              <article key={claim.id} className="claim-card">
                <div>
                  <p className="eyebrow">{claim.status.toUpperCase()}</p>
                  <h3>{claim.medicationName}{claim.strength ? ` ${claim.strength}` : ""}</h3>
                  <p>{claim.serviceDate}{claim.pharmacyName ? ` · ${claim.pharmacyName}` : ""}</p>
                </div>
                <div>
                  <p>Member responsibility</p>
                  <strong>{claim.memberResponsibility}</strong>
                  <Link href={`/dashboard/claims/${claim.id}`}>View claim details →</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
