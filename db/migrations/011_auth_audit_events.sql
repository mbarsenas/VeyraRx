CREATE TABLE IF NOT EXISTS auth_audit_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  external_auth_id TEXT,
  event_type TEXT NOT NULL,
  event_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auth_audit_events_external_auth_time
  ON auth_audit_events(external_auth_id, occurred_at DESC);

ALTER TABLE auth_audit_events ENABLE ROW LEVEL SECURITY;

-- Audit history is intentionally unavailable through the member Data API.
-- Trusted server connections may insert/query it for security operations.
