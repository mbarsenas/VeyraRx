import MemberTopbar from "@/components/member/MemberTopbar";

export default function MessagesPage() {
  return (
    <>
      <MemberTopbar eyebrow="Messages" title="Secure messages" description="Review pharmacy-benefit notifications and member support messages." />
      <section className="memberEmptyState">
        <span className="eyebrow">Inbox</span>
        <h2>No new messages</h2>
        <p>You are all caught up. New benefit, pharmacy, or order messages will appear here.</p>
      </section>
    </>
  );
}
