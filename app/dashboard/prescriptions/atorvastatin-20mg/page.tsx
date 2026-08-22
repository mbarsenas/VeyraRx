import PrescriptionDetails from "../../../../components/member/PrescriptionDetails";
import { getPrescriptionBySlug } from "../../../../lib/mock-data/member";
import { getPbmDemoScenario } from "@/lib/demo/pbm-scenarios";

export default async function AtorvastatinDetailsPage({ searchParams }: { searchParams: Promise<{ scenario?: string }> }) {
  const { scenario: scenarioId } = await searchParams;
  const prescription = getPrescriptionBySlug("atorvastatin-20mg");

  if (!prescription) return null;

  return <PrescriptionDetails prescription={prescription} scenario={scenarioId ? getPbmDemoScenario(scenarioId) : undefined} />;
}
