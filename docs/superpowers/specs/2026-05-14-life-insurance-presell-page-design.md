# Design Spec: Life Insurance Pre-Sell Landing Page

**Date:** 2026-05-14  
**Status:** Approved

---

## Problem

Meta ads for Engel Financial Group send traffic directly to the 10-step qualification wizard at `/lp/life-insurance`. 96 visitors landed; 0 converted. The wizard asks for personal info (name, phone, OTP) with no trust context preceding it — cold traffic has no reason to comply.

**Goal:** Insert a pre-sell trust page between the ad and the wizard that builds credibility, demonstrates social proof, answers objections, and closes with a clear CTA into the wizard. Match the structure of the reference landing page (LegacyFinancial style) with Engel Financial Group branding.

---

## URL Strategy — Approach A (approved)

- **Current wizard** `lp/life-insurance.html` → **renamed** to `lp/life-insurance-form.html`
- **New presell page** → `lp/life-insurance.html` (same URL ads already point to — no Ads Manager changes)
- **CTA on presell** → links to `/lp/life-insurance-form.html` (with UTM params passed through via JS)
- **Meta Pixel:** PageView fires on the presell page (good for retargeting). ViewContent, Lead, CompleteRegistration still fire inside the wizard at `life-insurance-form.html`.
- **Wizard `source_page`:** Update from `/lp/life-insurance` → `/lp/life-insurance-form` inside `life-insurance-form.html`

---

## Additional Tasks in Same Implementation

### 1. Remove .html from URLs (Vercel)
Add `vercel.json` at project root:
```json
{
  "cleanUrls": true
}
```
This strips `.html` from all deployed URLs and sets up 301 redirects from the old `.html` paths. All internal links (`/privacy-policy.html`, etc.) continue to work — Vercel resolves both forms.

### 2. Vercel Analytics Inspection
Not implementable without access to the live URL. User must share the deployed domain so we can `fetch` the page source and inspect what Vercel injected. Deferred.

---

## Presell Page — Section-by-Section Spec

### File
`lp/life-insurance.html` (new file — presell)

### Styling
- Standalone HTML page — does NOT use `wizard.css` or `styles.css` (those are for the wizard shell and main site respectively)
- All styles inline in `<style>` block in `<head>`
- Brand tokens: `--navy: #111d2b`, `--gold: #b87333`, `--warm-white: #fbf3da`
- Fonts: Cormorant Garamond (headings) + Jost (body) via Google Fonts CDN
- Mobile-first, single-column on mobile, max-width 680px centered on desktop

### Meta Pixel
- Same pixel base code as current `life-insurance.html` — copy verbatim (Pixel ID `1273293374914132`, PageView on load)
- No wizard events (ViewContent/Lead/CompleteRegistration) — those stay in the wizard

---

### Section 1: Header
```
[EFG logo]                    PREFER TO TALK?
                               (501) 691-5508
```
- Logo: `brand_assets/engel-financial-group.jpg`, links to `/`
- Phone: `tel:+15016915508`, styled as two-line block (label + number)
- Background: white, subtle bottom border
- Sticky on desktop

---

### Section 2: Hero
```
[ FREE · NO OBLIGATION · 5 MINUTES ]   ← pill badge, navy bg, gold text

Life Insurance Protection
In Minutes                              ← Cormorant Garamond, ~44px, navy

✅ Covers illness, disability & death
✅ Access 14 top carriers instantly
✅ No medical exam required for many plans

[ Check My Options → ]                 ← gold CTA button, full-width on mobile

★★★★★  4.9  rated by families nationwide
```
- Badge: small pill with `FREE · NO OBLIGATION · 5 MINUTES`
- H1: Two lines, Cormorant Garamond, `font-weight: 700`, `letter-spacing: -0.02em`
- Bullets: gold checkmark icon + Jost text
- CTA button: gold (`#b87333`) background, white text, `border-radius: 8px`, `padding: 18px 40px`, arrow `→`
- Star rating: gold stars + bold "4.9" + muted "rated by families nationwide"
- Thin divider line below hero
- CTA `href`: `/lp/life-insurance-form` + UTM passthrough (see JS section)

---

### Section 3: Carriers Strip
```
─────────────────────────────────────────────
        Easily compare options from
           leading carriers
[ Transamerica ] [ Foresters ] [ Mutual of Omaha ]
[ SBLI ] [ F&G ] [ Aetna ] [ Corebridge Financial ]
─────────────────────────────────────────────
```
- Background: `#111d2b` (navy)
- Heading: white, Jost, `font-size: 15px`, `font-weight: 600`, uppercase letter-spacing
- Carrier logos are now available as real image files in `brand_assets/carriers/`: `transamerica.png`, `foresters-financial.svg`, `mutual-of-omaha.svg`, `sbli.png`, `fg.png`, `aetna.svg`, `corebridge.jpg`
- Render as `<img>` tags with `alt` text for each carrier
- CSS treatment for dark navy background: `filter: brightness(0) invert(1); opacity: 0.85` — converts all pixels to white, creating clean white logo silhouettes on the navy strip
- Layout: flex-wrap row, centered, gap 24px, each logo constrained to `height: 32px; width: auto`
- Mobile: wraps to 2–3 per row naturally

---

### Section 4: Pain Section
```
Protect your home and family
from the unexpected...

  🛡 Diagnosis of a Critical Illness
  ⚡ Becoming Disabled from Illness/Injury  
  💙 Passing Away

─────────────────────────────────────────────
  [ 54% ]        [ 81% ]
 FORECLOSURES  BANKRUPTCIES
─────────────────────────────────────────────

Medical crises often cause
financial crises

Studies show that up to 54% of home foreclosures
and more than 81% of personal bankruptcies are
linked to medical debt from illness or injuries.
```
- Left column: heading + 3 risk items with colored icon chips (circle badges)
- Right column (desktop) / below (mobile): the stats + explanatory copy
- Stats boxes: bold large number (Cormorant Garamond, ~48px), label below, contrasting background tile
- The 54%/81% stats are sourced from real industry data and match the reference exactly

---

### Section 5: Social Proof / About
```
  [EFG Logo]
  Independent Broker · Licensed in 15 States
  
  Access to 14 top-rated carriers · No carrier bias
  Offering affordable coverage nationwide
```
- Background: `#111d2b` (dark navy) — same as reference
- Logo: `brand_assets/engel-financial-group.jpg` (white bg version), displayed white/inverted
  - Use `engel-financial-group-trasnarent.png` if cleaner on dark bg
- Trust line 1 (bold): "Independent Broker · Licensed in 15 States"
- Trust line 2 (muted): "Access to 14 top-rated carriers · No carrier bias"  
- Trust line 3: "Offering affordable coverage nationwide"
- Layout: centered, stacked, logo on top

---

### Section 6: FAQ
```
Frequently Asked Questions
─────────────────────────────

▼ What is life insurance and why do I need it?
  Life insurance provides a tax-free payout to your beneficiaries
  if you pass away, ensuring your family can maintain their home,
  pay off debts, and cover everyday expenses without financial hardship.

▼ How much does life insurance cost?
  Costs vary based on your age, health, coverage amount, and policy
  type. Many healthy adults qualify for coverage starting under $30/month.
  A licensed advisor will walk you through options that fit your budget.

▼ Do I need a medical exam to qualify?
  Not always. Many carriers offer simplified-issue or no-exam policies,
  especially for term and final expense coverage. Your advisor will
  identify which options you may qualify for without an exam.

▼ Can I still qualify if I have a health condition?
  Yes, in many cases. As an independent broker, we work with 14 carriers
  and can match you with plans designed for various health profiles.
  A short review helps us find what fits your situation.

▼ How does the free review work?
  Answer a few short questions (about 5 minutes). A licensed advisor
  from Engel Financial Group will then reach out personally to walk
  through your options — no obligation, no pressure.

[ GET MY FREE REVIEW ]   ← same gold CTA button
```
- FAQ items: accordion, pure CSS (checkbox hack) or minimal JS
- Chevron rotates on open
- "GET MY FREE REVIEW" CTA below the list — same gold button, full-width on mobile
- CTA `href`: same `/lp/life-insurance-form` + UTM passthrough

---

### Section 7: Footer
```
© 2026 Engel Financial Group. All rights reserved.
Licensed insurance professional. Not affiliated with any government agency.
Privacy Policy · Terms of Service · TCPA Compliance
```
- Same footer copy as current `life-insurance.html`
- Links: `/privacy-policy`, `/terms-of-service`, `/tcpa-compliance` (clean URLs, no .html)

---

## UTM Passthrough (JS)

The CTA button must forward UTM params from the presell URL to the wizard URL so Supabase attribution is preserved.

```js
// In presell page inline <script>
(function() {
  var search = window.location.search;
  var links = document.querySelectorAll('a[data-utm-passthrough]');
  links.forEach(function(link) {
    if (search) link.href = link.href.split('?')[0] + search;
  });
})();
```

All CTA anchor tags get `data-utm-passthrough` attribute. Base `href="/lp/life-insurance-form"`.

---

## Wizard File Changes (`lp/life-insurance-form.html`)

This is a rename + one-line edit of the current `life-insurance.html`:
1. File renamed from `life-insurance.html` → `life-insurance-form.html`
2. `source_page` in the `lpWizard.init()` config updated: `'/lp/life-insurance'` → `'/lp/life-insurance-form'`
3. No other changes — wizard logic, steps, OTP, CAPI all unchanged

---

## `vercel.json`

New file at project root:
```json
{
  "cleanUrls": true
}
```

---

## Files Changed

| Action | File |
|---|---|
| NEW | `lp/life-insurance.html` (presell page) |
| RENAME | `lp/life-insurance.html` → `lp/life-insurance-form.html` (wizard) |
| EDIT | `lp/life-insurance-form.html` — update `source_page` value |
| NEW | `vercel.json` |

---

## What Does NOT Change

- Ads Manager destination URL (stays `/lp/life-insurance`) — no change needed
- Meta Pixel ID and events architecture — unchanged
- Supabase columns and API — unchanged
- All other LP wizard pages — unchanged
- Main site `styles.css` and nav — unchanged
