UPDATE prescriptions
SET pharmacy_name = REPLACE(pharmacy_name, 'VeyraRx', 'SmarteRX')
WHERE pharmacy_name LIKE '%VeyraRx%';

UPDATE member_claims
SET pharmacy_name = REPLACE(pharmacy_name, 'VeyraRx', 'SmarteRX')
WHERE pharmacy_name LIKE '%VeyraRx%';

UPDATE member_messages
SET sender = REPLACE(sender, 'VeyraRx', 'SmarteRX'),
    updated_at = CURRENT_TIMESTAMP
WHERE sender LIKE '%VeyraRx%';
