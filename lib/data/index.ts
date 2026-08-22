import type { MemberRepository } from "@/lib/data/member-repository";
import { mockMemberRepository } from "@/lib/data/mock-member-repository";
import { createAuthenticatedPostgresMemberRepository } from "@/lib/data/authenticated-postgres-member-repository";
import { createRlsMemberRepository } from "@/lib/data/rls-member-repository";
import { neonSqlExecutor } from "@/lib/data/neon-sql";

export type DataProvider = "mock" | "postgres" | "data-api";

function getConfiguredProvider(): DataProvider {
  const configured = process.env.VEYRA_DATA_PROVIDER;
  const isProduction = process.env.NODE_ENV === "production";

  if (!configured) {
    if (isProduction) {
      throw new Error("VEYRA_DATA_PROVIDER must be explicitly configured in production.");
    }
    return "mock";
  }

  if (configured !== "mock" && configured !== "postgres" && configured !== "data-api") {
    throw new Error(`Unsupported data provider '${configured}'.`);
  }

  if (isProduction && configured === "mock") {
    throw new Error("The mock data provider is disabled in production. Configure VEYRA_DATA_PROVIDER=data-api.");
  }

  return configured;
}

export function getMemberRepository(): MemberRepository {
  const provider = getConfiguredProvider();

  if (provider === "mock") {
    return mockMemberRepository;
  }

  if (provider === "data-api") {
    return createRlsMemberRepository();
  }

  return createAuthenticatedPostgresMemberRepository(neonSqlExecutor);
}
