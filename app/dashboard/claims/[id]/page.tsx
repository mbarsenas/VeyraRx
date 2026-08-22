import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthenticatedMemberClaimById } from "@/lib/data/member-claims";

export const dynamic = "force-dynamic";

export default async function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const claim = await getAuthenticatedMemberClaimById(id);
  if (!claim) notFound();

  return (
    <main>
      <Link href="/dashboard/claims">← Back to claims</Link>
      <section className="dashboard-page-header">
        <p className="eyebrow">CLAIM DETAILS</p>
        <h1>{claim.medicationName}{claim.strength ? ` ${claim.strength}` : ""}</h1>
        <p>{claim.serviceDate}{claim.pharmacyName ? ` · ${claim.pharmacyName}` : ""}</p>
      </section>

      <section className="dashboard-card">
        <div className="claim-detail-grid">
          <div><span>Claim reference</span><strong>{claim.claimReference}</strong></div>
          <div><span>Status</span><strong>{claim.status}</strong></div>
          <div><span>Transaction</span><strong>{claim.transactionType}</strong></div>
          <div><span>Quantity</span><strong>{claim.quantity ?? "Not available"}</strong></div>
          <div><span>Days supply</span><strong>{claim.daysSupply ?? "Not available"}</strong></div>
          <div><span>Submitted amount</span><strong>{claim.submittedAmount}</strong></div>
          <div><span>Allowed amount</span><strong>{claim.allowedAmount}</strong></div>
          <div><span>Plan paid</span><strong>{claim.planPaid}</strong></div>
          <div><span>Member responsibility</span><strong>{claim.memberResponsibility}</strong></div>
          <div><span>Deductible</span><strong>{claim.deductible}</strong></div>
          <div><span>Copay</span><strong>{claim.copay}</strong></div>
          <div><span>Coinsurance</span><strong>{claim.coinsurance}</strong></div>
        </div>

        {claim.rejectMessage ? (
          <div className="claim-reject-callout">
            <h2>Claim message</h2>
            <p>{claim.rejectCode ? `${claim.rejectCode}: ` : ""}{claim.rejectMessage}</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
