import { member, prescriptions, recentActivity } from "@/lib/mock-data/member";
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
};
