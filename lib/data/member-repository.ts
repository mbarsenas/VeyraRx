import type { ActivityItem, MemberSummary, Prescription } from "@/lib/domain/member";
import type { FormularyMedication, MemberBenefits, PriorAuthorization } from "@/lib/domain/benefits";
import type { PharmacyLocation } from "@/lib/domain/pharmacy";

export interface MemberRepository {
  getMemberSummary(): Promise<MemberSummary>;
  getPrescriptions(): Promise<Prescription[]>;
  getPrescriptionBySlug(slug: string): Promise<Prescription | undefined>;
  getRecentActivity(): Promise<ActivityItem[]>;
  getBenefits(): Promise<MemberBenefits>;
  getFormularyMedications(): Promise<FormularyMedication[]>;
  getPriorAuthorizations(): Promise<PriorAuthorization[]>;
  getPharmacies(): Promise<PharmacyLocation[]>;
  getPreferredPharmacyId(): Promise<string | null>;
  setPreferredPharmacy(id: string): Promise<void>;
}
