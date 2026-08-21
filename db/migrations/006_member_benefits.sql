CREATE TABLE IF NOT EXISTS member_benefits (
  member_id TEXT PRIMARY KEY REFERENCES members(id) ON DELETE CASCADE,
  deductible_used_cents INTEGER NOT NULL DEFAULT 0 CHECK (deductible_used_cents >= 0),
  deductible_total_cents INTEGER NOT NULL DEFAULT 0 CHECK (deductible_total_cents >= 0),
  out_of_pocket_used_cents INTEGER NOT NULL DEFAULT 0 CHECK (out_of_pocket_used_cents >= 0),
  out_of_pocket_max_cents INTEGER NOT NULL DEFAULT 0 CHECK (out_of_pocket_max_cents >= 0),
  plan_year_label TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS plan_coverage_tiers (
  id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL REFERENCES member_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  retail_30_label TEXT NOT NULL,
  retail_90_label TEXT NOT NULL,
  home_90_label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(plan_id, name)
);

CREATE INDEX IF NOT EXISTS plan_coverage_tiers_plan_sort_idx
  ON plan_coverage_tiers(plan_id, sort_order);
