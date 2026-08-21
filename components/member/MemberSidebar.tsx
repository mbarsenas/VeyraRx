"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { member } from "@/lib/mock-data/member";

const navItems = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/prescriptions", label: "Prescriptions" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/benefits", label: "Benefits & coverage" },
  { href: "/dashboard/pharmacy", label: "Pharmacy" },
  { href: "/dashboard/messages", label: "Messages" },
  { href: "/dashboard/profile", label: "Profile" },
];

export default function MemberSidebar() {
  const pathname = usePathname();

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
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return <Link key={item.href} className={active ? "active" : undefined} href={item.href}>{item.label}</Link>;
        })}
      </nav>

      <div className="memberHelp">
        <strong>Need help?</strong>
        <p>Member support is available for prescription and benefit questions.</p>
        <Link href="/contact">Contact support</Link>
      </div>
    </aside>
  );
}
