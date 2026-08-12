export default function Orders() {
  return <main className="shell pageWrap">
    <span className="eyebrow">Order tracking</span><h1>Track a medication order.</h1>
    <p className="leadSmall">Check order status using your confirmation information.</p>
    <div className="toolCard"><label>Order number</label><input placeholder="Order number" />
    <label>Date of birth</label><input placeholder="MM / DD / YYYY" />
    <button className="button primary">Track order</button>
    <small className="note">Demo interface only. This form is not connected to patient data.</small></div>
  </main>
}
