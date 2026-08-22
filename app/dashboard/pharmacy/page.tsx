import MemberTopbar from "@/components/member/MemberTopbar";
import PharmacySearch from "@/components/member/PharmacySearch";
import PbmScenarioContext from "@/components/member/PbmScenarioContext";
import { getMemberRepository } from "@/lib/data";
import { getPbmDemoScenario } from "@/lib/demo/pbm-scenarios";

export default async function MemberPharmacyPage({ searchParams }: { searchParams: Promise<{ scenario?: string }> }) {
  const { scenario: scenarioId } = await searchParams;
  const scenario = getPbmDemoScenario(scenarioId);
  const repository = getMemberRepository();
  const [pharmacyLocations, preferredId] = await Promise.all([
    repository.getPharmacies(),
    repository.getPreferredPharmacyId(),
  ]);

  return (
    <>
      <MemberTopbar eyebrow="Pharmacy" title="Your pharmacy network" description="Review your preferred pharmacy, search participating locations and compare network details." />
      {scenarioId && <PbmScenarioContext scenario={scenario} />}
      <PharmacySearch pharmacyLocations={pharmacyLocations} initialPreferredId={preferredId} />
    </>
  );
}
