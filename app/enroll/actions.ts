"use server";

import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { getCurrentMemberSession } from "@/lib/auth/session";
import { neonSqlExecutor } from "@/lib/data/neon-sql";

export type EnrollState = { error?: string } | null;

type MemberRow = {
  id: string;
  enrollment_code_hash: string | null;
  enrollment_code_expires_at: string | null;
  external_auth_id: string | null;
};

export async function enrollMember(
  _prevState: EnrollState,
  formData: FormData
): Promise<EnrollState> {
  const session = await getCurrentMemberSession();
  if (!session) redirect("/signin");

  const rawCode = String(formData.get("code") ?? "").trim();
  if (!rawCode) return { error: "Enter your enrollment code." };

  const codeHash = createHash("sha256").update(rawCode).digest("hex");

  const existing = await neonSqlExecutor<MemberRow>(
    `SELECT id, enrollment_code_hash, enrollment_code_expires_at, external_auth_id
       FROM members
      WHERE enrollment_code_hash = $1
      LIMIT 1`,
    [codeHash]
  );

  const member = existing[0];
  if (!member) return { error: "Invalid enrollment code." };
  if (!member.enrollment_code_expires_at || new Date(member.enrollment_code_expires_at).getTime() <= Date.now()) {
    return { error: "This enrollment code has expired." };
  }
  if (member.external_auth_id && member.external_auth_id !== session.memberId) {
    return { error: "This member record is already linked to another sign-in." };
  }

  const alreadyLinked = await neonSqlExecutor<{ id: string }>(
    `SELECT id FROM members WHERE external_auth_id = $1 AND id <> $2 LIMIT 1`,
    [session.memberId, member.id]
  );
  if (alreadyLinked[0]) return { error: "This sign-in is already linked to another member record." };

  await neonSqlExecutor(
    `UPDATE members
        SET external_auth_id = $1,
            enrolled_at = now(),
            enrollment_code_hash = NULL,
            enrollment_code_expires_at = NULL,
            enrollment_attempts = 0,
            updated_at = now()
      WHERE id = $2
        AND (external_auth_id IS NULL OR external_auth_id = $1)`,
    [session.memberId, member.id]
  );

  redirect("/dashboard");
}
