import type { MemberRepository } from "@/lib/data/member-repository";
import { mockMemberRepository } from "@/lib/data/mock-member-repository";

export type DataProvider = "mock" | "postgres";

export function getMemberRepository(): MemberRepository {
  const provider = (process.env.VEYRA_DATA_PROVIDER ?? "mock") as DataProvider;

  if (provider === "mock") {
    return mockMemberRepository;
  }

  throw new Error(
    `Data provider '${provider}' is not configured. Set VEYRA_DATA_PROVIDER=mock until the PostgreSQL adapter is installed.`
  );
}
