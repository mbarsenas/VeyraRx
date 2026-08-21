import type { ActivityItem, MemberSummary, Prescription } from "@/lib/domain/member";
import type { MemberBenefits } from "@/lib/domain/benefits";

export interface MemberRepository {
  getMemberSummary(): Promise<MemberSummary>;
  getPrescriptions(): Promise<Prescription[]>;
  getPrescriptionBySlug(slug: string): Promise<Prescription | undefined>;
  getRecentActivity(): Promise<ActivityItem[]>;
  getBenefits(): Promise<MemberBenefits>;
}
