import PricingSearch from "@/components/PricingSearch";
import { getPbmDemoScenario } from "@/lib/demo/pbm-scenarios";

export default async function Pricing({ searchParams }: { searchParams: Promise<{ scenario?: string }> }) {
  const { scenario: scenarioId } = await searchParams;
  const scenario = getPbmDemoScenario(scenarioId);

  return (
    <main className="shell pageWrap">
      <span className="eyebrow">Drug pricing</span>
      <h1>Compare medication costs.</h1>
      <p className="leadSmall">
        Search demo medication prices across participating pharmacies and compare estimated member, negotiated and cash costs.
      </p>
      <PricingSearch scenario={scenarioId ? scenario : undefined} />
    </main>
  );
}
