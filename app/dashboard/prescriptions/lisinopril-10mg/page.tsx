import PrescriptionDetails from "../../../../components/member/PrescriptionDetails";
import { getPrescriptionBySlug } from "../../../../lib/mock-data/member";

export default function LisinoprilDetailsPage() {
  const prescription = getPrescriptionBySlug("lisinopril-10mg");

  if (!prescription) return null;

  return <PrescriptionDetails prescription={prescription} />;
}
