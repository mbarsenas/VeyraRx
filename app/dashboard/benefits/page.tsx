import MemberTopbar from "@/components/member/MemberTopbar";
import SummaryCard from "@/components/member/SummaryCard";
import { member } from "@/lib/mock-data/member";

export default function MemberBenefitsPage() {
  const deductiblePercent = Math.round((member.plan.deductibleUsed / member.plan.deductibleTotal) * 100);
  return (
    <>
      <MemberTopbar eyebrow="Benefits & coverage" title="Your pharmacy benefit" description="Review plan identifiers, deductible progress and medication coverage information." />
      <section className="summaryGrid">
        <SummaryCard label="Deductible used" value={`$${member.plan.deductibleUsed}`} detail={`${deductiblePercent}% of annual deductible`} progressPercent={deductiblePercent} />
        <SummaryCard label="Annual deductible" value={`$${member.plan.deductibleTotal.toLocaleString()}`} detail="Pharmacy benefit" />
        <SummaryCard label="Plan" value={member.plan.name} detail={`Effective ${member.plan.effectiveDate}`} />
        <SummaryCard label="Potential savings" value={`$${member.potentialSavings}`} detail="Available this month" />
      </section>
      <div className="memberPageGrid">
        <article className="panelCard">
          <span className="eyebrow">Plan identifiers</span><h2>Benefit information</h2>
          <div className="benefitItem"><span>Rx BIN</span><strong>{member.plan.rxBin}</strong></div>
          <div className="benefitItem"><span>Rx Group</span><strong>{member.plan.rxGroup}</strong></div>
          <div className="benefitItem"><span>Effective date</span><strong>{member.plan.effectiveDate}</strong></div>
        </article>
        <article className="panelCard">
          <span className="eyebrow">Coverage tools</span><h2>Understand your medications</h2>
          <div className="benefitItem"><span>Formulary</span><strong>View covered drugs</strong></div>
          <div className="benefitItem"><span>Prior authorization</span><strong>Review requirements</strong></div>
          <div className="benefitItem"><span>Coverage tiers</span><strong>Compare member costs</strong></div>
        </article>
      </div>
    </>
  );
}
