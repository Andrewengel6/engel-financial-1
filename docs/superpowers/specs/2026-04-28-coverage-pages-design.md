# Design Spec: Coverage Pages — Phase 1
**Date:** 2026-04-28
**Project:** Engel Financial Group
**Phase:** 1 of 3 — Website Expansion (Coverage Section)

---

## Scope

Build 7 new coverage product pages and update shared nav/footer across the entire site. This is Phase 1 of a 3-phase project:
- Phase 1: Full website pages (coverage, company, legal)
- Phase 2: Homepage edits
- Phase 3: Supabase lead tracking backend

This spec covers Phase 1, Section 1: Coverage pages.

---

## Hard Rules

- Nav and footer are **identical across every page** — no exceptions.
- Each coverage page has its own **embedded lead capture form** with the coverage type pre-selected.
- Nav is **SEO-friendly** — all links are real HTML anchor tags, not JS-injected.
- All styles shared via `styles.css`; page-specific styles inline in each file.
- Mobile-first. Burger menu on mobile. Dropdown on desktop.
- Brand colors: `#111d2b` (navy), `#1a2d3f` (navy-mid), `#243851` (navy-light), `#b87333` (gold/copper), `#bd9468` (gold-light), `#fbf3da` (warm white), `#f5ede0` (off-white).
- Fonts: Cormorant Garamond (headings), Jost (body).
- Placeholder images via `https://placehold.co/`.

---

## File Structure

```
project_andrew/
├── styles.css                    ← NEW: all shared styles
├── index.html                    ← UPDATED: imports styles.css, nav/footer updated
├── thank-you.html                ← UPDATED: imports styles.css
├── life-insurance.html           ← NEW
├── whole-life-insurance.html     ← NEW
├── iuls.html                     ← NEW
├── annuities.html                ← NEW
├── mortgage-protection.html      ← NEW
├── retirement-planning.html      ← NEW
├── advanced-markets.html         ← NEW
```

---

## Shared Nav

### Desktop
- Fixed top, navy background, blur backdrop
- Left: Engel Financial Group logo
- Center: "Coverage" text link with dropdown on hover — lists all 7 coverage pages
- Right: Phone number link + "Get a Free Quote" button (scrolls to page form)

### Mobile
- Burger icon (☰) on right
- Tap opens full-height slide-down menu
- "Coverage" is an accordion item — taps to expand listing all 7 pages
- Phone + CTA button below nav links

### Coverage Dropdown Items (desktop) / Accordion Items (mobile)
1. Life Insurance → `/life-insurance.html`
2. Whole Life Insurance → `/whole-life-insurance.html`
3. IULs → `/iuls.html`
4. Annuities → `/annuities.html`
5. Mortgage Protection → `/mortgage-protection.html`
6. Retirement Planning → `/retirement-planning.html`
7. Advanced Markets → `/advanced-markets.html`

---

## Shared Footer

Identical on every page. Four columns:

**Column 1 — Brand**
Logo + tagline: "Protecting families across America with trusted, affordable life insurance solutions."

**Column 2 — Coverage** (updated from 4 to 7 items)
Life Insurance, Whole Life Insurance, IULs, Annuities, Mortgage Protection, Retirement Planning, Advanced Markets

**Column 3 — Company**
About, How It Works, Carriers We Work With, Contact

**Column 4 — Legal**
Privacy Policy, Terms of Service, Licensing, TCPA Compliance

Bottom bar: copyright, license status indicator.

---

## Page Template Structure

All 7 coverage pages use this exact section order:

### Section 1: Hero
- Full-width, navy background (`#111d2b`)
- Large serif headline (Cormorant Garamond, ~64px desktop / ~40px mobile)
- Subheadline (Jost, ~18px, muted white)
- Two CTAs: "See If You Qualify" (gold button, scrolls to form) + "Call Us" (ghost button)
- Subtle grain overlay (matching index.html)
- Layered radial gradient background for depth

### Section 2: What Is It
- 2-column layout (text left, image right; stacks on mobile)
- Left: section label ("What Is [Product]"), serif headline, 2–3 paragraph explanation, 3 key fact chips (e.g. "No medical exam", "Flexible terms", "Tax advantages")
- Right: placeholder image with gold gradient overlay + color treatment layer

### Section 3: Who It's For
- 3 cards in a row (stack to 1 col on mobile)
- Each card: icon, title, 2-sentence description
- Tailored to the product's typical buyer profile
- Hover animation: lift + gold top border reveal

### Section 4: How It Works
- 3-step horizontal track (matching homepage style)
- Steps: Apply → Get Matched → Get Covered (adapted per product)
- Numbered circles in gold

### Section 5: Benefits
- 6-item grid (3x2 desktop, 2x3 tablet, 1x6 mobile)
- Each item: gold checkmark icon, bold label, 1-line description
- Product-specific benefits

### Section 6: Lead Capture Form
- Same card style as homepage (`form-card`)
- Coverage type **pre-selected** in a dropdown at the top of the form
- Dropdown is expandable — user can switch to any of the 7 coverage types
- Fields: First Name, Last Name, Phone, Email, Zip Code
- Submit button: "Get My Free Quote"
- Disclaimer text below button
- On submit: validates fields, then redirects to `/thank-you.html`

### Section 7: FAQ
- 4 questions, accordion expand/collapse
- Gold chevron icon rotates on expand
- Product-specific questions and answers
- Clean separator lines between items

### Section 8: Bottom CTA Banner
- Dark navy (`#0a1219`) full-width band
- Serif headline, short supporting sentence
- Single gold "Get My Free Quote Now" button (scrolls to form)

### Section 9: Footer
- Identical to all other pages

---

## Coverage Page Content Topics

Content written from scratch by Claude, refined later by client.

| Page | Core Angle |
|------|-----------|
| Life Insurance | Overview of all life insurance — gateway page, links to specific products |
| Whole Life Insurance | Permanent coverage + cash value growth, estate planning |
| IULs | Market-linked growth with downside protection, tax-free retirement income |
| Annuities | Guaranteed income in retirement, principal protection |
| Mortgage Protection | Pay off the mortgage if the breadwinner dies, protect the family home |
| Retirement Planning | Building a tax-efficient retirement income strategy with life insurance |
| Advanced Markets | Business owners: key person insurance, buy-sell agreements, executive benefits |

---

## Lead Form — Coverage Dropdown Options

When a user is on a specific page, that coverage type is pre-selected. The dropdown allows switching to:
- Life Insurance
- Whole Life Insurance
- IUL (Indexed Universal Life)
- Annuities
- Mortgage Protection
- Retirement Planning
- Advanced Markets / Business Planning

---

## Implementation Notes

- Extract `index.html` shared styles into `styles.css`. Keep only page-specific styles inline.
- Update `index.html` nav and footer to match the new shared structure.
- Update `thank-you.html` nav and footer to match.
- Build coverage pages one at a time, each fully complete before moving to the next.
- Screenshot each completed page from localhost before marking done.
- Test mobile burger menu and dropdown on each page.
