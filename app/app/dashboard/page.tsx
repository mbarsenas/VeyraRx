import Link from "next/link";

const prescriptions = [
  { name: "Atorvastatin", strength: "20 mg", supply: "90-day supply", status: "Processing", action: "Track order" },
  { name: "Lisinopril", strength: "10 mg", supply: "30-day supply", status: "Refill available", action: "Refill now" },
  { name: "Metformin ER", strength: "500 mg", supply: "90-day supply", status: "Active", action: "View details" },
];

export default function DashboardPage() {
  return (
    <main className="memberApp">
      <aside className="memberSidebar">
        <Link href="/" className="memberBrand">
          <span className="brandMark" aria-hidden="true">
            <span className="brandV">V</span><span className="brandRx">Rx</span>
          </span>
          <span>VeyraRx</span>
        </Link>

        <div className="memberIdentity">
          <div className="avatar">MB</div>
          <div>
            <strong>Mark B.</strong>
            <small>Member ID •••• 4821</small>
          </div>
        </div>

        <nav className="memberNav">
          <Link className="active" href="/dashboard">Overview</Link>
          <Link href="/dashboard/prescriptions">Prescriptions</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/coverage">Benefits & coverage</Link>
          <Link href="/pharmacies">Pharmacy</Link>
          <Link href="/dashboard/messages">Messages</Link>
          <Link href="/dashboard/profile">Profile</Link>
        </nav>

        <div className="memberHelp">
          <strong>Need help?</strong>
          <p>Member support is available for prescription and benefit questions.</p>
          <Link href="/contact">Contact support</Link>
        </div>
      </aside>

      <section className="memberContent">
        <header className="memberTopbar">
          <div>
            <span className="eyebrow">Member dashboard</span>
            <h1>Good evening, Mark.</h1>
            <p>Here’s a quick look at your prescriptions, benefits and recent activity.</p>
          </div>
          <div className="topbarActions">
            <button className="iconButton" aria-label="Notifications">🔔</button>
            <Link className="button secondary" href="/signin">Sign out</Link>
          </div>
        </header>

        <section className="summaryGrid">
          <article className="summaryCard">
            <span className="summaryLabel">Active prescriptions</span>
            <strong>3</strong>
            <small>1 refill available</small>
          </article>
          <article className="summaryCard">
            <span className="summaryLabel">Orders in progress</span>
            <strong>1</strong>
            <small>Estimated arrival Aug 14</small>
          </article>
          <article className="summaryCard">
            <span className="summaryLabel">Plan deductible</span>
            <strong>$620 / $1,500</strong>
            <div className="progressTrack"><span style={{ width: "41%" }} /></div>
            <small>41% met</small>
          </article>
          <article className="summaryCard">
            <span className="summaryLabel">Potential savings</span>
            <strong>$38</strong>
            <small>Available this month</small>
          </article>
        </section>

        <section className="dashboardGrid">
          <div className="dashboardMain">
            <article className="panelCard">
              <div className="panelHeader">
                <div>
                  <span className="eyebrow">My prescriptions</span>
                  <h2>Prescription overview</h2>
                </div>
                <Link href="/dashboard/prescriptions">View all</Link>
              </div>

              <div className="prescriptionList">
                {prescriptions.map((rx) => (
                  <div className="prescriptionRow" key={rx.name}>
                    <div className="rxBadge">Rx</div>
                    <div className="rxDetails">
                      <strong>{rx.name} {rx.strength}</strong>
                      <span>{rx.supply}</span>
                    </div>
                    <div className="rxStatus">
                      <span className={
                        rx.status === "Refill available" ? "statusChip attention" :
                        rx.status === "Processing" ? "statusChip processing" :
                        "statusChip"
                      }>{rx.status}</span>
                    </div>
                    <button className="textButton">{rx.action} →</button>
                  </div>
                ))}
              </div>
            </article>

            <article className="panelCard">
              <div className="panelHeader">
                <div>
                  <span className="eyebrow">Recent activity</span>
                  <h2>Orders & updates</h2>
                </div>
              </div>
              <div className="timeline">
                <div className="timelineItem">
                  <span className="timelineDot"></span>
                  <div><strong>Atorvastatin order is processing</strong><small>Today · 6:42 PM</small></div>
                </div>
                <div className="timelineItem">
                  <span className="timelineDot"></span>
                  <div><strong>Lisinopril refill became available</strong><small>Aug 10 · 9:15 AM</small></div>
                </div>
                <div className="timelineItem">
                  <span className="timelineDot"></span>
                  <div><strong>Preferred pharmacy updated</strong><small>Aug 4 · 2:03 PM</small></div>
                </div>
              </div>
            </article>
          </div>

          <aside className="dashboardRail">
            <article className="panelCard benefitCard">
              <span className="eyebrow">Your plan</span>
              <h2>Pharmacy benefits</h2>
              <div className="benefitItem"><span>Plan</span><strong>VeyraChoice Plus</strong></div>
              <div className="benefitItem"><span>Rx BIN</span><strong>610014</strong></div>
              <div className="benefitItem"><span>Rx Group</span><strong>VYR365</strong></div>
              <div className="benefitItem"><span>Effective date</span><strong>Jan 1, 2026</strong></div>
              <Link className="button primary full" href="/coverage">View benefit details</Link>
            </article>

            <article className="panelCard">
              <span className="eyebrow">Preferred pharmacy</span>
              <h2>H-E-B Pharmacy</h2>
              <p className="railText">San Antonio, TX<br/>2.4 miles away</p>
              <Link href="/pharmacies" className="textButton">Find another pharmacy →</Link>
            </article>

            <article className="panelCard savingsCard">
              <span className="eyebrow">Savings opportunity</span>
              <h2>Save on a 90-day supply</h2>
              <p className="railText">Switching one maintenance medication to a 90-day fill may reduce your estimated monthly cost.</p>
              <button className="button secondary full">Review savings</button>
            </article>
          </aside>
        </section>
      </section>
    </main>
  );
}
