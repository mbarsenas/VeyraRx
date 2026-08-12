$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$AppDir = Join-Path $Root "app"

if (-not (Test-Path $AppDir)) {
    throw "Could not find an app folder in: $Root`nRun this script from the actual Next.js project folder."
}

$HomePath = Join-Path $AppDir "page.tsx"
$CssPath = Join-Path $AppDir "globals.css"

foreach ($Path in @($HomePath, $CssPath)) {
    if (-not (Test-Path $Path)) {
        throw "Expected project file not found: $Path"
    }
}

$DashboardDir = Join-Path $AppDir "dashboard"
$PrescriptionsDir = Join-Path $DashboardDir "prescriptions"
$MessagesDir = Join-Path $DashboardDir "messages"
$ProfileDir = Join-Path $DashboardDir "profile"

New-Item -ItemType Directory -Force -Path `
    $DashboardDir, `
    $PrescriptionsDir, `
    $MessagesDir, `
    $ProfileDir | Out-Null

$DashboardPage = @'
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
            <span className="brandV">V</span>
            <span className="brandRx">Rx</span>
          </span>
          <span>VeyraRx</span>
        </Link>

        <div className="memberIdentity">
          <div className="avatar">MB</div>
          <div>
            <strong>Mark B.</strong>
            <small>Member ID **** 4821</small>
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
            <p>Here is a quick look at your prescriptions, benefits and recent activity.</p>
          </div>
          <div className="topbarActions">
            <button className="iconButton" aria-label="Notifications">N</button>
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
            <div className="progressTrack">
              <span style={{ width: "41%" }} />
            </div>
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
                      <span
                        className={
                          rx.status === "Refill available"
                            ? "statusChip attention"
                            : rx.status === "Processing"
                            ? "statusChip processing"
                            : "statusChip"
                        }
                      >
                        {rx.status}
                      </span>
                    </div>

                    <button className="textButton">{rx.action} -&gt;</button>
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
                  <div>
                    <strong>Atorvastatin order is processing</strong>
                    <small>Today - 6:42 PM</small>
                  </div>
                </div>

                <div className="timelineItem">
                  <span className="timelineDot"></span>
                  <div>
                    <strong>Lisinopril refill became available</strong>
                    <small>Aug 10 - 9:15 AM</small>
                  </div>
                </div>

                <div className="timelineItem">
                  <span className="timelineDot"></span>
                  <div>
                    <strong>Preferred pharmacy updated</strong>
                    <small>Aug 4 - 2:03 PM</small>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <aside className="dashboardRail">
            <article className="panelCard benefitCard">
              <span className="eyebrow">Your plan</span>
              <h2>Pharmacy benefits</h2>

              <div className="benefitItem">
                <span>Plan</span>
                <strong>VeyraChoice Plus</strong>
              </div>

              <div className="benefitItem">
                <span>Rx BIN</span>
                <strong>610014</strong>
              </div>

              <div className="benefitItem">
                <span>Rx Group</span>
                <strong>VYR365</strong>
              </div>

              <div className="benefitItem">
                <span>Effective date</span>
                <strong>Jan 1, 2026</strong>
              </div>

              <Link className="button primary full" href="/coverage">
                View benefit details
              </Link>
            </article>

            <article className="panelCard">
              <span className="eyebrow">Preferred pharmacy</span>
              <h2>H-E-B Pharmacy</h2>
              <p className="railText">
                San Antonio, TX
                <br />
                2.4 miles away
              </p>
              <Link href="/pharmacies" className="textButton">
                Find another pharmacy -&gt;
              </Link>
            </article>

            <article className="panelCard savingsCard">
              <span className="eyebrow">Savings opportunity</span>
              <h2>Save on a 90-day supply</h2>
              <p className="railText">
                Switching one maintenance medication to a 90-day fill may reduce your estimated monthly cost.
              </p>
              <button className="button secondary full">Review savings</button>
            </article>
          </aside>
        </section>
      </section>
    </main>
  );
}
'@

$PrescriptionsPage = @'
import Link from "next/link";

export default function PrescriptionsPage() {
  return (
    <main className="shell pageWrap">
      <span className="eyebrow">Member dashboard</span>
      <h1>My prescriptions</h1>
      <p className="leadSmall">
        View active medications, refill status and recent prescription activity.
      </p>

      <div className="infoGrid">
        <article className="infoCard">
          <h3>Atorvastatin 20 mg</h3>
          <p>90-day supply - Processing</p>
          <button className="textButton">Track order -&gt;</button>
        </article>

        <article className="infoCard">
          <h3>Lisinopril 10 mg</h3>
          <p>30-day supply - Refill available</p>
          <button className="textButton">Refill now -&gt;</button>
        </article>

        <article className="infoCard">
          <h3>Metformin ER 500 mg</h3>
          <p>90-day supply - Active</p>
          <button className="textButton">View details -&gt;</button>
        </article>
      </div>

      <p style={{ marginTop: "30px" }}>
        <Link href="/dashboard" className="textButton">
          &lt;- Back to dashboard
        </Link>
      </p>
    </main>
  );
}
'@

$MessagesPage = @'
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
'@

$ProfilePage = @'
import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="shell pageWrap">
      <span className="eyebrow">Member dashboard</span>
      <h1>Profile</h1>
      <p className="leadSmall">
        Manage contact information, communication preferences and account settings.
      </p>

      <div className="toolCard">
        <label>Email</label>
        <input value="mark@example.com" readOnly />

        <label>Phone</label>
        <input value="(210) 555-0148" readOnly />

        <label>Preferred communication</label>
        <input value="Email" readOnly />
      </div>

      <p>
        <Link href="/dashboard" className="textButton">
          &lt;- Back to dashboard
        </Link>
      </p>
    </main>
  );
}
'@

Set-Content (Join-Path $DashboardDir "page.tsx") $DashboardPage -Encoding UTF8
Set-Content (Join-Path $PrescriptionsDir "page.tsx") $PrescriptionsPage -Encoding UTF8
Set-Content (Join-Path $MessagesDir "page.tsx") $MessagesPage -Encoding UTF8
Set-Content (Join-Path $ProfileDir "page.tsx") $ProfilePage -Encoding UTF8

$Css = Get-Content $CssPath -Raw

if ($Css -notmatch "VEYRA MEMBER DASHBOARD") {
    $DashboardCss = @'

/* ===== VEYRA MEMBER DASHBOARD ===== */
.memberApp{min-height:100vh;background:#f4f8f7;display:grid;grid-template-columns:280px 1fr}
.memberSidebar{background:#123a43;color:#fff;min-height:100vh;padding:26px 22px;position:sticky;top:0;height:100vh;display:flex;flex-direction:column}
.memberBrand{display:flex;align-items:center;gap:11px;font-size:21px;font-weight:800;margin-bottom:34px}
.memberIdentity{display:flex;align-items:center;gap:12px;padding:16px 0 22px;border-bottom:1px solid rgba(255,255,255,.12)}
.avatar{width:42px;height:42px;border-radius:50%;background:#d4f06a;color:#173a42;display:grid;place-items:center;font-weight:800}
.memberIdentity small{display:block;color:#a9c0c3;margin-top:4px;font-size:12px}
.memberNav{display:flex;flex-direction:column;gap:7px;margin-top:24px}
.memberNav a{padding:12px 14px;border-radius:10px;color:#cfe0e2;font-weight:650}
.memberNav a:hover,.memberNav a.active{background:#0c6663;color:#fff}
.memberHelp{margin-top:auto;background:rgba(255,255,255,.07);padding:16px;border-radius:14px}
.memberHelp p{font-size:13px;line-height:1.5;color:#b9cdd0}
.memberHelp a{color:#d4f06a;font-weight:750}
.memberContent{padding:36px 42px 60px;min-width:0}
.memberTopbar{display:flex;justify-content:space-between;gap:30px;align-items:flex-start;margin-bottom:28px}
.memberTopbar h1{font-size:40px;margin:8px 0 7px;letter-spacing:-1.3px}
.memberTopbar p{margin:0;color:#61777c}
.topbarActions{display:flex;gap:12px;align-items:center}
.iconButton{width:44px;height:44px;border-radius:50%;border:1px solid #d4e0df;background:#fff;cursor:pointer}
.summaryGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:22px}
.summaryCard{background:#fff;border:1px solid #dfe8e7;border-radius:16px;padding:20px;min-height:140px}
.summaryLabel{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6f8488;font-weight:800}
.summaryCard strong{display:block;font-size:27px;margin:14px 0 7px;color:#173b45}
.summaryCard small{color:#6a7f83}
.progressTrack{height:7px;background:#e6eeee;border-radius:99px;overflow:hidden;margin:8px 0}
.progressTrack span{display:block;height:100%;background:#8dbb35;border-radius:99px}
.dashboardGrid{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(280px,.8fr);gap:20px}
.dashboardMain,.dashboardRail{display:flex;flex-direction:column;gap:20px}
.panelCard{background:#fff;border:1px solid #dfe8e7;border-radius:18px;padding:24px}
.panelHeader{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:10px}
.panelHeader h2,.panelCard h2{margin:7px 0 10px;font-size:24px}
.panelHeader a{color:#08716e;font-weight:750}
.prescriptionList{display:flex;flex-direction:column}
.prescriptionRow{display:grid;grid-template-columns:42px minmax(0,1fr) auto auto;gap:14px;align-items:center;padding:17px 0;border-top:1px solid #e8eeee}
.prescriptionRow:first-child{border-top:0}
.rxBadge{width:38px;height:38px;border-radius:50%;background:#e6f5f1;color:#08716e;display:grid;place-items:center;font-weight:800}
.rxDetails strong{display:block}
.rxDetails span{display:block;color:#74878b;font-size:13px;margin-top:4px}
.statusChip{display:inline-block;background:#e9f6d7;color:#426819;border-radius:999px;padding:6px 10px;font-size:12px;font-weight:800}
.statusChip.attention{background:#fff1c9;color:#7b5a00}
.statusChip.processing{background:#e7f1fb;color:#205d8c}
.timeline{display:flex;flex-direction:column}
.timelineItem{display:flex;gap:13px;padding:15px 0;border-top:1px solid #e8eeee}
.timelineItem:first-child{border-top:0}
.timelineDot{width:10px;height:10px;border-radius:50%;background:#0b7471;margin-top:5px;flex:0 0 auto}
.timelineItem small{display:block;color:#7a8c90;margin-top:5px}
.benefitItem{display:flex;justify-content:space-between;gap:16px;padding:11px 0;border-bottom:1px solid #e8eeee;font-size:14px}
.benefitItem span{color:#718589}
.railText{color:#667d82;line-height:1.6}
.savingsCard{background:linear-gradient(145deg,#f8fbef,#f5faf5)}
@media(max-width:1100px){
  .summaryGrid{grid-template-columns:1fr 1fr}
  .dashboardGrid{grid-template-columns:1fr}
  .memberApp{grid-template-columns:230px 1fr}
}
@media(max-width:760px){
  .memberApp{display:block}
  .memberSidebar{position:relative;height:auto;min-height:0}
  .memberNav{display:grid;grid-template-columns:1fr 1fr}
  .memberHelp{margin-top:24px}
  .memberContent{padding:26px 18px 50px}
  .memberTopbar{flex-direction:column}
  .summaryGrid{grid-template-columns:1fr}
  .prescriptionRow{grid-template-columns:42px 1fr}
  .rxStatus,.prescriptionRow .textButton{grid-column:2}
  .memberTopbar h1{font-size:34px}
}
'@

    Add-Content $CssPath $DashboardCss -Encoding UTF8
}

$Home = Get-Content $HomePath -Raw

# Safely replace only the href for the dashboard link.
$Home = [regex]::Replace(
    $Home,
    'href="/signin"(?=>Open member dashboard)',
    'href="/dashboard"'
)

Set-Content $HomePath $Home -Encoding UTF8

Write-Host ""
Write-Host "VeyraRx Member Dashboard installed successfully." -ForegroundColor Green
Write-Host "Project root: $Root" -ForegroundColor DarkGray
Write-Host "Created: app\dashboard\page.tsx" -ForegroundColor Cyan
Write-Host "Created: app\dashboard\prescriptions\page.tsx" -ForegroundColor Cyan
Write-Host "Created: app\dashboard\messages\page.tsx" -ForegroundColor Cyan
Write-Host "Created: app\dashboard\profile\page.tsx" -ForegroundColor Cyan
Write-Host "Updated: app\globals.css" -ForegroundColor Cyan
Write-Host ""
Write-Host "Restart npm run dev, then open http://localhost:3000/dashboard" -ForegroundColor Yellow
