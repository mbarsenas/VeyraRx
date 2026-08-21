import MemberTopbar from "@/components/member/MemberTopbar";
import { member } from "@/lib/mock-data/member";

export default function ProfilePage() {
  return (
    <>
      <MemberTopbar eyebrow="Profile" title="Account & preferences" description="Manage contact information and communication preferences for your member account." />
      <div className="memberProfileGrid">
        <section className="memberProfileCard">
          <h2>Contact information</h2>
          <label>Email</label><input value="mark@example.com" readOnly />
          <label>Phone</label><input value="(210) 555-0148" readOnly />
          <label>Preferred communication</label><input value="Email" readOnly />
        </section>
        <section className="memberProfileCard">
          <h2>Member information</h2>
          <div className="benefitItem"><span>Name</span><strong>{member.firstName} {member.lastInitial}</strong></div>
          <div className="benefitItem"><span>Member ID</span><strong>**** {member.memberIdLast4}</strong></div>
          <div className="benefitItem"><span>Plan</span><strong>{member.plan.name}</strong></div>
          <div className="benefitItem"><span>Effective date</span><strong>{member.plan.effectiveDate}</strong></div>
        </section>
      </div>
    </>
  );
}
