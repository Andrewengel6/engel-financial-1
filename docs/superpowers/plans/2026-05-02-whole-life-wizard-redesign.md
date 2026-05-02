# Whole Life Insurance Wizard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `lp/whole-life.html` with a new 8-step qualification flow, adding a `closingSteps` config override and a `choiceWithNote` step type to the shared wizard engine.

**Architecture:** Two targeted additions to `js/lp-wizard.js` (one-line `closingSteps` override in `init()`, plus new `choiceWithNote` step type with its own HTML renderer and `_render` binding block). Three CSS rules added to `lp/wizard.css`. `lp/whole-life.html` gets a full `lpWizard.init()` config replacement. All other LP pages are unaffected.

**Tech Stack:** Vanilla JS (IIFE module), plain CSS, no build step. Dev server: `node serve.mjs` at `http://localhost:3000`.

---

## File Map

| File | Change |
|---|---|
| `lp/wizard.css` | Add `.lp-choice--selected`, `.lp-note-wrap`, `.lp-note-label`, `.lp-textarea` rules |
| `js/lp-wizard.js` | (1) Guard `.lp-choice` binding to exclude `choiceWithNote`; (2) `closingSteps` override in `init()`; (3) `choiceWithNote` binding block in `_render`; (4) `case 'choiceWithNote'` in switch; (5) `_choiceWithNoteHtml()` function |
| `lp/whole-life.html` | Full `lpWizard.init()` config rewrite — 8 custom steps + `closingSteps` |

---

## Task 1: Add CSS rules to `lp/wizard.css`

**Files:**
- Modify: `lp/wizard.css`

- [ ] **Step 1: Append 4 new rules after the `.lp-grid-card--loading` block (current end of file, around line 498)**

Open `lp/wizard.css` and append after the last line:

```css
/* Choice selected state (used by choiceWithNote) */
.lp-choice--selected {
  border-color: var(--gold);
  background: #fffbf5;
  box-shadow: 0 4px 16px rgba(17,29,43,0.09);
}

/* Optional note field (used by choiceWithNote step) */
.lp-note-wrap {
  margin-top: 1.25rem;
  margin-bottom: 1rem;
}
.lp-note-label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-soft);
  margin-bottom: 0.5rem;
  font-family: 'Jost', sans-serif;
}
.lp-textarea {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid rgba(17,29,43,0.15);
  border-radius: 10px;
  font-family: 'Jost', sans-serif;
  font-size: 1.05rem;
  color: var(--text-dark);
  background: white;
  transition: border-color 0.15s;
  resize: vertical;
  min-height: 80px;
}
.lp-textarea:focus { outline: none; border-color: var(--gold); }
.lp-textarea::placeholder { color: var(--text-soft); }
```

- [ ] **Step 2: Commit**

```bash
git add lp/wizard.css
git commit -m "feat: add lp-choice--selected and lp-textarea styles for choiceWithNote step"
```

---

## Task 2: Add `choiceWithNote` step type to `js/lp-wizard.js`

**Files:**
- Modify: `js/lp-wizard.js`

Five targeted edits in order top-to-bottom. Read the file before editing to confirm line numbers, then make each change.

### 2a — Guard `.lp-choice` auto-advance binding to exclude `choiceWithNote`

- [ ] **Step 1: Wrap the `.lp-choice` forEach in a type guard**

Find these lines in `_render` (around line 394):

```js
    container.querySelectorAll('.lp-choice').forEach(btn => {
      btn.addEventListener('click', () => select(btn.dataset.field, btn.dataset.value));
    });
```

Replace with:

```js
    if (step.type !== 'choiceWithNote') {
      container.querySelectorAll('.lp-choice').forEach(btn => {
        btn.addEventListener('click', () => select(btn.dataset.field, btn.dataset.value));
      });
    }
```

`choiceWithNote` buttons carry `.lp-choice` for styling but must NOT auto-advance — they have their own binding block below.

### 2b — Add `choiceWithNote` binding block in `_render`

- [ ] **Step 2: Add binding block immediately after the redirect binding block (after the closing `}` of the redirect block, around line 455)**

Find the end of the redirect binding block:

```js
    // Bind redirect grid cards — single click fires window.location.href
    if (step.type === 'redirect') {
      ...
    }
```

Insert immediately after its closing `}`:

```js
    // Bind choiceWithNote — highlights selection, enables Continue, saves both answers
    if (step.type === 'choiceWithNote') {
      const continueBtn = container.querySelector('#lp-cwn-continue');
      container.querySelectorAll('.lp-choice-pick').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.lp-choice-pick').forEach(b => b.classList.remove('lp-choice--selected'));
          btn.classList.add('lp-choice--selected');
          if (continueBtn) continueBtn.disabled = false;
        });
      });
      // Restore state on back navigation
      if (_answers[step.field]) {
        const prev = container.querySelector(`.lp-choice-pick[data-value="${CSS.escape(_answers[step.field])}"]`);
        if (prev) { prev.classList.add('lp-choice--selected'); if (continueBtn) continueBtn.disabled = false; }
        const noteEl = container.querySelector('#lp-note-input');
        if (noteEl && _answers[step.noteField]) noteEl.value = _answers[step.noteField];
      }
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          const selected = container.querySelector('.lp-choice-pick.lp-choice--selected');
          if (!selected) return;
          _answers[step.field] = selected.dataset.value;
          const noteEl = container.querySelector('#lp-note-input');
          _answers[step.noteField] = noteEl ? noteEl.value.trim() : '';
          _render(_current + 1);
        });
      }
    }
```

### 2c — Add `case 'choiceWithNote'` to `_buildStepHtml` switch

- [ ] **Step 3: Add one line to the switch in `_buildStepHtml` (around line 517)**

Find:

```js
      case 'redirect':     return _redirectHtml(step);
      default:             return '';
```

Replace with:

```js
      case 'redirect':        return _redirectHtml(step);
      case 'choiceWithNote':  return _choiceWithNoteHtml(step);
      default:                return '';
```

### 2d — Add `_choiceWithNoteHtml` renderer

- [ ] **Step 4: Add the function immediately after `_redirectHtml` (after its closing `}`, around line 588)**

Find the closing `}` of `_redirectHtml`:

```js
  function _redirectHtml(step) {
    ...
  }
```

Insert immediately after:

```js
  function _choiceWithNoteHtml(step) {
    const buttons = step.choices.map(c =>
      `<button type="button" class="lp-choice lp-choice-pick" data-field="${_h(step.field)}" data-value="${_h(c.value)}">${_h(c.label)}</button>`
    ).join('\n');
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${_h(step.question)}</h2>
      <div class="lp-choices" id="lp-cwn-choices">${buttons}</div>
      <div class="lp-note-wrap">
        <label class="lp-note-label" for="lp-note-input">${_h(step.notePlaceholder || 'Anything else we should know? (optional)')}</label>
        <textarea class="lp-textarea" id="lp-note-input" rows="3" aria-label="Optional notes"></textarea>
      </div>
      <button class="lp-btn-primary" id="lp-cwn-continue" disabled>Continue &rarr;</button>
    </div>`;
  }
```

### 2e — Add `closingSteps` override to `init()`

- [ ] **Step 5: Change one line in `init()` (line 187)**

Find:

```js
    _steps = [...config.steps, ...CLOSING_STEPS];
```

Replace with:

```js
    _steps = [...config.steps, ...(config.closingSteps ?? CLOSING_STEPS)];
```

When `config.closingSteps` is present it replaces `CLOSING_STEPS`. When absent (all existing LPs), behaviour is unchanged.

- [ ] **Step 6: Commit**

```bash
git add js/lp-wizard.js
git commit -m "feat: add choiceWithNote step type and closingSteps config override to lpWizard"
```

---

## Task 3: Rewrite `lp/whole-life.html` init config

**Files:**
- Modify: `lp/whole-life.html`

- [ ] **Step 1: Replace the inline `<script>` block (lines 85–167)**

`lp/whole-life.html` has `<script src="/js/lp-wizard.js"></script>` at line 84. Replace ONLY the inline `<script>` tag (line 85 to end of file) — do NOT touch line 84. The replacement:

```html
  <script>
    document.getElementById('lp-back-btn').addEventListener('click', function() { lpWizard.back(); });

    lpWizard.init({
      coverage_type: 'Whole Life Insurance',
      source_page: '/lp/whole-life',
      closingSteps: [
        { type: 'name',  question: "What's your full name?" },
        { type: 'email', question: "What's your email address?" },
        { type: 'phone', question: "Let's verify your phone number" },
        { type: 'otp' },
        { type: 'done' },
      ],
      steps: [
        {
          type: 'choice',
          question: "What best describes why you're looking into whole life insurance?",
          field: 'intent',
          choices: [
            { label: 'I want lifetime coverage',                  value: 'lifetime_coverage' },
            { label: 'I want to protect my family',               value: 'protect_family' },
            { label: 'I want coverage that can build cash value',  value: 'build_cash_value' },
            { label: "I'm comparing whole life with other options", value: 'comparing_options' },
            { label: "I'm not sure yet",                          value: 'not_sure' },
          ],
        },
        {
          type: 'number',
          question: "What's your age?",
          field: 'age',
          min: 18,
          max: 100,
          placeholder: 'Enter your age',
        },
        {
          type: 'choice',
          question: "What's your main goal with whole life insurance?",
          field: 'primary_goal',
          choices: [
            { label: 'Leave money behind for loved ones', value: 'leave_money' },
            { label: 'Lock in permanent coverage',        value: 'permanent_coverage' },
            { label: 'Cover final expenses',              value: 'final_expenses' },
            { label: 'Build cash value over time',        value: 'build_cash_value' },
            { label: 'Add protection for my family',      value: 'family_protection' },
          ],
        },
        {
          type: 'choice',
          question: 'Do you currently have life insurance?',
          field: 'current_coverage',
          choices: [
            { label: 'Yes',      value: 'yes' },
            { label: 'No',       value: 'no' },
            { label: 'Not sure', value: 'not_sure' },
          ],
        },
        {
          type: 'choice',
          question: 'What monthly range would you feel comfortable starting with?',
          field: 'monthly_budget',
          choices: [
            { label: 'Under $100/month',  value: 'under_100' },
            { label: '$100–$250/month',   value: '100_250' },
            { label: '$250–$500/month',   value: '250_500' },
            { label: '$500+/month',       value: '500_plus' },
            { label: 'Not sure yet',      value: 'not_sure' },
          ],
        },
        {
          type: 'choice',
          question: 'What matters most to you in a policy?',
          field: 'key_concern',
          choices: [
            { label: 'Premiums that stay consistent',         value: 'consistent_premiums' },
            { label: 'Guaranteed lifetime coverage',          value: 'guaranteed_coverage' },
            { label: "Living benefits if I get seriously ill", value: 'living_benefits' },
            { label: 'Cash value over time',                  value: 'cash_value' },
            { label: 'Making sure my family is protected',    value: 'family_protected' },
          ],
        },
        {
          type: 'choice',
          question: 'When would you like a licensed agent to contact you?',
          field: 'contact_urgency',
          choices: [
            { label: 'Immediately',        value: 'immediately' },
            { label: 'Within a week',      value: 'within_a_week' },
            { label: 'Within a month',     value: 'within_a_month' },
            { label: 'Just looking around', value: 'just_looking' },
          ],
        },
        {
          type: 'choiceWithNote',
          question: "What's the best time for a licensed agent to call you?",
          field: 'best_call_time',
          noteField: 'agent_notes',
          notePlaceholder: 'Anything the agent should know before calling? (optional)',
          choices: [
            { label: 'Morning',   value: 'morning' },
            { label: 'Afternoon', value: 'afternoon' },
            { label: 'Evening',   value: 'evening' },
            { label: 'Anytime',   value: 'anytime' },
          ],
        },
      ],
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add lp/whole-life.html
git commit -m "feat: redesign whole-life wizard with 8-step qualification flow"
```

---

## Task 4: Manual verification

No automated test suite. Verify in browser.

- [ ] **Step 1: Ensure dev server is running**

```bash
node serve.mjs
```

Server runs at `http://localhost:3000`. Skip if already running.

- [ ] **Step 2: Open the whole-life page**

Navigate to `http://localhost:3000/lp/whole-life.html`.

Expected on load:
- Step 1 of 12 shown in step label (8 custom + 5 closing steps, total = 13, label = `Step N of 12`)
- Question: "What best describes why you're looking into whole life insurance?"
- 5 choice buttons (I want lifetime coverage / I want to protect my family / I want coverage that can build cash value / I'm comparing whole life with other options / I'm not sure yet)
- Clicking a button immediately advances to Step 2 (age number input)

- [ ] **Step 3: Walk through all 8 custom steps**

| Step | Expected behaviour |
|---|---|
| 1 — Intent | Tap any option → advances to Step 2 |
| 2 — Age | Type a number 18–100 → Continue → advances; type 17 or 101 → shake animation, no advance |
| 3 — Primary goal | Tap any option → advances |
| 4 — Current coverage | Tap Yes/No/Not sure → advances |
| 5 — Monthly budget | Tap any option → advances |
| 6 — Key concern | Tap any option → advances |
| 7 — Contact urgency | Tap any option → advances |
| 8 — Best call time + note | Tap a time option → it highlights (gold border), Continue button becomes enabled; typing in textarea is optional; tap Continue → advances to name step |

- [ ] **Step 4: Verify back navigation on Step 8**

On Step 8, tap "Evening", type "Please call after 6pm" in the textarea, tap Continue. Then tap Back. Verify:
- "Evening" is pre-highlighted with gold border
- "Please call after 6pm" is still in the textarea
- Continue button is already enabled

- [ ] **Step 5: Verify closing steps have no urgency question**

After Step 8 (best call time), the next steps should be: name → email → phone → OTP → done. The "How soon do you want to be contacted?" urgency question should NOT appear — it was already asked in Step 7.

- [ ] **Step 6: Verify other LPs are unchanged**

Navigate to `http://localhost:3000/lp/iul.html` and verify its first step is still "What are your goals for IUL?" (or whatever its original Step 1 is). The `closingSteps` change must not have broken other pages — they should still have urgency in their closing steps.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat: whole-life wizard redesign complete"
```
