import PublicPharmacySearch from "@/components/PublicPharmacySearch";
import { pharmacyLocations } from "@/lib/mock-data/pharmacies";

export default function Pharmacies() {
  return <main className="shell pageWrap">
    <span className="eyebrow">Pharmacy network</span><h1>Find a pharmacy near you.</h1>
    <p className="leadSmall">Search by ZIP code, city or pharmacy name.</p>
    <PublicPharmacySearch pharmacyLocations={pharmacyLocations} />
  </main>
}
