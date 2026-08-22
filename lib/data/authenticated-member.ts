import { getCurrentMemberSession } from "@/lib/auth/session";
import { dataApiSelect, eq } from "@/lib/data/data-api";
import { neonSqlExecutor } from "@/lib/data/neon-sql";

export function useDataApi(): boolean {
  return process.env.VEYRA_DATA_PROVIDER === "data-api";
}

export async function requireAuthenticatedMemberSession() {
  const session = await getCurrentMemberSession();
  if (!session) throw new Error("An authenticated member session is required.");
  return session;
}

export async function resolveAuthenticatedMemberId(): Promise<string> {
  const session = await requireAuthenticatedMemberSession();

  if (useDataApi()) {
    const rows = await dataApiSelect<{ id: string }>(
      "members",
      "id",
      [`external_auth_id=${eq(session.memberId)}`],
      undefined,
      1
    );
    if (!rows[0]?.id) {
      throw new Error("This account is not linked to a SmarteRX member record.");
    }
    return rows[0].id;
  }

  const rows = await neonSqlExecutor<{ id: string }>(
    `SELECT id FROM members WHERE external_auth_id = $1 LIMIT 1`,
    [session.memberId]
  );
  if (!rows[0]?.id) {
    throw new Error("This account is not linked to a SmarteRX member record.");
  }
  return rows[0].id;
}
