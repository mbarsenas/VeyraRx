import Link from "next/link";
import MemberSidebar from "@/components/member/MemberSidebar";
import PrescriptionRow from "@/components/member/PrescriptionRow";
import { member, prescriptions, recentActivity } from "@/lib/mock-data/member";

export default function DashboardPage() {
  const deductiblePercent = Math.round((member.plan.deductibleUsed / member.plan.deductibleTotal) * 100);

  return (
    <main className="memberApp">
      <MemberSidebar />

      <section className="memberContent">
        <header className="memberTopbar">
          <div>
            <span className="eyebrow">Member dashboard</span>
            <h1>Good evening, {member.firstName}.</h1>
            <p>Here is a quick look at your prescriptions, benefits and recent activity.</p>
          </div>
          <div className="topbarActions">
            <button className="iconButton" aria-label="Notifications">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
                <path d="M10 21h4"></path>
              </svg>
            </button>
            <Link className="button secondary" href="/signin">Sign out</Link>
          </div>
        </header>

        <section className="summaryGrid">
          <article className="summaryCard">
            <span className="summaryLabel">Active prescriptions</span>
            <strong>{prescriptions.length}</strong>
            <small>{prescriptions.filter((rx) => rx.status === "Refill available").length} refill available</small>
          </article>

          <article className="summaryCard">
            <span className="summaryLabel">Orders in progress</span>
            <strong>{prescriptions.filter((rx) => rx.status === "Processing").length}</strong>
            <small>Estimated arrival Aug 14</small>
          </article>

          <article className="summaryCard">
            <span className="summaryLabel">Plan deductible</span>
            <strong>${member.plan.deductibleUsed} / ${member.plan.deductibleTotal.toLocaleString()}</strong>
            <div className="progressTrack"><span style={{ width: `${deductiblePercent}%` }} /></div>
            <small>{deductiblePercent}% met</small>
          </article>

          <article className="summaryCard">
            <span className="summaryLabel">Potential savings</span>
            <strong>${member.potentialSavings}</strong>
            <small>Available this month</small>
          </article>
        </section>

        <section className="dashboardGrid">
          <div className="dashboardMain">
            <article className="panelCard">
              <div className="panelHeader">
                <div><span className="eyebrow">My prescriptions</span><h2>Prescription overview</h2></div>
                <Link href="/dashboard/prescriptions">View all</Link>
              </div>

              <div className="prescriptionList">
                {prescriptions.map((prescription) => (
                  <PrescriptionRow key={prescription.id} prescription={prescription} />
                ))}
              </div>
            </article>

            <article className="panelCard">
              <div className="panelHeader"><div><span className="eyebrow">Recent activity</span><h2>Orders & updates</h2></div></div>
              <div className="timeline">
                {recentActivity.map((item) => (
                  <div className="timelineItem" key={`${item.title}-${item.time}`}>
                    <span className="timelineDot"></span>
                    <div><strong>{item.title}</strong><small>{item.time}</small></div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="dashboardRail">
            <article className="panelCard benefitCard">
              <span className="eyebrow">Your plan</span><h2>Pharmacy benefits</h2>
              <div className="benefitItem"><span>Plan</span><strong>{member.plan.name}</strong></div>
              <div className="benefitItem"><span>Rx BIN</span><strong>{member.plan.rxBin}</strong></div>
              <div className="benefitItem"><span>Rx Group</span><strong>{member.plan.rxGroup}</strong></div>
              <div className="benefitItem"><span>Effective date</span><strong>{member.plan.effectiveDate}</strong></div>
              <Link className="button primary full" href="/coverage">View benefit details</Link>
            </article>

            <article className="panelCard">
              <span className="eyebrow">Preferred pharmacy</span><h2>{member.preferredPharmacy.name}</h2>
              <p className="railText">{member.preferredPharmacy.location}<br/>{member.preferredPharmacy.distance}</p>
              <Link href="/pharmacies" className="textButton">Find another pharmacy -&gt;</Link>
            </article>

            <article className="panelCard savingsCard">
              <span className="eyebrow">Savings opportunity</span><h2>Save on a 90-day supply</h2>
              <p className="railText">Switching one maintenance medication to a 90-day fill may reduce your estimated monthly cost.</p>
              <button className="button secondary full">Review savings</button>
            </article>
          </aside>
        </section>
      </section>
    </main>
  );
}
