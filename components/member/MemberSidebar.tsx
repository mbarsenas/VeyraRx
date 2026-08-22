"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { member } from "@/lib/mock-data/member";
import BrandLogo from "@/components/BrandLogo";

const navItems = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/reviewer-scenarios", label: "Reviewer scenarios" },
  { href: "/dashboard/prescriptions", label: "Prescriptions" },
  { href: "/dashboard/claims", label: "Claims" },
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
        <BrandLogo compact />
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
        <strong>Evaluation build</strong>
        <p>Use Reviewer scenarios to inspect different synthetic PBM benefit situations.</p>
        <Link href="/dashboard/reviewer-scenarios">Open scenarios</Link>
      </div>
    </aside>
  );
}
