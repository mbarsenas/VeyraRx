import Link from "next/link";
import MemberTopbar from "@/components/member/MemberTopbar";
import SummaryCard from "@/components/member/SummaryCard";
import PrescriptionRow from "@/components/member/PrescriptionRow";
import PlanCard from "@/components/member/PlanCard";
import PharmacyCard from "@/components/member/PharmacyCard";
import ActivityTimeline from "@/components/member/ActivityTimeline";
import PbmScenarioPanel from "@/components/member/PbmScenarioPanel";
import { getMemberRepository } from "@/lib/data";
import { getAuthenticatedMemberClaimAccumulators, getAuthenticatedMemberClaims } from "@/lib/data/member-claims";

export default async function DashboardPage() {
  const repository = getMemberRepository();
  const [member, prescriptions, claims, activity, accumulators] = await Promise.all([
    repository.getMemberSummary(),
    repository.getPrescriptions(),
    getAuthenticatedMemberClaims(),
    repository.getRecentActivity(),
    getAuthenticatedMemberClaimAccumulators(),
  ]);

  const deductibleUsed = accumulators.deductibleCents / 100;
  const deductiblePercent = member.plan.deductibleTotal > 0 ? Math.round((deductibleUsed / member.plan.deductibleTotal) * 100) : 0;
  const refillCount = prescriptions.filter((rx) => rx.status === "Refill available").length;
  const processingCount = prescriptions.filter((rx) => rx.status === "Processing").length;

  return (
    <>
      <MemberTopbar
        title={`Good evening, ${member.firstName}.`}
        description="Here is a quick look at your prescriptions, benefits and recent activity."
      />

      <PbmScenarioPanel />

      <section className="summaryGrid">
        <SummaryCard label="Active prescriptions" value={prescriptions.length} detail={`${refillCount} refill available`} />
        <SummaryCard label="Orders in progress" value={processingCount} detail={processingCount > 0 ? "Estimated arrival Aug 14" : "No active deliveries"} />
        <SummaryCard
          label="Plan deductible"
          value={`$${deductibleUsed.toLocaleString()} / $${member.plan.deductibleTotal.toLocaleString()}`}
          detail={`${deductiblePercent}% met`}
          progressPercent={deductiblePercent}
        />
        <SummaryCard label="Potential savings" value={`$${member.potentialSavings}`} detail="Available this month" />
      </section>

      <section className="dashboardGrid">
        <div className="dashboardMain">
          <article className="panelCard">
            <div className="panelHeader">
              <div><span className="eyebrow">My prescriptions</span><h2>Prescription overview</h2></div>
              <Link href="/dashboard/prescriptions">View all</Link>
            </div>
            <div className="prescriptionList">
              {prescriptions.map((prescription) => <PrescriptionRow key={prescription.id} prescription={prescription} />)}
            </div>
          </article>

          <ActivityTimeline activity={activity} />
          <article className="panelCard">
            <div className="panelHeader">
              <div><span className="eyebrow">Recent claims</span><h2>Latest pharmacy activity</h2></div>
              <Link href="/dashboard/claims">View all claims</Link>
            </div>
            <div className="prescriptionList">
              {claims.slice(0, 3).map((claim) => (
                <div className="benefitItem" key={claim.id}>
                  <span>{claim.serviceDate} · {claim.status}</span>
                  <strong><Link href={`/dashboard/claims/${claim.id}`}>{claim.medicationName} {claim.strength}</Link></strong>
                </div>
              ))}
              {claims.length === 0 ? <p className="railText">No pharmacy claims are available yet.</p> : null}
            </div>
          </article>
        </div>

        <aside className="dashboardRail">
          <PlanCard plan={member.plan} />
          <PharmacyCard pharmacy={member.preferredPharmacy} />
          <article className="panelCard savingsCard">
            <span className="eyebrow">Savings opportunity</span>
            <h2>Save on a 90-day supply</h2>
            <p className="railText">Switching one maintenance medication to a 90-day fill may reduce your estimated monthly cost.</p>
            <button className="button secondary full">Review savings</button>
          </article>
        </aside>
      </section>
    </>
  );
}
