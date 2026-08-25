import Link from "next/link";
import MemberTopbar from "@/components/member/MemberTopbar";
import SummaryCard from "@/components/member/SummaryCard";
import CoverageTierCard from "@/components/member/CoverageTierCard";
import PbmScenarioContext from "@/components/member/PbmScenarioContext";
import { getMemberRepository } from "@/lib/data";
import { getPbmDemoScenario } from "@/lib/demo/pbm-scenarios";
import { getAuthenticatedMemberClaimAccumulators } from "@/lib/data/member-claims";

export default async function MemberBenefitsPage({ searchParams }: { searchParams: Promise<{ scenario?: string }> }) {
  const { scenario: scenarioId } = await searchParams;
  const scenario = getPbmDemoScenario(scenarioId);
  const repository = getMemberRepository();
  const [member, benefits, claimAccumulators] = await Promise.all([
    repository.getMemberSummary(),
    repository.getBenefits(),
    getAuthenticatedMemberClaimAccumulators(),
  ]);

  const deductibleUsed = claimAccumulators.deductibleCents / 100;
  const outOfPocketUsed = claimAccumulators.outOfPocketCents / 100;

  const deductiblePercent = benefits.deductibleTotal > 0
    ? Math.round((deductibleUsed / benefits.deductibleTotal) * 100)
    : 0;
  const outOfPocketPercent = benefits.outOfPocketMax > 0
    ? Math.round((outOfPocketUsed / benefits.outOfPocketMax) * 100)
    : 0;
  const suffix = `?scenario=${scenario.id}`;

  return (
    <>
      <MemberTopbar
        eyebrow="Benefits & coverage"
        title="Your pharmacy benefit"
        description="Review benefit accumulators, formulary tiers, utilization-management requirements and member cost-sharing examples."
      />

      {scenarioId && <PbmScenarioContext scenario={scenario} />}

      <section className="summaryGrid">
        <SummaryCard label="Rx deductible accumulator" value={`$${deductibleUsed.toLocaleString()}`} detail={`${deductiblePercent}% of $${benefits.deductibleTotal.toLocaleString()} based on paid claims`} progressPercent={deductiblePercent} />
        <SummaryCard label="Rx out-of-pocket accumulator" value={`$${outOfPocketUsed.toLocaleString()}`} detail={`${outOfPocketPercent}% of $${benefits.outOfPocketMax.toLocaleString()} based on paid claims`} progressPercent={outOfPocketPercent} />
        <SummaryCard label="Benefit plan" value={member.plan.name} detail={benefits.planYear} />
        <SummaryCard label="Estimated savings opportunities" value={`$${member.potentialSavings}`} detail="Synthetic demo estimate" />
      </section>

      <div className="memberPageGrid">
        <article className="panelCard">
          <span className="eyebrow">Benefit identifiers</span><h2>Pharmacy benefit information</h2>
          <div className="benefitItem"><span>Rx BIN</span><strong>{member.plan.rxBin}</strong></div>
          <div className="benefitItem"><span>Rx Group</span><strong>{member.plan.rxGroup}</strong></div>
          <div className="benefitItem"><span>Benefit effective date</span><strong>{member.plan.effectiveDate}</strong></div>
          <div className="benefitItem"><span>Plan year</span><strong>{benefits.planYear}</strong></div>
          <p className="railText">Member responsibility can vary by formulary tier, deductible stage, pharmacy network, day supply and utilization-management requirements.</p>
        </article>

        <article className="panelCard">
          <span className="eyebrow">Coverage tools</span><h2>Understand medication coverage</h2>
          <p className="railText">Review formulary status, cost-sharing tier and whether prior authorization or other utilization-management rules may apply.</p>
          <div className="cardActionRow" style={{ marginTop: "18px" }}>
            <Link className="button primary" href={`/dashboard/benefits/formulary${scenarioId ? suffix : ""}`}>Review formulary</Link>
            <Link className="button secondary" href={`/dashboard/benefits/prior-authorization${scenarioId ? suffix : ""}`}>View prior authorizations</Link>
          </div>
        </article>
      </div>

      <section style={{ marginTop: "20px" }}>
        <div className="panelHeader"><div><span className="eyebrow">Member cost sharing</span><h2>Illustrative formulary tiers</h2><p className="railText">These values model common retail and home-delivery benefit designs and are not live adjudication results.</p></div></div>
        <div className="memberPageGrid">{benefits.coverageTiers.map((tier) => <CoverageTierCard key={tier.name} tier={tier} />)}</div>
      </section>

      <p className="demoDisclosure">Synthetic benefit data only. Actual coverage and member responsibility are determined at claim adjudication using the member's active plan, accumulated benefit position, pharmacy network and medication-specific rules.</p>
    </>
  );
}
