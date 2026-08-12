import Link from "next/link";
import { member } from "@/lib/mock-data/member";

export default function MemberSidebar() {
  return (
    <aside className="memberSidebar">
      <Link href="/" className="memberBrand">
        <span className="brandMark" aria-hidden="true">
          <span className="brandV">V</span><span className="brandRx">Rx</span>
        </span>
        <span>VeyraRx</span>
      </Link>

      <div className="memberIdentity">
        <div className="avatar">{member.initials}</div>
        <div>
          <strong>{member.firstName} {member.lastInitial}</strong>
          <small>Member ID **** {member.memberIdLast4}</small>
        </div>
      </div>

      <nav className="memberNav">
        <Link href="/dashboard">Overview</Link>
        <Link href="/dashboard/prescriptions">Prescriptions</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/coverage">Benefits & coverage</Link>
        <Link href="/pharmacies">Pharmacy</Link>
        <Link href="/dashboard/messages">Messages</Link>
        <Link href="/dashboard/profile">Profile</Link>
      </nav>

      <div className="memberHelp">
        <strong>Need help?</strong>
        <p>Member support is available for prescription and benefit questions.</p>
        <Link href="/contact">Contact support</Link>
      </div>
    </aside>
  );
}
