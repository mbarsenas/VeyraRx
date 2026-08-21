import { redirect } from "next/navigation";
import MemberSidebar from "@/components/member/MemberSidebar";
import { getCurrentMemberSession } from "@/lib/auth/session";
import { isCurrentAccountEnrolled } from "@/lib/data/member-enrollment";
import "./member-shell.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentMemberSession();
  if (!session) redirect("/signin");

  if (!(await isCurrentAccountEnrolled())) {
    redirect("/enroll");
  }

  return (
    <main className="memberApp">
      <MemberSidebar />
      <section className="memberContent">{children}</section>
    </main>
  );
}
