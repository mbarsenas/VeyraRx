import MemberSidebar from "@/components/member/MemberSidebar";
import "./member-shell.css";
import "./claims/claims.css";
import { getMemberRepository } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const member = await getMemberRepository().getMemberSummary();
  return (
    <main className="memberApp">
      <MemberSidebar member={member} />
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
