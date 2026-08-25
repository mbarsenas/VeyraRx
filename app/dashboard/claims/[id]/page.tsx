import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthenticatedMemberClaimById } from "@/lib/data/member-claims";

export const dynamic = "force-dynamic";

const statusCopy = {
  Paid: ["This claim was paid", "Your plan processed this pharmacy claim. The amounts below show how the allowed cost was shared."],
  Rejected: ["This claim was not processed", "The pharmacy claim was rejected, so no final allowed amount, plan payment or member responsibility was established."],
  Reversed: ["This claim was reversed", "This transaction undid an earlier claim. The reversed amounts are shown for reference and are not a current amount due."],
  Pending: ["This claim is pending", "The claim is still being processed. Final plan payment and member responsibility are not yet available."],
} as const;

export default async function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = await getAuthenticatedMemberClaimById(id);
  if (!claim) notFound();

  const isPaid = claim.status === "Paid";
  const [statusTitle, statusBody] = statusCopy[claim.status];

  return (
    <main className="claim-detail-page">
      <Link className="claim-back-link" href="/dashboard/claims">← Back to claims</Link>
      <section className="dashboard-page-header">
        <div className="claim-detail-title-row">
          <p className="eyebrow">CLAIM DETAILS</p>
          <span className={`claim-status claim-status-${claim.status.toLowerCase()}`}>{claim.status}</span>
        </div>
        <h1>{claim.medicationName}{claim.strength ? ` ${claim.strength}` : ""}</h1>
        <p>{claim.serviceDate}{claim.pharmacyName ? ` · ${claim.pharmacyName}` : ""}</p>
      </section>

      <section className={`claim-status-summary claim-status-summary-${claim.status.toLowerCase()}`}>
        <div className="claim-status-icon" aria-hidden="true">{isPaid ? "✓" : claim.status === "Rejected" ? "!" : "↺"}</div>
        <div><h2>{statusTitle}</h2><p>{statusBody}</p></div>
      </section>

      <section className="dashboard-card">
        <div className="section-heading-row claim-section-heading">
          <div><p className="eyebrow">CLAIM INFORMATION</p><h2>Transaction details</h2></div>
        </div>
        <div className="claim-detail-grid">
          <div><span>Claim reference</span><strong>{claim.claimReference}</strong></div>
          <div><span>Transaction</span><strong>{claim.transactionType}</strong></div>
          <div><span>Pharmacy</span><strong>{claim.pharmacyName ?? "Not available"}</strong></div>
          <div><span>Service date</span><strong>{claim.serviceDate}</strong></div>
          <div><span>Quantity</span><strong>{claim.quantity ?? "Not available"}</strong></div>
          <div><span>Days supply</span><strong>{claim.daysSupply ?? "Not available"}</strong></div>
        </div>

        {claim.status === "Rejected" ? (
          <div className="claim-reject-callout">
            <span className="claim-callout-label">Pharmacy response{claim.rejectCode ? ` · Code ${claim.rejectCode}` : ""}</span>
            <h2>{claim.rejectMessage ?? "The claim could not be processed."}</h2>
            <p>Contact your pharmacy or plan support for help resolving this claim before the prescription is filled.</p>
          </div>
        ) : null}
        {claim.status === "Reversed" ? (
          <div className="claim-reversal-callout">
            <span className="claim-callout-label">Original transaction</span>
            <h2>Claim {claim.reversalOfClaimReference ?? "reference unavailable"}</h2>
            <p>This reversal cancels the original transaction. It does not create a new amount for you to pay.</p>
          </div>
        ) : null}
      </section>

      <section className="dashboard-card claim-economics-card">
        <div className="section-heading-row claim-section-heading">
          <div><p className="eyebrow">COST SUMMARY</p><h2>{isPaid ? "How this claim was paid" : claim.status === "Reversed" ? "Reversed claim amounts" : "Claim amounts"}</h2></div>
        </div>
        <div className="claim-economics-grid">
          <div><span>Pharmacy submitted</span><strong>{claim.submittedAmount}</strong></div>
          {claim.status === "Rejected" || claim.status === "Pending" ? (
            <div className="claim-economics-unavailable"><span>Final claim economics</span><strong>Not available</strong><small>No final cost sharing was established.</small></div>
          ) : (
            <>
              <div><span>Plan allowed</span><strong>{claim.allowedAmount}</strong></div>
              <div><span>Plan paid</span><strong>{claim.planPaid}</strong></div>
              <div className="claim-member-total"><span>{claim.status === "Reversed" ? "Member amount reversed" : "You pay"}</span><strong>{claim.memberResponsibility}</strong></div>
            </>
          )}
        </div>
        {isPaid ? (
          <div className="claim-cost-share">
            <h3>Your cost breakdown</h3>
            <dl>
              <div><dt>Deductible</dt><dd>{claim.deductible}</dd></div>
              <div><dt>Copay</dt><dd>{claim.copay}</dd></div>
              <div><dt>Coinsurance</dt><dd>{claim.coinsurance}</dd></div>
              <div className="claim-cost-share-total"><dt>Total member responsibility</dt><dd>{claim.memberResponsibility}</dd></div>
            </dl>
          </div>
        ) : null}
        {claim.status === "Reversed" ? <p className="claim-economics-note">These values describe the reversed transaction and do not represent a current payment due.</p> : null}
      </section>
    </main>
  );
}
