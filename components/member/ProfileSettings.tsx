"use client";

import { useState, useTransition } from "react";
import type { MemberProfile, CommunicationPreference } from "@/lib/domain/profile";
import { saveMemberProfile } from "@/app/dashboard/profile/actions";

export default function ProfileSettings({ initialProfile }: { initialProfile: MemberProfile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [status, setStatus] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function update<K extends keyof MemberProfile>(key: K, value: MemberProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setStatus("");
  }

  function saveProfile() {
    setStatus("");
    startTransition(async () => {
      const result = await saveMemberProfile(profile);
      setStatus(result.message);
    });
  }

  return (
    <div className="memberProfileGrid">
      <section className="memberProfileCard">
        <span className="eyebrow">Contact information</span>
        <h2>Contact details</h2>

        <label>Email</label>
        <input value={profile.email} readOnly aria-readonly="true" />
        <small className="railText">Sign-in email is managed by your account authentication settings.</small>

        <label>Phone</label>
        <input value={profile.phone} onChange={(e) => update("phone", e.target.value)} />

        <label>Address</label>
        <input value={profile.address1} onChange={(e) => update("address1", e.target.value)} />
        <input value={profile.address2} placeholder="Apartment, suite, etc. (optional)" onChange={(e) => update("address2", e.target.value)} />

        <div className="twoCol">
          <div>
            <label>City</label>
            <input value={profile.city} onChange={(e) => update("city", e.target.value)} />
          </div>
          <div>
            <label>State</label>
            <input value={profile.state} maxLength={2} onChange={(e) => update("state", e.target.value)} />
          </div>
        </div>

        <label>ZIP code</label>
        <input value={profile.postalCode} onChange={(e) => update("postalCode", e.target.value)} />
      </section>

      <section className="memberProfileCard">
        <span className="eyebrow">Preferences</span>
        <h2>Communication settings</h2>

        <label>Preferred communication</label>
        <select
          value={profile.communicationPreference}
          onChange={(e) => update("communicationPreference", e.target.value as CommunicationPreference)}
          style={{ width: "100%", padding: "15px 16px", border: "1px solid #cbd9d8", borderRadius: "10px", fontSize: "16px" }}
        >
          <option>Email</option>
          <option>Text</option>
          <option>Phone</option>
        </select>

        <div style={{ marginTop: "24px" }}>
          <label style={{ display: "flex", gap: "10px", alignItems: "center", fontWeight: 700 }}>
            <input type="checkbox" checked={profile.paperless} onChange={(e) => update("paperless", e.target.checked)} style={{ width: "auto", margin: 0 }} />
            Paperless communications
          </label>
          <label style={{ display: "flex", gap: "10px", alignItems: "center", fontWeight: 700 }}>
            <input type="checkbox" checked={profile.refillReminders} onChange={(e) => update("refillReminders", e.target.checked)} style={{ width: "auto", margin: 0 }} />
            Refill reminders
          </label>
          <label style={{ display: "flex", gap: "10px", alignItems: "center", fontWeight: 700 }}>
            <input type="checkbox" checked={profile.orderUpdates} onChange={(e) => update("orderUpdates", e.target.checked)} style={{ width: "auto", margin: 0 }} />
            Order status updates
          </label>
        </div>

        <button className="button primary" onClick={saveProfile} disabled={isPending} style={{ marginTop: "22px" }}>
          {isPending ? "Saving..." : "Save changes"}
        </button>
        {status && <p className="railText" style={{ marginTop: "12px" }}>{status}</p>}

        <div className="workflowNotice" style={{ marginTop: "24px" }}>
          Changes are stored in your linked SmarteRX member record.
        </div>
      </section>
    </div>
  );
}
