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
