import type { MemberRepository } from "@/lib/data/member-repository";
import { createPostgresMemberRepository, type SqlExecutor } from "@/lib/data/postgres-member-repository";
import { getCurrentMemberSession } from "@/lib/auth/session";

type MemberLookupRow = { id: string };

export class MemberEnrollmentRequiredError extends Error {
  constructor() {
    super("This authenticated account is not linked to a VeyraRx member record.");
    this.name = "MemberEnrollmentRequiredError";
  }
}

export async function resolveAuthenticatedMemberId(sql: SqlExecutor): Promise<string> {
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

  if (!linked[0]?.id) {
    throw new MemberEnrollmentRequiredError();
  }

  return linked[0].id;
}

export function createAuthenticatedPostgresMemberRepository(sql: SqlExecutor): MemberRepository {
  let resolvedMemberId: string | undefined;

  async function repository() {
    resolvedMemberId ??= await resolveAuthenticatedMemberId(sql);
    return createPostgresMemberRepository(sql, resolvedMemberId);
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
  };
}
