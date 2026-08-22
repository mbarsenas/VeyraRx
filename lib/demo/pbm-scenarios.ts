export type PbmDemoScenario = {
  id: string;
  title: string;
  memberLabel: string;
  summary: string;
  focus: string;
  highlights: string[];
  routes: string[];
};

export const pbmDemoScenarios: PbmDemoScenario[] = [
  {
    id: "maintenance-generics",
    title: "Maintenance generics",
    memberLabel: "Scenario A",
    summary: "Stable chronic therapy with low-cost Tier 1 generics and straightforward refill behavior.",
    focus: "Baseline member experience, 30-day vs 90-day economics, formulary placement and preferred-pharmacy behavior.",
    highlights: ["Atorvastatin / lisinopril / metformin", "Tier 1 formulary", "Low member responsibility", "Retail vs 90-day comparison"],
    routes: ["/dashboard/prescriptions", "/pricing", "/dashboard/pharmacy", "/dashboard/benefits/formulary"],
  },
  {
    id: "deductible-stage",
    title: "Deductible-stage member",
    memberLabel: "Scenario B",
    summary: "Member is still accumulating toward the pharmacy deductible, making negotiated price and member responsibility diverge from a simple copay model.",
    focus: "Benefit accumulators, deductible applicability and explaining why the member pays what they pay.",
    highlights: ["Deductible not yet met", "Negotiated amount", "Member responsibility", "Accumulator context"],
    routes: ["/dashboard/benefits", "/pricing", "/dashboard/prescriptions"],
  },
  {
    id: "utilization-management",
    title: "Utilization management",
    memberLabel: "Scenario C",
    summary: "A medication requires plan review before coverage, giving the reviewer a prior-authorization and formulary-management workflow to inspect.",
    focus: "Prior authorization, formulary status, clinical criteria language and member-facing workflow clarity.",
    highlights: ["Ozempic", "Prior authorization", "Clinical documentation", "Coverage not guaranteed"],
    routes: ["/dashboard/benefits/prior-authorization", "/dashboard/benefits/formulary", "/pricing"],
  },
  {
    id: "specialty-cost",
    title: "High-cost / specialty",
    memberLabel: "Scenario D",
    summary: "Reviewer examines how VeyraRx should present expensive therapy, specialty benefit design, coinsurance and network restrictions without implying live adjudication.",
    focus: "Specialty-tier presentation, percentage cost share, fulfillment restrictions and high-cost member guidance.",
    highlights: ["Specialty tier", "Coinsurance", "Restricted network", "High member-cost sensitivity"],
    routes: ["/dashboard/benefits", "/dashboard/benefits/formulary", "/dashboard/pharmacy", "/pricing"],
  },
];
