import Link from "next/link";
import { member } from "@/lib/mock-data/member";

export default function PlanCard() {
  return (
    <article className="panelCard benefitCard">
      <span className="eyebrow">Your plan</span>
      <h2>Pharmacy benefits</h2>
      <div className="benefitItem"><span>Plan</span><strong>{member.plan.name}</strong></div>
      <div className="benefitItem"><span>Rx BIN</span><strong>{member.plan.rxBin}</strong></div>
      <div className="benefitItem"><span>Rx Group</span><strong>{member.plan.rxGroup}</strong></div>
      <div className="benefitItem"><span>Effective date</span><strong>{member.plan.effectiveDate}</strong></div>
      <Link className="button primary full" href="/dashboard/benefits">View benefit details</Link>
    </article>
  );
}
