import MemberSidebar from "@/components/member/MemberSidebar";
import "./member-shell.css";
import "./claims/claims.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="memberApp">
      <MemberSidebar />
      <section className="memberContent">
        <div className="evaluationBanner" role="note" aria-label="SmarteRX evaluation environment notice">
          <strong>SmarteRX evaluation environment</strong>
          <span>Synthetic member, benefit, pharmacy and pricing data only. No live claims or adjudication.</span>
        </div>
        {children}
      </section>
    </main>
  );
}
