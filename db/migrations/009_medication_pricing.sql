CREATE TABLE IF NOT EXISTS drug_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  generic_name TEXT,
  strength TEXT NOT NULL,
  dosage_form TEXT NOT NULL,
  package_description TEXT,
  ndc TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medication_price_quotes (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES drug_products(id) ON DELETE CASCADE,
  pharmacy_id TEXT NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES member_plans(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  days_supply INTEGER CHECK (days_supply > 0),
  cash_price_cents INTEGER CHECK (cash_price_cents IS NULL OR cash_price_cents >= 0),
  negotiated_price_cents INTEGER CHECK (negotiated_price_cents IS NULL OR negotiated_price_cents >= 0),
  member_estimated_cost_cents INTEGER CHECK (member_estimated_cost_cents IS NULL OR member_estimated_cost_cents >= 0),
  copay_cents INTEGER CHECK (copay_cents IS NULL OR copay_cents >= 0),
  coinsurance_percent NUMERIC(5,2) CHECK (coinsurance_percent IS NULL OR (coinsurance_percent >= 0 AND coinsurance_percent <= 100)),
  deductible_applies BOOLEAN NOT NULL DEFAULT FALSE,
  formulary_tier TEXT,
  coverage_status TEXT,
  network_status TEXT,
  fulfillment_type TEXT NOT NULL DEFAULT 'Retail',
  pricing_source TEXT NOT NULL,
  quoted_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS medication_price_quotes_product_idx ON medication_price_quotes(product_id);
CREATE INDEX IF NOT EXISTS medication_price_quotes_pharmacy_idx ON medication_price_quotes(pharmacy_id);
CREATE INDEX IF NOT EXISTS medication_price_quotes_plan_idx ON medication_price_quotes(plan_id);
CREATE INDEX IF NOT EXISTS medication_price_quotes_lookup_idx ON medication_price_quotes(product_id, quantity, pharmacy_id, quoted_at DESC);
