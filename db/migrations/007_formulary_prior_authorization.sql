CREATE TABLE IF NOT EXISTS plan_formulary_medications (
  id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL REFERENCES member_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  strength TEXT NOT NULL,
  tier TEXT NOT NULL,
  coverage_status TEXT NOT NULL,
  estimated_cost_cents INTEGER NOT NULL DEFAULT 0 CHECK (estimated_cost_cents >= 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(plan_id, name, strength)
);

CREATE INDEX IF NOT EXISTS plan_formulary_medications_plan_sort_idx
  ON plan_formulary_medications(plan_id, sort_order);

CREATE TABLE IF NOT EXISTS member_prior_authorizations (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  medication TEXT NOT NULL,
  status TEXT NOT NULL,
  requirement TEXT NOT NULL,
  last_updated DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS member_prior_authorizations_member_updated_idx
  ON member_prior_authorizations(member_id, last_updated DESC);
