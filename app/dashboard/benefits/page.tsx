import Link from "next/link";
import MemberTopbar from "@/components/member/MemberTopbar";
import SummaryCard from "@/components/member/SummaryCard";
import CoverageTierCard from "@/components/member/CoverageTierCard";
import { getMemberRepository } from "@/lib/data";

export default async function MemberBenefitsPage() {
  const repository = getMemberRepository();
  const [member, benefits] = await Promise.all([
    repository.getMemberSummary(),
    repository.getBenefits(),
  ]);

  const deductiblePercent = benefits.deductibleTotal > 0
    ? Math.round((benefits.deductibleUsed / benefits.deductibleTotal) * 100)
    : 0;
  const outOfPocketPercent = benefits.outOfPocketMax > 0
    ? Math.round((benefits.outOfPocketUsed / benefits.outOfPocketMax) * 100)
    : 0;

  return (
    <>
      <MemberTopbar
        eyebrow="Benefits & coverage"
        title="Your pharmacy benefit"
        description="Review plan costs, medication coverage, formulary tiers and authorization requirements."
      />

      <section className="summaryGrid">
        <SummaryCard
          label="Deductible used"
          value={`$${benefits.deductibleUsed.toLocaleString()}`}
          detail={`${deductiblePercent}% of $${benefits.deductibleTotal.toLocaleString()}`}
          progressPercent={deductiblePercent}
        />
        <SummaryCard
          label="Out-of-pocket"
          value={`$${benefits.outOfPocketUsed.toLocaleString()}`}
          detail={`${outOfPocketPercent}% of $${benefits.outOfPocketMax.toLocaleString()}`}
          progressPercent={outOfPocketPercent}
        />
        <SummaryCard label="Plan" value={member.plan.name} detail={benefits.planYear} />
        <SummaryCard label="Potential savings" value={`$${member.potentialSavings}`} detail="Available this month" />
      </section>

      <div className="memberPageGrid">
        <article className="panelCard">
          <span className="eyebrow">Plan identifiers</span>
          <h2>Benefit information</h2>
          <div className="benefitItem"><span>Rx BIN</span><strong>{member.plan.rxBin}</strong></div>
          <div className="benefitItem"><span>Rx Group</span><strong>{member.plan.rxGroup}</strong></div>
          <div className="benefitItem"><span>Effective date</span><strong>{member.plan.effectiveDate}</strong></div>
          <div className="benefitItem"><span>Plan year</span><strong>{benefits.planYear}</strong></div>
        </article>

        <article className="panelCard">
          <span className="eyebrow">Coverage tools</span>
          <h2>Understand your medications</h2>
          <p className="railText">Search covered medications, review cost tiers and see whether prior authorization applies.</p>
          <div className="cardActionRow" style={{ marginTop: "18px" }}>
            <Link className="button primary" href="/dashboard/benefits/formulary">View formulary</Link>
            <Link className="button secondary" href="/dashboard/benefits/prior-authorization">Prior authorization</Link>
          </div>
        </article>
      </div>

      <section style={{ marginTop: "20px" }}>
        <div className="panelHeader">
          <div>
            <span className="eyebrow">Coverage tiers</span>
            <h2>What you may pay</h2>
          </div>
        </div>
        <div className="memberPageGrid">
          {benefits.coverageTiers.map((tier) => <CoverageTierCard key={tier.name} tier={tier} />)}
        </div>
      </section>

      <p className="demoDisclosure">Demo benefit data only. Actual member costs and coverage are determined by the member plan and pharmacy claim.</p>
    </>
  );
}
