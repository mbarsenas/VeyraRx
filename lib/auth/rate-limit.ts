import { neonSqlExecutor } from "@/lib/data/neon-sql";
import type { SqlExecutor } from "@/lib/data/postgres-member-repository";

export const authRateLimitPolicies = {
  signIn: { eventType: "sign_in_failed", maxAttempts: 5, windowMs: 15 * 60 * 1000 },
  verificationEmail: { eventType: "verification_email_requested", maxAttempts: 3, windowMs: 15 * 60 * 1000 },
  passwordReset: { eventType: "password_reset_requested", maxAttempts: 3, windowMs: 60 * 60 * 1000 },
} as const;

type AuthRateLimitPolicy = (typeof authRateLimitPolicies)[keyof typeof authRateLimitPolicies];

export type AuthRateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export async function checkAuthRateLimit(
  email: string,
  policy: AuthRateLimitPolicy,
  executor: SqlExecutor = neonSqlExecutor
): Promise<AuthRateLimitResult> {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const rows = await executor<{ attempt_count: number | string }>(
      `SELECT COUNT(*)::int AS attempt_count
       FROM auth_audit_events
       WHERE event_type = $1
         AND event_metadata ->> 'email' = $2
         AND occurred_at >= NOW() - ($3 * INTERVAL '1 millisecond')`,
      [policy.eventType, normalizedEmail, policy.windowMs]
    );
    const attemptCount = Number(rows[0]?.attempt_count ?? 0);

    return {
      allowed: attemptCount < policy.maxAttempts,
      retryAfterSeconds: Math.ceil(policy.windowMs / 1000),
    };
  } catch (error) {
    console.error("Unable to evaluate authentication rate limit", {
      eventType: policy.eventType,
      error,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
