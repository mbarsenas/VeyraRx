import MemberTopbar from "@/components/member/MemberTopbar";
import { member } from "@/lib/mock-data/member";

export default function MemberPharmacyPage() {
  return (
    <>
      <MemberTopbar eyebrow="Pharmacy" title="Your pharmacy network" description="Review your preferred pharmacy and explore other participating locations." />
      <div className="memberPageGrid">
        <article className="panelCard">
          <span className="eyebrow">Preferred pharmacy</span><h2>{member.preferredPharmacy.name}</h2>
          <p className="railText">{member.preferredPharmacy.location}<br />{member.preferredPharmacy.distance}</p>
          <div className="benefitItem"><span>Status</span><strong>Preferred</strong></div>
          <div className="benefitItem"><span>Pickup</span><strong>Available</strong></div>
          <div className="benefitItem"><span>90-day fills</span><strong>Eligible</strong></div>
        </article>
        <article className="panelCard">
          <span className="eyebrow">Find another pharmacy</span><h2>Search participating locations</h2>
          <label>ZIP code or city</label><input placeholder="San Antonio, TX" />
          <button className="button primary">Search pharmacies</button>
          <small className="note">Prototype search. Live pharmacy-network data is not connected yet.</small>
        </article>
      </div>
    </>
  );
}
