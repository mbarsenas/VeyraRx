import MemberTopbar from "@/components/member/MemberTopbar";
import PharmacySearch from "@/components/member/PharmacySearch";

export default function MemberPharmacyPage() {
  return (
    <>
      <MemberTopbar
        eyebrow="Pharmacy"
        title="Your pharmacy network"
        description="Review your preferred pharmacy, search participating locations and compare network details."
      />
      <PharmacySearch />
    </>
  );
}
