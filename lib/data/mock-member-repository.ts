import { member, prescriptions, recentActivity } from "@/lib/mock-data/member";
import { benefitSummary, coverageTiers } from "@/lib/mock-data/benefits";
import type { MemberRepository } from "@/lib/data/member-repository";

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
};
