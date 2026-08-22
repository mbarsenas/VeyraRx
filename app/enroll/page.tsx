import { redirect } from "next/navigation";
import { getCurrentMemberSession } from "@/lib/auth/session";

export default async function EnrollPage() {
  const session = await getCurrentMemberSession();
  if (!session) redirect("/signin");

  return (
    <main className="signinWrap">
      <section className="signinCard">
        <div className="brandMark big" aria-hidden="true"><span className="brandV">V</span><span className="brandRx">Rx</span></div>
        <h1>Connect your member account</h1>
        <p>Your VeyraRx sign-in is active, but it is not yet linked to a pharmacy-benefit member record.</p>
        <p className="note">For this production-foundation build, member linking is being completed server-side so we can validate authenticated identity and RLS safely.</p>
        <a className="button primary full" href="/dashboard">Try dashboard again</a>
        <a className="button secondary full" href="/signin">Return to sign in</a>
      </section>
    </main>
  );
}
