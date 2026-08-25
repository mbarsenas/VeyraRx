import type { MemberRepository } from "@/lib/data/member-repository";
import { createPostgresMemberRepository, type SqlExecutor } from "@/lib/data/postgres-member-repository";
import { getCurrentMemberSession } from "@/lib/auth/session";

type MemberLookupRow = { id: string };

export function createAuthenticatedPostgresMemberRepository(sql: SqlExecutor): MemberRepository {
  let resolvedMemberId: string | undefined;

  async function resolveMemberId(): Promise<string> {
    if (resolvedMemberId) return resolvedMemberId;

    const session = await getCurrentMemberSession();
    if (!session) {
      throw new Error("An authenticated member session is required.");
    }

    const linked = await sql<MemberLookupRow>(
      `SELECT id
         FROM members
        WHERE external_auth_id = $1
        LIMIT 1`,
      [session.memberId]
    );

    if (linked[0]?.id) {
      resolvedMemberId = linked[0].id;
      return resolvedMemberId;
    }

    throw new Error(
      "This authenticated account is not linked to a SmarteRX member record. Complete member enrollment before accessing protected health-plan data."
    );
  }

  async function repository() {
    return createPostgresMemberRepository(sql, await resolveMemberId());
  }

  return {
    async getMemberSummary() {
      return (await repository()).getMemberSummary();
    },
    async getPrescriptions() {
      return (await repository()).getPrescriptions();
    },
    async getPrescriptionBySlug(slug: string) {
      return (await repository()).getPrescriptionBySlug(slug);
    },
    async getRecentActivity() {
      return (await repository()).getRecentActivity();
    },
    async getBenefits() {
      return (await repository()).getBenefits();
    },
    async getFormularyMedications() {
      return (await repository()).getFormularyMedications();
    },
    async getPriorAuthorizations() {
      return (await repository()).getPriorAuthorizations();
    },
    async getPharmacies() {
      return (await repository()).getPharmacies();
    },
    async getPreferredPharmacyId() {
      return (await repository()).getPreferredPharmacyId();
    },
    async setPreferredPharmacy(id: string) {
      return (await repository()).setPreferredPharmacy(id);
    },
  };
}
