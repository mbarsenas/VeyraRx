import MemberSidebar from "@/components/member/MemberSidebar";
import "./member-shell.css";
import "./claims/claims.css";
import { getMemberRepository } from "@/lib/data";
import { getCurrentMemberSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getMemberAccessDestination } from "@/lib/auth/member-access";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentMemberSession();
  const initialDestination = getMemberAccessDestination(session, true);
  if (initialDestination === "/signin") redirect(initialDestination);
  if (initialDestination === "/verify-email") redirect(`/verify-email?email=${encodeURIComponent(session!.email)}`);

  let member;
  try {
    member = await getMemberRepository().getMemberSummary();
  } catch (error) {
    if (error instanceof Error && error.message.includes("not linked")) {
      redirect(getMemberAccessDestination(session, false));
    }
    throw error;
  }
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
