# LP Gateway Router Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `lp/life-insurance.html` into a pure service-selection gateway that immediately redirects users to the correct service-specific LP on a single tile click.

**Architecture:** Add a new `redirect` step type to the shared `lpWizard` engine in `js/lp-wizard.js`. This type renders the same 2×N icon grid as `multiChoice` but fires `window.location.href` on single click instead of toggling a selection. `lp/life-insurance.html` is then simplified to a single `redirect` step — all subsequent questions removed. A `.lp-grid-card--loading` CSS class handles the tap-feedback pulse while the browser navigates.

**Tech Stack:** Vanilla JS (IIFE module pattern), plain CSS, no build step. Dev server: `node serve.mjs` at `http://localhost:3000`.

---

## File Map

| File | Change |
|---|---|
| `lp/wizard.css` | Add `@keyframes lpPulse` + `.lp-grid-card--loading` rule |
| `js/lp-wizard.js` | Add `_redirectHtml()`, add `'redirect'` case in `_buildStepHtml`, add redirect click binding in `_render`, update step-label logic |
| `lp/life-insurance.html` | Replace entire `steps[]` array with a single `redirect` step; remove `coverage_type` / `source_page` from `init()` config |

---

## Task 1: Add loading-state CSS to `lp/wizard.css`

**Files:**
- Modify: `lp/wizard.css`

The `.lp-grid-card--loading` class is applied by the JS click handler the moment a tile is tapped, before `window.location.href` fires. It signals "tap registered" on slow connections and blocks double-taps via `pointer-events: none` on the parent container (handled in JS — Task 2).

- [ ] **Step 1: Add the keyframe and rule to the end of `lp/wizard.css`**

Open `lp/wizard.css`. Append the following block after the last line (after the `@media (min-width: 480px)` block at line 487):

```css
/* Redirect tile — loading state while browser navigates */
@keyframes lpPulse {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 0.35; }
}
.lp-grid-card--loading {
  animation: lpPulse 0.9s ease-in-out infinite;
  cursor: wait;
}
```

- [ ] **Step 2: Commit**

```bash
git add lp/wizard.css
git commit -m "feat: add lp-grid-card--loading pulse style for redirect tiles"
```

---

## Task 2: Add `redirect` step type to `js/lp-wizard.js`

**Files:**
- Modify: `js/lp-wizard.js`

Three targeted edits to the existing file. Do them in order (top-to-bottom in the file) to keep line references stable.

### 2a — Update the step-label line in `_render`

- [ ] **Step 1: Find and update the step-label assignment**

In `_render` (around line 383), find this exact line:

```js
    document.getElementById('lp-step-label').textContent =
      step.type === 'done' ? 'Complete!' : `Step ${n + 1} of ${total}`;
```

Replace it with:

```js
    document.getElementById('lp-step-label').textContent =
      step.type === 'done'     ? 'Complete!'          :
      step.type === 'redirect' ? ''                   :
      `Step ${n + 1} of ${total}`;
```

Redirect is the only step on the gateway page so "Step 1 of 7" (with unreachable CLOSING_STEPS counted) would be misleading — showing nothing is cleaner.

### 2b — Add redirect click binding in `_render`

- [ ] **Step 2: Add redirect binding block after the interstitial binding**

In `_render`, find the interstitial binding block (around line 435):

```js
    // Bind interstitial continue
    const interstitialNext = container.querySelector('#lp-interstitial-next');
    if (interstitialNext) {
      interstitialNext.addEventListener('click', () => _render(_current + 1));
    }
```

Insert the following block **immediately after** those 4 lines:

```js
    // Bind redirect grid cards — single click fires window.location.href
    if (step.type === 'redirect') {
      const grid = container.querySelector('#lp-redirect-grid');
      container.querySelectorAll('.lp-grid-card[data-href]').forEach(card => {
        card.addEventListener('click', () => {
          const href = card.dataset.href;
          if (!href || grid.style.pointerEvents === 'none') return;
          grid.style.pointerEvents = 'none';
          card.classList.add('lp-grid-card--loading');
          window.location.href = href;
        });
      });
    }
```

The `grid.style.pointerEvents === 'none'` guard prevents any second tap while the browser is already navigating.

### 2c — Add `_redirectHtml` renderer and wire it into `_buildStepHtml`

- [ ] **Step 3: Add the `'redirect'` case to `_buildStepHtml`**

In `_buildStepHtml` (around line 489), find the switch statement:

```js
    switch (step.type) {
      case 'choice':   return _choiceHtml(step);
      case 'dropdown': return _dropdownHtml(step);
      case 'number':   return _numberHtml(step);
      case 'name':     return _nameHtml(step);
      case 'email':    return _emailHtml(step);
      case 'phone':    return _phoneHtml(step);
      case 'otp':          return _otpHtml();
      case 'done':         return _doneHtml();
      case 'multiChoice':  return _multiChoiceHtml(step);
      case 'interstitial': return _interstitialHtml(step);
      default:             return '';
    }
```

Replace it with (adds one line):

```js
    switch (step.type) {
      case 'choice':   return _choiceHtml(step);
      case 'dropdown': return _dropdownHtml(step);
      case 'number':   return _numberHtml(step);
      case 'name':     return _nameHtml(step);
      case 'email':    return _emailHtml(step);
      case 'phone':    return _phoneHtml(step);
      case 'otp':          return _otpHtml();
      case 'done':         return _doneHtml();
      case 'multiChoice':  return _multiChoiceHtml(step);
      case 'interstitial': return _interstitialHtml(step);
      case 'redirect':     return _redirectHtml(step);
      default:             return '';
    }
```

- [ ] **Step 4: Add the `_redirectHtml` function**

Find the `_interstitialHtml` function (around line 539). Add the following function **immediately after** the closing brace of `_interstitialHtml`:

```js
  function _redirectHtml(step) {
    const cards = step.choices.map(c =>
      `<button type="button" class="lp-grid-card" data-href="${_h(c.href)}" aria-label="${_h(c.label)}">
        <div class="lp-grid-card-icon">${c.icon || ''}</div>
        <span class="lp-grid-card-label">${_h(c.label)}</span>
      </button>`
    ).join('');
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${_h(step.question)}</h2>
      <div class="lp-grid-choices" id="lp-redirect-grid">${cards}</div>
    </div>`;
  }
```

Note: no `.lp-grid-card-check` circle (that's multi-select state), no `data-field` / `aria-pressed` (this is navigation, not a selection toggle), no "Next" button.

- [ ] **Step 5: Commit**

```bash
git add js/lp-wizard.js
git commit -m "feat: add redirect step type to lpWizard"
```

---

## Task 3: Update `lp/life-insurance.html` to pure gateway

**Files:**
- Modify: `lp/life-insurance.html`

The entire `<script>` block at the bottom of the file gets simplified. The old config had `coverage_type`, `source_page`, and 9 steps. Replace the whole inline `<script>` block (everything after `<script src="/js/lp-wizard.js"></script>`).

- [ ] **Step 1: Replace the inline `<script>` block**

`lp/life-insurance.html` already has `<script src="/js/lp-wizard.js"></script>` at line 84. The inline `<script>` block starts at line 85 and runs to line 181. Replace only lines 85–181 (the inline `<script>` tag only — do NOT touch line 84):

```html
  <script>
    document.getElementById('lp-back-btn').addEventListener('click', function() { lpWizard.back(); });

    lpWizard.init({
      steps: [
        {
          type: 'redirect',
          question: "Which type of coverage interests you?",
          choices: [
            { label: 'Whole Life Insurance',  icon: lpWizard.ICONS.shield, href: '/lp/whole-life.html' },
            { label: 'IUL / Cash Value Life', icon: lpWizard.ICONS.growth, href: '/lp/iul.html' },
            { label: 'Annuities',             icon: lpWizard.ICONS.income, href: '/lp/annuities.html' },
            { label: 'Mortgage Protection',   icon: lpWizard.ICONS.house,  href: '/lp/mortgage-protection.html' },
            { label: 'Retirement Planning',   icon: lpWizard.ICONS.clock,  href: '/lp/retirement-planning.html' },
            { label: 'Advanced Markets',      icon: lpWizard.ICONS.trophy, href: '/lp/advanced-markets.html' },
          ],
        },
      ],
    });
  </script>
```

`coverage_type` and `source_page` are omitted — they were only used in the OTP submission payload, and the redirect step never reaches OTP.

- [ ] **Step 2: Commit**

```bash
git add lp/life-insurance.html
git commit -m "feat: convert life-insurance LP to pure service-selection gateway"
```

---

## Task 4: Manual verification

No automated test suite exists in this project. Verify in the browser.

- [ ] **Step 1: Start the dev server (if not already running)**

```bash
node serve.mjs
```

Server runs at `http://localhost:3000`. If it's already running, skip this.

- [ ] **Step 2: Open the gateway page**

Navigate to `http://localhost:3000/lp/life-insurance.html`.

Expected:
- Header with logo + phone number visible
- Single question: "Which type of coverage interests you?"
- 2×3 grid of 6 service tiles with icons
- No "Next" button
- Step label is empty (no "Step 1 of N" text)
- Back button hidden (first step)
- Progress bar at 0%

- [ ] **Step 3: Test each tile redirect**

Click each tile one at a time (use browser back to return after each):

| Tile | Expected destination |
|---|---|
| Whole Life Insurance | `http://localhost:3000/lp/whole-life.html` |
| IUL / Cash Value Life | `http://localhost:3000/lp/iul.html` |
| Annuities | `http://localhost:3000/lp/annuities.html` |
| Mortgage Protection | `http://localhost:3000/lp/mortgage-protection.html` |
| Retirement Planning | `http://localhost:3000/lp/retirement-planning.html` |
| Advanced Markets | `http://localhost:3000/lp/advanced-markets.html` |

For each: verify the tapped tile briefly pulses (loading animation visible for a moment), then the browser navigates to the correct LP and that LP's wizard loads at step 1.

- [ ] **Step 4: Verify loading state on slow connection (optional)**

In Chrome DevTools → Network → Throttling → set to "Slow 3G". Click a tile. You should see the tile pulse for ~1-2 seconds before navigation. No double-tap should be possible.

- [ ] **Step 5: Verify the 6 specific LPs are unchanged**

Navigate to each of the 6 service LPs directly. Confirm each still starts at their own Q1 (goals, dependents, etc.) and the full wizard flow works end-to-end.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: LP gateway router complete — life-insurance.html routes to service LPs"
```
