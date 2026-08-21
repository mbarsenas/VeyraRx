import MemberTopbar from "@/components/member/MemberTopbar";
import OrderCard from "@/components/member/OrderCard";
import { getAuthenticatedMemberOrders } from "@/lib/data/member-orders";

export default async function MemberOrdersPage() {
  const orders = await getAuthenticatedMemberOrders();
  const activeOrders = orders.filter((order) => order.status !== "Delivered" && order.status !== "Cancelled");
  const completedOrders = orders.filter((order) => order.status === "Delivered" || order.status === "Cancelled");

  return (
    <>
      <MemberTopbar eyebrow="Orders" title="Your medication orders" description="Track active shipments and review recent prescription orders." />

      <section className="ordersSection">
        <div className="panelHeader">
          <div><span className="eyebrow">Active orders</span><h2>In progress</h2></div>
          <span className="ordersCount">{activeOrders.length} active</span>
        </div>
        <div className="memberPageGrid">
          {activeOrders.length > 0
            ? activeOrders.map((order) => <OrderCard order={order} key={order.id} />)
            : <article className="panelCard"><p className="railText">You have no active medication orders.</p></article>}
        </div>
      </section>

      <section className="ordersSection">
        <div className="panelHeader">
          <div><span className="eyebrow">Order history</span><h2>Completed orders</h2></div>
          <span className="ordersCount">{completedOrders.length} recent</span>
        </div>
        <div className="memberPageGrid">
          {completedOrders.length > 0
            ? completedOrders.map((order) => <OrderCard order={order} key={order.id} />)
            : <article className="panelCard"><p className="railText">No completed medication orders yet.</p></article>}
        </div>
      </section>
    </>
  );
}
