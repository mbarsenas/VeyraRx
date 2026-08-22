import MemberTopbar from "@/components/member/MemberTopbar";
import PharmacySearch from "@/components/member/PharmacySearch";
import { getMemberRepository } from "@/lib/data";

export default async function MemberPharmacyPage() {
  const repository = getMemberRepository();
  const [pharmacyLocations, preferredId] = await Promise.all([
    repository.getPharmacies(),
    repository.getPreferredPharmacyId(),
  ]);

  return (
    <>
      <MemberTopbar
        eyebrow="Pharmacy"
        title="Your pharmacy network"
        description="Review your preferred pharmacy, search participating locations and compare network details."
      />
      <PharmacySearch pharmacyLocations={pharmacyLocations} initialPreferredId={preferredId} />
    </>
  );
}
