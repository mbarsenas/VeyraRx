CREATE INDEX IF NOT EXISTS idx_auth_audit_events_type_email_time
  ON auth_audit_events(event_type, (event_metadata ->> 'email'), occurred_at DESC);

