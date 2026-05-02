# LP Gateway Router — Design Spec
_2026-05-02_

## Overview

`lp/life-insurance.html` becomes a pure gateway: it shows a single service-selection question, and clicking any tile immediately redirects the user to the matching service-specific landing page. The goal is pre-qualified leads — every lead Andrew receives has already self-identified their product interest before answering a single form question.

## User Flow

1. User lands on `/lp/life-insurance.html`
2. Sees one question: **"Which type of coverage interests you?"** — 6 tiles (one per service)
3. Clicks a tile → tile enters brief loading state → browser navigates to the specific LP
4. User completes the full tailored wizard on the specific LP
5. Lead is submitted with `source_page` set to that specific LP's route

## Redirect Map

| Tile label | Destination |
|---|---|
| Whole Life Insurance | `/lp/whole-life.html` |
| IUL / Cash Value Life | `/lp/iul.html` |
| Annuities | `/lp/annuities.html` |
| Mortgage Protection | `/lp/mortgage-protection.html` |
| Retirement Planning | `/lp/retirement-planning.html` |
| Advanced Markets | `/lp/advanced-markets.html` |

## Architecture

### New step type: `redirect` (js/lp-wizard.js)

Add a `redirect` case to `_buildStepHtml` and a corresponding renderer `_redirectHtml`.

**Config shape:**
```js
{
  type: 'redirect',
  question: "Which type of coverage interests you?",
  choices: [
    { label: 'Whole Life Insurance',  value: 'whole_life',  icon: lpWizard.ICONS.shield,  href: '/lp/whole-life.html' },
    { label: 'IUL / Cash Value Life', value: 'iul',         icon: lpWizard.ICONS.growth,  href: '/lp/iul.html' },
    // ... etc
  ]
}
```

**Behavior:**
- Renders the same 2×N icon grid as `multiChoice` (reuses `.lp-grid-choices` / `.lp-grid-card` CSS)
- No "Next" button — each card is a single-action trigger
- On click: add `.lp-grid-card--loading` class to the clicked card, set `pointer-events: none` on the `.lp-grid-choices` container (prevents any second tap on any card), then `window.location.href = choice.href`
- No field/answer stored — this step is purely navigational
- Back button is hidden on step 0 (same as existing behavior)

**Loading state (lp/wizard.css):**
Add `.lp-grid-card--loading` style: reduce opacity to 0.6, show a subtle pulse animation on the card. The parent `.lp-grid-choices` gets `pointer-events: none` on first click to block double-taps.

### Changes to lp/life-insurance.html

- Replace the `multiChoice` Q1 step with a `redirect` step using the redirect map above
- Remove all subsequent steps (Q2 goals, Q3 dependents, Q4 interstitial, Q5 state, Q6 gender, Q7 tobacco, Q8 health, Q9 age) — they are unreachable with a pure gateway
- `coverage_type` and `source_page` config values can remain or be removed (they are unused in a redirect-only flow)

### No changes to the 6 specific LPs

`lp/whole-life.html`, `lp/iul.html`, `lp/annuities.html`, `lp/mortgage-protection.html`, `lp/retirement-planning.html`, `lp/advanced-markets.html` — unchanged.

## What is NOT in scope

- Passing URL parameters from the gateway to the destination LP (not needed — `source_page` in each specific LP's config already identifies the lead source)
- A "Not sure" fallback path — deliberately excluded; pure gateway means every lead is service-qualified
- Changes to the 6 specific LP question sets

## Files Changed

| File | Change |
|---|---|
| `js/lp-wizard.js` | Add `redirect` step type: `_redirectHtml()`, `_buildStepHtml` case, click handler with loading state |
| `lp/life-insurance.html` | Replace Q1 `multiChoice` with `redirect`; remove Q2–Q9 steps |
| `lp/wizard.css` | Add `.lp-grid-card--loading` style (opacity + pulse animation) |
