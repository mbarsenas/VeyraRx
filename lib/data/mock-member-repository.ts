import { member, prescriptions, recentActivity } from "@/lib/mock-data/member";
import { benefitSummary, coverageTiers, formularyMedications, priorAuthorizations } from "@/lib/mock-data/benefits";
import { pharmacyLocations } from "@/lib/mock-data/pharmacies";
import type { MemberRepository } from "@/lib/data/member-repository";

let preferredPharmacyId: string | null = "heb-wurzbach";

export const mockMemberRepository: MemberRepository = {
  async getMemberSummary() {
    return member;
  },
  async getPrescriptions() {
    return prescriptions;
  },
  async getPrescriptionBySlug(slug: string) {
    return prescriptions.find((prescription) => prescription.slug === slug);
  },
  async getRecentActivity() {
    return recentActivity;
  },
  async getBenefits() {
    return {
      deductibleUsed: benefitSummary.deductibleUsed,
      deductibleTotal: benefitSummary.deductibleTotal,
      outOfPocketUsed: benefitSummary.outOfPocketUsed,
      outOfPocketMax: benefitSummary.outOfPocketMax,
      planYear: benefitSummary.planYear,
      coverageTiers,
    };
  },
  async getFormularyMedications() {
    return formularyMedications;
  },
  async getPriorAuthorizations() {
    return priorAuthorizations;
  },
  async getPharmacies() {
    return pharmacyLocations;
  },
  async getPreferredPharmacyId() {
    return preferredPharmacyId;
  },
  async setPreferredPharmacy(id: string) {
    const pharmacy = pharmacyLocations.find((item) => item.id === id);
    if (!pharmacy || pharmacy.networkStatus === "Out of network") {
      throw new Error("The selected pharmacy is not eligible to be preferred.");
    }
    preferredPharmacyId = id;
  },
};
