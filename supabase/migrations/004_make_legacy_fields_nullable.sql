-- The new life-insurance wizard uses product_interest and contact_timing
-- instead of the old coverage_type and contact_urgency fields.
-- Make legacy NOT NULL columns nullable so the new wizard can insert leads.
ALTER TABLE leads ALTER COLUMN coverage_type    DROP NOT NULL;
ALTER TABLE leads ALTER COLUMN contact_urgency  DROP NOT NULL;
