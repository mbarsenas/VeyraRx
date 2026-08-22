"use client";

import { useEffect, useState, useTransition } from "react";
import type { MedicationPriceQuote } from "@/lib/domain/pricing";
import type { PbmDemoScenario } from "@/lib/demo/pbm-scenarios";
import { searchMedicationPricesAction } from "@/app/pricing/actions";

type SearchState = { medication: string; strength: string; quantity: string };
const initialSearch: SearchState = { medication: "atorvastatin", strength: "20 mg", quantity: "30" };

function utilizationManagementLabel(quote: MedicationPriceQuote) {
  const status = (quote.coverageStatus ?? "").toLowerCase();
  if (status.includes("prior authorization")) return "Prior authorization";
  if (status.includes("step")) return "Step therapy";
  if (status.includes("quantity")) return "Quantity limit";
  return "No UM flag in demo quote";
}

const scenarioGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "10px",
  marginTop: "18px",
} as const;

const scenarioMetricStyle = {
  border: "1px solid #dce7e6",
  borderRadius: "12px",
  background: "#f7faf9",
  padding: "13px 14px",
  minHeight: "72px",
} as const;

const scenarioLabelStyle = {
  display: "block",
  marginBottom: "7px",
  color: "#647b80",
  fontSize: "11px",
  fontWeight: 800,
  letterSpacing: "1px",
  textTransform: "uppercase",
} as const;

const scenarioValueStyle = {
  display: "block",
  color: "#173b45",
  fontSize: "14px",
  lineHeight: 1.35,
} as const;

const interpretationStyle = {
  marginTop: "12px",
  border: "1px solid #dce7e6",
  borderRadius: "12px",
  background: "#f7faf9",
  padding: "14px 16px",
} as const;

export default function PricingSearch({ scenario }: { scenario?: PbmDemoScenario }) {
  const [search, setSearch] = useState(initialSearch);
  const [results, setResults] = useState<MedicationPriceQuote[]>([]);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!scenario) return;
    const med = scenario.economics.medication;
    const match = med.match(/^(.*?)(?:\s+(\d+(?:\.\d+)?\s*(?:mg|mcg|g|mL).*))$/i);
    setSearch({ medication: match?.[1] ?? med, strength: match?.[2] ?? "", quantity: scenario.economics.quantity.match(/\d+/)?.[0] ?? "" });
    setSearched(false);
    setResults([]);
  }, [scenario]);

  function updateField(field: keyof SearchState, value: string) { setSearch((current) => ({ ...current, [field]: value })); }

  function submitSearch() {
    startTransition(async () => {
      setMessage("");
      try {
        const quantity = search.quantity.trim() ? Number(search.quantity) : undefined;
        const data = await searchMedicationPricesAction({ medication: search.medication, strength: search.strength, quantity: Number.isFinite(quantity) && quantity && quantity > 0 ? quantity : undefined });
        setResults(data); setSearched(true);
      } catch { setMessage("We could not load medication pricing. Please try again."); }
    });
  }

  return (
    <>
      {scenario && (
        <article className="panelCard pbmScenarioContext" style={{ marginTop: "28px", borderLeft: "4px solid #09b8f2" }}>
          <div className="panelHeader">
            <div>
              <span className="eyebrow">{scenario.memberLabel} · PBM evaluation</span>
              <h2>{scenario.title}</h2>
              <p className="railText">{scenario.focus}</p>
            </div>
          </div>
          <div className="scenarioEconomicsGrid" style={scenarioGridStyle}>
            <div style={scenarioMetricStyle}><span style={scenarioLabelStyle}>Medication</span><strong style={scenarioValueStyle}>{scenario.economics.medication}</strong></div>
            <div style={scenarioMetricStyle}><span style={scenarioLabelStyle}>Plan-negotiated amount</span><strong style={scenarioValueStyle}>{scenario.economics.negotiatedAmount}</strong></div>
            <div style={scenarioMetricStyle}><span style={scenarioLabelStyle}>Deductible applied</span><strong style={scenarioValueStyle}>{scenario.economics.deductibleApplied}</strong></div>
            <div style={scenarioMetricStyle}><span style={scenarioLabelStyle}>Plan paid</span><strong style={scenarioValueStyle}>{scenario.economics.planPaid}</strong></div>
            <div style={scenarioMetricStyle}><span style={scenarioLabelStyle}>Member responsibility</span><strong style={scenarioValueStyle}>{scenario.economics.memberResponsibility}</strong></div>
            <div style={scenarioMetricStyle}><span style={scenarioLabelStyle}>Cost share</span><strong style={scenarioValueStyle}>{scenario.economics.copayOrCoinsurance}</strong></div>
            <div style={scenarioMetricStyle}><span style={scenarioLabelStyle}>Formulary / coverage</span><strong style={scenarioValueStyle}>{scenario.economics.coverageStatus}</strong></div>
            <div style={scenarioMetricStyle}><span style={scenarioLabelStyle}>Network</span><strong style={scenarioValueStyle}>{scenario.economics.networkStatus}</strong></div>
          </div>
          <div className="costContextBox" style={interpretationStyle}>
            <strong>Scenario interpretation</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.5 }}>{scenario.economics.accumulatorContext} Utilization management: {scenario.economics.utilizationManagement}.</p>
          </div>
        </article>
      )}

      <div className="toolCard pricingToolCard">
        <label htmlFor="medication-name">Medication name</label>
        <input id="medication-name" value={search.medication} onChange={(event) => updateField("medication", event.target.value)} placeholder="e.g. atorvastatin" />
        <div className="twoCol">
          <div><label htmlFor="medication-strength">Strength</label><input id="medication-strength" value={search.strength} onChange={(event) => updateField("strength", event.target.value)} placeholder="20 mg" /></div>
          <div><label htmlFor="medication-quantity">Quantity</label><input id="medication-quantity" value={search.quantity} onChange={(event) => updateField("quantity", event.target.value)} placeholder="30" inputMode="numeric" /></div>
        </div>
        <button className="button primary" onClick={submitSearch} disabled={isPending || !search.medication.trim()}>{isPending ? "Searching..." : "Search prices"}</button>
        <small className="note">Synthetic evaluation pricing only. Estimates are not live claim adjudication, guarantees of member liability, or pharmacy quotes.</small>
        {message && <div className="workflowNotice">{message}</div>}
      </div>

      {searched && (
        <section className="pricingResultsSection">
          <div className="sectionIntro"><span className="eyebrow">Pricing results</span><h2>{results.length ? `${results.length} price options found` : "No matching price options"}</h2><p className="railText">Compare the member estimate with the plan-negotiated amount and cash price. In production, final member responsibility would depend on real-time eligibility, accumulator state, benefit rules and claim adjudication.</p></div>
          {results.length > 0 ? <div className="pricingResultsGrid">{results.map((quote) => (
            <article className="panelCard pricingResultCard" key={quote.id}>
              <div className="panelHeader"><div><span className="eyebrow">{quote.formularyTier ?? "Medication"}</span><h2>{quote.medicationName} {quote.strength}</h2><p className="railText">{quote.quantity} units{quote.daysSupply ? ` · ${quote.daysSupply}-day supply` : ""} · {quote.fulfillmentType}</p></div><span className={quote.networkStatus === "Out of network" ? "statusChip attention" : "statusChip processing"}>{quote.networkStatus}</span></div>
              <div className="pricingPharmacy"><strong>{quote.pharmacyName}</strong><span>{quote.pharmacyAddress}, {quote.pharmacyCityStateZip}</span></div>
              <div className="pbmTagRow"><span className="pbmTag good">{quote.coverageStatus ?? "Coverage not available"}</span><span className={utilizationManagementLabel(quote).startsWith("No ") ? "pbmTag" : "pbmTag warning"}>{utilizationManagementLabel(quote)}</span><span className="pbmTag">{quote.formularyTier ?? "Tier not available"}</span></div>
              <div className="pricingCostHero"><span>Estimated member responsibility</span><strong>{quote.memberEstimatedCost ?? "Not available"}</strong></div>
              <div className="benefitItem"><span>Plan-negotiated amount</span><strong>{quote.negotiatedPrice ?? "Not available"}</strong></div>
              <div className="benefitItem"><span>Cash price</span><strong>{quote.cashPrice ?? "Not available"}</strong></div>
              <div className="benefitItem"><span>Fixed copay</span><strong>{quote.copay ?? "Not applicable"}</strong></div>
              <div className="benefitItem"><span>Coinsurance</span><strong>{quote.coinsurancePercent != null ? `${quote.coinsurancePercent}%` : "Not applicable"}</strong></div>
              <div className="benefitItem"><span>Deductible applies</span><strong>{quote.deductibleApplies ? "Yes" : "No"}</strong></div>
              <div className="costContextBox"><strong>How to read this estimate</strong><p>The plan-negotiated amount is the contracted reference amount for this demo scenario. The estimated member responsibility reflects the synthetic benefit setup shown here; it is not a live paid-claim result.</p></div>
              <p className="pricingAsOf">Pricing as of {new Date(quote.quotedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {quote.pricingSource}</p>
            </article>
          ))}</div> : <article className="panelCard"><p className="railText">No persisted demo quote matches this scenario-specific medication yet. Use the scenario economics above as the reviewer reference, or try a seeded medication such as atorvastatin, lisinopril, metformin ER or Ozempic.</p></article>}
        </section>
      )}
    </>
  );
}
