-- Campaign wizard fields
ALTER TABLE leads ADD COLUMN IF NOT EXISTS coverage_for   text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS product_interest text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS main_reason    text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_timing text;

-- UTM / attribution fields
ALTER TABLE leads ADD COLUMN IF NOT EXISTS landing_page_url text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS query_string     text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source       text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium       text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign     text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_adset        text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_content      text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_term         text;

-- Post-lead pipeline fields (updated manually by Andrew after calls)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contacted        boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contacted_at     timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS booked_call      boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS booked_at        timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS showed           boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS showed_at        timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS qualified        boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS quoted           boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS premium_amount   numeric;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sold             boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sold_at          timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS reason_unqualified text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_status      text;
