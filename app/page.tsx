import Image from "next/image";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

function ActionIcon({ type }: { type: "package" | "pill" | "card" | "pin" }) {
  const common = {
    width: 32,
    height: 32,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (type === "package") {
    return (
      <svg {...common}>
        <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
        <path d="M4 7.5V16.5L12 21l8-4.5V7.5" />
        <path d="M12 12v9" />
      </svg>
    );
  }

  if (type === "pill") {
    return (
      <svg {...common}>
        <path d="m7.2 16.8 9.6-9.6a4.24 4.24 0 0 0-6-6l-9.6 9.6a4.24 4.24 0 0 0 6 6Z" transform="translate(3 3) scale(.72)" />
        <path d="m9 15 6-6" />
      </svg>
    );
  }

  if (type === "card") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18" />
        <path d="M7 14h4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

const actions = [
  { title: "Track an order", text: "See delivery progress and prescription status.", href: "/orders", icon: "package" as const },
  { title: "Drug pricing", text: "Explore medication pricing options before you fill.", href: "/pricing", icon: "pill" as const },
  { title: "Coverage & benefits", text: "Understand your pharmacy benefits and plan details.", href: "/coverage", icon: "card" as const },
  { title: "Find a pharmacy", text: "Search participating pharmacies near you.", href: "/pharmacies", icon: "pin" as const },
];

export default function Home() {
  return (
    <>
      <section className="hero heroPhotoSection">
        <div className="shell heroPhotoGrid">
          <div className="heroCopy">
            <span className="eyebrow">Pharmacy benefits made simpler</span>
            <h1>Medication access that puts people first.</h1>
            <p className="lead">
              SmarteRX brings prescriptions, pricing, benefits and pharmacy tools into one
              clear experience built around the member.
            </p>
            <div className="buttonRow">
              <Link className="button primary" href="/signin">Sign in</Link>
              <Link className="button secondary" href="/pricing">View drug pricing</Link>
            </div>
            <div className="trustLine">
              <span>Clear pricing</span><span>Convenient access</span><span>Member-first support</span>
            </div>
          </div>

          <div className="heroPhotoWrap" aria-hidden="true">
            <Image
              src="/veyrarx-family-hero.png"
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 100vw, 52vw"
              className="heroPhoto"
            />
          </div>
        </div>
      </section>

      <section className="quickSection">
        <div className="shell">
          <div className="sectionIntro">
            <span className="eyebrow">What can we help with?</span>
            <h2>Get to what matters quickly.</h2>
          </div>
          <div className="actionGrid">
            {actions.map((a) => (
              <Link className="actionCard" href={a.href} key={a.title}>
                <span className="actionIcon"><ActionIcon type={a.icon} /></span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                <span className="cardArrow">Explore <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="splitSection">
        <div className="shell splitGrid">
          <div className="deliveryVisual">
            <div className="pharmacyCard" aria-label="Sample SmarteRX prescription benefit card">
              <div className="pharmacyCardTop">
                <BrandLogo compact />
                <div className="pharmacyCardType">
                  <span>Prescription benefit card</span>
                  <strong>SmarteChoice Plus</strong>
                </div>
              </div>
              <div className="pharmacyCardMember">
                <div>
                  <span>Member name</span>
                  <strong>Sample Member</strong>
                </div>
                <div>
                  <span>Member ID</span>
                  <strong>SRX000000001</strong>
                </div>
              </div>
              <div className="pharmacyCardRouting">
                <div><span>RxBIN</span><strong>610014</strong></div>
                <div><span>RxPCN</span><strong>SRX</strong></div>
                <div><span>RxGRP</span><strong>VYR365</strong></div>
              </div>
              <div className="pharmacyCardBottom">
                <span>Present this card when filling prescriptions</span>
                <strong>Member services&nbsp; 1-800-555-0199</strong>
              </div>
              <span className="pharmacyCardSample">SAMPLE</span>
            </div>
          </div>
          <div>
            <span className="eyebrow">Home delivery</span>
            <h2>Your medications, delivered with less hassle.</h2>
            <p className="leadSmall">
              Move eligible maintenance prescriptions to home delivery and manage refills,
              shipments and support from your account.
            </p>
            <Link className="button primary" href="/resources">Learn about delivery</Link>
          </div>
        </div>
      </section>

      <section className="promiseSection">
        <div className="shell">
          <div className="sectionIntro centered">
            <span className="eyebrow">Our promise</span>
            <h2>A pharmacy experience designed around you.</h2>
          </div>
          <div className="promiseGrid">
            <article><div>01</div><h3>Affordable</h3><p>Tools that make medication costs easier to understand and compare.</p></article>
            <article><div>02</div><h3>Accessible</h3><p>Simple digital access to prescriptions, pharmacies, benefits and support.</p></article>
            <article><div>03</div><h3>Supportive</h3><p>Guidance when you have questions about your medications or pharmacy benefits.</p></article>
          </div>
        </div>
      </section>

      <section className="ctaSection">
        <div className="shell ctaBox">
          <div><span className="eyebrow light">Member tools</span><h2>Search. Compare. Manage. Save.</h2>
          <p>Sign in to see personalized medication pricing, benefits and prescription information.</p></div>
          <Link className="button lightButton" href="/signin">Go to member sign in</Link>
        </div>
      </section>
    </>
  );
}
