export default function Pharmacies() {
  return <main className="shell pageWrap">
    <span className="eyebrow">Pharmacy network</span><h1>Find a pharmacy near you.</h1>
    <p className="leadSmall">Search by ZIP code, city or pharmacy name.</p>
    <div className="toolCard"><label>Location</label><input placeholder="ZIP code or city" />
    <button className="button primary">Find pharmacies</button>
    <div className="placeholderMap">Interactive pharmacy map</div></div>
  </main>
}
