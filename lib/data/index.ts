import type { MemberRepository } from "@/lib/data/member-repository";
import { mockMemberRepository } from "@/lib/data/mock-member-repository";
import { createPostgresMemberRepository } from "@/lib/data/postgres-member-repository";
import { neonSqlExecutor } from "@/lib/data/neon-sql";

export type DataProvider = "mock" | "postgres";

export function getMemberRepository(): MemberRepository {
  const provider = (process.env.VEYRA_DATA_PROVIDER ?? "mock") as DataProvider;

  if (provider === "mock") {
    return mockMemberRepository;
  }

  if (provider === "postgres") {
    const memberId = process.env.VEYRA_MEMBER_ID ?? "member-demo-001";
    return createPostgresMemberRepository(neonSqlExecutor, memberId);
  }

  throw new Error(`Unsupported data provider '${provider}'.`);
}
