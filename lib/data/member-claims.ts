import type { ClaimAccumulators, MemberClaim } from "@/lib/domain/claim";
import { resolveAuthenticatedMemberId, useDataApi } from "@/lib/data/authenticated-member";
import { dataApiSelect } from "@/lib/data/data-api";
import { neonSqlExecutor } from "@/lib/data/neon-sql";
import { createMemberClaimsRepository } from "@/lib/data/member-claims-repository";

const memberClaimsRepository = createMemberClaimsRepository({
  resolveMemberId: resolveAuthenticatedMemberId,
  isDataApi: useDataApi,
  selectFromDataApi: dataApiSelect,
  executeSql: neonSqlExecutor,
});

export async function getAuthenticatedMemberClaims(): Promise<MemberClaim[]> {
  return memberClaimsRepository.list();
}

export async function getAuthenticatedMemberClaimById(id: string): Promise<MemberClaim | undefined> {
  return memberClaimsRepository.findById(id);
}

export async function getAuthenticatedMemberClaimAccumulators(): Promise<ClaimAccumulators> {
  return memberClaimsRepository.accumulators();
}
