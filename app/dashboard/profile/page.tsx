import MemberTopbar from "@/components/member/MemberTopbar";
import ProfileSettings from "@/components/member/ProfileSettings";
import { member } from "@/lib/mock-data/member";
import { memberProfile } from "@/lib/mock-data/profile";

export default function ProfilePage() {
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
        </article>

        <article className="panelCard">
          <span className="eyebrow">Security</span>
          <h2>Sign-in & account security</h2>
          <div className="benefitItem"><span>Password</span><strong>Last changed 42 days ago</strong></div>
          <div className="benefitItem"><span>Two-step verification</span><strong>Enabled</strong></div>
          <div className="benefitItem"><span>Recent sign-in</span><strong>San Antonio, TX</strong></div>
          <button className="button secondary" style={{ marginTop: "18px" }}>Manage security</button>
        </article>
      </section>

      <ProfileSettings initialProfile={memberProfile} />
    </>
  );
}
