CREATE TABLE IF NOT EXISTS member_claims (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id),
  prescription_id TEXT REFERENCES prescriptions(id),
  claim_reference TEXT NOT NULL UNIQUE,
  medication_name TEXT NOT NULL,
  strength TEXT,
  quantity NUMERIC,
  days_supply INTEGER,
  pharmacy_id TEXT REFERENCES pharmacies(id),
  pharmacy_name TEXT,
  service_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Paid', 'Rejected', 'Reversed', 'Pending')),
  transaction_type TEXT NOT NULL DEFAULT 'Paid',
  submitted_amount_cents INTEGER NOT NULL DEFAULT 0 CHECK (submitted_amount_cents >= 0),
  allowed_amount_cents INTEGER NOT NULL DEFAULT 0 CHECK (allowed_amount_cents >= 0),
  plan_paid_cents INTEGER NOT NULL DEFAULT 0 CHECK (plan_paid_cents >= 0),
  member_responsibility_cents INTEGER NOT NULL DEFAULT 0 CHECK (member_responsibility_cents >= 0),
  deductible_cents INTEGER NOT NULL DEFAULT 0 CHECK (deductible_cents >= 0),
  copay_cents INTEGER NOT NULL DEFAULT 0 CHECK (copay_cents >= 0),
  coinsurance_cents INTEGER NOT NULL DEFAULT 0 CHECK (coinsurance_cents >= 0),
  reject_code TEXT,
  reject_message TEXT,
  reversal_of_claim_id TEXT REFERENCES member_claims(id),
  adjudicated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_member_claims_member_service_date
  ON member_claims(member_id, service_date DESC);
CREATE INDEX IF NOT EXISTS idx_member_claims_prescription
  ON member_claims(prescription_id);
CREATE INDEX IF NOT EXISTS idx_member_claims_pharmacy
  ON member_claims(pharmacy_id);

ALTER TABLE member_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS member_claims_self_select ON member_claims;
CREATE POLICY member_claims_self_select ON member_claims
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM members m
      WHERE m.id = member_claims.member_id
        AND m.external_auth_id = auth.user_id()
    )
  );
