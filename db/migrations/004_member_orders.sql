CREATE TABLE IF NOT EXISTS member_orders (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  prescription_id TEXT REFERENCES prescriptions(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE,
  medication_name TEXT NOT NULL,
  fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('Retail pickup','Home delivery','Mail order')),
  status TEXT NOT NULL CHECK (status IN ('Processing','Ready for pickup','Shipped','Delivered','Cancelled')),
  pharmacy_id TEXT REFERENCES pharmacies(id) ON DELETE SET NULL,
  quantity INTEGER,
  days_supply INTEGER,
  member_cost_cents INTEGER NOT NULL DEFAULT 0 CHECK (member_cost_cents >= 0),
  placed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  tracking_number TEXT,
  carrier TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS member_orders_member_placed_idx ON member_orders(member_id, placed_at DESC);
CREATE INDEX IF NOT EXISTS member_orders_member_status_idx ON member_orders(member_id, status);
