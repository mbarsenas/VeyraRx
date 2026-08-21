import MemberSidebar from "@/components/member/MemberSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="memberApp">
      <MemberSidebar />
      <section className="memberContent">{children}</section>
    </main>
  );
}
