# Phase 2 — Homepage Edits Design Spec
Date: 2026-04-29

## Overview

Seven changes to `index.html`: four bug fixes and three new sections. Page structure is extended but no existing sections are removed.

---

## Final Page Structure (order)

1. Nav
2. Hero + Lead Form
3. Stats Bar
4. Pain Section
5. Solution Section
6. **NEW — Independent Broker vs Captive Agent**
7. Benefits Grid ("What Sets This Coverage Apart")
8. **NEW — Why Choose Andrew**
9. How It Works
10. Testimonials
11. **NEW — Schedule a Call**
12. CTA Band
13. Footer

---

## Bug Fix 1 — Logo Size

**File:** `index.html` (nav), `styles.css`

The `.logo-img` in the nav is too small and zoomed out. Increase max-height to `44px`. The logo anchor (`.logo`) should be vertically centered in the nav. No other nav changes.

---

## Bug Fix 2 — Phone Number

**File:** `index.html`

Replace every instance of `(800) 555-1234` and `+18005551234` with:
- Display: `(501) 691-5508`
- `href`: `tel:+15016915508`

Locations: desktop nav phone link, mobile menu phone link. Both must be updated.

---

## Bug Fix 3 — Nav Dropdown Hover Gap

**File:** `styles.css`

The dropdown menu disappears when the user moves the cursor from the trigger button down to the menu items, because there is a gap that triggers `mouseleave`. Fix by adding `padding-top: 8px` to `.nav-dropdown-menu` and a matching negative `margin-top: -8px` (or an invisible pseudo-element bridge on the trigger) so the hover area is continuous with no gap.

---

## Bug Fix 4 — Solution Card Stack Overlap

**File:** `index.html` (inline styles on `.sol-card-1`, `.sol-card-2`, `.sol-card-3`)

The three absolutely-positioned cards in `.solution-card-stack` overlap each other. Recalculate `top` values so each card is visually separated:
- `.sol-card-1`: `top: 0`
- `.sol-card-2`: `top: 160px`
- `.sol-card-3`: `top: 320px`

Adjust `.solution-card-stack` height to `520px` to accommodate the new offsets. Verify no cards are clipped.

---

## New Section 1 — Independent Broker vs Captive Agent

**Placement:** After Solution section, before Benefits section.

**HTML id:** `broker-advantage`

**Background:** `var(--off-white)` — `#F5F3EF`

**Padding:** `100px 0`

### Content

**Eyebrow:** "The Advantage"

**Headline:** "Independent Broker vs. Captive Agent — Here's the Difference"

**Intro paragraph:**
> "Not all insurance agents work the same way — and that difference has a direct impact on your rate and your options. As an independent broker, I have access to 40–50+ A-rated carriers, which means I can shop the market and find you the best coverage at the best price. Captive agents are locked into one company's products. I work for you, not the carrier."

**Comparison Table (4 rows):**

| Feature | Engel Financial (Independent) | Captive Agent |
|---|---|---|
| Carriers available | 40–50+ A-rated carriers | 1 company only |
| Shops the market for you | ✓ Yes — compares all options | ✗ Cannot compare outside products |
| Who they work for | You, the client | The insurance company |
| Rate & coverage flexibility | Best available rate through competition | Limited to one company's pricing |

- Engel column: gold-tinted header, check marks in `var(--gold)`, bold values
- Captive column: muted text `rgba(17,29,43,0.35)`, ✗ marks
- Table has a bottom trust statement below it (not inside the table):
  > *"With access to dozens of top carriers, we shop the market so you don't have to — saving you time, money, and the headache of comparing policies on your own."*

### CSS
- Section uses `.section-eyebrow`, `.section-inner` patterns from existing stylesheet
- Table: new CSS class `.broker-table` — `width: 100%`, `border-collapse: collapse`, header row background `rgba(184,115,51,0.08)`, row border `1px solid rgba(17,29,43,0.07)`
- Table cells: `padding: 16px 20px`, font-size `15px`
- Highlighted column (Engel): `background: rgba(184,115,51,0.04)` on each cell
- Responsive: on mobile (`max-width: 768px`), hide the table entirely and render a vertical list of `<div>` cards instead. Each card shows the feature name in small uppercase gold, the Engel value in full color with a ✓, and the captive value dimmed with a ✗. Four cards total, one per table row.

---

## New Section 2 — Why Choose Andrew

**Placement:** After Benefits section, before How It Works.

**HTML id:** `meet-andrew`

**Background:** `#fff`

**Padding:** `100px 0`

### Content

**Layout:** Two-column grid — `380px photo | 1fr content`. Photo on left, content on right. Gap: `72px`. Vertically centered.

**Photo:**
- Source: `brand_assets/andrew business guy 7 figures..png`
- Container: `border-radius: 4px`, subtle gold border `1px solid rgba(184,115,51,0.3)`, layered shadow `0 8px 32px rgba(17,29,43,0.12), 0 2px 8px rgba(17,29,43,0.06)`
- Gradient overlay inside: `linear-gradient(to top, rgba(17,29,43,0.25) 0%, transparent 50%)` — same treatment used on hero photos per CLAUDE.md
- `object-fit: cover`, full width of container, natural aspect ratio

**Content (right column):**
- Eyebrow: "Who You're Working With"
- Name: **Andrew Engel** (Cormorant Garamond, 38px, navy)
- Title: *Licensed Senior Underwriter & Independent Insurance Broker* (Jost, 14px, gold)
- Gold divider line (matches `.gold-divider` pattern)
- Bio (edited for brevity from `About me - Andrew.txt`):
  > "I didn't grow up with safety nets or stability. I've seen firsthand how quickly everything can fall apart when there's no protection in place — and those experiences are what led me into this industry. Today, I help families create the kind of security I wish my own had. This isn't just a career. This is personal."
- Credential pills (row of 4):
  - `NPN 21546368`
  - `Licensed in 15 States`
  - `40–50+ Carrier Network`
  - `Independent Broker`
- CTA link below pills: `"Learn More About Andrew →"` — links to `/about-andrew.html` — styled as `.btn-dark`

**Credential pill CSS:** New class `.cred-pill` — `display: inline-block`, `font-size: 11px`, `font-weight: 600`, `letter-spacing: 0.08em`, `text-transform: uppercase`, `background: rgba(184,115,51,0.08)`, `border: 1px solid rgba(184,115,51,0.25)`, `border-radius: 20px`, `padding: 5px 14px`, `color: var(--gold)`, `margin: 0 6px 8px 0`

**Responsive (mobile):** Stack to single column — photo on top, content below. Photo max-height `320px`, `object-fit: cover`.

---

## New Section 3 — Schedule a Call

**Placement:** After Testimonials section, before CTA Band.

**HTML id:** `schedule`

**Background:** `var(--navy)` — `#111D2B`

**Padding:** `100px 0`

### Content

**Layout:** Centered, max-width `720px`, `text-align: center`

**Eyebrow:** "Book Your Free Consultation"

**Headline:** "Ready to Get Protected? Let's Talk."

**Subtext:**
> "Pick a time that works for you — no pressure, no commitment required. A short 15-minute call is all it takes to understand your options and what coverage looks like for your situation."

**CTA Button:** `"View My Calendar & Book a Call →"`
- Styled as `.btn-nav` (large, gold-outlined style) but wider — custom class `.btn-calendar`
- `href`: `https://calendar.google.com/calendar/appointments/PLACEHOLDER` — opens in `target="_blank"` with `rel="noopener noreferrer"`
- `PLACEHOLDER` is clearly marked in a comment for easy swap later

**Reassurance line below button:**
> Free · No obligation · 15 minutes

Styled in `rgba(255,255,255,0.4)`, `font-size: 13px`, `letter-spacing: 0.08em`

**CSS for `.btn-calendar`:**
- `display: inline-block`, `padding: 16px 40px`, `font-size: 15px`, `font-weight: 600`
- `border: 1.5px solid var(--gold)`, `color: var(--gold)`
- `border-radius: 2px`, `letter-spacing: 0.06em`
- Hover: `background: var(--gold)`, `color: var(--navy)` — transition `0.25s ease`
- `focus-visible` state required

---

## Scroll Animations

All three new sections follow the existing `scroll-hidden` / `in-view` IntersectionObserver pattern already in the page's `<script>` block. The existing `querySelectorAll` selector must be extended to include new elements:

```js
document.querySelectorAll(
  '.pain-card, .benefit-item, .testimonial-card, .step, .broker-row, .andrew-photo, .andrew-content, .schedule-content'
).forEach(el => {
  el.classList.add('scroll-hidden');
  observer.observe(el);
});
```

- `.broker-row` — each `<tr>` in the comparison table (stagger via inline `transition-delay` on each row: 0ms, 80ms, 160ms, 240ms)
- `.andrew-photo`, `.andrew-content` — the two columns of the Andrew section
- `.schedule-content` — the centered content block in the scheduling section

---

## Assets Used

- Andrew's photo: `brand_assets/andrew business guy 7 figures..png`
- Logo: `brand_assets/engel-financial-group.jpg`
- Bio source: `brand_assets/About me - Andrew.txt`

---

## What Is NOT Changing

- All other sections (Pain, Solution, Benefits, How It Works, Testimonials, CTA Band, Footer) — content unchanged
- `styles.css` shared stylesheet — only additive changes (new classes), no modifications to existing rules
- All other HTML files — no changes in this phase
