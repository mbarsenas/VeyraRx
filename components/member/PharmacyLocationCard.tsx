import type { PharmacyLocation } from "@/lib/mock-data/pharmacies";

type Props = {
  pharmacy: PharmacyLocation;
  isPreferred: boolean;
  onSelectPreferred: (id: string) => void;
};

export default function PharmacyLocationCard({ pharmacy, isPreferred, onSelectPreferred }: Props) {
  const statusClass = pharmacy.networkStatus === "Preferred" ? "statusChip" : pharmacy.networkStatus === "In network" ? "statusChip processing" : "statusChip attention";

  return (
    <article className="panelCard">
      <div className="panelHeader">
        <div>
          <span className="eyebrow">{isPreferred ? "Preferred pharmacy" : "Pharmacy"}</span>
          <h2>{pharmacy.name}</h2>
        </div>
        <span className={statusClass}>{pharmacy.networkStatus}</span>
      </div>

      <p className="railText">{pharmacy.address}<br />{pharmacy.cityStateZip}<br />{pharmacy.distance} away</p>
      <div className="benefitItem"><span>Hours today</span><strong>{pharmacy.hours}</strong></div>
      <div className="benefitItem"><span>Phone</span><strong>{pharmacy.phone}</strong></div>
      <div className="benefitItem"><span>Pickup</span><strong>{pharmacy.pickup ? "Available" : "Unavailable"}</strong></div>
      <div className="benefitItem"><span>90-day fills</span><strong>{pharmacy.ninetyDayEligible ? "Eligible" : "Not eligible"}</strong></div>
      <div className="benefitItem"><span>Drive-thru</span><strong>{pharmacy.driveThru ? "Available" : "No"}</strong></div>

      {pharmacy.networkStatus !== "Out of network" && !isPreferred && (
        <button className="button secondary full" onClick={() => onSelectPreferred(pharmacy.id)}>
          Set as preferred
        </button>
      )}
    </article>
  );
}
