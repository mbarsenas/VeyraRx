import { createHash } from "crypto";
import { getCurrentMemberSession } from "@/lib/auth/session";
import { neonSqlExecutor } from "@/lib/data/neon-sql";

const MAX_ATTEMPTS = 5;

type EnrollmentRow = {
  id: string;
  external_auth_id: string | null;
  enrollment_code_expires_at: string | null;
  enrollment_attempts: number;
};

export type EnrollmentResult = {
  ok: boolean;
  message: string;
};

function hashEnrollmentCode(code: string): string {
  return createHash("sha256").update(code.trim()).digest("hex");
}

export async function isCurrentAccountEnrolled(): Promise<boolean> {
  const session = await getCurrentMemberSession();
  if (!session) return false;

  const rows = await neonSqlExecutor<{ id: string }>(
    `SELECT id FROM members WHERE external_auth_id = $1 LIMIT 1`,
    [session.memberId]
  );

  return Boolean(rows[0]?.id);
}

export async function enrollCurrentAccount(code: string): Promise<EnrollmentResult> {
  const session = await getCurrentMemberSession();
  if (!session) {
    return { ok: false, message: "You must be signed in to enroll." };
  }

  if (!code.trim()) {
    return { ok: false, message: "Enter your enrollment code." };
  }

  const existing = await neonSqlExecutor<{ id: string }>(
    `SELECT id FROM members WHERE external_auth_id = $1 LIMIT 1`,
    [session.memberId]
  );

  if (existing[0]?.id) {
    return { ok: true, message: "Your account is already enrolled." };
  }

  const codeHash = hashEnrollmentCode(code);
  const rows = await neonSqlExecutor<EnrollmentRow>(
    `SELECT id, external_auth_id, enrollment_code_expires_at, enrollment_attempts
       FROM members
      WHERE enrollment_code_hash = $1
      LIMIT 1`,
    [codeHash]
  );

  const member = rows[0];
  if (!member) {
    return { ok: false, message: "That enrollment code is not valid." };
  }

  if (member.external_auth_id) {
    return { ok: false, message: "That member record is already linked to an account." };
  }

  if (member.enrollment_attempts >= MAX_ATTEMPTS) {
    return { ok: false, message: "Enrollment has been locked. Contact member support." };
  }

  if (member.enrollment_code_expires_at && new Date(member.enrollment_code_expires_at) < new Date()) {
    return { ok: false, message: "That enrollment code has expired." };
  }

  const claimed = await neonSqlExecutor<{ id: string }>(
    `UPDATE members
        SET external_auth_id = $1,
            enrolled_at = CURRENT_TIMESTAMP,
            enrollment_code_hash = NULL,
            enrollment_code_expires_at = NULL,
            enrollment_attempts = 0,
            updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
        AND external_auth_id IS NULL
      RETURNING id`,
    [session.memberId, member.id]
  );

  if (!claimed[0]?.id) {
    return { ok: false, message: "That member record could not be linked. Please try again." };
  }

  return { ok: true, message: "Enrollment complete." };
}
