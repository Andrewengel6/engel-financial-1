# Meta Life Insurance Campaign — Design Spec
**Date:** 2026-05-04
**Author:** Andrew Engel / Engel Financial Group
**Status:** Approved — Ready for Implementation

---

## 1. Campaign Overview

**Goal:** Generate exclusive, high-quality life insurance leads through Meta (Facebook/Instagram) ads. Leads flow through a 10-step qualification wizard with OTP phone verification. A licensed advisor (Andrew Engel) follows up within 24 hours.

**Product scope:** Broad life insurance funnel — term, whole life, IUL, final expense. Product discovery happens inside the wizard. Ads are not product-specific.

**Weekly budget:** $1,000/week (~$143/day)
**Licensed states:** AR, FL, IA, KS, MI, MN, MO, MT, NC, OH, OK, SC, TN, TX, VA (15 states)
**Landing page:** `/lp/life-insurance.html` (rebuilt as general qualification wizard)
**Primary metric:** Cost per OTP-verified lead, traced to cost per qualified lead and cost per sale

**Lead quality philosophy:** Do not optimise for cheapest leads. Optimise for leads most likely to become qualified conversations and sales. All budget decisions made on downstream quality, not CPL.

---

## 2. Campaign Architecture

### Budget Split

| Campaign | Purpose | Budget |
|---|---|---|
| Campaign 1 — Legacy Broad | Scale · Advantage+ | $650/week (~$93/day) |
| Campaign 2 — Audience Tests | 3 ad sets · Manual | $350/week |
| **Total** | | **$1,000/week** |

### Campaign 1 — Legacy Broad Scale

- **Objective:** Website Conversions
- **Optimisation event:** CompleteRegistration (OTP-verified lead)
- **Audience:** Advantage+ Broad
- **Hard filters:** 15 licensed states · Age 35–65 · English
- **Ad angle:** Family Protection / Legacy
- **Creative:** 3–5 variations (video + static)
- **Bid strategy:** Phase 1 (Days 1–14) lowest cost · Phase 2 evaluate cost cap at ~1.5× Phase 1 CPL based on cost per OTP-verified lead, not raw CPL
- **Exclude:** Existing OTP-verified leads (customer list upload from Supabase)

### Campaign 2 — Audience Tests (3 Ad Sets)

**Ad Set 1 — Retargeting · Warm Pool**
- **Launch:** Week 2 (pixel must be live 7–10 days first)
- **Audience:** Custom audience — wizard page visitors who did not fire CompleteRegistration (30-day window) + Facebook/Instagram page engagers (60-day) + ad clickers (30-day) + 50%+ video viewers (30-day)
- **Exclude:** CompleteRegistration events (OTP-verified leads)
- **Angle:** Retargeting — direct, completion-focused
- **Budget:** $150/week (~$21/day)
- **Frequency cap:** Max 3 impressions/person/week

**Ad Set 2 — Cash Value / Coverage Options · Financial Interests**
- **Audience:** Manual · 15 states · Age 35–65
- **Interests (OR logic, not AND):** Financial planning, Retirement planning, Estate planning, Wealth management, Life insurance, Investment
- **Fallback interests:** Personal finance, Savings, Dave Ramsey, Suze Orman, AARP, 401(k)
- **Angle:** Coverage Options — not product-specific, curiosity-driven
- **Budget:** $120/week (~$17/day)
- **Exclude:** OTP-verified leads · Retargeting pool

**Ad Set 3 — Soft Protection · Family/Homeowner · 30-Day Signal**
- **Audience:** Manual · 15 states · Age 35–65
- **Interests (OR logic):** Homeownership, Parenting, Family, Home improvement, Mortgage, Life milestones
- **Fallback interests:** Parents (FB category), Home & Garden, Marriage, Family values, First-time homebuyer
- **Angle:** Family Peace of Mind — warm, not fear-heavy
- **Budget:** $80/week (~$11/day)
- **Exclude:** OTP-verified leads · Retargeting pool · Financial interests audience
- **Evaluation:** 30-day minimum — do not judge or cut at 14 days. Insufficient volume for conclusions earlier.

### Decision Rules

- After Day 14: compare cost per OTP-verified lead + contact rate + qualified rate across all 4 ad sets
- After Day 30: full review including Ad Set 3 (Soft Protection). Budget reallocation decisions made here.
- If Campaign 1 CPL is lower but test ad sets show higher qualified rate: shift budget toward test ad sets
- If Retargeting outperforms cold on cost per qualified lead: increase retargeting pool and budget
- Never cut a placement or ad set based on CPL alone
- After 50+ CompleteRegistration events: build 1–3% Lookalike audience as a future Week 4+ ad set

---

## 3. Audience Targeting

### Shared Settings — All Ad Sets
- **Geo:** AR, FL, IA, KS, MI, MN, MO, MT, NC, OH, OK, SC, TN, TX, VA
- **Age:** 35–65
- **Gender:** All
- **Language:** English

### Custom Audiences to Build Before Launch

| Audience | Source | Used for |
|---|---|---|
| Wizard Visitors 30-day | ViewContent pixel event on /lp/life-insurance | Retargeting target (Ad Set 1) · Exclusion from all cold ad sets |
| OTP-Verified Leads | Customer list upload (hashed phone/email from Supabase) | Exclusion from all ad sets |
| CompleteRegistration Event | Meta pixel auto-build | Back-stop exclusion · Future lookalike seed |
| Lookalike 1–3% | Seed: CompleteRegistration events | Week 4+ ad set — not at launch |

### Launch Sequence

- **Day 1:** Campaign 1 + Ad Set 2 + Ad Set 3 go live. Pixel fires. Custom audiences begin building.
- **Day 7–10:** Check wizard visitor pool in Meta. If >1,000 people, launch Ad Set 1 (Retargeting). If smaller, wait until Day 14.
- **Day 14:** First data review — CPL, CompleteRegistration cost, contact rate. Adjust creatives if needed. No structural changes yet.
- **Day 30:** Full review including Ad Set 3. Budget reallocation. Lookalike build if event volume qualifies.

---

## 4. Ad Copy

**Formula applied to every ad:** Strong hook → Emotional reason to care → Safe policy explanation → Licensed agent CTA

**Compliance rules:**
- No product-specific guarantees (whole life, term, IUL) in cold ad copy
- No "guaranteed," "investment," "wealth," "borrow from yourself," "guaranteed returns"
- All product claims qualified with "designed to," "may," "subject to approval," "subject to policy terms"
- "Waiting can change your options" is the approved urgency line — grounded in underwriting fact
- No deadlines, no artificial scarcity, no rate guarantees
- Agent follow-up pre-framed in every ad: "A licensed advisor from Engel Financial Group will reach out to walk through what may be available for your family."
- Review all copy against TX and FL DOI advertising guidelines before launch

### CTA Options

| CTA | Use case |
|---|---|
| Start Your Free Review | Primary — cold traffic |
| See If You Qualify | Cold traffic — qualification framing |
| Check Your Options | Softest entry — broadest cold audience |
| See What Fits Your Family | Soft Protection ad set |
| Complete Your Review | Retargeting only |

Never use: "Get a Quote," "See Your Rate," "Instant Quote" — the wizard does not produce automated pricing.

---

### Angle 1 — Family Protection / Legacy (Campaign 1 · 65% of budget)

**V1**
> Hook: Don't leave your family's protection to chance.
> Emotion: If something happened to you, would your family be okay — not just this year, but long-term? The right coverage makes that question easier to answer.
> Safe: Life insurance is designed to provide financial protection for your family. Coverage options, costs, and eligibility vary by age, health, and policy type.
> CTA: Start your free review. A licensed advisor from Engel Financial Group will reach out to walk through what may be available for your family.
> Button: Start Your Free Review

**V2 ★ Lead Creative**
> Hook: Don't leave your family with a question mark.
> Emotion: Life insurance isn't just about dying — it's about not leaving chaos behind. The right plan means your family knows exactly what happens next. No guessing. No gaps.
> Safe: Coverage options vary by type, age, and health. A licensed advisor can help you understand what may be available and what fits your family's situation.
> CTA: Complete your short review. A licensed advisor will follow up to discuss what options may be available in your state.
> Button: See If You Qualify

**V3**
> Hook: The policy you choose today can shape what your family faces tomorrow.
> Emotion: Most people put off reviewing their coverage until something changes. A few minutes today can start a much clearer conversation about your family's protection.
> Safe: Life insurance options include term, whole life, and other plans. Eligibility and costs are subject to approval and vary by individual circumstances.
> CTA: See what may be available for your family. A licensed advisor will reach out after your short review — no obligation.
> Button: Check Your Options

**Headlines (rotate, one per ad):**
1. Don't leave your family with a question mark.
2. The coverage you choose today shapes what your family faces tomorrow.
3. Don't leave your family's protection to chance.
4. Life insurance isn't just about dying — it's about not leaving chaos behind.
5. A few minutes today can start a much clearer conversation about your family's protection.

---

### Angle 2 — Coverage Options (Ad Set 2 · Financial Interests)

**V1**
> Hook: Not all life insurance works the same way.
> Emotion: Some policies are designed for a set period. Others provide long-term protection — and some may include features that work for you while you're still alive. Knowing the difference matters.
> Safe: Life insurance options vary widely by type, cost, and structure. A licensed advisor can help you compare what may be available and what fits your goals.
> CTA: Start your free review. A licensed advisor from Engel Financial Group will explain what options may be available in your state.
> Button: Check Your Options

**V2**
> Hook: Your coverage should match your goals — not just your budget.
> Emotion: Whether you want to protect your family long-term, cover a specific obligation, or build something that lasts — there's a coverage option designed for that. The question is which one fits you.
> Safe: Coverage type, costs, and eligibility vary by age, health, and individual circumstances. A licensed advisor can help you compare your options.
> CTA: Complete your short review. A licensed advisor from Engel Financial Group will follow up with what may be available for your family.
> Button: Start Your Free Review

**Compliance note:** No cash value, investment, or return language. No product-specific claims. The wizard handles product routing after the click.

---

### Angle 3 — Family Peace of Mind (Ad Set 3 · Homeowner/Family · 30-Day Signal)

**V1**
> Hook: If your family depends on your income, your plan should not be temporary by accident.
> Emotion: Many people don't realise their coverage has an end date until it's too late to change it easily. Reviewing your options now takes less than 5 minutes.
> Safe: Life insurance options vary by type, coverage length, and cost. Subject to approval and individual circumstances.
> CTA: See what may fit your family. A licensed advisor from Engel Financial Group will reach out after your short review — no obligation.
> Button: See What Fits Your Family

**V2**
> Hook: Life insurance isn't just about dying — it's about not leaving chaos behind.
> Emotion: The right coverage means your family knows exactly what happens next. No guessing. No gaps. No surprises. That peace of mind starts with a 5-minute review.
> Safe: Life insurance options, costs, and eligibility vary. A licensed advisor can help identify what may work for your family's situation.
> CTA: Complete your short review. A licensed advisor from Engel Financial Group will follow up with options — no obligation.
> Button: See What Fits Your Family

---

### Angle 4 — Retargeting (Ad Set 1 · Warm Pool · Week 2 launch)

**V1 — Soft Reminder**
> Hook: Still comparing options? Finish your short coverage review.
> Emotion: You were already thinking about protecting your family. That's the hard part. The review takes less than 5 minutes — and a licensed advisor will walk you through the rest.
> Safe: No obligation — just a clearer picture of what life insurance options may be available for your situation.
> CTA: A licensed advisor from Engel Financial Group will reach out after you finish. No pressure — just answers.
> Button: Complete Your Review

**V2 — Optionality**
> Hook: Waiting can change your options.
> Emotion: A few minutes today can start a much clearer conversation about your family's protection. You were already looking — finishing the review is the next step.
> Safe: If approved, coverage options may vary based on your age and health at the time of application. The sooner you review, the clearer your choices may be.
> CTA: Check your options below. A licensed advisor from Engel Financial Group will follow up after your review.
> Button: Check Your Options

**Retargeting video (separate cut — see Section 5):**
- 10–15 seconds only
- No cold-traffic intro
- Opens directly: "Still thinking about protecting your family? Finish your review."
- Reinforces: takes a few minutes, no obligation, licensed advisor follows up
- CTA: "Complete Your Review" or "Check Your Options"

---

## 5. Video + Static Placement Strategy

### Launch Creative Mix
- **Video: 65%** — AI avatar, advisor-led, Reels + Stories primary
- **Static: 35%** — Image ads, Feed + Stories backup

### Video Aspect Ratios

| Format | Dimensions | Role | Placements |
|---|---|---|---|
| 9:16 | 1080 × 1920 | Master format | IG Reels, FB Reels, IG Stories, FB Stories |
| 4:5 | 1080 × 1350 | Feed adapted | IG Feed, FB Feed |
| 1:1 | 1080 × 1080 | Backup only | If 4:5 unavailable — do not produce unless needed |

### Static Aspect Ratios

| Format | Dimensions | Role | Placements |
|---|---|---|---|
| 4:5 | 1080 × 1350 | Primary static | IG Feed, FB Feed |
| 9:16 | 1080 × 1920 | Stories/Reels | IG Stories, FB Stories |
| 1:1 | 1080 × 1080 | Backup only | Square feed fallback |

### Placement Priority

| Placement | Priority | Primary format |
|---|---|---|
| Instagram Reels | High | Video 9:16 |
| Facebook Reels | High | Video 9:16 |
| Instagram Stories | High | Video + Static 9:16 |
| Facebook Stories | Medium | Video + Static 9:16 |
| Instagram Feed | Medium | Static + Video 4:5 |
| Facebook Feed | Medium | Static + Video 4:5 |

### Advantage+ Placements
Use Advantage+ Placements at launch. Provide placement-specific assets for each key placement — do not rely on a single asset being auto-cropped. Upload 9:16 master for Reels/Stories and 4:5 adapted version for Feed. Meta selects the right asset per placement automatically.

**Never:** Upload only a square or landscape asset and let Meta auto-crop into 9:16. This destroys the hook frame and pushes critical text into UI zones.

### Video Creative Requirements

1. **Hook in first 2 seconds** — hook line on screen and spoken within 2 seconds. Text overlay from frame 1.
2. **Captions required** — 85% of Reels are watched without sound. Every spoken word must have a caption or on-screen text. Auto-captions acceptable if reviewed.
3. **AI avatar — advisor-led feel** — talking-head style, direct eye contact, calm and professional. Not voiceover over stock footage. Mid-40s appearance, professional casual attire, neutral background.
4. **Brand visible early** — Engel Financial Group name or logo visible within first 3 seconds. Lower-third or small watermark. Keep above bottom 250px (Meta UI zone).
5. **CTA pre-frames the review** — spoken CTA + on-screen text in final 3 seconds. "Start your free review" or "Check your options in 5 minutes." Not "get a quote."
6. **Safe zones** — no critical text in bottom 250px, top 150px, or within 50px of left/right edges on 9:16.
7. **Agent follow-up pre-frame** — spoken or on-screen: "After your review, a licensed advisor from Engel Financial Group will reach out to walk through your options."
8. **Length** — 15–30 sec for cold traffic. 10–15 sec for retargeting. Test longer cuts only after baseline CPL established.

### Retargeting Video (Separate Cut)
- **Length:** 10–15 seconds
- **No cold-traffic intro** — these users already visited the wizard
- **Opens with:** "Still thinking about protecting your family? Finish your review."
- **Reinforces:** takes a few minutes, no obligation, licensed advisor follows up
- **CTA:** "Complete Your Review" or "Check Your Options"

### Placement Decision Rules
Do not judge placements by views, CTR, or CPL only. Compare: OTP-verified lead · contacted rate · booked call rate · qualified rate · cost per qualified lead · cost per sale.

- If Reels produces cheaper leads but lower contact + qualified rate than Feed → reduce Reels, shift to Feed
- If video costs more per OTP-verified lead but produces better booked call rate → video may still win on cost per qualified lead
- Stories tends toward high volume, low intent — monitor contact rate from Stories-sourced leads before scaling
- First placement review at Day 14. Do not restructure before then.
- UTM `utm_content` field must include placement identifier (via Meta dynamic macro) so Supabase lead records can be segmented by placement in post-lead analysis

---

## 6. Creative Direction — AI Avatar Ads

### Avatar Specifications
- **Style:** Photorealistic AI avatar, advisor-led, talking-head format
- **Appearance:** Mid-40s, professional casual (open collar shirt or light blazer), neutral background (clean home office or light wall)
- **Feel:** Calm, trustworthy, direct — not salesy, not robotic, not overly polished/studio
- **Delivery:** Direct eye contact with camera, conversational pace, no teleprompter stiffness

### Visual Treatment per Angle

**Legacy / Family Protection:**
- Warm tones — navy and gold brand palette
- Avatar speaks directly, family imagery in background (soft-focused)
- On-screen text overlays hook in large bold type
- Brand logo lower-left, above UI safe zone

**Coverage Options:**
- Cleaner, slightly cooler tones — professional setting
- Minimal background — avatar fills most of 9:16 frame
- Hook text prominent, supporting text smaller below

**Family Peace of Mind:**
- Warmer, softer colour treatment
- Slightly more relaxed avatar posture
- Hook text warm/gold accent colour

**Retargeting (short cut):**
- Same avatar, same brand feel
- No background imagery — pure talking head
- Faster pace — cuts directly to hook with no build-up

### Static Ad Treatment
- AI-generated lifestyle imagery: family at home, multi-generational, warm lighting
- Strong headline overlay (hook text) in brand typography
- Engel Financial Group logo + "Licensed Insurance Advisor" credential line
- Gradient overlay on imagery (dark-to-transparent) to ensure text legibility
- No stock photo aesthetic — use AI-generated for brand control

---

## 7. Tracking Setup — Phase 1 Prerequisites

All tracking must be verified in Meta Events Manager before campaign launch.

### Meta Pixel Event Map

| Event | Trigger | Purpose |
|---|---|---|
| PageView | Auto — every page load | Base signal |
| ViewContent | Wizard page loads at /lp/life-insurance | Funnel entry |
| Lead | Contact info submitted (name/email/phone step) | Contact capture |
| CompleteRegistration ★ | OTP verified — wizard fully complete | **Optimisation target** |

**CompleteRegistration must fire ONLY after OTP is verified** — not at form submission, not at phone entry. This is the campaign's conversion signal. If it fires too early, Meta will optimise for the wrong event.

### Conversions API (CAPI)
Wire CAPI to the server-side lead submission endpoint. This reinforces pixel signals lost to iOS privacy restrictions and improves Match Quality Score. The existing API already handles lead submission — CAPI is an extension of that server-side call.

### UTM Parameters — Meta Dynamic Macros

Apply these to the destination URL on every ad in Meta Ads Manager:

```
utm_source=meta
utm_medium=paid_social
utm_campaign={{campaign.name}}
utm_adset={{adset.name}}
utm_content={{ad.name}}_{{placement}}
utm_term={{site_source_name}}
```

**Meta dynamic parameter reference:**
- `{{campaign.name}}` — campaign name as set in Ads Manager
- `{{adset.name}}` — ad set name
- `{{ad.name}}` — ad name (include angle + variation + format: e.g. `legacy-v2-video-916`)
- `{{placement}}` — placement identifier (feed, story, reels, instream, etc.)
- `{{site_source_name}}` — publisher platform (fb, ig, etc.)

**Do not hardcode placement values** when using Advantage+ Placements — use the `{{placement}}` macro so Supabase receives the actual delivery context, not an assumed one.

### Launch Checklist

- [ ] Meta Pixel base code installed in `<head>` of all pages
- [ ] ViewContent fires on /lp/life-insurance wizard load
- [ ] Lead fires when contact info is submitted
- [ ] CompleteRegistration fires only after OTP verified — not before
- [ ] Conversions API wired to server-side lead submission endpoint
- [ ] UTM dynamic parameters applied to destination URL on every ad
- [ ] All 3 events verified in Meta Events Manager before going live
- [ ] Custom conversion created in Meta: CompleteRegistration = qualified lead event
- [ ] Customer list (existing Supabase leads, hashed) uploaded as exclusion audience
- [ ] Privacy policy updated with one sentence covering suppression use of submitted contact data

---

## 8. Landing Page — /lp/life-insurance.html

The existing redirect wizard is replaced with a full 10-step qualification wizard. The existing /lp/whole-life.html stays live and unchanged for organic/direct traffic.

### Wizard Flow

| Step | Type | Question | Field |
|---|---|---|---|
| 1 | Dropdown | What state do you live in? | state |
| 2 | Number | What is your age? | age |
| 3 | Choice | Who are you getting this coverage for? | coverage_for |
| 4 | Choice | What type of coverage are you looking for? | coverage_type |
| 5 | Choice | What's your main reason for looking? | main_reason |
| 6 | Choice | How would you describe your overall health? | health |
| 7 | Choice | Do you currently use tobacco products? | tobacco |
| 8 | Choice | When would you like to speak with a licensed agent? | contact_timing |
| 9 | Contact Capture | Where should the licensed agent reach you? | first_name, last_name, email, phone + TCPA |
| 10 | OTP | Let's verify your phone number | otp_verified |
| ✓ | Done | Review submitted — Andrew will reach out within 24 hours | — |

**Step 3 choices:** Myself · My spouse / partner · My children · Other
**Step 4 choices:** Term Life · Whole Life · IUL / Cash Value Life · Final Expense · Not sure yet
**Step 5 choices:** Protect my family · Cover mortgage / debt · Leave money behind · Cover final expenses · Build long-term protection · Not sure yet
**Step 6 choices:** Great · Fair · Poor
**Step 7 choices:** No · Yes
**Step 8 choices:** As soon as possible · This week · Within a month · Just looking around

**Step 9 — Contact Capture:** New combined step type (`contactCapture`) in lp-wizard.js capturing full name + email + phone on one screen with TCPA consent language displayed before submit button.

**State validation:** All states collect leads. No filtering or rejection based on state. Andrew reviews state on his end.

**OTP:** Existing OTP flow unchanged. CompleteRegistration pixel event fires here.

---

## 9. Lead Data Schema — Supabase

### New Columns (Migration Required — All Nullable)

| Column | Type | Source | Notes |
|---|---|---|---|
| state | text | Wizard step 1 | Two-letter state code |
| age | integer | Wizard step 2 | |
| coverage_for | text | Wizard step 3 | self, spouse, children, other |
| product_interest | text | Wizard step 4 | **Key segmentation field** — named `product_interest` to avoid collision with existing `coverage_type` column (which stores 'Whole Life Insurance' from old wizard) |
| main_reason | text | Wizard step 5 | |
| health | text | Wizard step 6 | great, fair, poor |
| tobacco | boolean | Wizard step 7 | |
| contact_timing | text | Wizard step 8 | immediately, this_week, within_a_month, just_looking |

### UTM / Source Fields (New — All Nullable)

| Column | Type | Source |
|---|---|---|
| landing_page_url | text | Captured at wizard load |
| query_string | text | Full raw query string |
| utm_source | text | Parsed from query string |
| utm_medium | text | Parsed from query string |
| utm_campaign | text | Parsed from query string |
| utm_adset | text | Parsed from query string |
| utm_content | text | Parsed — includes ad name + placement |
| utm_term | text | Parsed — publisher platform |

### Existing Fields (Unchanged)

`first_name`, `last_name`, `email`, `phone`, `otp_verified`, `otp_verified_at`, `source_page`, `coverage_type` (existing — retains old value 'Whole Life Insurance' for legacy whole-life leads; new field is `product_interest`), `created_at`

### Pipeline Fields (Post-Lead — Supabase as Source of Truth)

| Column | Type | Updated by |
|---|---|---|
| contacted | boolean | Andrew |
| contacted_at | timestamp | Andrew |
| booked_call | boolean | Andrew |
| booked_at | timestamp | Andrew |
| showed | boolean | Andrew |
| showed_at | timestamp | Andrew |
| qualified | boolean | Andrew |
| quoted | boolean | Andrew |
| premium_amount | numeric | Andrew |
| sold | boolean | Andrew |
| sold_at | timestamp | Andrew |
| reason_unqualified | text | Andrew |
| lead_status | text | Enum: new, contacted, booked, showed, qualified, quoted, sold, unqualified |

---

## 10. Post-Lead Quality Tracking

Supabase is the source of truth for all post-lead pipeline stages. UTM fields in the lead record link every stage outcome back to Meta campaign → ad set → ad → creative → placement.

**Analysis queries needed:**
- Cost per OTP-verified lead by campaign / ad set / ad / placement
- Contact rate by campaign / ad set / placement
- Booked call rate by coverage_type (wizard answer)
- Qualified rate by coverage_type, health, tobacco, age range
- Cost per qualified lead by campaign / ad set
- Cost per sale by campaign / ad set / creative

**Benchmark — vendor lead comparison:** Once 30+ sales data points exist, compare cost per sale from Meta leads vs. vendor-purchased leads. This is the primary justification for the campaign ROI.

---

## 11. Metrics Framework

### Primary Metrics (Decision-Grade)
1. Cost per OTP-verified lead (CompleteRegistration)
2. Contact rate
3. Booked call rate
4. Qualified rate
5. Cost per qualified lead
6. Cost per sale

### Secondary Metrics (Diagnostic Only)
- CPL (raw) — volume signal, not quality signal
- CTR — creative performance indicator
- Cost per wizard start (ViewContent)
- Wizard completion rate (Lead → CompleteRegistration)
- Video view rate + hook retention (first 2 sec vs 15 sec)

### Placement-Specific Metrics
Break all metrics above by placement (via utm_content {{placement}} macro) to identify which placements produce qualified conversations, not just form fills.

---

## 12. Implementation Phases

### Phase 1 — Tracking + Landing Page (Before Launch)
1. Install Meta Pixel base code on all pages
2. Add ViewContent, Lead, CompleteRegistration events to /lp/life-insurance wizard
3. Wire Conversions API to server-side lead submission
4. Rebuild /lp/life-insurance.html as 10-step qualification wizard
5. Add new step type `contactCapture` (name + email + phone + TCPA) to lp-wizard.js
6. Run Supabase migration — add 29 new nullable columns: 8 wizard fields (state, age, coverage_for, product_interest, main_reason, health, tobacco, contact_timing) + 8 UTM fields + 13 pipeline fields (contacted, contacted_at, booked_call, booked_at, showed, showed_at, qualified, quoted, premium_amount, sold, sold_at, reason_unqualified, lead_status). All nullable so existing whole-life lead records are not broken.
7. Capture UTM parameters from query string and store in lead record at submission
8. Verify all events in Meta Events Manager
9. Add suppression sentence to privacy policy
10. Upload existing lead list to Meta as customer exclusion audience

### Phase 2 — Campaign Launch (Day 1)
1. Create Campaign 1 (Legacy Broad) and Campaign 2 in Meta Ads Manager
2. Build Ad Set 2 (Financial Interests) and Ad Set 3 (Soft Protection)
3. Upload all creative assets (video 9:16 master, video 4:5, static 4:5, static 9:16)
4. Apply UTM dynamic parameters to destination URL on every ad
5. Set Advantage+ Placements — confirm placement-specific assets are mapped
6. Go live — monitor Events Manager for first 24 hours

### Phase 3 — Retargeting + Optimisation (Day 7–14)
1. Check wizard visitor pool size — launch Ad Set 1 (Retargeting) when >1,000
2. Upload retargeting video cut (10–15 sec, warm audience version)
3. Day 14 review — creative performance, CPL, CompleteRegistration cost
4. Bid strategy evaluation — consider cost cap if Phase 1 data supports it

### Phase 4 — Scale + Lookalike (Day 30+)
1. Full campaign review — all 4 ad sets, all placements
2. Budget reallocation based on cost per qualified lead data
3. Build 1–3% Lookalike from CompleteRegistration events (if 50+ events)
4. Launch Lookalike as a 5th ad set
5. Begin vendor lead cost comparison analysis
