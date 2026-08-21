BEGIN;

CREATE TABLE IF NOT EXISTS member_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rx_bin TEXT NOT NULL,
  rx_group TEXT NOT NULL,
  effective_date DATE NOT NULL,
  deductible_used_cents INTEGER NOT NULL DEFAULT 0 CHECK (deductible_used_cents >= 0),
  deductible_total_cents INTEGER NOT NULL CHECK (deductible_total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pharmacies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT,
  address_line1 TEXT,
  phone TEXT,
  network_status TEXT NOT NULL DEFAULT 'In network',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  external_auth_id TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_initial TEXT NOT NULL,
  initials TEXT NOT NULL,
  member_id_last4 TEXT NOT NULL CHECK (char_length(member_id_last4) = 4),
  email TEXT,
  phone TEXT,
  plan_id TEXT NOT NULL REFERENCES member_plans(id),
  preferred_pharmacy_id TEXT REFERENCES pharmacies(id),
  potential_savings_cents INTEGER NOT NULL DEFAULT 0 CHECK (potential_savings_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  strength TEXT NOT NULL,
  supply TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Processing', 'Refill available', 'Active')),
  rx_number TEXT NOT NULL,
  prescriber TEXT NOT NULL,
  quantity TEXT NOT NULL,
  refills_remaining INTEGER NOT NULL DEFAULT 0 CHECK (refills_remaining >= 0),
  last_fill DATE,
  next_refill_label TEXT NOT NULL,
  pharmacy_name TEXT NOT NULL,
  coverage_tier TEXT NOT NULL,
  estimated_cost_cents INTEGER NOT NULL DEFAULT 0 CHECK (estimated_cost_cents >= 0),
  primary_action_label TEXT NOT NULL,
  primary_action_href TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (member_id, slug),
  UNIQUE (member_id, rx_number)
);

CREATE TABLE IF NOT EXISTS prescription_fills (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  prescription_id TEXT NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  fill_date DATE NOT NULL,
  quantity TEXT NOT NULL,
  cost_cents INTEGER NOT NULL DEFAULT 0 CHECK (cost_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS member_activity (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  display_time TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS prescriptions_member_id_idx ON prescriptions(member_id);
CREATE INDEX IF NOT EXISTS prescription_fills_prescription_id_idx ON prescription_fills(prescription_id, fill_date DESC);
CREATE INDEX IF NOT EXISTS member_activity_member_id_idx ON member_activity(member_id, occurred_at DESC);

COMMIT;
