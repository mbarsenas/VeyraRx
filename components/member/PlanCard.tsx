import Link from "next/link";
import type { MemberPlan } from "@/lib/domain/member";

export default function PlanCard({ plan }: { plan: MemberPlan }) {
  return (
    <article className="panelCard benefitCard">
      <span className="eyebrow">Your plan</span>
      <h2>Pharmacy benefits</h2>
      <div className="benefitItem"><span>Plan</span><strong>{plan.name}</strong></div>
      <div className="benefitItem"><span>Rx BIN</span><strong>{plan.rxBin}</strong></div>
      <div className="benefitItem"><span>Rx Group</span><strong>{plan.rxGroup}</strong></div>
      <div className="benefitItem"><span>Effective date</span><strong>{plan.effectiveDate}</strong></div>
      <Link className="button primary full" href="/dashboard/benefits">View benefit details</Link>
    </article>
  );
}
