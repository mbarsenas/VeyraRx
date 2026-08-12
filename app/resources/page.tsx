export default function Resources() {
  return <main className="shell pageWrap">
    <span className="eyebrow">Member resources</span><h1>Answers and tools for managing your prescriptions.</h1>
    <div className="resourceList">
      {["Home delivery","Understanding your benefits","Medication safety","Specialty medications","Prior authorization","Forms & documents"].map(x =>
        <div className="resourceRow" key={x}><strong>{x}</strong><span>View resource →</span></div>)}
    </div>
  </main>
}
