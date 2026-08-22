ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_fills ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_prior_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY members_self_select ON members FOR SELECT USING (external_auth_id = auth.user_id()::text);
CREATE POLICY members_self_update ON members FOR UPDATE USING (external_auth_id = auth.user_id()::text) WITH CHECK (external_auth_id = auth.user_id()::text);

CREATE POLICY member_activity_self_select ON member_activity FOR SELECT USING (EXISTS (SELECT 1 FROM members m WHERE m.id = member_activity.member_id AND m.external_auth_id = auth.user_id()::text));
CREATE POLICY prescriptions_self_select ON prescriptions FOR SELECT USING (EXISTS (SELECT 1 FROM members m WHERE m.id = prescriptions.member_id AND m.external_auth_id = auth.user_id()::text));
CREATE POLICY prescription_fills_self_select ON prescription_fills FOR SELECT USING (EXISTS (SELECT 1 FROM prescriptions p JOIN members m ON m.id = p.member_id WHERE p.id = prescription_fills.prescription_id AND m.external_auth_id = auth.user_id()::text));
CREATE POLICY member_benefits_self_select ON member_benefits FOR SELECT USING (EXISTS (SELECT 1 FROM members m WHERE m.id = member_benefits.member_id AND m.external_auth_id = auth.user_id()::text));
CREATE POLICY member_prior_authorizations_self_select ON member_prior_authorizations FOR SELECT USING (EXISTS (SELECT 1 FROM members m WHERE m.id = member_prior_authorizations.member_id AND m.external_auth_id = auth.user_id()::text));
CREATE POLICY member_messages_self_select ON member_messages FOR SELECT USING (EXISTS (SELECT 1 FROM members m WHERE m.id = member_messages.member_id AND m.external_auth_id = auth.user_id()::text));
CREATE POLICY member_messages_self_update ON member_messages FOR UPDATE USING (EXISTS (SELECT 1 FROM members m WHERE m.id = member_messages.member_id AND m.external_auth_id = auth.user_id()::text)) WITH CHECK (EXISTS (SELECT 1 FROM members m WHERE m.id = member_messages.member_id AND m.external_auth_id = auth.user_id()::text));
CREATE POLICY member_orders_self_select ON member_orders FOR SELECT USING (EXISTS (SELECT 1 FROM members m WHERE m.id = member_orders.member_id AND m.external_auth_id = auth.user_id()::text));
