import MemberTopbar from "@/components/member/MemberTopbar";
import OrderCard from "@/components/member/OrderCard";
import { orders } from "@/lib/mock-data/orders";

export default function MemberOrdersPage() {
  const activeOrders = orders.filter((order) => order.status !== "Delivered");
  const completedOrders = orders.filter((order) => order.status === "Delivered");

  return (
    <>
      <MemberTopbar eyebrow="Orders" title="Your medication orders" description="Track active shipments and review recent prescription orders." />

      <section className="ordersSection">
        <div className="panelHeader">
          <div><span className="eyebrow">Active orders</span><h2>In progress</h2></div>
          <span className="ordersCount">{activeOrders.length} active</span>
        </div>
        <div className="memberPageGrid">
          {activeOrders.map((order) => <OrderCard order={order} key={order.id} />)}
        </div>
      </section>

      <section className="ordersSection">
        <div className="panelHeader">
          <div><span className="eyebrow">Order history</span><h2>Completed orders</h2></div>
          <span className="ordersCount">{completedOrders.length} recent</span>
        </div>
        <div className="memberPageGrid">
          {completedOrders.map((order) => <OrderCard order={order} key={order.id} />)}
        </div>
      </section>
    </>
  );
}
