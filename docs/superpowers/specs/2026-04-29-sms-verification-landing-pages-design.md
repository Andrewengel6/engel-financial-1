# Design: SMS Verification + Service Landing Pages
**Date:** 2026-04-29
**Phases:** 3 (backend + SMS on existing forms) and 4 (service landing pages + homepage tweak)

---

## Overview

Two-phase build to turn form submissions into verified, spam-free leads and create service-specific Meta Ads landing pages.

**Phase 3** — Wire Supabase + Twilio Verify into every existing form on the site. No visual redesign; two new fields added (state, contact urgency); OTP verification step inserted before submission.

**Phase 4** — Build 7 service-specific landing pages with a one-question-per-screen wizard funnel (same backend). Update the homepage form with the two new fields.

---

## Architecture

```
Browser (HTML forms / landing page wizards)
    ↓ POST fetch
Vercel Serverless Functions (/api/)
    ├── Twilio Verify API  (send OTP / check OTP)
    ├── Supabase           (store verified lead)
    └── Twilio Messaging   (SMS notification → Andrew)
```

### Vercel Serverless Functions

| File | Method | Purpose |
|---|---|---|
| `api/send-code.js` | POST | Receives `phone`. Calls Twilio Verify to dispatch OTP SMS. Returns `{ok: true}` or error. |
| `api/submit-lead.js` | POST | Receives `code` + all form fields. Verifies OTP with Twilio. On success: inserts row in Supabase, sends SMS to Andrew. Returns `{ok: true}` or error. |

### Environment Variables (set in Vercel dashboard — never in code)

| Key | Value source |
|---|---|
| `TWILIO_ACCOUNT_SID` | Twilio console |
| `TWILIO_AUTH_TOKEN` | Twilio console |
| `TWILIO_VERIFY_SID` | Twilio Verify service SID |
| `TWILIO_FROM_NUMBER` | Twilio purchased number |
| `ANDREW_PHONE` | Andrew's personal mobile (E.164 format) |
| `SUPABASE_URL` | Supabase project settings |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |

---

## Supabase Schema

### Table: `leads`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, auto-generated |
| `created_at` | timestamptz | Auto |
| `first_name` | text | |
| `last_name` | text | |
| `phone` | text | E.164 format |
| `email` | text | |
| `state` | text | Full state name e.g. "Texas" |
| `coverage_type` | text | e.g. "Life Insurance", "Annuities" |
| `contact_urgency` | text | `immediately` / `within_a_week` / `within_a_month` / `just_looking` |
| `source_page` | text | e.g. `/contact.html`, `/lp/life-insurance` |
| `message` | text | nullable — contact form only |
| `age` | text | nullable — landing pages only |
| `gender` | text | nullable — life/whole-life/IUL/mortgage pages |
| `tobacco` | text | nullable — `yes` or `no` |
| `health` | text | nullable — `great` / `fair` / `poor` |
| `beneficiary` | text | nullable — life/whole-life pages |
| `coverage_amount` | text | nullable — whole-life page |
| `coverage_subtype` | text | nullable — life insurance: Term/Whole Life/IUL/Not sure |
| `primary_goal` | text | nullable — IUL/annuities/retirement/advanced markets |
| `annual_income` | text | nullable — IUL/advanced markets |
| `income_start` | text | nullable — annuities |
| `retirement_savings` | text | nullable — annuities/retirement |
| `employment_status` | text | nullable — retirement planning |
| `mortgage_status` | text | nullable — mortgage protection |
| `mortgage_balance` | text | nullable — mortgage protection |
| `mortgage_co_borrower` | text | nullable — mortgage protection |
| `retirement_timeline` | text | nullable — retirement planning |
| `describes_you` | text | nullable — advanced markets |

Every row in this table is a **verified lead** — rows are only inserted after Twilio confirms the OTP. No partial/unverified rows ever exist.

---

## Phase 3 — SMS Verification on Existing Forms

### Scope

9 forms updated: homepage (`index.html`), contact (`contact.html`), and 7 coverage pages (life-insurance, whole-life-insurance, iuls, annuities, mortgage-protection, retirement-planning, advanced-markets).

### New Fields Added to All Existing Forms

**State** — full 50-state dropdown, placed after the existing phone field.

**Contact Urgency** — radio group or styled select, placed after state:
- I want to be contacted immediately
- Within a week
- Within a month
- I'm just looking around

### Form UX Flow (two-step — same on all 9 forms)

**Step 1 — Fill & Request Code**
- Form looks identical to today. New fields (state, urgency) appear inline.
- Submit button label: "Send Verification Code"
- On click: validate all required fields client-side. If valid, POST to `/api/send-code` with phone number. Button shows spinner.

**Step 2 — Enter Code**
- Form fields fade out. Replacement screen appears:
  > *"We sent a 6-digit code to [phone]. Enter it below to confirm your identity."*
- Single 6-digit input (auto-advance between digits).
- "Verify & Submit" button.
- "Resend code" link — enabled after 30 seconds.
- On submit: POST to `/api/submit-lead` with code + all collected form data.

**Step 3 — Confirmation (inline)**
- Form area replaced with:
  > *"You're all set! One of our agents will reach out to you within 24 hours."*
- No redirect to thank-you.html — confirmation is inline.

### Error Handling

| Scenario | User-facing message |
|---|---|
| Invalid/expired OTP | "That code didn't match. Please try again or resend." |
| Network error on send-code | "Something went wrong sending your code. Please try again." |
| Network error on submit | "Something went wrong submitting your info. Please try again." |
| Twilio rate limit hit | "Too many attempts. Please wait a few minutes and try again." |

---

## Andrew's SMS Notification

Sent by `api/submit-lead.js` via Twilio Messaging immediately after a verified lead is stored.

**Format:**
```
New lead: John Smith | Texas | (501) 555-1234 | john@example.com | Life Insurance | Urgency: Immediately | /lp/life-insurance
```

For landing page leads, the message also includes the key qualifier:
```
New lead: Jane Doe | Florida | (501) 555-5678 | jane@example.com | Mortgage Protection | Urgency: Within a week | Balance: $150k–$300k | Health: Great | /lp/mortgage-protection
```

---

## Phase 4 — Service Landing Pages

### File Structure

```
/lp/
  life-insurance.html
  whole-life.html
  iul.html
  annuities.html
  mortgage-protection.html
  retirement-planning.html
  advanced-markets.html
```

Each file is a self-contained HTML page. Same Tailwind CDN + brand styles as the rest of the site. Same Vercel functions for backend.

### Wizard UX Pattern

- Full-screen step: one question per screen, large tap-target buttons for multiple-choice answers.
- Progress bar across the top (e.g. "Step 3 of 9").
- Selecting a button answer immediately advances to the next step (no separate "Next" click for choice questions).
- Text/dropdown inputs have a "Continue" button.
- Back arrow in top-left to go to previous step.
- Engel Financial Group logo top-center. Phone number top-right ("Call us for help").
- "How it works" trust section below the fold on every step (same as LegacyFinancial reference).

### Closing Steps (identical across all 7 funnels)

These are the last steps of every landing page funnel, after the service-specific questions:

| Step | Question | Input type |
|---|---|---|
| Urgency | "How soon do you want to be contacted?" | 4 large buttons |
| Name | "What's your full name?" | Text input |
| Email | "What's your email address?" | Email input |
| Phone | "Let's verify your phone number" | Tel input + "Send my code" button |
| OTP | "Enter the 6-digit code we sent to [phone]" | 6-digit input + "Verify & Submit" |
| Done | Confirmation screen | — |

### Service-Specific Question Sets

**Life Insurance** (`/lp/life-insurance`)
1. Age (dropdown 18–80)
2. State (50-state dropdown)
3. Who depends on you financially? → Spouse or partner / Children / Parent / Other
4. Which type of life insurance? → Term / Whole Life / IUL / Not sure — need help deciding
5. Gender → Male / Female
6. Do you use tobacco products? → Yes / No
7. How would you describe your health? → Great / Fair / Poor
8. → Closing steps

---

**Whole Life Insurance** (`/lp/whole-life`)
1. Age
2. State
3. Who depends on you financially? → Spouse or partner / Children / Parent / Other
4. Desired coverage amount → $25,000 / $50,000 / $100,000 / $250,000+
5. Gender → Male / Female
6. Do you use tobacco products? → Yes / No
7. How would you describe your health? → Great / Fair / Poor
8. → Closing steps

---

**IULs** (`/lp/iul`)
1. Age
2. State
3. What's your primary goal? → Tax-free retirement income / Protect my family / Build tax-free wealth / Not sure
4. Annual household income → $50k–$100k / $100k–$200k / $200k+
5. Gender → Male / Female
6. Do you use tobacco products? → Yes / No
7. How would you describe your health? → Great / Fair / Poor
8. → Closing steps

---

**Annuities** (`/lp/annuities`)
1. Age
2. State
3. What's your primary goal? → Guaranteed lifetime income / Principal protection / Tax-deferred growth / Leave a legacy
4. When do you want to start receiving income? → Now / 1–5 years / 5–10 years / 10+ years
5. Approximate investable savings → $50k–$100k / $100k–$250k / $250k–$500k / $500k+
6. → Closing steps

---

**Mortgage Protection** (`/lp/mortgage-protection`)
1. Age
2. State
3. Mortgage status → I have an active mortgage / I just closed / I'm refinancing soon / I'm planning to buy
4. Approximate mortgage balance → $50k–$150k / $150k–$300k / $300k–$500k / $500k+
5. Who else is on the mortgage? → Just me / Spouse or partner / Other
6. Gender → Male / Female
7. Do you use tobacco products? → Yes / No
8. How would you describe your health? → Great / Fair / Poor
9. → Closing steps

---

**Retirement Planning** (`/lp/retirement-planning`)
1. Age
2. State
3. When do you plan to retire? → Already retired / Within 5 years / 5–10 years / 10+ years
4. Biggest retirement concern → Running out of money / Tax burden / Healthcare costs / Leaving a legacy
5. Current retirement savings → $0–$50k / $50k–$200k / $200k–$500k / $500k+
6. Employment status → Employed / Self-employed / Retired
7. → Closing steps

---

**Advanced Markets** (`/lp/advanced-markets`)
1. Age
2. State
3. What best describes you? → Business owner / High-income professional / Retiree / Other
4. Primary goal → Business succession / Executive benefits / Estate planning / Tax-efficient wealth transfer
5. Annual income → $100k–$250k / $250k–$500k / $500k+
6. → Closing steps

---

## Implementation Order

### Phase 3
1. Create Supabase project, run SQL to create `leads` table
2. Create Twilio account, set up Verify service, buy a phone number
3. Scaffold `api/send-code.js` and `api/submit-lead.js`
4. Test both functions locally (via `vercel dev`)
5. Add state + contact urgency fields to all 9 existing forms
6. Add OTP two-step flow to all 9 existing forms (shared JS module)
7. Deploy to Vercel, set all env vars in dashboard
8. End-to-end test: submit each form, confirm lead in Supabase, confirm SMS to Andrew

### Phase 4
1. Build `/lp/life-insurance.html` (wizard scaffold + Life Insurance questions)
2. Build remaining 6 landing pages using same wizard component
3. Add state + urgency fields to homepage form
4. End-to-end test all 7 landing pages
5. Final polish pass across entire site

---

## Cost Estimate (at 100 verified leads/month)

| Service | Cost |
|---|---|
| Vercel | Free |
| Supabase | Free |
| Twilio Verify (OTP to prospect) | ~$0.05/verification = ~$5/month |
| Twilio SMS (notification to Andrew) | ~$0.008/SMS = ~$0.80/month |
| **Total** | **~$6/month** |
