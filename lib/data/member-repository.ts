import type { ActivityItem, MemberSummary, Prescription } from "@/lib/domain/member";

export interface MemberRepository {
  getMemberSummary(): Promise<MemberSummary>;
  getPrescriptions(): Promise<Prescription[]>;
  getPrescriptionBySlug(slug: string): Promise<Prescription | undefined>;
  getRecentActivity(): Promise<ActivityItem[]>;
}
