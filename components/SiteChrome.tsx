"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMemberApp = pathname.startsWith("/dashboard");

  if (isMemberApp) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="topBar">
        <div className="shell topInner">
          <span>Member support</span>
          <span>For health care professionals</span>
        </div>
      </div>

      <header>
        <div className="shell nav">
          <Link href="/" className="brand">
            <BrandLogo compact />
          </Link>

          <nav>
            <Link href="/pricing">Drug pricing</Link>
            <Link href="/pharmacies">Find a pharmacy</Link>
            <Link href="/coverage">Coverage</Link>
            <Link href="/resources">Resources</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <Link className="signinButton" href="/signin">
            Sign in
          </Link>
        </div>
      </header>

      {children}

      <footer>
        <div className="shell footerGrid">
          <div>
            <div className="brand footerBrand">
              <BrandLogo compact />
            </div>
            <p>Making pharmacy benefits easier to navigate.</p>
          </div>

          <div>
            <strong>Members</strong>
            <Link href="/pricing">Drug pricing</Link>
            <Link href="/pharmacies">Find a pharmacy</Link>
            <Link href="/resources">Resources</Link>
          </div>

          <div>
            <strong>Company</strong>
            <Link href="/contact">Contact</Link>
            <span>Privacy</span>
            <span>Accessibility</span>
          </div>
        </div>

        <div className="shell copyright">
          Copyright 2026 SmarteRX. Prototype concept. All rights reserved.
        </div>
      </footer>
    </>
  );
}
