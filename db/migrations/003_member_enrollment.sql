ALTER TABLE members ADD COLUMN IF NOT EXISTS enrollment_code_hash TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS enrollment_code_expires_at TIMESTAMPTZ;
ALTER TABLE members ADD COLUMN IF NOT EXISTS enrollment_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE members ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMPTZ;
CREATE UNIQUE INDEX IF NOT EXISTS members_enrollment_code_hash_key ON members(enrollment_code_hash) WHERE enrollment_code_hash IS NOT NULL;
