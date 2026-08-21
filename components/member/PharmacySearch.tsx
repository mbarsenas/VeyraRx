"use client";

import { useMemo, useState } from "react";
import PharmacyLocationCard from "@/components/member/PharmacyLocationCard";
import { pharmacyLocations } from "@/lib/mock-data/pharmacies";

export default function PharmacySearch() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [preferredId, setPreferredId] = useState("heb-wurzbach");
  const [notice, setNotice] = useState("");

  const results = useMemo(() => {
    const value = submittedQuery.trim().toLowerCase();
    if (!value) return pharmacyLocations;
    return pharmacyLocations.filter((pharmacy) =>
      [pharmacy.name, pharmacy.address, pharmacy.cityStateZip].some((field) => field.toLowerCase().includes(value))
    );
  }, [submittedQuery]);

  function selectPreferred(id: string) {
    const pharmacy = pharmacyLocations.find((item) => item.id === id);
    if (!pharmacy || pharmacy.networkStatus === "Out of network") return;
    setPreferredId(id);
    setNotice(`${pharmacy.name} is now your preferred pharmacy for this prototype session.`);
  }

  return (
    <>
      <article className="panelCard" style={{ marginBottom: "20px" }}>
        <span className="eyebrow">Find a pharmacy</span>
        <h2>Search participating locations</h2>
        <div className="twoCol">
          <div>
            <label htmlFor="pharmacy-search">ZIP code, city or pharmacy</label>
            <input
              id="pharmacy-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="San Antonio, TX"
            />
          </div>
          <div style={{ display: "flex", alignItems: "end" }}>
            <button className="button primary full" onClick={() => setSubmittedQuery(query)}>
              Search pharmacies
            </button>
          </div>
        </div>
        {notice && <div className="workflowNotice">{notice}</div>}
      </article>

      <div className="panelHeader">
        <div>
          <span className="eyebrow">Network results</span>
          <h2>{results.length} pharmacies found</h2>
        </div>
      </div>

      <div className="memberPageGrid">
        {results.map((pharmacy) => (
          <PharmacyLocationCard
            key={pharmacy.id}
            pharmacy={pharmacy}
            isPreferred={preferredId === pharmacy.id}
            onSelectPreferred={selectPreferred}
          />
        ))}
      </div>

      {results.length === 0 && (
        <article className="panelCard">
          <h2>No matching pharmacies</h2>
          <p className="railText">Try a different ZIP code, city, street or pharmacy name.</p>
        </article>
      )}

      <p className="demoDisclosure">Prototype pharmacy network only. Search results and preferred-pharmacy changes are not saved.</p>
    </>
  );
}
