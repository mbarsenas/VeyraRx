import PricingSearch from "@/components/PricingSearch";

export default function Pricing() {
  return (
    <main className="shell pageWrap">
      <span className="eyebrow">Drug pricing</span>
      <h1>Compare medication costs.</h1>
      <p className="leadSmall">
        Search demo medication prices across participating pharmacies and compare estimated member, negotiated and cash costs.
      </p>
      <PricingSearch />
    </main>
  );
}
