import MemberTopbar from "@/components/member/MemberTopbar";
import ProfileSettings from "@/components/member/ProfileSettings";
import { getCurrentMemberSession } from "@/lib/auth/session";
import { getMemberRepository } from "@/lib/data";
import { memberProfile } from "@/lib/mock-data/profile";

export default async function ProfilePage() {
  const session = await getCurrentMemberSession();
  if (!session) {
    throw new Error("An authenticated member session is required.");
  }

  const repository = getMemberRepository();
  const member = await repository.getMemberSummary();
  const initialProfile = {
    ...memberProfile,
    email: session.email,
  };

  return (
    <>
      <MemberTopbar
        eyebrow="Profile"
        title="Account & preferences"
        description="Manage contact information, communication preferences and member account settings."
      />

      <section className="memberPageGrid" style={{ marginBottom: "20px" }}>
        <article className="panelCard">
          <span className="eyebrow">Member information</span>
          <h2>Account summary</h2>
          <div className="benefitItem"><span>Name</span><strong>{member.firstName} {member.lastInitial}</strong></div>
          <div className="benefitItem"><span>Member ID</span><strong>**** {member.memberIdLast4}</strong></div>
          <div className="benefitItem"><span>Plan</span><strong>{member.plan.name}</strong></div>
          <div className="benefitItem"><span>Effective date</span><strong>{member.plan.effectiveDate}</strong></div>
          <div className="benefitItem"><span>Sign-in email</span><strong>{session.email}</strong></div>
        </article>

        <article className="panelCard">
          <span className="eyebrow">Security</span>
          <h2>Sign-in & account security</h2>
          <div className="benefitItem"><span>Account</span><strong>{session.displayName}</strong></div>
          <div className="benefitItem"><span>Email</span><strong>{session.email}</strong></div>
          <div className="benefitItem"><span>Authentication</span><strong>Neon Auth session active</strong></div>
        </article>
      </section>

      <ProfileSettings initialProfile={initialProfile} />
    </>
  );
}
