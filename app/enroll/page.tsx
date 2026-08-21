import { redirect } from "next/navigation";
import EnrollForm from "@/app/enroll/EnrollForm";
import { getCurrentMemberSession } from "@/lib/auth/session";
import { isCurrentAccountEnrolled } from "@/lib/data/member-enrollment";

export default async function EnrollPage() {
  const session = await getCurrentMemberSession();
  if (!session) redirect("/signin");

  if (await isCurrentAccountEnrolled()) {
    redirect("/dashboard");
  }

  return (
    <main style={{ padding: "24px" }}>
      <EnrollForm />
    </main>
  );
}
