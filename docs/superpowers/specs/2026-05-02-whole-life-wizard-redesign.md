# Whole Life Insurance Wizard Redesign — Design Spec
_2026-05-02_

## Overview

Restructure `lp/whole-life.html` with a new 9-step question flow tailored to whole life insurance qualification. Two additions to the shared wizard engine are required: a `closingSteps` config override (so the custom urgency step isn't duplicated) and a new `choiceWithNote` step type (single-select + optional textarea on one screen).

## New Step Flow — `lp/whole-life.html`

| # | Step Type | Field(s) | Question |
|---|---|---|---|
| 1 | `choice` | `intent` | What best describes why you're looking into whole life insurance? |
| 2 | `number` | `age` | What's your age? |
| 3 | `choice` | `primary_goal` | What's your main goal with whole life insurance? |
| 4 | `choice` | `current_coverage` | Do you currently have life insurance? |
| 5 | `choice` | `monthly_budget` | What monthly range would you feel comfortable starting with? |
| 6 | `choice` | `key_concern` | What matters most to you in a policy? |
| 7 | `choice` | `contact_urgency` | When would you like a licensed agent to contact you? |
| 8 | `choiceWithNote` | `best_call_time`, `agent_notes` | What's the best time for a licensed agent to call you? |
| closing | name → email → phone → OTP → done | — | (urgency omitted — covered in step 7) |

## Full Choice Options

**Step 1 — Intent** (`field: 'intent'`)
- I want lifetime coverage
- I want to protect my family
- I want coverage that can build cash value
- I'm comparing whole life with other options
- I'm not sure yet

**Step 2 — Age** (`field: 'age'`, min: 18, max: 100, placeholder: 'Enter your age')

**Step 3 — Primary Goal** (`field: 'primary_goal'`)
- Leave money behind for loved ones
- Lock in permanent coverage
- Cover final expenses
- Build cash value over time
- Add protection for my family

**Step 4 — Current Coverage** (`field: 'current_coverage'`)
- Yes
- No
- Not sure

**Step 5 — Monthly Budget** (`field: 'monthly_budget'`)
- Under $100/month
- $100–$250/month
- $250–$500/month
- $500+/month
- Not sure yet

**Step 6 — Key Concern** (`field: 'key_concern'`)
- Premiums that stay consistent
- Guaranteed lifetime coverage
- Living benefits if I get seriously ill
- Cash value over time
- Making sure my family is protected

**Step 7 — Contact Urgency** (`field: 'contact_urgency'`)
- Immediately
- Within a week
- Within a month
- Just looking around

**Step 8 — Best Call Time + Notes** (`field: 'best_call_time'`, optional `field: 'agent_notes'`)
- Morning
- Afternoon
- Evening
- Anytime
- Optional textarea: "Anything the agent should know before calling?"

## Engine Changes — `js/lp-wizard.js`

### 1. `closingSteps` config override

In `init(config)`, change:
```js
_steps = [...config.steps, ...CLOSING_STEPS];
```
To:
```js
_steps = [...config.steps, ...(config.closingSteps ?? CLOSING_STEPS)];
```

When `config.closingSteps` is provided it replaces `CLOSING_STEPS` entirely. When absent, behaviour is identical to today — all existing LPs unaffected.

### 2. New `choiceWithNote` step type

**Config shape:**
```js
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
}
```

**Rendered HTML structure:**
- Question heading
- Vertical list of choice buttons (`.lp-choice` class, same as existing `choice` type)
- Selected state: add `.lp-choice--selected` class on click, remove from siblings
- Optional textarea below the choices (`.lp-textarea`, `rows="3"`, `id="lp-note-input"`)
- Small label above textarea: "Anything the agent should know before calling? (optional)"
- Continue button (`.lp-btn-primary`) — **disabled on render, enabled once a choice is tapped**

**Behavior:**
- Tapping a choice highlights it (`.lp-choice--selected`) but does NOT auto-advance
- Continue button becomes enabled once a choice is selected
- On Continue: saves `field` answer + saves `noteField` answer (textarea value, may be empty string) → advances to next step
- Back navigation restores selected choice and textarea content from `_answers`

**CSS additions to `lp/wizard.css`:**
- `.lp-choice--selected` — gold border + light gold background (mirrors `.lp-grid-card--selected` treatment)
- `.lp-textarea` — same base style as `.lp-input`, `resize: vertical`, `min-height: 80px`
- `.lp-note-label` — small label above textarea, `font-size: 0.8rem`, `color: var(--text-soft)`

## `lp/whole-life.html` Config Changes

Replace the entire `lpWizard.init({...})` call with the new 8-step config + `closingSteps` override:

```js
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
  steps: [ /* steps 1–8 as defined above */ ],
});
```

## What is NOT in scope

- Changes to any other LP page (`iul.html`, `annuities.html`, etc.) — those are addressed separately
- Changes to the default `CLOSING_STEPS` constant (it remains unchanged for backward compatibility)
- Adding icons to the new `choice` steps — the existing `choice` type renders text-only buttons, which is appropriate for these question types

## Files Changed

| File | Change |
|---|---|
| `js/lp-wizard.js` | `closingSteps` override in `init()`; add `choiceWithNote` step type (`_choiceWithNoteHtml`, `_buildStepHtml` case, click + continue binding in `_render`) |
| `lp/wizard.css` | `.lp-choice--selected`, `.lp-textarea`, `.lp-note-label` |
| `lp/whole-life.html` | Full `lpWizard.init()` config rewrite with new 8-step flow + `closingSteps` |
