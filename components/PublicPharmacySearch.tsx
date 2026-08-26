"use client";

import { FormEvent, useMemo, useState } from "react";
import type { PharmacyLocation } from "@/lib/domain/pharmacy";
import { filterPharmacyLocations } from "@/lib/pharmacy-search";

export default function PublicPharmacySearch({ pharmacyLocations }: { pharmacyLocations: PharmacyLocation[] }) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const results = useMemo(() => {
    return filterPharmacyLocations(pharmacyLocations, submittedQuery);
  }, [pharmacyLocations, submittedQuery]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query);
  }

  return (
    <div className="publicPharmacyFinder">
      <form className="toolCard pharmacyFinderForm" onSubmit={submitSearch}>
        <label htmlFor="public-pharmacy-search">Location or pharmacy name</label>
        <div className="pharmacyFinderControls">
          <input
            id="public-pharmacy-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ZIP code, city or pharmacy name"
            autoComplete="postal-code"
          />
          <button className="button primary" type="submit">Find pharmacies</button>
        </div>
      </form>

      {submittedQuery && (
        <section className="pharmacyFinderResults" aria-live="polite">
          <div className="pharmacyFinderHeading">
            <div>
              <span className="eyebrow">Search results</span>
              <h2>{results.length} {results.length === 1 ? "pharmacy" : "pharmacies"} found</h2>
            </div>
            <button className="textButton" type="button" onClick={() => { setQuery(""); setSubmittedQuery(""); }}>
              Clear search
            </button>
          </div>

          <div className="publicPharmacyGrid">
            {results.map((pharmacy) => {
              const directionsQuery = encodeURIComponent(`${pharmacy.name}, ${pharmacy.address}, ${pharmacy.cityStateZip}`);
              return (
                <article className="publicPharmacyResult" key={pharmacy.id}>
                  <div className="publicPharmacyResultTop">
                    <div><span className="miniLabel">Pharmacy location</span><h3>{pharmacy.name}</h3></div>
                    <span className={`networkBadge ${pharmacy.networkStatus === "Out of network" ? "out" : "in"}`}>
                      {pharmacy.networkStatus}
                    </span>
                  </div>
                  <p>{pharmacy.address}<br />{pharmacy.cityStateZip}<br /><strong>{pharmacy.distance} away</strong></p>
                  <dl className="publicPharmacyFacts">
                    <div><dt>Hours today</dt><dd>{pharmacy.hours}</dd></div>
                    <div><dt>Phone</dt><dd><a href={`tel:${pharmacy.phone.replace(/\D/g, "")}`}>{pharmacy.phone}</a></dd></div>
                    <div><dt>90-day fills</dt><dd>{pharmacy.ninetyDayEligible ? "Eligible" : "Not eligible"}</dd></div>
                  </dl>
                  <a
                    className="button secondary full"
                    href={`https://www.google.com/maps/search/?api=1&query=${directionsQuery}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get directions
                  </a>
                </article>
              );
            })}
          </div>

          {results.length === 0 && (
            <div className="pharmacyEmptyState">
              <h3>No matching pharmacies</h3>
              <p>Try another ZIP code, city, street, or pharmacy name.</p>
            </div>
          )}
        </section>
      )}

      <p className="pharmacyFinderDisclosure">
        Synthetic evaluation directory. Pharmacy participation, hours, distance and services are not live network information.
      </p>
    </div>
  );
}
