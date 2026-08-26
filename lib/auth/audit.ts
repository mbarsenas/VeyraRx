import { neonSqlExecutor } from "@/lib/data/neon-sql";

export function createSignInFailureMetadata(email: string) {
  return {
    email: email.trim().toLowerCase(),
    failure_category: "authentication_failed",
    authentication_method: "password",
  } as const;
}

export async function recordAuthEvent(eventType: string, externalAuthId?: string, metadata: Record<string, unknown> = {}) {
  try {
    await neonSqlExecutor(
      `INSERT INTO auth_audit_events (external_auth_id, event_type, event_metadata)
       VALUES ($1, $2, $3::jsonb)`,
      [externalAuthId ?? null, eventType, JSON.stringify(metadata)]
    );
  } catch (error) {
    console.error("Unable to record authentication audit event", { eventType, error });
  }
}
