import MemberSidebar from "@/components/member/MemberSidebar";
import "./member-shell.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="memberApp">
      <MemberSidebar />
      <section className="memberContent">
        <div className="evaluationBanner" role="note" aria-label="VeyraRx evaluation environment notice">
          <strong>VeyraRx evaluation environment</strong>
          <span>Synthetic member, benefit, pharmacy and pricing data only. No live claims or adjudication.</span>
        </div>
        {children}
      </section>
    </main>
  );
}
