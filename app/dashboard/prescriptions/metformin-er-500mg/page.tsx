import PrescriptionDetails from "../../../../components/member/PrescriptionDetails";
import { getPrescriptionBySlug } from "../../../../lib/mock-data/member";

export default function MetforminDetailsPage() {
  const prescription = getPrescriptionBySlug("metformin-er-500mg");

  if (!prescription) return null;

  return <PrescriptionDetails prescription={prescription} />;
}
