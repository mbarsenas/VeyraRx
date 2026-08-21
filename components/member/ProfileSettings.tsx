"use client";

import { useState } from "react";
import type { MemberProfile, CommunicationPreference } from "@/lib/mock-data/profile";

export default function ProfileSettings({ initialProfile }: { initialProfile: MemberProfile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof MemberProfile>(key: K, value: MemberProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function saveProfile() {
    setSaved(true);
  }

  return (
    <div className="memberProfileGrid">
      <section className="memberProfileCard">
        <span className="eyebrow">Contact information</span>
        <h2>Contact details</h2>

        <label>Email</label>
        <input value={profile.email} onChange={(e) => update("email", e.target.value)} />

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
            <input value={profile.state} onChange={(e) => update("state", e.target.value)} />
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

        <button className="button primary" onClick={saveProfile} style={{ marginTop: "22px" }}>Save changes</button>
        {saved && <p className="railText" style={{ marginTop: "12px" }}>Saved for this prototype session.</p>}

        <div className="workflowNotice" style={{ marginTop: "24px" }}>
          Prototype account settings only. Changes are not stored in a production member record.
        </div>
      </section>
    </div>
  );
}
