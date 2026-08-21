import type { CoverageTier } from "@/lib/mock-data/benefits";

export default function CoverageTierCard({ tier }: { tier: CoverageTier }) {
  return (
    <article className="panelCard">
      <span className="eyebrow">{tier.name}</span>
      <h2>{tier.description}</h2>
      <div className="benefitItem"><span>30-day retail</span><strong>{tier.retail30}</strong></div>
      <div className="benefitItem"><span>90-day retail</span><strong>{tier.retail90}</strong></div>
      <div className="benefitItem"><span>90-day home delivery</span><strong>{tier.home90}</strong></div>
    </article>
  );
}
