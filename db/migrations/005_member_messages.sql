CREATE TABLE IF NOT EXISTS member_messages (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  preview TEXT NOT NULL,
  body TEXT NOT NULL,
  sender TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Order','Benefit','Pharmacy','Support')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS member_messages_member_sent_idx ON member_messages(member_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS member_messages_member_read_idx ON member_messages(member_id, is_read);
