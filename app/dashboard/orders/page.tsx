import Link from "next/link";
import MemberTopbar from "@/components/member/MemberTopbar";

export default function MemberOrdersPage() {
  return (
    <>
      <MemberTopbar eyebrow="Orders" title="Your medication orders" description="Track active shipments and review recent prescription orders." />
      <div className="memberPageGrid">
        <article className="panelCard">
          <div className="panelHeader"><div><span className="eyebrow">In progress</span><h2>Atorvastatin 20 mg</h2></div><span className="statusChip processing">Processing</span></div>
          <div className="benefitItem"><span>Order</span><strong>VYR-883921</strong></div>
          <div className="benefitItem"><span>Supply</span><strong>90 days</strong></div>
          <div className="benefitItem"><span>Estimated arrival</span><strong>Aug 14</strong></div>
          <Link className="button primary" href="/dashboard/orders/atorvastatin">Track order</Link>
        </article>
        <article className="panelCard">
          <span className="eyebrow">Recent orders</span><h2>Order history</h2>
          <div className="benefitItem"><span>Jun 28, 2026</span><strong>Metformin ER 500 mg</strong></div>
          <div className="benefitItem"><span>Jul 12, 2026</span><strong>Lisinopril 10 mg</strong></div>
          <div className="benefitItem"><span>May 14, 2026</span><strong>Atorvastatin 20 mg</strong></div>
        </article>
      </div>
    </>
  );
}
