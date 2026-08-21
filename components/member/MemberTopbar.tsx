import Link from "next/link";

type MemberTopbarProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function MemberTopbar({ eyebrow = "Member dashboard", title, description }: MemberTopbarProps) {
  return (
    <header className="memberTopbar">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="topbarActions">
        <button className="iconButton" aria-label="Notifications">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
        </button>
        <Link className="button secondary" href="/signin">Sign out</Link>
      </div>
    </header>
  );
}
