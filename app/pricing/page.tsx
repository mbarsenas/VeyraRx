export default function Pricing() {
  return <main className="shell pageWrap">
    <span className="eyebrow">Drug pricing</span><h1>Compare medication costs.</h1>
    <p className="leadSmall">Enter a medication to preview pricing options and participating pharmacies.</p>
    <div className="toolCard">
      <label>Medication name</label><input placeholder="e.g. atorvastatin" />
      <div className="twoCol"><div><label>Strength</label><input placeholder="20 mg" /></div><div><label>Quantity</label><input placeholder="30" /></div></div>
      <button className="button primary">Search prices</button>
      <small className="note">Demo interface only. No live drug pricing is connected yet.</small>
    </div>
  </main>
}
