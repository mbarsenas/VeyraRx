export type PbmDemoScenario = {
  id: string;
  title: string;
  memberLabel: string;
  summary: string;
  focus: string;
  highlights: string[];
  routes: string[];
  economics: {
    medication: string;
    quantity: string;
    daysSupply: string;
    formularyTier: string;
    coverageStatus: string;
    networkStatus: string;
    negotiatedAmount: string;
    deductibleApplied: string;
    planPaid: string;
    memberResponsibility: string;
    copayOrCoinsurance: string;
    accumulatorContext: string;
    utilizationManagement: string;
  };
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
    economics: {
      medication: "Atorvastatin 20 mg",
      quantity: "30 tablets",
      daysSupply: "30 days",
      formularyTier: "Tier 1 generic",
      coverageStatus: "Covered",
      networkStatus: "In-network retail",
      negotiatedAmount: "$11.42",
      deductibleApplied: "$0.00",
      planPaid: "$3.42",
      memberResponsibility: "$8.00",
      copayOrCoinsurance: "$8 copay",
      accumulatorContext: "Deductible does not apply to this Tier 1 generic in this synthetic scenario.",
      utilizationManagement: "None",
    },
  },
  {
    id: "deductible-stage",
    title: "Deductible-stage member",
    memberLabel: "Scenario B",
    summary: "Member is still accumulating toward the pharmacy deductible, making negotiated price and member responsibility diverge from a simple copay model.",
    focus: "Benefit accumulators, deductible applicability and explaining why the member pays what they pay.",
    highlights: ["Deductible not yet met", "Negotiated amount", "Member responsibility", "Accumulator context"],
    routes: ["/dashboard/benefits", "/pricing", "/dashboard/prescriptions"],
    economics: {
      medication: "Rosuvastatin 20 mg",
      quantity: "30 tablets",
      daysSupply: "30 days",
      formularyTier: "Tier 2 preferred brand/generic example",
      coverageStatus: "Covered; deductible applies",
      networkStatus: "In-network retail",
      negotiatedAmount: "$74.63",
      deductibleApplied: "$74.63",
      planPaid: "$0.00",
      memberResponsibility: "$74.63",
      copayOrCoinsurance: "Cost share begins after deductible",
      accumulatorContext: "$620 of $1,500 pharmacy deductible met before this illustrative fill.",
      utilizationManagement: "None",
    },
  },
  {
    id: "utilization-management",
    title: "Utilization management",
    memberLabel: "Scenario C",
    summary: "A medication requires plan review before coverage, giving the reviewer a prior-authorization and formulary-management workflow to inspect.",
    focus: "Prior authorization, formulary status, clinical criteria language and member-facing workflow clarity.",
    highlights: ["Ozempic", "Prior authorization", "Clinical documentation", "Coverage not guaranteed"],
    routes: ["/dashboard/benefits/prior-authorization", "/dashboard/benefits/formulary", "/pricing"],
    economics: {
      medication: "Ozempic 2 mg/3 mL",
      quantity: "1 carton",
      daysSupply: "28 days",
      formularyTier: "Tier 2",
      coverageStatus: "Prior authorization required",
      networkStatus: "In-network retail",
      negotiatedAmount: "$892.15",
      deductibleApplied: "Pending coverage determination",
      planPaid: "Not determined",
      memberResponsibility: "Not determined",
      copayOrCoinsurance: "$35 illustrative copay if approved and applicable",
      accumulatorContext: "Final member responsibility cannot be determined until coverage requirements are satisfied and the claim adjudicates.",
      utilizationManagement: "Prior authorization; prescriber clinical documentation required",
    },
  },
  {
    id: "specialty-cost",
    title: "High-cost / specialty",
    memberLabel: "Scenario D",
    summary: "Reviewer examines how VeyraRx should present expensive therapy, specialty benefit design, coinsurance and network restrictions without implying live adjudication.",
    focus: "Specialty-tier presentation, percentage cost share, fulfillment restrictions and high-cost member guidance.",
    highlights: ["Specialty tier", "Coinsurance", "Restricted network", "High member-cost sensitivity"],
    routes: ["/dashboard/benefits", "/dashboard/benefits/formulary", "/dashboard/pharmacy", "/pricing"],
    economics: {
      medication: "Synthetic specialty therapy 40 mg",
      quantity: "2 pens",
      daysSupply: "28 days",
      formularyTier: "Specialty",
      coverageStatus: "Covered through designated specialty pharmacy",
      networkStatus: "Restricted specialty network",
      negotiatedAmount: "$6,240.00",
      deductibleApplied: "$0.00",
      planPaid: "$4,992.00",
      memberResponsibility: "$1,248.00",
      copayOrCoinsurance: "20% coinsurance",
      accumulatorContext: "Illustrative specialty cost share before any manufacturer assistance or plan-specific maximums.",
      utilizationManagement: "Specialty pharmacy requirement; clinical management may apply",
    },
  },
];

export function getPbmDemoScenario(id?: string | null) {
  return pbmDemoScenarios.find((scenario) => scenario.id === id) ?? pbmDemoScenarios[0];
}
