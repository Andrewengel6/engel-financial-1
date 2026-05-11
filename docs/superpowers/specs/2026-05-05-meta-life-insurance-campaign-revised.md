# Meta Life Insurance Campaign — Revised Spec (Special Ad Category Compliant)
**Date:** 2026-05-05
**Author:** Andrew Engel / Engel Financial Group
**Status:** Approved — Ready for Creative Production and Ads Manager Setup
**Supersedes:** 2026-05-04-meta-life-insurance-campaign-design.md

---

## 1. Campaign Overview

**Goal:** Generate exclusive, high-quality life insurance leads through Meta (Facebook/Instagram) ads. Leads flow through a 10-step qualification wizard with OTP phone verification. A licensed advisor (Andrew Engel) follows up within 24 hours.

**Product scope:** Broad life insurance funnel — term, whole life, IUL, final expense. Product discovery happens inside the wizard. Ads are not product-specific.

**Weekly budget:** $1,000/week (~$143/day)
**Licensed states:** AR, FL, IA, KS, MI, MN, MO, MT, NC, OH, OK, SC, TN, TX, VA (15 states)
**Landing page:** `/lp/life-insurance.html` (10-step qualification wizard, live)
**Primary metric:** Cost per OTP-verified lead, traced to cost per qualified lead and cost per sale

**Special Ad Category:** Financial Products and Services — declared on every campaign. Mandatory per Meta policy as of January 21, 2025 for insurance advertising in the US. Non-declaration is a policy violation.

**Targeting philosophy:** The Special Ad Category restricts age narrowing, detailed interests, and lookalike audiences. Creative, the wizard, and OTP verification do the qualifying — not audience filters. Broad targeting + strong creative is the compliant and correct approach.

**Funnel summary:**
Ad (broad life insurance intent) → Wizard (product discovery + qualification) → OTP (real lead filter) → Andrew (licensed-agent follow-up within 24h)

---

## 2. Special Ad Category Restrictions — What Changed

These restrictions are confirmed and apply to every campaign and ad set:

| Targeting Parameter | Old Plan | Compliant Plan |
|---|---|---|
| Age | 35–65 | 18–65+ (locked by Meta — no narrowing allowed) |
| Gender | All | All (required — cannot exclude) |
| Detailed interests | Financial planning, homeownership, parenting, etc. | Not relied upon — interests are limited/uncertain under this category |
| Lookalike audiences | Week 4+ standard 1–3% lookalike | Removed — not available under Financial Products and Services |
| Special Ad Audiences | Planned as lookalike replacement | Discontinued — not available |
| Location | State-level | State-level allowed; ZIP code exclusions not allowed |
| Customer list exclusions | Planned from Supabase | Uncertain — must be verified in Ads Manager before launch |
| Pixel-based retargeting | Planned | Still allowed — verify in Events Manager |
| Pixel events (Lead, CompleteRegistration) | Verified working | Confirm no domain restriction notice in Events Manager before launch |

---

## 3. Budget Structure

### Week 1 — Launch (Total: $1,000/week)

| Campaign | Purpose | Budget |
|---|---|---|
| Campaign 1 — Broad Scale | Advantage+ broad, Family Protection + Coverage Options | $700/week (~$100/day) |
| Campaign 2 — Message Tests | 4 angle ad sets, same broad audience | $300/week (~$43/day) |
| Retargeting | Not live — warm pool not yet built | $0 |
| **Total** | | **$1,000/week** |

### Week 2+ — Retargeting Launch (Total: $1,000/week)
*Condition: warm pool must exceed 1,000 people before retargeting goes live. Check Meta audience size before activating.*

| Campaign | Purpose | Budget |
|---|---|---|
| Campaign 1 — Broad Scale | Unchanged | $700/week (~$100/day) |
| Campaign 2 — Message Tests | Reduced to fund retargeting | $150/week (~$21/day) |
| Retargeting | Warm pool — wizard visitors who did not complete OTP | $150/week (~$21/day) |
| **Total** | | **$1,000/week** |

---

## 4. Campaign Architecture

### Campaign 1 — Broad Life Insurance Scale

- **Special Ad Category:** Financial Products and Services (declared)
- **Objective:** Website Conversions → CompleteRegistration
- **Audience:** Advantage+ (Meta-optimized, broad)
- **Age:** 18–65+ (Meta-locked — no narrowing)
- **Gender:** All (required)
- **Geo:** AR, FL, IA, KS, MI, MN, MO, MT, NC, OH, OK, SC, TN, TX, VA
- **Language:** English
- **Bid strategy:** Lowest cost for Days 1–14. Evaluate cost cap only after sufficient conversion volume (see Section 8 — Decision Rules)
- **Placements:** Advantage+ Placements (upload placement-specific assets — see Section 6)
- **Creative:** 3–5 variations across Family Protection/Legacy and Coverage Options angles
- **Exclude:** Existing OTP-verified leads via customer list (verify allowed — see Section 7) and/or pixel CompleteRegistration event audience
- **Budget:** $700/week

---

### Campaign 2 — Creative/Message Tests

- **Special Ad Category:** Financial Products and Services (declared)
- **Objective:** Website Conversions → CompleteRegistration
- **Audience:** Same Advantage+ broad as Campaign 1 — same compliant audience on all ad sets
- **Age:** 18–65+
- **Gender:** All
- **Geo:** Same 15 states
- **Language:** English
- **Structure:** 4 ad sets, each testing a different message angle — not different audiences
- **Budget:** $300/week (Week 1) → $150/week (Week 2+ when retargeting launches)

**Ad Set A — Family Protection / Legacy**
- Angle: Legacy, leaving something behind, family certainty
- Copy: V1 and V2 from Section 5
- Budget: ~$75/week (Week 1) → ~$37/week (Week 2+)

**Ad Set B — Coverage Options / Not Sure What You Need**
- Angle: Curiosity-driven, option-awareness, no product commitment required
- Copy: V1 and V2 from Section 5
- Budget: ~$75/week (Week 1) → ~$37/week (Week 2+)

**Ad Set C — Mortgage/Homeowner Protection**
- Angle: Income protection framed around the home and obligations
- Copy: V1 from Section 5
- Note: This tests wording only — not interest-based targeting
- Budget: ~$75/week (Week 1) → ~$38/week (Week 2+)

**Ad Set D — Family Peace of Mind**
- Angle: Warm, non-fear-based, "your family knows what happens next"
- Copy: V1 and V2 from Section 5
- Budget: ~$75/week (Week 1) → ~$38/week (Week 2+)

---

### Retargeting — Launch Week 2+ (Conditional)

- **Special Ad Category:** Financial Products and Services (declared)
- **Objective:** Website Conversions → CompleteRegistration
- **Launch condition:** Warm pool must exceed 1,000 people. Check Meta audience size before activating. If pool is under 1,000 at Day 7, wait until Day 14.
- **Audience (pixel-based — still allowed under this category):**
  - Landing page visitors (/lp/life-insurance) — 30-day window
  - Wizard starters (ViewContent event) — 30-day window
  - Ad clickers — 30-day window
  - 50%+ video viewers — 30-day window
  - Facebook/Instagram page engagers — 60-day window
- **Exclude:** CompleteRegistration pixel audience (OTP-verified leads) + customer list if allowed
- **Frequency cap:** Max 3 impressions/person/week
- **Creative:** Separate 10–15 sec retargeting cut only — do not reuse cold traffic creative
- **Budget:** $150/week

---

## 5. Ad Copy

**Formula applied to every ad:** Strong hook → Emotional reason to care → Safe policy explanation → Licensed agent CTA

**Compliance rules:**
- No product-specific guarantees in cold ad copy
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
| See What Fits Your Family | Family Peace of Mind and Homeowner ad sets |
| Complete Your Review | Retargeting only |

Never use: "Get a Quote," "See Your Rate," "Instant Quote" — the wizard does not produce automated pricing.

---

### Angle 1 — Family Protection / Legacy (Campaign 1 + Ad Set A)

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

### Angle 2 — Coverage Options (Campaign 1 + Ad Set B)

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

---

### Angle 3 — Mortgage / Homeowner Protection (Ad Set C)

**V1**
> Hook: If your family depends on your income, your plan should not be temporary by accident.
> Emotion: Many people don't realise their coverage has an end date until it's too late to change it easily. Reviewing your options now takes less than 5 minutes.
> Safe: Life insurance options vary by type, coverage length, and cost. Subject to approval and individual circumstances.
> CTA: See what may fit your family. A licensed advisor from Engel Financial Group will reach out after your short review — no obligation.
> Button: See What Fits Your Family

---

### Angle 4 — Family Peace of Mind (Ad Set D)

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

### Angle 5 — Retargeting (Week 2+ Only)

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

**Retargeting creative requirement:** 10–15 seconds only. No cold-traffic intro. Opens directly: "Still thinking about protecting your family? Finish your review." Do not reuse cold traffic creative for retargeting.

---

## 6. Creative Formats

### Video

| Format | Dimensions | Role | Placements |
|---|---|---|---|
| 9:16 | 1080 × 1920 | Master | IG Reels, FB Reels, IG Stories, FB Stories |
| 4:5 | 1080 × 1350 | Feed adapted | IG Feed, FB Feed |

Do not upload only a square or landscape asset and let Meta auto-crop into 9:16. This destroys the hook frame and pushes critical text into UI zones.

### Static

| Format | Dimensions | Role | Placements |
|---|---|---|---|
| 4:5 | 1080 × 1350 | Primary static | IG Feed, FB Feed |
| 9:16 | 1080 × 1920 | Stories/Reels backup | IG Stories, FB Stories |

### Retargeting Video (Separate Cut)
- 9:16 only, 10–15 seconds
- Same avatar/brand, no cold-traffic build-up
- Opens directly on hook

### Creative Requirements — All Video
1. Hook line on screen and spoken within first 2 seconds
2. Captions required (85% of Reels watched without sound)
3. AI avatar — talking-head, mid-40s, professional casual, neutral background, direct eye contact
4. Engel Financial Group name or logo visible within first 3 seconds (lower-third or watermark)
5. CTA spoken + on-screen in final 3 seconds — "Start your free review" or "Check your options in 5 minutes"
6. Safe zones: no critical text in bottom 250px, top 150px, or within 50px of left/right edges on 9:16
7. Agent follow-up pre-framed spoken or on-screen: "After your review, a licensed advisor from Engel Financial Group will reach out to walk through your options."
8. Length: 15–30 sec for cold traffic, 10–15 sec for retargeting only

### Placements
Use Advantage+ Placements. Upload 9:16 master for Reels/Stories and 4:5 adapted version for Feed. Meta selects the right asset per placement automatically.

---

## 7. Pre-Launch Verification Checklist

Complete all items before campaigns go live. Do not launch until every item is confirmed.

### Special Ad Category
- [ ] Financial Products and Services declared on Campaign 1
- [ ] Financial Products and Services declared on Campaign 2
- [ ] Financial Products and Services declared on Retargeting campaign (when built)
- [ ] Age confirmed as 18–65+ on all ad sets (not narrowed)
- [ ] Gender confirmed as All on all ad sets

### Pixel and CAPI Verification (Events Manager)
- [ ] No domain restriction notices on the Pixel in Events Manager
- [ ] CompleteRegistration fires only after OTP is verified — not at form submission or phone entry
- [ ] Lead fires when contact info is submitted (name/email/phone step)
- [ ] ViewContent fires on /lp/life-insurance wizard load
- [ ] PageView fires on all pages
- [ ] CAPI CompleteRegistration fires server-side with matching event_id (deduplication confirmed)
- [ ] UTM parameters captured in Supabase lead records (verify via test submission)

### Customer List Exclusions
- [ ] Open Ads Manager under Financial Products and Services category — verify customer list custom audience upload is available
- [ ] If allowed: upload hashed phone + hashed email only (no health, underwriting, or financial data)
- [ ] Certify compliance in Meta if required during upload flow
- [ ] If not allowed: use pixel CompleteRegistration event audience as exclusion backstop

### Retargeting Audience (Before Week 2 Launch)
- [ ] Check warm pool audience size in Meta — do not launch if under 1,000 people
- [ ] Confirm pixel-based custom audiences are building (ViewContent, ad clickers, video viewers)

### UTM Parameters
Apply these to the destination URL on every ad in Meta Ads Manager:
```
utm_source=meta
utm_medium=paid_social
utm_campaign={{campaign.name}}
utm_adset={{adset.name}}
utm_content={{ad.name}}_{{placement}}
utm_term={{site_source_name}}
```
- [ ] UTM dynamic parameters applied to destination URL on every ad — no hardcoded values

### Copy and Compliance
- [ ] All ad copy reviewed against TX DOI advertising guidelines
- [ ] All ad copy reviewed against FL DOI advertising guidelines
- [ ] No prohibited language in any ad (guaranteed, investment, wealth, borrow from yourself, guaranteed returns, instant quote, get a quote, see your rate)
- [ ] Agent follow-up language present in every ad
- [ ] Privacy policy suppression disclosure confirmed live

---

## 8. Decision Rules and Optimization Timeline

### Bid Strategy
- **Days 1–14:** Lowest cost bid on all campaigns. Do not touch bid strategy during the learning phase.
- **Day 14+:** Evaluate cost cap only if all three conditions are met:
  1. Campaign has exited the learning phase (50+ CompleteRegistration events in a recent 7-day window)
  2. Cost per OTP-verified lead is stable (not still declining)
  3. Cost per qualified lead data exists from at least 20 qualified conversations
- **Cost cap level:** Set at ~1.5× the Day 14 cost per OTP-verified lead — not based on raw CPL
- **Never:** Evaluate cost cap on raw CPL, CTR, or impressions alone

### Lookalike Audiences
Standard lookalike audiences are not available under Financial Products and Services Special Ad Category. Do not plan a lookalike expansion. If Meta releases a compliant equivalent in future, evaluate then.

### Performance Reviews

**Day 14 — First Review**
- Compare cost per OTP-verified lead across Campaign 1 and all Campaign 2 ad sets
- Compare contact rate by ad set (tracked in Supabase via UTM fields)
- Creative performance: hook retention rate, CTR, video view rate
- Action: pause lowest-performing ad set creative, not the whole ad set
- No structural campaign changes before Day 14

**Day 30 — Full Review**
- Full funnel: CPL → contact rate → booked call rate → qualified rate → cost per qualified lead
- Budget reallocation: shift toward ad sets showing highest cost per qualified lead performance
- Campaign 2 ad set evaluation: retain top 2 angles, pause bottom 2 if budget permits scaling the winners

**Week 2 — Retargeting Launch**
- Check warm pool size before activating
- Monitor frequency — cap at 3 impressions/person/week
- Evaluate retargeting separately: cost per OTP-verified lead from warm pool vs. cold

### Evaluation Framework
Never judge ad sets on CPL alone. Always evaluate on this full funnel:

Cost per OTP-verified lead → Contact rate → Booked call rate → Qualified rate → Cost per qualified lead → Cost per sale

UTM fields in Supabase (`utm_campaign`, `utm_adset`, `utm_content`) link every stage back to campaign → ad set → ad → placement.

### Placement Evaluation
- If Reels produces cheaper leads but lower contact + qualified rate than Feed: reduce Reels, shift to Feed
- If video costs more per OTP-verified lead but produces better booked call rate: video may still win on cost per qualified lead
- First placement review at Day 14. Do not restructure before then.

---

## 9. What Is Explicitly Removed from the Old Plan

| Item | Status | Reason |
|---|---|---|
| Age filter 35–65 | Removed | Locked to 18–65+ under Special Ad Category |
| Interest-based ad sets (financial planning, retirement, homeownership, parenting, etc.) | Removed as primary structure | Limited/restricted under Special Ad Category; creative does the qualifying instead |
| Standard 1–3% Lookalike audience (Week 4+) | Removed | Not available under Financial Products and Services |
| Special Ad Audiences | Removed | Discontinued |
| Retargeting at launch (Day 1) | Deferred to Week 2+ | Warm pool must be built first |
| Meta Instant Forms | Not used | Website wizard + OTP is the funnel — wizard includes qualification steps (health, tobacco) that require the site |
| Cost cap evaluation on CPL | Removed | Cost cap evaluated on cost per OTP-verified lead only, and only after learning phase exits |

---

## 10. Funnel and Tracking Architecture (Unchanged)

### Wizard Flow (/lp/life-insurance)
State → Age → Coverage For → Product Interest → Main Reason → Health → Tobacco → Contact Timing → Contact Capture (name+email+phone+TCPA) → OTP → Done

### Pixel Event Map

| Event | Trigger | Purpose |
|---|---|---|
| PageView | Auto — every page load | Base signal |
| ViewContent | Wizard page loads at /lp/life-insurance | Funnel entry / retargeting seed |
| Lead | Contact info submitted (name/email/phone step) | Contact capture signal |
| CompleteRegistration ★ | OTP verified — wizard fully complete | **Optimization target** |

CompleteRegistration must fire only after OTP is verified. This is the campaign's conversion signal.

### CAPI
Server-side CompleteRegistration fires after successful Supabase insert. Includes `event_id` matching the browser pixel's UUID for deduplication. Hashes email (SHA-256, lowercase trim) and phone (digits only, SHA-256).

### UTM Tracking
All wizard answers, UTM fields, and pipeline stages tracked in Supabase. Every lead record links back to campaign → ad set → ad → placement via `utm_content` (ad name + placement macro).

---

## 11. Launch Sequence

### Day 1
1. Complete pre-launch verification checklist (Section 7)
2. Upload creative assets — video 9:16 master, video 4:5, static 4:5
3. Build Campaign 1 in Ads Manager — declare Special Ad Category, Advantage+ audience, 18–65+, 15 states
4. Build Campaign 2 in Ads Manager — 4 ad sets (Angles A/B/C/D), same audience settings
5. Apply UTM dynamic parameters to destination URL on every ad
6. Set Advantage+ Placements — confirm placement-specific assets are mapped
7. Set total daily budget: ~$143/day across both campaigns
8. Go live — monitor Events Manager for first 24 hours

### Day 7–10
1. Check warm pool size in Meta audience dashboard
2. If warm pool > 1,000: build Retargeting campaign, upload retargeting video, launch
3. Adjust Campaign 2 budget to $150/week to free up $150/week for Retargeting (total stays $1,000/week)
4. If warm pool < 1,000: wait until Day 14 check

### Day 14
1. First performance review — CPL, cost per OTP-verified lead, contact rate, hook retention
2. Pause lowest-performing creative variations
3. Evaluate bid strategy eligibility (see Section 8)
4. Do not make structural campaign changes

### Day 30
1. Full funnel review
2. Budget reallocation decisions
3. Campaign 2 angle winners identified — scale budget toward top 2 ad sets
