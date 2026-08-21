BEGIN;

INSERT INTO member_plans (id, name, rx_bin, rx_group, effective_date, deductible_used_cents, deductible_total_cents)
VALUES ('plan-veyrachoice-plus', 'VeyraChoice Plus', '610014', 'VYR365', DATE '2026-01-01', 62000, 150000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO pharmacies (id, name, city, state, postal_code, address_line1, phone, network_status)
VALUES ('pharmacy-heb-demo', 'H-E-B Pharmacy', 'San Antonio', 'TX', '78201', 'Demo address', '(210) 555-0100', 'Preferred')
ON CONFLICT (id) DO NOTHING;

INSERT INTO members (id, first_name, last_initial, initials, member_id_last4, email, phone, plan_id, preferred_pharmacy_id, potential_savings_cents)
VALUES ('member-demo-001', 'Mark', 'B.', 'MB', '4821', 'mark@example.com', '(210) 555-0148', 'plan-veyrachoice-plus', 'pharmacy-heb-demo', 3800)
ON CONFLICT (id) DO NOTHING;

INSERT INTO prescriptions (id, member_id, slug, name, strength, supply, status, rx_number, prescriber, quantity, refills_remaining, last_fill, next_refill_label, pharmacy_name, coverage_tier, estimated_cost_cents, primary_action_label, primary_action_href)
VALUES
('rx-atorvastatin-20', 'member-demo-001', 'atorvastatin-20mg', 'Atorvastatin', '20 mg', '90-day supply', 'Processing', 'RX-784291', 'Dr. Amanda Chen', '90 tablets', 3, DATE '2026-05-14', 'Aug 12, 2026', 'VeyraRx Home Delivery', 'Tier 1 - Generic', 1200, 'Track order', '/dashboard/orders/atorvastatin'),
('rx-lisinopril-10', 'member-demo-001', 'lisinopril-10mg', 'Lisinopril', '10 mg', '30-day supply', 'Refill available', 'RX-552104', 'Dr. Marcus Reed', '30 tablets', 2, DATE '2026-07-12', 'Now eligible', 'H-E-B Pharmacy', 'Tier 1 - Generic', 800, 'Refill now', '/dashboard/prescriptions/lisinopril-10mg/refill'),
('rx-metformin-er-500', 'member-demo-001', 'metformin-er-500mg', 'Metformin ER', '500 mg', '90-day supply', 'Active', 'RX-318822', 'Dr. Sophia Patel', '180 tablets', 4, DATE '2026-06-20', 'Sep 18, 2026', 'H-E-B Pharmacy', 'Tier 1 - Generic', 1000, 'View details', '/dashboard/prescriptions/metformin-er-500mg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO prescription_fills (prescription_id, fill_date, quantity, cost_cents)
SELECT * FROM (VALUES
('rx-atorvastatin-20', DATE '2026-05-14', '90 tablets', 1200),
('rx-atorvastatin-20', DATE '2026-02-13', '90 tablets', 1200),
('rx-lisinopril-10', DATE '2026-07-12', '30 tablets', 800),
('rx-lisinopril-10', DATE '2026-06-12', '30 tablets', 800),
('rx-lisinopril-10', DATE '2026-05-13', '30 tablets', 800),
('rx-metformin-er-500', DATE '2026-06-20', '180 tablets', 1000),
('rx-metformin-er-500', DATE '2026-03-22', '180 tablets', 1000)
) AS seed(prescription_id, fill_date, quantity, cost_cents)
WHERE NOT EXISTS (
  SELECT 1 FROM prescription_fills existing
  WHERE existing.prescription_id = seed.prescription_id
    AND existing.fill_date = seed.fill_date
);

INSERT INTO member_activity (member_id, title, occurred_at, display_time)
SELECT * FROM (VALUES
('member-demo-001', 'Atorvastatin order is processing', TIMESTAMPTZ '2026-08-21 18:42:00-05', 'Today - 6:42 PM'),
('member-demo-001', 'Lisinopril refill became available', TIMESTAMPTZ '2026-08-10 09:15:00-05', 'Aug 10 - 9:15 AM'),
('member-demo-001', 'Preferred pharmacy updated', TIMESTAMPTZ '2026-08-04 14:03:00-05', 'Aug 4 - 2:03 PM')
) AS seed(member_id, title, occurred_at, display_time)
WHERE NOT EXISTS (
  SELECT 1 FROM member_activity existing
  WHERE existing.member_id = seed.member_id
    AND existing.title = seed.title
    AND existing.occurred_at = seed.occurred_at
);

COMMIT;
