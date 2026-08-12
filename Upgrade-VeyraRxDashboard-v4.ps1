$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$AppDir = Join-Path $Root "app"
$ComponentsDir = Join-Path $Root "components"

if (-not (Test-Path $AppDir)) {
    throw "Could not find app folder in: $Root. Run this script from the VeyraRx Next.js project root."
}

New-Item -ItemType Directory -Force -Path $ComponentsDir | Out-Null

$SiteChrome = @'
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMemberApp = pathname.startsWith("/dashboard");

  if (isMemberApp) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="topBar">
        <div className="shell topInner">
          <span>Member support</span>
          <span>For health care professionals</span>
        </div>
      </div>

      <header>
        <div className="shell nav">
          <Link href="/" className="brand">
            <span className="brandMark" aria-hidden="true">
              <span className="brandV">V</span>
              <span className="brandRx">Rx</span>
            </span>
            <strong>VeyraRx</strong>
          </Link>

          <nav>
            <Link href="/pricing">Drug pricing</Link>
            <Link href="/pharmacies">Find a pharmacy</Link>
            <Link href="/coverage">Coverage</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <Link className="signinButton" href="/signin">
            Sign in
          </Link>
        </div>
      </header>

      {children}

      <footer>
        <div className="shell footerGrid">
          <div>
            <div className="brand footerBrand">
              <span className="brandMark" aria-hidden="true">
                <span className="brandV">V</span>
                <span className="brandRx">Rx</span>
              </span>
              <strong>VeyraRx</strong>
            </div>
            <p>Making pharmacy benefits easier to navigate.</p>
          </div>

          <div>
            <strong>Members</strong>
            <Link href="/pricing">Drug pricing</Link>
            <Link href="/pharmacies">Find a pharmacy</Link>
            <Link href="/resources">Resources</Link>
          </div>

          <div>
            <strong>Company</strong>
            <Link href="/contact">Contact</Link>
            <span>Privacy</span>
            <span>Accessibility</span>
          </div>
        </div>

        <div className="shell copyright">
          Copyright 2026 VeyraRx. Prototype concept. All rights reserved.
        </div>
      </footer>
    </>
  );
}
'@

Set-Content (Join-Path $ComponentsDir "SiteChrome.tsx") $SiteChrome -Encoding UTF8

$Layout = @'
import "./globals.css";
import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "VeyraRx | Pharmacy benefits made simpler",
  description: "A modern pharmacy benefits and prescription management experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
'@

Set-Content (Join-Path $AppDir "layout.tsx") $Layout -Encoding UTF8

$DashboardPagePath = Join-Path $AppDir "dashboard\page.tsx"
if (-not (Test-Path $DashboardPagePath)) {
    throw "Dashboard page not found: $DashboardPagePath"
}

$DashboardPage = Get-Content $DashboardPagePath -Raw

$DashboardPage = $DashboardPage.Replace(
    '<button className="iconButton" aria-label="Notifications">N</button>',
    '<button className="iconButton" aria-label="Notifications"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg></button>'
)

$DashboardPage = $DashboardPage.Replace(
    '<button className="textButton">{rx.action} -&gt;</button>',
    '{rx.name === "Lisinopril" ? (<Link className="textButton" href="/dashboard/prescriptions/lisinopril-10mg/refill">Refill now -&gt;</Link>) : rx.name === "Atorvastatin" ? (<Link className="textButton" href="/dashboard/orders/atorvastatin">Track order -&gt;</Link>) : (<Link className="textButton" href="/dashboard/prescriptions">View details -&gt;</Link>)}'
)

Set-Content $DashboardPagePath $DashboardPage -Encoding UTF8

$RefillDir = Join-Path $AppDir "dashboard\prescriptions\lisinopril-10mg\refill"
$OrderDir = Join-Path $AppDir "dashboard\orders\atorvastatin"
New-Item -ItemType Directory -Force -Path $RefillDir,$OrderDir | Out-Null

$RefillPage = @'
"use client";

import Link from "next/link";
import { useState } from "react";

export default function LisinoprilRefillPage() {
  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState("pharmacy");

  return (
    <main className="workflowPage">
      <div className="workflowShell">
        <Link href="/dashboard" className="workflowBack">
          &lt;- Back to dashboard
        </Link>

        <div className="workflowHeader">
          <span className="eyebrow">Prescription refill</span>
          <h1>Refill Lisinopril 10 mg</h1>
          <p>30-day supply. No prescriber approval is required for this demo refill.</p>
        </div>

        <div className="stepper">
          <div className={step >= 1 ? "step active" : "step"}><span>1</span>Delivery</div>
          <div className={step >= 2 ? "step active" : "step"}><span>2</span>Review</div>
          <div className={step >= 3 ? "step active" : "step"}><span>3</span>Confirmation</div>
        </div>

        {step === 1 && (
          <section className="workflowCard">
            <h2>Where would you like this refill?</h2>

            <label className={delivery === "pharmacy" ? "choiceCard selected" : "choiceCard"}>
              <input
                type="radio"
                name="delivery"
                checked={delivery === "pharmacy"}
                onChange={() => setDelivery("pharmacy")}
              />
              <div>
                <strong>Pick up at H-E-B Pharmacy</strong>
                <span>San Antonio, TX - Preferred pharmacy</span>
                <small>Estimated member cost: $8.00</small>
              </div>
            </label>

            <label className={delivery === "home" ? "choiceCard selected" : "choiceCard"}>
              <input
                type="radio"
                name="delivery"
                checked={delivery === "home"}
                onChange={() => setDelivery("home")}
              />
              <div>
                <strong>Home delivery</strong>
                <span>Standard delivery to your saved address</span>
                <small>Estimated member cost: $6.00</small>
              </div>
            </label>

            <div className="workflowActions">
              <Link className="button secondary" href="/dashboard">Cancel</Link>
              <button className="button primary" onClick={() => setStep(2)}>Continue</button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="workflowCard">
            <h2>Review your refill</h2>

            <div className="reviewRows">
              <div><span>Medication</span><strong>Lisinopril 10 mg</strong></div>
              <div><span>Quantity</span><strong>30 tablets</strong></div>
              <div><span>Refills remaining</span><strong>2</strong></div>
              <div><span>Fulfillment</span><strong>{delivery === "home" ? "Home delivery" : "H-E-B Pharmacy pickup"}</strong></div>
              <div><span>Estimated member cost</span><strong>{delivery === "home" ? "$6.00" : "$8.00"}</strong></div>
            </div>

            <div className="workflowNotice">
              Final pricing is determined when the prescription is processed.
            </div>

            <div className="workflowActions">
              <button className="button secondary" onClick={() => setStep(1)}>Back</button>
              <button className="button primary" onClick={() => setStep(3)}>Submit refill</button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="workflowCard confirmationCard">
            <div className="successIcon">OK</div>
            <span className="eyebrow">Refill submitted</span>
            <h2>Your Lisinopril refill is in progress.</h2>
            <p>
              Confirmation number <strong>VYR-260811-4821</strong>
            </p>

            <div className="reviewRows">
              <div><span>Status</span><strong>Submitted</strong></div>
              <div><span>Fulfillment</span><strong>{delivery === "home" ? "Home delivery" : "H-E-B Pharmacy pickup"}</strong></div>
              <div><span>Estimated cost</span><strong>{delivery === "home" ? "$6.00" : "$8.00"}</strong></div>
            </div>

            <div className="workflowActions">
              <Link className="button primary" href="/dashboard">Return to dashboard</Link>
            </div>
          </section>
        )}

        <p className="demoDisclosure">
          Prototype workflow only. No prescription was submitted and no health information was transmitted.
        </p>
      </div>
    </main>
  );
}
'@

Set-Content (Join-Path $RefillDir "page.tsx") $RefillPage -Encoding UTF8

$OrderPage = @'
import Link from "next/link";

export default function AtorvastatinOrderPage() {
  return (
    <main className="workflowPage">
      <div className="workflowShell">
        <Link href="/dashboard" className="workflowBack">
          &lt;- Back to dashboard
        </Link>

        <div className="workflowHeader">
          <span className="eyebrow">Order tracking</span>
          <h1>Atorvastatin 20 mg</h1>
          <p>Order VYR-883921 - 90-day supply</p>
        </div>

        <section className="workflowCard">
          <div className="orderHero">
            <div>
              <span className="statusChip processing">Processing</span>
              <h2>Estimated arrival Aug 14</h2>
              <p>Your prescription is being prepared for shipment.</p>
            </div>
            <div className="orderPackage">Rx</div>
          </div>

          <div className="orderTimeline">
            <div className="orderStep complete">
              <span></span>
              <div><strong>Order received</strong><small>Aug 11 - 5:58 PM</small></div>
            </div>
            <div className="orderStep complete">
              <span></span>
              <div><strong>Prescription verified</strong><small>Aug 11 - 6:21 PM</small></div>
            </div>
            <div className="orderStep current">
              <span></span>
              <div><strong>Processing</strong><small>Medication is being prepared</small></div>
            </div>
            <div className="orderStep">
              <span></span>
              <div><strong>Shipped</strong><small>Tracking information will appear here</small></div>
            </div>
            <div className="orderStep">
              <span></span>
              <div><strong>Delivered</strong><small>Expected Aug 14</small></div>
            </div>
          </div>

          <div className="reviewRows compactReview">
            <div><span>Medication</span><strong>Atorvastatin 20 mg</strong></div>
            <div><span>Quantity</span><strong>90 tablets</strong></div>
            <div><span>Delivery</span><strong>Standard home delivery</strong></div>
            <div><span>Estimated member cost</span><strong>$12.00</strong></div>
          </div>

          <div className="workflowActions">
            <Link className="button primary" href="/dashboard">Return to dashboard</Link>
          </div>
        </section>

        <p className="demoDisclosure">
          Prototype tracking data only. This page is not connected to a pharmacy fulfillment system.
        </p>
      </div>
    </main>
  );
}
'@

Set-Content (Join-Path $OrderDir "page.tsx") $OrderPage -Encoding UTF8

$CssPath = Join-Path $AppDir "globals.css"
$Css = Get-Content $CssPath -Raw

if ($Css -notmatch "VEYRA DASHBOARD V4") {
$ExtraCss = @'

/* ===== VEYRA DASHBOARD V4 ===== */
.iconButton svg{width:19px;height:19px;fill:none;stroke:#173b45;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.memberContent{padding-top:28px}
.memberTopbar{background:transparent;border-bottom:0;padding-bottom:8px}
.memberTopbar h1{margin-top:6px}
.workflowPage{min-height:100vh;background:#f4f8f7;padding:42px 24px 70px}
.workflowShell{width:min(860px,100%);margin:0 auto}
.workflowBack{display:inline-block;color:#08716e;font-weight:750;margin-bottom:25px}
.workflowHeader h1{font-size:42px;letter-spacing:-1.4px;margin:8px 0 10px}
.workflowHeader p{color:#667d82;font-size:17px;margin-bottom:28px}
.stepper{display:grid;grid-template-columns:repeat(3,1fr);margin:25px 0 20px}
.step{display:flex;align-items:center;gap:9px;color:#879699;font-weight:750;font-size:13px;position:relative}
.step:after{content:"";height:2px;background:#d7e2e1;position:absolute;left:34px;right:8px;bottom:-10px}
.step:last-child:after{display:none}
.step span{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#dfe8e7;color:#64797d}
.step.active{color:#0a6663}
.step.active span{background:#0a706e;color:#fff}
.workflowCard{background:#fff;border:1px solid #dce7e6;border-radius:22px;padding:30px;box-shadow:0 12px 34px rgba(30,70,70,.06)}
.workflowCard h2{font-size:27px;margin:0 0 22px}
.choiceCard{display:flex;gap:14px;border:1px solid #d7e4e2;border-radius:15px;padding:18px;margin:14px 0;cursor:pointer;transition:.18s}
.choiceCard:hover,.choiceCard.selected{border-color:#08716e;background:#f3fbf8}
.choiceCard input{width:auto;margin:3px 0 0}
.choiceCard strong,.choiceCard span,.choiceCard small{display:block}
.choiceCard span{color:#61777c;margin:5px 0}
.choiceCard small{color:#08716e;font-weight:750}
.workflowActions{display:flex;justify-content:flex-end;gap:11px;margin-top:26px}
.reviewRows{border-top:1px solid #e4eceb;margin-top:10px}
.reviewRows>div{display:flex;justify-content:space-between;gap:25px;padding:15px 0;border-bottom:1px solid #e4eceb}
.reviewRows span{color:#718589}
.workflowNotice{margin-top:20px;background:#f2f7f6;border-left:4px solid #08716e;padding:14px 16px;color:#61777c;border-radius:7px}
.confirmationCard{text-align:center}
.confirmationCard .reviewRows{text-align:left;margin-top:26px}
.successIcon{width:58px;height:58px;border-radius:50%;background:#dff1bd;color:#416415;display:grid;place-items:center;margin:0 auto 18px;font-weight:900}
.demoDisclosure{font-size:12px;color:#819194;margin-top:15px;text-align:center}
.orderHero{display:flex;justify-content:space-between;gap:30px;align-items:center;padding-bottom:24px;border-bottom:1px solid #e4eceb}
.orderHero h2{margin:12px 0 6px}
.orderHero p{color:#677d82;margin:0}
.orderPackage{width:90px;height:90px;border-radius:20px;background:#0a706e;color:#d4f06a;display:grid;place-items:center;font-size:30px;font-weight:900}
.orderTimeline{padding:26px 0 8px}
.orderStep{display:grid;grid-template-columns:24px 1fr;gap:13px;position:relative;padding-bottom:25px}
.orderStep:before{content:"";position:absolute;left:7px;top:16px;bottom:0;width:2px;background:#dbe5e4}
.orderStep:last-child:before{display:none}
.orderStep>span{width:16px;height:16px;border-radius:50%;border:3px solid #d5e0df;background:#fff;z-index:1}
.orderStep.complete>span{background:#88b934;border-color:#88b934}
.orderStep.current>span{background:#0a706e;border-color:#0a706e;box-shadow:0 0 0 5px #e4f2ef}
.orderStep strong,.orderStep small{display:block}
.orderStep small{color:#73878b;margin-top:4px}
.compactReview{margin-top:4px}
@media(max-width:700px){
  .workflowPage{padding:28px 14px 55px}
  .workflowHeader h1{font-size:34px}
  .workflowCard{padding:22px}
  .step{font-size:11px}
  .reviewRows>div{flex-direction:column;gap:5px}
  .workflowActions{flex-direction:column-reverse}
  .workflowActions .button{width:100%}
  .orderHero{align-items:flex-start}
  .orderPackage{width:64px;height:64px}
}
'@
    Add-Content $CssPath $ExtraCss -Encoding UTF8
}

Write-Host ""
Write-Host "VeyraRx dashboard v4 upgrade complete." -ForegroundColor Green
Write-Host "Public site header/footer are now hidden inside /dashboard." -ForegroundColor Cyan
Write-Host "Added refill workflow: /dashboard/prescriptions/lisinopril-10mg/refill" -ForegroundColor Cyan
Write-Host "Added order tracking: /dashboard/orders/atorvastatin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Restart npm run dev, then refresh http://localhost:3000/dashboard" -ForegroundColor Yellow
