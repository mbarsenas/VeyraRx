import Link from "next/link";
import { getAuthenticatedMemberClaims } from "@/lib/data/member-claims";

export const dynamic = "force-dynamic";

function claimAmountLabel(status: string) {
  if (status === "Rejected") return "Not processed";
  if (status === "Reversed") return "Amount reversed";
  return "Member responsibility";
}

function claimAmountValue(status: string, memberResponsibility: string) {
  if (status === "Rejected") return "Not available";
  if (status === "Reversed") return "No current amount due";
  return memberResponsibility;
}

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
                <div className="claim-card-main">
                  <span className={`claim-status claim-status-${claim.status.toLowerCase()}`}>{claim.status}</span>
                  <div className="claim-medication">
                    <h3>{claim.medicationName}{claim.strength ? ` ${claim.strength}` : ""}</h3>
                    <p className="claim-reference">Claim {claim.claimReference}</p>
                  </div>
                  <dl className="claim-meta">
                    <div><dt>Service date</dt><dd>{claim.serviceDate}</dd></div>
                    <div><dt>Pharmacy</dt><dd>{claim.pharmacyName ?? "Not available"}</dd></div>
                  </dl>
                </div>
                <div className="claim-card-action">
                  <div className="claim-amount">
                    <span>{claimAmountLabel(claim.status)}</span>
                    <strong>{claimAmountValue(claim.status, claim.memberResponsibility)}</strong>
                  </div>
                  <Link className="claim-detail-link" href={`/dashboard/claims/${claim.id}`}>
                    View claim details <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
