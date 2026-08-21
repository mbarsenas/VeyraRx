import Image from "next/image";
import Link from "next/link";

const actions = [
  { title: "Track an order", text: "See delivery progress and prescription status.", href: "/orders", icon: "BOX" },
  { title: "Compare drug prices", text: "Explore medication pricing options before you fill.", href: "/pricing", icon: "RX" },
  { title: "Coverage & benefits", text: "Understand your pharmacy benefits and plan details.", href: "/coverage", icon: "PLAN" },
  { title: "Find a pharmacy", text: "Search participating pharmacies near you.", href: "/pharmacies", icon: "PIN" },
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
              VeyraRx brings prescriptions, pricing, benefits and pharmacy tools into one
              clear experience built around the member.
            </p>
            <div className="buttonRow">
              <Link className="button primary" href="/signin">Sign in</Link>
              <Link className="button secondary" href="/pricing">Check drug pricing</Link>
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
                <span className="actionIcon">{a.icon}</span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                <span className="cardArrow">Explore -&gt;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="splitSection">
        <div className="shell splitGrid">
          <div className="deliveryVisual">
            <div className="deliveryBadge">Free standard delivery</div>
            <div className="package">Veyra<span>Rx</span></div>
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
            <article><div>03</div><h3>Supportive</h3><p>Guidance when you have questions about your medications or pharmacy benefit.</p></article>
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
