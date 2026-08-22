"use client";

import { useState, useTransition } from "react";
import type { MedicationPriceQuote } from "@/lib/domain/pricing";
import { searchMedicationPricesAction } from "@/app/pricing/actions";

type SearchState = {
  medication: string;
  strength: string;
  quantity: string;
};

const initialSearch: SearchState = { medication: "atorvastatin", strength: "20 mg", quantity: "30" };

export default function PricingSearch() {
  const [search, setSearch] = useState(initialSearch);
  const [results, setResults] = useState<MedicationPriceQuote[]>([]);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function updateField(field: keyof SearchState, value: string) {
    setSearch((current) => ({ ...current, [field]: value }));
  }

  function submitSearch() {
    startTransition(async () => {
      setMessage("");
      try {
        const quantity = search.quantity.trim() ? Number(search.quantity) : undefined;
        const data = await searchMedicationPricesAction({
          medication: search.medication,
          strength: search.strength,
          quantity: Number.isFinite(quantity) && quantity && quantity > 0 ? quantity : undefined,
        });
        setResults(data);
        setSearched(true);
      } catch {
        setMessage("We could not load medication pricing. Please try again.");
      }
    });
  }

  return (
    <>
      <div className="toolCard pricingToolCard">
        <label htmlFor="medication-name">Medication name</label>
        <input
          id="medication-name"
          value={search.medication}
          onChange={(event) => updateField("medication", event.target.value)}
          placeholder="e.g. atorvastatin"
        />
        <div className="twoCol">
          <div>
            <label htmlFor="medication-strength">Strength</label>
            <input
              id="medication-strength"
              value={search.strength}
              onChange={(event) => updateField("strength", event.target.value)}
              placeholder="20 mg"
            />
          </div>
          <div>
            <label htmlFor="medication-quantity">Quantity</label>
            <input
              id="medication-quantity"
              value={search.quantity}
              onChange={(event) => updateField("quantity", event.target.value)}
              placeholder="30"
              inputMode="numeric"
            />
          </div>
        </div>
        <button className="button primary" onClick={submitSearch} disabled={isPending || !search.medication.trim()}>
          {isPending ? "Searching..." : "Search prices"}
        </button>
        <small className="note">Demo pricing only. These values are not live pharmacy or payer quotes.</small>
        {message && <div className="workflowNotice">{message}</div>}
      </div>

      {searched && (
        <section className="pricingResultsSection">
          <div className="sectionIntro">
            <span className="eyebrow">Pricing results</span>
            <h2>{results.length ? `${results.length} price options found` : "No matching price options"}</h2>
          </div>

          {results.length > 0 ? (
            <div className="pricingResultsGrid">
              {results.map((quote) => (
                <article className="panelCard pricingResultCard" key={quote.id}>
                  <div className="panelHeader">
                    <div>
                      <span className="eyebrow">{quote.formularyTier ?? "Medication"}</span>
                      <h2>{quote.medicationName} {quote.strength}</h2>
                      <p className="railText">{quote.quantity} units{quote.daysSupply ? ` · ${quote.daysSupply}-day supply` : ""}</p>
                    </div>
                    <span className={quote.networkStatus === "Out of network" ? "statusChip attention" : "statusChip processing"}>
                      {quote.networkStatus}
                    </span>
                  </div>

                  <div className="pricingPharmacy">
                    <strong>{quote.pharmacyName}</strong>
                    <span>{quote.pharmacyAddress}, {quote.pharmacyCityStateZip}</span>
                  </div>

                  <div className="pricingCostHero">
                    <span>Your estimated cost</span>
                    <strong>{quote.memberEstimatedCost ?? "Not available"}</strong>
                  </div>

                  <div className="benefitItem"><span>Plan negotiated cost</span><strong>{quote.negotiatedPrice ?? "Not available"}</strong></div>
                  <div className="benefitItem"><span>Cash price</span><strong>{quote.cashPrice ?? "Not available"}</strong></div>
                  <div className="benefitItem"><span>Coverage</span><strong>{quote.coverageStatus ?? "Not available"}</strong></div>
                  <div className="benefitItem"><span>Copay</span><strong>{quote.copay ?? "Not applicable"}</strong></div>
                  <div className="benefitItem"><span>Deductible applies</span><strong>{quote.deductibleApplies ? "Yes" : "No"}</strong></div>

                  <p className="pricingAsOf">
                    Pricing as of {new Date(quote.quotedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {quote.pricingSource}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <article className="panelCard">
              <p className="railText">Try another medication, strength or quantity. Demo data currently includes atorvastatin, lisinopril, metformin ER and Ozempic.</p>
            </article>
          )}
        </section>
      )}
    </>
  );
}
