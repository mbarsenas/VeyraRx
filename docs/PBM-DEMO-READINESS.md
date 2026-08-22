# VeyraRx PBM Demo Readiness

## Goal
Prepare VeyraRx as a credible synthetic-data evaluation environment for a pharmacy-benefits-management expert. The objective is domain feedback on product usefulness, terminology, workflow realism, and missing capabilities — not production launch.

## Reviewer framing
The review environment should make it obvious that all member, pharmacy, pricing, claims-like, and benefit data are synthetic.

Recommended banner text:

> VeyraRx Evaluation Environment — Synthetic Data Only

Recommended reviewer prompt:

> Please evaluate whether the workflows, terminology, benefit presentation, medication pricing, pharmacy experience, and prior-authorization experience reflect real PBM/member needs. Flag anything inaccurate, unrealistic, missing, or confusing.

## Demo acceptance checklist

### 1. Member overview
- Active prescriptions are visible and understandable.
- Current benefit accumulator values are visible.
- Preferred pharmacy is visible.
- Recent activity feels plausible.
- No dead links or placeholder actions are exposed.

### 2. Prescription detail
Each medication should expose enough context for a PBM reviewer to assess realism:
- medication and strength
- quantity and days supply
- Rx number
- prescriber
- refill status / refills remaining
- last fill and next refill eligibility
- dispensing pharmacy
- formulary tier
- coverage restrictions when applicable
- estimated member cost
- fill history

### 3. Medication pricing
Pricing must avoid presenting one universal drug price. For each quote, distinguish where available:
- retail/cash price
- plan-negotiated amount
- member estimated responsibility
- copay or coinsurance
- deductible impact
- formulary tier
- network/preferred-pharmacy status
- quantity and days supply
- retail versus 90-day versus home-delivery context
- pricing as-of timestamp / provenance

Suggested reviewer-facing breakdown:

> Plan negotiated cost: $42.18  
> Deductible applied: $20.00  
> Plan paid: $14.18  
> Your estimated cost: $28.00  
> Tier 2 · Preferred pharmacy

Do not imply that synthetic pricing is a live adjudicated claim.

### 4. Benefits and formulary
Reviewer should be able to evaluate:
- deductible and out-of-pocket accumulators
- plan year
- 30-day retail, 90-day retail, and home-delivery benefit differences
- formulary tiering
- covered versus non-formulary states
- prior authorization
- step therapy
- quantity limits
- specialty handling where relevant

### 5. Prior authorization
PA experiences should communicate:
- medication
- current status
- requirement / reason
- action needed from member or prescriber
- last update
- next step

### 6. Pharmacy experience
Clearly distinguish:
- member's preferred pharmacy
- preferred network status, if the plan uses one
- in-network
- out-of-network
- 90-day retail eligibility
- pickup
- drive-through
- home delivery / mail service where applicable

Member preference must never be confused with the plan's network designation.

### 7. Orders / fulfillment
Include plausible scenarios for:
- retail pickup
- home delivery
- processing
- shipped
- delivered
- cancelled
- tracking where applicable

### 8. Synthetic reviewer personas
The final demo should contain several intentionally different benefit scenarios:

1. **Generic-maintenance member** — mostly Tier 1 generics, low-cost refills, preferred retail pharmacy.
2. **Deductible-stage member** — deductible still being met so member responsibility changes materially.
3. **Utilization-management member** — medication subject to prior authorization, step therapy, or quantity limit.
4. **Specialty-cost member** — high-cost medication, specialty tier, coinsurance, specialty-pharmacy workflow.

These personas must contain no real PHI.

## Reviewer questions
Ask the PBM expert:

1. Does this look and feel like a credible member PBM experience?
2. Is any pharmacy-benefit terminology wrong or misleading?
3. What information is missing from prescription detail?
4. Does the medication-cost presentation make sense?
5. Are formulary and utilization-management statuses represented correctly?
6. Does the preferred/in-network/out-of-network pharmacy model make sense?
7. What would a member, employer, health plan, or PBM expect that is missing?
8. Which screen feels least realistic?
9. Which feature creates the most value?
10. What would prevent you from recommending continued development?

## Demo-mode priorities
Before expert access, prioritize in this order:

1. Domain accuracy and terminology
2. Complete clickable member journey
3. Multiple synthetic member scenarios
4. Clear pricing explanation
5. Reviewer/evaluation banner
6. Error-free navigation and polished empty/loading/error states
7. Reviewer feedback capture

Production-only items such as exhaustive audit logging, operational monitoring, and real eligibility/claims integrations remain important but are not blockers for this evaluation milestone.
