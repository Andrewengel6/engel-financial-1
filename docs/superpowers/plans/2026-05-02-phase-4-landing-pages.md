# Phase 4: Service Landing Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 7 service-specific Meta Ads landing pages at `/lp/` — each a multi-step wizard funnel that collects service-specific answers then closes with urgency → name → email → phone → OTP → confirmation, submitting verified leads to the existing Phase 3 API with zero backend changes.

**Architecture:** Each page is a self-contained HTML file with inline CSS, a shared wizard IIFE module (`js/lp-wizard.js`) that manages step rendering/navigation/API calls, and an inline `<script>` that calls `lpWizard.init()` with the service-specific question set. All pages reuse the existing `/api/send-code` and `/api/submit-lead` endpoints unchanged.

**Tech Stack:** Vanilla HTML/CSS/JS · Cormorant Garamond + Jost (Google Fonts) · Brand CSS variables (navy/gold palette) · Existing Phase 3 Vercel API endpoints

---

## File Structure

| File | Action | Purpose |
|---|---|---|
| `lp/` | Create directory | Landing page directory |
| `js/lp-wizard.js` | Create | Shared wizard IIFE: step rendering, navigation, API calls, shared option lists |
| `lp/life-insurance.html` | Create | Life Insurance wizard (establishes visual template) |
| `lp/whole-life.html` | Create | Whole Life Insurance wizard |
| `lp/iul.html` | Create | IUL wizard |
| `lp/annuities.html` | Create | Annuities wizard |
| `lp/mortgage-protection.html` | Create | Mortgage Protection wizard |
| `lp/retirement-planning.html` | Create | Retirement Planning wizard |
| `lp/advanced-markets.html` | Create | Advanced Markets wizard |

**Backend unchanged:** `api/send-code.js`, `api/submit-lead.js`, `api/utils/format-sms.js` — no modifications.

---

## Wizard Step Types

The wizard supports these step types, each rendered by `lp-wizard.js`:

| type | Renders | Advances by |
|---|---|---|
| `choice` | Large tap-target buttons | Clicking any choice (auto-advance) |
| `dropdown` | `<select>` + Continue button | Continue button click |
| `name` | Two text inputs (first + last) + Continue | Continue button |
| `email` | Email input + Continue | Continue button |
| `phone` | Tel input + Send My Code (→ `/api/send-code`) | API success |
| `otp` | 6-digit OTP inputs + Verify & Submit (→ `/api/submit-lead`) | API success |
| `done` | Confirmation screen | — |

**Closing steps** (always appended by `lpWizard.init()` after service-specific steps):
1. urgency choice (contact_urgency)
2. name
3. email
4. phone
5. otp
6. done

---

## Task 1: Build `js/lp-wizard.js`

**Files:**
- Create: `js/lp-wizard.js`

- [ ] **Step 1: Create the `lp/` directory**

```powershell
mkdir "c:\Users\Gaming PC\Desktop\project_andrew\lp"
```

- [ ] **Step 2: Create `js/lp-wizard.js` with complete wizard IIFE**

```javascript
// js/lp-wizard.js
const lpWizard = (() => {
  let _steps = [];
  let _current = 0;
  let _answers = {};
  let _config = {};
  let _phone = '';
  let _resendInterval = null;

  const AGE_OPTIONS = [
    { value: '18–24', label: '18–24' },
    { value: '25–34', label: '25–34' },
    { value: '35–44', label: '35–44' },
    { value: '45–54', label: '45–54' },
    { value: '55–64', label: '55–64' },
    { value: '65–74', label: '65–74' },
    { value: '75+', label: '75+' },
  ];

  const STATE_OPTIONS = [
    { value: 'Alabama', label: 'Alabama' },
    { value: 'Alaska', label: 'Alaska' },
    { value: 'Arizona', label: 'Arizona' },
    { value: 'Arkansas', label: 'Arkansas' },
    { value: 'California', label: 'California' },
    { value: 'Colorado', label: 'Colorado' },
    { value: 'Connecticut', label: 'Connecticut' },
    { value: 'Delaware', label: 'Delaware' },
    { value: 'Florida', label: 'Florida' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Hawaii', label: 'Hawaii' },
    { value: 'Idaho', label: 'Idaho' },
    { value: 'Illinois', label: 'Illinois' },
    { value: 'Indiana', label: 'Indiana' },
    { value: 'Iowa', label: 'Iowa' },
    { value: 'Kansas', label: 'Kansas' },
    { value: 'Kentucky', label: 'Kentucky' },
    { value: 'Louisiana', label: 'Louisiana' },
    { value: 'Maine', label: 'Maine' },
    { value: 'Maryland', label: 'Maryland' },
    { value: 'Massachusetts', label: 'Massachusetts' },
    { value: 'Michigan', label: 'Michigan' },
    { value: 'Minnesota', label: 'Minnesota' },
    { value: 'Mississippi', label: 'Mississippi' },
    { value: 'Missouri', label: 'Missouri' },
    { value: 'Montana', label: 'Montana' },
    { value: 'Nebraska', label: 'Nebraska' },
    { value: 'Nevada', label: 'Nevada' },
    { value: 'New Hampshire', label: 'New Hampshire' },
    { value: 'New Jersey', label: 'New Jersey' },
    { value: 'New Mexico', label: 'New Mexico' },
    { value: 'New York', label: 'New York' },
    { value: 'North Carolina', label: 'North Carolina' },
    { value: 'North Dakota', label: 'North Dakota' },
    { value: 'Ohio', label: 'Ohio' },
    { value: 'Oklahoma', label: 'Oklahoma' },
    { value: 'Oregon', label: 'Oregon' },
    { value: 'Pennsylvania', label: 'Pennsylvania' },
    { value: 'Rhode Island', label: 'Rhode Island' },
    { value: 'South Carolina', label: 'South Carolina' },
    { value: 'South Dakota', label: 'South Dakota' },
    { value: 'Tennessee', label: 'Tennessee' },
    { value: 'Texas', label: 'Texas' },
    { value: 'Utah', label: 'Utah' },
    { value: 'Vermont', label: 'Vermont' },
    { value: 'Virginia', label: 'Virginia' },
    { value: 'Washington', label: 'Washington' },
    { value: 'West Virginia', label: 'West Virginia' },
    { value: 'Wisconsin', label: 'Wisconsin' },
    { value: 'Wyoming', label: 'Wyoming' },
  ];

  const CLOSING_STEPS = [
    {
      type: 'choice',
      question: 'How soon do you want to be contacted?',
      field: 'contact_urgency',
      choices: [
        { label: 'Immediately', value: 'immediately' },
        { label: 'Within a week', value: 'within_a_week' },
        { label: 'Within a month', value: 'within_a_month' },
        { label: "I'm just looking", value: 'just_looking' },
      ],
    },
    { type: 'name', question: "What's your full name?" },
    { type: 'email', question: "What's your email address?" },
    { type: 'phone', question: "Let's verify your phone number" },
    { type: 'otp' },
    { type: 'done' },
  ];

  function init(config) {
    _config = config;
    _steps = [...config.steps, ...CLOSING_STEPS];
    _current = 0;
    _answers = {};
    _render(0);
  }

  function back() {
    if (_current > 0) _render(_current - 1);
  }

  function select(field, value) {
    _answers[field] = value;
    _render(_current + 1);
  }

  function continueFromInput(field, inputId) {
    const el = document.getElementById(inputId);
    const val = el ? el.value.trim() : '';
    if (!val) { _shake(el); return; }
    _answers[field] = val;
    _render(_current + 1);
  }

  function submitName() {
    const first = document.getElementById('lp-first-name').value.trim();
    const last = document.getElementById('lp-last-name').value.trim();
    if (!first) { _shake(document.getElementById('lp-first-name')); return; }
    if (!last) { _shake(document.getElementById('lp-last-name')); return; }
    _answers.first_name = first;
    _answers.last_name = last;
    _render(_current + 1);
  }

  function submitEmail() {
    const email = document.getElementById('lp-email').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      _shake(document.getElementById('lp-email')); return;
    }
    _answers.email = email;
    _render(_current + 1);
  }

  async function sendCode() {
    const rawPhone = document.getElementById('lp-phone-input').value.trim();
    if (!rawPhone) { _shake(document.getElementById('lp-phone-input')); return; }
    const digits = rawPhone.replace(/\D/g, '');
    if (digits.length < 10) { _shake(document.getElementById('lp-phone-input')); return; }
    _phone = rawPhone;
    _answers.phone = rawPhone;

    const btn = document.getElementById('lp-send-btn');
    const errEl = document.getElementById('lp-phone-err');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    errEl.style.display = 'none';

    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: rawPhone }),
      });
      if (!res.ok) throw new Error();
      _render(_current + 1);
    } catch {
      btn.disabled = false;
      btn.textContent = 'Send My Code';
      errEl.textContent = 'Something went wrong sending your code. Please try again.';
      errEl.style.display = '';
    }
  }

  async function verifyOtp() {
    const code = [...document.querySelectorAll('.lp-otp-digit')].map(d => d.value).join('');
    if (code.length < 6) {
      const errEl = document.getElementById('lp-otp-err');
      errEl.textContent = 'Please enter all 6 digits.';
      errEl.style.display = '';
      return;
    }

    const btn = document.getElementById('lp-verify-btn');
    const errEl = document.getElementById('lp-otp-err');
    btn.disabled = true;
    btn.textContent = 'Verifying…';
    errEl.style.display = 'none';

    const payload = {
      code,
      ..._answers,
      coverage_type: _config.coverage_type,
      source_page: _config.source_page,
    };

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.error === 'invalid_code') {
        errEl.textContent = "That code didn’t match. Please try again or resend.";
        errEl.style.display = '';
        document.querySelectorAll('.lp-otp-digit').forEach(d => { d.value = ''; });
        document.querySelector('.lp-otp-digit').focus();
        btn.disabled = false;
        btn.textContent = 'Verify & Submit';
        return;
      }
      if (!res.ok || !json.ok) throw new Error();
      clearInterval(_resendInterval);
      _render(_current + 1);
    } catch {
      btn.disabled = false;
      btn.textContent = 'Verify & Submit';
      errEl.textContent = 'Something went wrong. Please try again.';
      errEl.style.display = '';
    }
  }

  async function resendCode(e) {
    e.preventDefault();
    const link = document.getElementById('lp-resend-link');
    if (link.dataset.disabled === 'true') return;
    link.dataset.disabled = 'true';
    try {
      await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: _phone }),
      });
      _startResendTimer();
    } catch {
      link.dataset.disabled = 'false';
    }
  }

  function _startResendTimer() {
    let secs = 30;
    const timerEl = document.getElementById('lp-resend-timer');
    const linkEl = document.getElementById('lp-resend-link');
    if (!timerEl || !linkEl) return;
    linkEl.dataset.disabled = 'true';
    linkEl.style.opacity = '.4';
    timerEl.textContent = `(${secs}s)`;
    clearInterval(_resendInterval);
    _resendInterval = setInterval(() => {
      secs--;
      if (secs <= 0) {
        clearInterval(_resendInterval);
        timerEl.textContent = '';
        linkEl.style.opacity = '1';
        linkEl.dataset.disabled = 'false';
      } else {
        timerEl.textContent = `(${secs}s)`;
      }
    }, 1000);
  }

  function _render(n) {
    _current = n;
    const step = _steps[n];
    const total = _steps.length - 1;
    const pct = Math.round((n / total) * 100);

    document.getElementById('lp-progress-fill').style.width = pct + '%';
    document.getElementById('lp-step-label').textContent =
      step.type === 'done' ? 'Complete!' : `Step ${n + 1} of ${total}`;

    const backBtn = document.getElementById('lp-back-btn');
    backBtn.style.visibility = n === 0 ? 'hidden' : 'visible';

    const container = document.getElementById('lp-step');
    container.innerHTML = _buildStepHtml(step);

    if (step.type === 'otp') {
      _bindOtpInputs();
      _startResendTimer();
    }

    document.getElementById('lp-main').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function _buildStepHtml(step) {
    switch (step.type) {
      case 'choice':   return _choiceHtml(step);
      case 'dropdown': return _dropdownHtml(step);
      case 'name':     return _nameHtml(step);
      case 'email':    return _emailHtml(step);
      case 'phone':    return _phoneHtml(step);
      case 'otp':      return _otpHtml();
      case 'done':     return _doneHtml();
      default:         return '';
    }
  }

  function _esc(str) {
    return String(str).replace(/'/g, "\\'");
  }

  function _choiceHtml(step) {
    const choices = step.choices.map(c =>
      `<button class="lp-choice" onclick="lpWizard.select('${_esc(step.field)}', '${_esc(c.value)}')">${c.label}</button>`
    ).join('\n');
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${step.question}</h2>
      <div class="lp-choices">${choices}</div>
    </div>`;
  }

  function _dropdownHtml(step) {
    const opts = step.options.map(o =>
      `<option value="${o.value}">${o.label}</option>`
    ).join('\n');
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${step.question}</h2>
      <div class="lp-input-wrap">
        <select class="lp-select" id="lp-input-${step.field}">
          <option value="">Select&hellip;</option>
          ${opts}
        </select>
        <button class="lp-btn-primary" onclick="lpWizard.continueFromInput('${_esc(step.field)}', 'lp-input-${step.field}')">Continue &rarr;</button>
      </div>
    </div>`;
  }

  function _nameHtml(step) {
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${step.question}</h2>
      <div class="lp-input-wrap">
        <input type="text" class="lp-input" id="lp-first-name" placeholder="First name" autocomplete="given-name">
        <input type="text" class="lp-input" id="lp-last-name" placeholder="Last name" autocomplete="family-name">
        <button class="lp-btn-primary" onclick="lpWizard.submitName()">Continue &rarr;</button>
      </div>
    </div>`;
  }

  function _emailHtml(step) {
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${step.question}</h2>
      <div class="lp-input-wrap">
        <input type="email" class="lp-input" id="lp-email" placeholder="your@email.com" autocomplete="email">
        <button class="lp-btn-primary" onclick="lpWizard.submitEmail()">Continue &rarr;</button>
      </div>
    </div>`;
  }

  function _phoneHtml(step) {
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${step.question}</h2>
      <p class="lp-step-sub">We’ll text you a 6-digit code to confirm your number.</p>
      <div class="lp-input-wrap">
        <input type="tel" class="lp-input" id="lp-phone-input" placeholder="(555) 000-0000" autocomplete="tel">
        <p class="lp-err" id="lp-phone-err" style="display:none"></p>
        <button class="lp-btn-primary lp-btn-gold" id="lp-send-btn" onclick="lpWizard.sendCode()">Send My Code</button>
      </div>
      <p class="lp-disclaimer">By providing your number you consent to receive SMS texts from Engel Financial Group. Msg &amp; data rates may apply. Reply STOP to opt out.</p>
    </div>`;
  }

  function _otpHtml() {
    const display = _phone ? ` to ${_phone}` : '';
    return `<div class="lp-step-inner">
      <h2 class="lp-question">Enter the 6-digit code we sent${display}</h2>
      <p class="lp-step-sub">Check your text messages. The code expires in 10 minutes.</p>
      <div class="lp-otp-row">
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" aria-label="Digit 1">
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" aria-label="Digit 2">
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" aria-label="Digit 3">
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" aria-label="Digit 4">
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" aria-label="Digit 5">
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" aria-label="Digit 6">
      </div>
      <p class="lp-err" id="lp-otp-err" style="display:none"></p>
      <button class="lp-btn-primary" id="lp-verify-btn" onclick="lpWizard.verifyOtp()">Verify &amp; Submit</button>
      <p class="lp-resend-row">Didn’t get it? <a href="#" class="lp-resend-link" id="lp-resend-link" data-disabled="true" onclick="lpWizard.resendCode(event)" style="opacity:.4">Resend code</a> <span id="lp-resend-timer"></span></p>
    </div>`;
  }

  function _doneHtml() {
    return `<div class="lp-step-inner lp-done-screen">
      <div class="lp-done-check">&#10003;</div>
      <h2 class="lp-question">You’re all set, ${_answers.first_name}!</h2>
      <p class="lp-step-sub">A licensed agent from Engel Financial Group will reach out to you within 24 hours. We look forward to helping you.</p>
    </div>`;
  }

  function _bindOtpInputs() {
    const inputs = document.querySelectorAll('.lp-otp-digit');
    inputs.forEach((el, i, all) => {
      el.addEventListener('input', () => {
        el.value = el.value.replace(/\D/g, '').slice(0, 1);
        if (el.value && i < all.length - 1) all[i + 1].focus();
      });
      el.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !el.value && i > 0) all[i - 1].focus();
      });
      el.addEventListener('paste', e => {
        e.preventDefault();
        const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
        [...all].forEach((d, idx) => { d.value = pasted[idx] || ''; });
        all[Math.min(pasted.length, all.length - 1)].focus();
      });
    });
    inputs[0].focus();
  }

  function _shake(el) {
    if (!el) return;
    el.classList.remove('lp-shake');
    void el.offsetWidth;
    el.classList.add('lp-shake');
    el.focus();
  }

  return { init, back, select, continueFromInput, submitName, submitEmail, sendCode, verifyOtp, resendCode, AGE_OPTIONS, STATE_OPTIONS };
})();
```

- [ ] **Step 3: Verify file saved correctly**

```powershell
(Get-Content "c:\Users\Gaming PC\Desktop\project_andrew\js\lp-wizard.js" | Measure-Object -Line).Lines
```

Expected: 250+ lines.

- [ ] **Step 4: Commit**

```powershell
git add js/lp-wizard.js
git commit -m "feat: add shared LP wizard IIFE module with AGE_OPTIONS and STATE_OPTIONS"
```

---

## Task 2: Build `lp/life-insurance.html` (Template Page)

**Files:**
- Create: `lp/life-insurance.html`

This is the reference design. All subsequent pages share the same CSS structure and trust section — only `<title>`, `<meta name="description">`, and the `lpWizard.init()` call differ.

- [ ] **Step 1: Create `lp/life-insurance.html` with full content**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Life Insurance Quote — Engel Financial Group</title>
  <meta name="description" content="Get a free life insurance quote in minutes. No obligation.">
  <meta name="robots" content="noindex">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --navy: #111d2b;
      --navy-mid: #1a2d3f;
      --navy-light: #243851;
      --gold: #b87333;
      --gold-light: #bd9468;
      --warm-white: #fbf3da;
      --off-white: #f5ede0;
      --text-dark: #111d2b;
      --text-mid: #3c4c62;
      --text-soft: #6b7a8d;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Jost', sans-serif;
      background: var(--warm-white);
      color: var(--text-dark);
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    /* Progress bar */
    .lp-progress {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 3px;
      background: rgba(17,29,43,0.12);
      z-index: 200;
    }
    #lp-progress-fill {
      height: 100%;
      background: var(--gold);
      transition: width 0.45s cubic-bezier(.4,0,.2,1);
      width: 0%;
    }

    /* Header */
    .lp-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--navy);
      padding: 0 1.25rem;
    }
    .lp-header-inner {
      max-width: 640px;
      margin: 0 auto;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .lp-logo img {
      height: 38px;
      width: auto;
      display: block;
    }
    .lp-phone-link {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-decoration: none;
      color: var(--warm-white);
      gap: 1px;
    }
    .lp-phone-link span {
      font-size: 0.65rem;
      font-weight: 400;
      letter-spacing: 0.06em;
      color: var(--gold-light);
      text-transform: uppercase;
    }
    .lp-phone-link strong {
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.01em;
    }
    .lp-phone-link:hover strong { color: var(--gold); }
    .lp-phone-link:focus-visible { outline: 2px solid var(--gold); outline-offset: 4px; border-radius: 2px; }

    /* Main wizard area */
    #lp-main {
      min-height: calc(100vh - 60px);
      padding: 2rem 1.25rem 5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Controls bar (Back + Step label) */
    .lp-controls {
      width: 100%;
      max-width: 640px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      min-height: 36px;
    }
    #lp-back-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-mid);
      font-family: 'Jost', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0;
      transition: color 0.15s;
      visibility: hidden;
    }
    #lp-back-btn:hover { color: var(--gold); }
    #lp-back-btn:focus-visible { outline: 2px solid var(--gold); outline-offset: 4px; border-radius: 2px; }
    #lp-back-btn svg { width: 16px; height: 16px; }
    #lp-step-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-soft);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    /* Step container */
    #lp-step {
      width: 100%;
      max-width: 640px;
    }
    .lp-step-inner {
      animation: lpStepIn 0.28s cubic-bezier(.4,0,.2,1);
    }
    @keyframes lpStepIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .lp-question {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.65rem, 5vw, 2.25rem);
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--navy);
      line-height: 1.2;
      margin-bottom: 1.75rem;
    }
    .lp-step-sub {
      font-size: 0.925rem;
      color: var(--text-soft);
      margin-top: -1.25rem;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    /* Choice buttons */
    .lp-choices { display: flex; flex-direction: column; gap: 0.7rem; }
    .lp-choice {
      display: block;
      width: 100%;
      padding: 1.1rem 1.5rem;
      background: white;
      border: 2px solid rgba(17,29,43,0.09);
      border-radius: 12px;
      font-family: 'Jost', sans-serif;
      font-size: 1.05rem;
      font-weight: 400;
      color: var(--text-dark);
      text-align: left;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s, transform 0.12s, box-shadow 0.15s;
      box-shadow: 0 2px 8px rgba(17,29,43,0.05);
    }
    .lp-choice:hover {
      border-color: var(--gold);
      background: #fffbf5;
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(17,29,43,0.09);
    }
    .lp-choice:active { transform: translateY(0); }
    .lp-choice:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; border-radius: 12px; }

    /* Inputs */
    .lp-input-wrap { display: flex; flex-direction: column; gap: 0.75rem; }
    .lp-input, .lp-select {
      width: 100%;
      padding: 1rem 1.25rem;
      border: 2px solid rgba(17,29,43,0.15);
      border-radius: 10px;
      font-family: 'Jost', sans-serif;
      font-size: 1.05rem;
      color: var(--text-dark);
      background: white;
      transition: border-color 0.15s;
      -webkit-appearance: none;
      appearance: none;
    }
    .lp-select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b7a8d' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1.25rem center;
      padding-right: 3rem;
    }
    .lp-input:focus, .lp-select:focus { outline: none; border-color: var(--gold); }
    .lp-input::placeholder { color: var(--text-soft); }

    /* Primary button */
    .lp-btn-primary {
      width: 100%;
      padding: 1rem 1.5rem;
      background: var(--navy);
      color: var(--warm-white);
      border: none;
      border-radius: 10px;
      font-family: 'Jost', sans-serif;
      font-size: 1.05rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.12s;
      letter-spacing: 0.01em;
    }
    .lp-btn-primary:hover { background: var(--navy-mid); transform: translateY(-1px); }
    .lp-btn-primary:active { transform: translateY(0); }
    .lp-btn-primary:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
    .lp-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .lp-btn-gold { background: var(--gold); }
    .lp-btn-gold:hover { background: #a36628; }

    /* OTP */
    .lp-otp-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }
    .lp-otp-digit {
      flex: 1;
      height: 3.5rem;
      border: 2px solid rgba(17,29,43,0.15);
      border-radius: 10px;
      text-align: center;
      font-family: 'Jost', sans-serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--navy);
      background: white;
      transition: border-color 0.15s;
      -webkit-appearance: none;
      appearance: none;
    }
    .lp-otp-digit:focus { outline: none; border-color: var(--gold); }
    .lp-resend-row {
      text-align: center;
      font-size: 0.875rem;
      color: var(--text-soft);
      margin-top: 1rem;
    }
    .lp-resend-link { color: var(--gold); text-decoration: none; }
    .lp-resend-link:hover { text-decoration: underline; }

    /* Error + disclaimer */
    .lp-err {
      font-size: 0.875rem;
      color: #b92b27;
      line-height: 1.4;
    }
    .lp-disclaimer {
      font-size: 0.72rem;
      color: var(--text-soft);
      line-height: 1.55;
      margin-top: 0.5rem;
    }

    /* Shake */
    @keyframes lpShake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
    .lp-shake { animation: lpShake 0.5s ease; }

    /* Done screen */
    .lp-done-screen { text-align: center; padding: 2.5rem 0; }
    .lp-done-check {
      width: 72px; height: 72px;
      border-radius: 50%;
      background: var(--gold);
      color: white;
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 24px rgba(184,115,51,0.35);
    }

    /* Trust section */
    .lp-trust {
      background: var(--navy);
      padding: 3.5rem 1.25rem;
    }
    .lp-trust-inner {
      max-width: 640px;
      margin: 0 auto;
    }
    .lp-trust h3 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.6rem;
      font-weight: 600;
      color: var(--warm-white);
      margin-bottom: 2rem;
      letter-spacing: -0.01em;
    }
    .lp-trust-steps { display: flex; flex-direction: column; gap: 1.5rem; }
    .lp-trust-step { display: flex; gap: 1rem; align-items: flex-start; }
    .lp-trust-num {
      flex-shrink: 0;
      width: 32px; height: 32px;
      border-radius: 50%;
      background: var(--gold);
      color: white;
      font-size: 0.85rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
    }
    .lp-trust-text strong { display: block; color: var(--warm-white); font-size: 0.95rem; font-weight: 600; margin-bottom: 0.2rem; }
    .lp-trust-text p { color: var(--gold-light); font-size: 0.875rem; line-height: 1.55; }

    /* Footer */
    .lp-footer {
      background: var(--navy);
      border-top: 1px solid rgba(255,255,255,0.07);
      padding: 1.5rem 1.25rem;
      text-align: center;
    }
    .lp-footer p { font-size: 0.72rem; color: var(--text-soft); line-height: 1.7; }
    .lp-footer a { color: var(--gold-light); text-decoration: none; }
    .lp-footer a:hover { text-decoration: underline; }

    @media (min-width: 480px) {
      .lp-otp-row { gap: 0.75rem; }
    }
  </style>
</head>
<body>

  <div class="lp-progress">
    <div id="lp-progress-fill"></div>
  </div>

  <header class="lp-header">
    <div class="lp-header-inner">
      <a href="/" class="lp-logo">
        <img src="/brand_assets/engel-financial-group.jpg" alt="Engel Financial Group">
      </a>
      <a href="tel:+15016915508" class="lp-phone-link">
        <span>Call us for help</span>
        <strong>(501) 691-5508</strong>
      </a>
    </div>
  </header>

  <main id="lp-main">
    <div class="lp-controls">
      <button id="lp-back-btn" onclick="lpWizard.back()" aria-label="Go back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>
      <span id="lp-step-label"></span>
    </div>
    <div id="lp-step"></div>
  </main>

  <section class="lp-trust">
    <div class="lp-trust-inner">
      <h3>How it works</h3>
      <div class="lp-trust-steps">
        <div class="lp-trust-step">
          <div class="lp-trust-num">1</div>
          <div class="lp-trust-text">
            <strong>Answer a few quick questions</strong>
            <p>Takes about 2 minutes. No social security number or medical records required.</p>
          </div>
        </div>
        <div class="lp-trust-step">
          <div class="lp-trust-num">2</div>
          <div class="lp-trust-text">
            <strong>Verify your identity</strong>
            <p>We send a quick text to confirm it's you — no spam, ever.</p>
          </div>
        </div>
        <div class="lp-trust-step">
          <div class="lp-trust-num">3</div>
          <div class="lp-trust-text">
            <strong>Speak with a licensed agent</strong>
            <p>Andrew Engel, licensed insurance advisor, will personally reach out within 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="lp-footer">
    <p>
      &copy; 2025 Engel Financial Group. All rights reserved.<br>
      Licensed insurance professional. This site is not affiliated with or endorsed by any government agency.<br>
      <a href="/privacy-policy.html">Privacy Policy</a> &nbsp;&middot;&nbsp;
      <a href="/terms-of-service.html">Terms of Service</a> &nbsp;&middot;&nbsp;
      <a href="/tcpa-compliance.html">TCPA Compliance</a>
    </p>
  </footer>

  <script src="/js/lp-wizard.js"></script>
  <script>
    lpWizard.init({
      coverage_type: 'Life Insurance',
      source_page: '/lp/life-insurance',
      steps: [
        {
          type: 'dropdown',
          question: 'How old are you?',
          field: 'age',
          options: lpWizard.AGE_OPTIONS,
        },
        {
          type: 'dropdown',
          question: 'What state do you live in?',
          field: 'state',
          options: lpWizard.STATE_OPTIONS,
        },
        {
          type: 'choice',
          question: 'Who depends on you financially?',
          field: 'beneficiary',
          choices: [
            { label: 'Spouse or partner', value: 'spouse_partner' },
            { label: 'Children', value: 'children' },
            { label: 'Parent', value: 'parent' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          type: 'choice',
          question: 'Which type of life insurance are you looking for?',
          field: 'coverage_subtype',
          choices: [
            { label: 'Term Life', value: 'Term' },
            { label: 'Whole Life', value: 'Whole Life' },
            { label: 'IUL (Indexed Universal Life)', value: 'IUL' },
            { label: 'Not sure — need help deciding', value: 'Not sure' },
          ],
        },
        {
          type: 'choice',
          question: 'What is your gender?',
          field: 'gender',
          choices: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ],
        },
        {
          type: 'choice',
          question: 'Do you use tobacco products?',
          field: 'tobacco',
          choices: [
            { label: 'No', value: 'no' },
            { label: 'Yes', value: 'yes' },
          ],
        },
        {
          type: 'choice',
          question: 'How would you describe your overall health?',
          field: 'health',
          choices: [
            { label: 'Great', value: 'great' },
            { label: 'Fair', value: 'fair' },
            { label: 'Poor', value: 'poor' },
          ],
        },
      ],
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Start the local server (skip if already running)**

```powershell
Start-Process node -ArgumentList "serve.mjs" -WorkingDirectory "c:\Users\Gaming PC\Desktop\project_andrew"
Start-Sleep -Seconds 2
```

- [ ] **Step 3: Screenshot the first step**

```powershell
node screenshot.mjs http://localhost:3000/lp/life-insurance.html step1
```

Read the saved file from `temporary screenshots/` and verify:
- Progress bar visible at top
- Header shows logo (left) and phone number (right) on navy background
- Back button visible (hidden on first step)
- Step label shows "Step 1 of 13" (7 service + 6 closing steps)
- Question text in Cormorant Garamond, large
- Dropdown rendered with "Select…" placeholder
- Continue → button in navy

- [ ] **Step 4: Screenshot the trust section (scroll down)**

```powershell
node screenshot.mjs http://localhost:3000/lp/life-insurance.html trust
```

Read the screenshot and verify:
- "How it works" heading in Cormorant Garamond
- 3 numbered steps with gold circles
- Navy background throughout

- [ ] **Step 5: Commit**

```powershell
git add lp/life-insurance.html
git commit -m "feat: add life insurance landing page wizard"
```

---

## Task 3: Build `lp/whole-life.html`

**Files:**
- Create: `lp/whole-life.html`

- [ ] **Step 1: Copy `lp/life-insurance.html` to `lp/whole-life.html`**

```powershell
Copy-Item "c:\Users\Gaming PC\Desktop\project_andrew\lp\life-insurance.html" "c:\Users\Gaming PC\Desktop\project_andrew\lp\whole-life.html"
```

- [ ] **Step 2: Make the following exact changes in `lp/whole-life.html`**

Change `<title>`:
```
Whole Life Insurance Quote — Engel Financial Group
```

Change `<meta name="description" content="...">`:
```
Get a free whole life insurance quote in minutes. No obligation.
```

Replace the entire `<script>` block at the bottom (after `<script src="/js/lp-wizard.js"></script>`) with:

```html
  <script>
    lpWizard.init({
      coverage_type: 'Whole Life Insurance',
      source_page: '/lp/whole-life',
      steps: [
        {
          type: 'dropdown',
          question: 'How old are you?',
          field: 'age',
          options: lpWizard.AGE_OPTIONS,
        },
        {
          type: 'dropdown',
          question: 'What state do you live in?',
          field: 'state',
          options: lpWizard.STATE_OPTIONS,
        },
        {
          type: 'choice',
          question: 'Who depends on you financially?',
          field: 'beneficiary',
          choices: [
            { label: 'Spouse or partner', value: 'spouse_partner' },
            { label: 'Children', value: 'children' },
            { label: 'Parent', value: 'parent' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          type: 'choice',
          question: 'What coverage amount are you looking for?',
          field: 'coverage_amount',
          choices: [
            { label: '$25,000', value: '$25,000' },
            { label: '$50,000', value: '$50,000' },
            { label: '$100,000', value: '$100,000' },
            { label: '$250,000+', value: '$250,000+' },
          ],
        },
        {
          type: 'choice',
          question: 'What is your gender?',
          field: 'gender',
          choices: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ],
        },
        {
          type: 'choice',
          question: 'Do you use tobacco products?',
          field: 'tobacco',
          choices: [
            { label: 'No', value: 'no' },
            { label: 'Yes', value: 'yes' },
          ],
        },
        {
          type: 'choice',
          question: 'How would you describe your overall health?',
          field: 'health',
          choices: [
            { label: 'Great', value: 'great' },
            { label: 'Fair', value: 'fair' },
            { label: 'Poor', value: 'poor' },
          ],
        },
      ],
    });
  </script>
```

- [ ] **Step 3: Screenshot and verify**

```powershell
node screenshot.mjs http://localhost:3000/lp/whole-life.html step1
```

Read screenshot. Verify title bar shows "Whole Life Insurance Quote" and the first question loads.

- [ ] **Step 4: Commit**

```powershell
git add lp/whole-life.html
git commit -m "feat: add whole life insurance landing page wizard"
```

---

## Task 4: Build `lp/iul.html`

**Files:**
- Create: `lp/iul.html`

- [ ] **Step 1: Copy template**

```powershell
Copy-Item "c:\Users\Gaming PC\Desktop\project_andrew\lp\life-insurance.html" "c:\Users\Gaming PC\Desktop\project_andrew\lp\iul.html"
```

- [ ] **Step 2: Make exact changes in `lp/iul.html`**

Change `<title>`:
```
IUL Quote — Engel Financial Group
```

Change `<meta name="description" content="...">`:
```
Get a free indexed universal life insurance quote. Build tax-free wealth with downside protection.
```

Replace the `<script>` block:

```html
  <script>
    lpWizard.init({
      coverage_type: 'IUL',
      source_page: '/lp/iul',
      steps: [
        {
          type: 'dropdown',
          question: 'How old are you?',
          field: 'age',
          options: lpWizard.AGE_OPTIONS,
        },
        {
          type: 'dropdown',
          question: 'What state do you live in?',
          field: 'state',
          options: lpWizard.STATE_OPTIONS,
        },
        {
          type: 'choice',
          question: "What's your primary goal?",
          field: 'primary_goal',
          choices: [
            { label: 'Tax-free retirement income', value: 'Tax-free retirement income' },
            { label: 'Protect my family', value: 'Protect my family' },
            { label: 'Build tax-free wealth', value: 'Build tax-free wealth' },
            { label: 'Not sure', value: 'Not sure' },
          ],
        },
        {
          type: 'choice',
          question: 'What is your annual household income?',
          field: 'annual_income',
          choices: [
            { label: '$50k–$100k', value: '$50k–$100k' },
            { label: '$100k–$200k', value: '$100k–$200k' },
            { label: '$200k+', value: '$200k+' },
          ],
        },
        {
          type: 'choice',
          question: 'What is your gender?',
          field: 'gender',
          choices: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ],
        },
        {
          type: 'choice',
          question: 'Do you use tobacco products?',
          field: 'tobacco',
          choices: [
            { label: 'No', value: 'no' },
            { label: 'Yes', value: 'yes' },
          ],
        },
        {
          type: 'choice',
          question: 'How would you describe your overall health?',
          field: 'health',
          choices: [
            { label: 'Great', value: 'great' },
            { label: 'Fair', value: 'fair' },
            { label: 'Poor', value: 'poor' },
          ],
        },
      ],
    });
  </script>
```

- [ ] **Step 3: Screenshot and verify**

```powershell
node screenshot.mjs http://localhost:3000/lp/iul.html step1
```

Read screenshot. Verify title and first question load correctly.

- [ ] **Step 4: Commit**

```powershell
git add lp/iul.html
git commit -m "feat: add IUL landing page wizard"
```

---

## Task 5: Build `lp/annuities.html`

**Files:**
- Create: `lp/annuities.html`

- [ ] **Step 1: Copy template**

```powershell
Copy-Item "c:\Users\Gaming PC\Desktop\project_andrew\lp\life-insurance.html" "c:\Users\Gaming PC\Desktop\project_andrew\lp\annuities.html"
```

- [ ] **Step 2: Make exact changes in `lp/annuities.html`**

Change `<title>`:
```
Annuity Quote — Engel Financial Group
```

Change `<meta name="description" content="...">`:
```
Guaranteed income, principal protection, tax-deferred growth. Get a free annuity quote today.
```

Replace the `<script>` block:

```html
  <script>
    lpWizard.init({
      coverage_type: 'Annuities',
      source_page: '/lp/annuities',
      steps: [
        {
          type: 'dropdown',
          question: 'How old are you?',
          field: 'age',
          options: lpWizard.AGE_OPTIONS,
        },
        {
          type: 'dropdown',
          question: 'What state do you live in?',
          field: 'state',
          options: lpWizard.STATE_OPTIONS,
        },
        {
          type: 'choice',
          question: "What's your primary goal?",
          field: 'primary_goal',
          choices: [
            { label: 'Guaranteed lifetime income', value: 'Guaranteed lifetime income' },
            { label: 'Principal protection', value: 'Principal protection' },
            { label: 'Tax-deferred growth', value: 'Tax-deferred growth' },
            { label: 'Leave a legacy', value: 'Leave a legacy' },
          ],
        },
        {
          type: 'choice',
          question: 'When do you want to start receiving income?',
          field: 'income_start',
          choices: [
            { label: 'Now', value: 'Now' },
            { label: '1–5 years', value: '1–5 years' },
            { label: '5–10 years', value: '5–10 years' },
            { label: '10+ years', value: '10+ years' },
          ],
        },
        {
          type: 'choice',
          question: 'What is your approximate investable savings?',
          field: 'retirement_savings',
          choices: [
            { label: '$50k–$100k', value: '$50k–$100k' },
            { label: '$100k–$250k', value: '$100k–$250k' },
            { label: '$250k–$500k', value: '$250k–$500k' },
            { label: '$500k+', value: '$500k+' },
          ],
        },
      ],
    });
  </script>
```

- [ ] **Step 3: Screenshot and verify**

```powershell
node screenshot.mjs http://localhost:3000/lp/annuities.html step1
```

Read screenshot. Verify title and first question load correctly.

- [ ] **Step 4: Commit**

```powershell
git add lp/annuities.html
git commit -m "feat: add annuities landing page wizard"
```

---

## Task 6: Build `lp/mortgage-protection.html`

**Files:**
- Create: `lp/mortgage-protection.html`

- [ ] **Step 1: Copy template**

```powershell
Copy-Item "c:\Users\Gaming PC\Desktop\project_andrew\lp\life-insurance.html" "c:\Users\Gaming PC\Desktop\project_andrew\lp\mortgage-protection.html"
```

- [ ] **Step 2: Make exact changes in `lp/mortgage-protection.html`**

Change `<title>`:
```
Mortgage Protection Quote — Engel Financial Group
```

Change `<meta name="description" content="...">`:
```
Protect your home and family if something happens. Get a free mortgage protection quote.
```

Replace the `<script>` block:

```html
  <script>
    lpWizard.init({
      coverage_type: 'Mortgage Protection',
      source_page: '/lp/mortgage-protection',
      steps: [
        {
          type: 'dropdown',
          question: 'How old are you?',
          field: 'age',
          options: lpWizard.AGE_OPTIONS,
        },
        {
          type: 'dropdown',
          question: 'What state do you live in?',
          field: 'state',
          options: lpWizard.STATE_OPTIONS,
        },
        {
          type: 'choice',
          question: 'What is your mortgage status?',
          field: 'mortgage_status',
          choices: [
            { label: 'I have an active mortgage', value: 'Active mortgage' },
            { label: 'I just closed', value: 'Just closed' },
            { label: "I'm refinancing soon", value: 'Refinancing soon' },
            { label: "I'm planning to buy", value: 'Planning to buy' },
          ],
        },
        {
          type: 'choice',
          question: 'What is your approximate mortgage balance?',
          field: 'mortgage_balance',
          choices: [
            { label: '$50k–$150k', value: '$50k–$150k' },
            { label: '$150k–$300k', value: '$150k–$300k' },
            { label: '$300k–$500k', value: '$300k–$500k' },
            { label: '$500k+', value: '$500k+' },
          ],
        },
        {
          type: 'choice',
          question: 'Who else is on the mortgage?',
          field: 'mortgage_co_borrower',
          choices: [
            { label: 'Just me', value: 'Just me' },
            { label: 'Spouse or partner', value: 'Spouse or partner' },
            { label: 'Other', value: 'Other' },
          ],
        },
        {
          type: 'choice',
          question: 'What is your gender?',
          field: 'gender',
          choices: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ],
        },
        {
          type: 'choice',
          question: 'Do you use tobacco products?',
          field: 'tobacco',
          choices: [
            { label: 'No', value: 'no' },
            { label: 'Yes', value: 'yes' },
          ],
        },
        {
          type: 'choice',
          question: 'How would you describe your overall health?',
          field: 'health',
          choices: [
            { label: 'Great', value: 'great' },
            { label: 'Fair', value: 'fair' },
            { label: 'Poor', value: 'poor' },
          ],
        },
      ],
    });
  </script>
```

- [ ] **Step 3: Screenshot and verify**

```powershell
node screenshot.mjs http://localhost:3000/lp/mortgage-protection.html step1
```

Read screenshot. Verify title and first question load correctly.

- [ ] **Step 4: Commit**

```powershell
git add lp/mortgage-protection.html
git commit -m "feat: add mortgage protection landing page wizard"
```

---

## Task 7: Build `lp/retirement-planning.html`

**Files:**
- Create: `lp/retirement-planning.html`

- [ ] **Step 1: Copy template**

```powershell
Copy-Item "c:\Users\Gaming PC\Desktop\project_andrew\lp\life-insurance.html" "c:\Users\Gaming PC\Desktop\project_andrew\lp\retirement-planning.html"
```

- [ ] **Step 2: Make exact changes in `lp/retirement-planning.html`**

Change `<title>`:
```
Retirement Planning Quote — Engel Financial Group
```

Change `<meta name="description" content="...">`:
```
Personalized retirement strategies for any stage. Get a free retirement planning consultation.
```

Replace the `<script>` block:

```html
  <script>
    lpWizard.init({
      coverage_type: 'Retirement Planning',
      source_page: '/lp/retirement-planning',
      steps: [
        {
          type: 'dropdown',
          question: 'How old are you?',
          field: 'age',
          options: lpWizard.AGE_OPTIONS,
        },
        {
          type: 'dropdown',
          question: 'What state do you live in?',
          field: 'state',
          options: lpWizard.STATE_OPTIONS,
        },
        {
          type: 'choice',
          question: 'When do you plan to retire?',
          field: 'retirement_timeline',
          choices: [
            { label: 'Already retired', value: 'Already retired' },
            { label: 'Within 5 years', value: 'Within 5 years' },
            { label: '5–10 years', value: '5–10 years' },
            { label: '10+ years', value: '10+ years' },
          ],
        },
        {
          type: 'choice',
          question: 'What is your biggest retirement concern?',
          field: 'primary_goal',
          choices: [
            { label: 'Running out of money', value: 'Running out of money' },
            { label: 'Tax burden', value: 'Tax burden' },
            { label: 'Healthcare costs', value: 'Healthcare costs' },
            { label: 'Leaving a legacy', value: 'Leaving a legacy' },
          ],
        },
        {
          type: 'choice',
          question: 'What are your current retirement savings?',
          field: 'retirement_savings',
          choices: [
            { label: '$0–$50k', value: '$0–$50k' },
            { label: '$50k–$200k', value: '$50k–$200k' },
            { label: '$200k–$500k', value: '$200k–$500k' },
            { label: '$500k+', value: '$500k+' },
          ],
        },
        {
          type: 'choice',
          question: 'What is your employment status?',
          field: 'employment_status',
          choices: [
            { label: 'Employed', value: 'Employed' },
            { label: 'Self-employed', value: 'Self-employed' },
            { label: 'Retired', value: 'Retired' },
          ],
        },
      ],
    });
  </script>
```

- [ ] **Step 3: Screenshot and verify**

```powershell
node screenshot.mjs http://localhost:3000/lp/retirement-planning.html step1
```

Read screenshot. Verify title and first question load correctly.

- [ ] **Step 4: Commit**

```powershell
git add lp/retirement-planning.html
git commit -m "feat: add retirement planning landing page wizard"
```

---

## Task 8: Build `lp/advanced-markets.html`

**Files:**
- Create: `lp/advanced-markets.html`

- [ ] **Step 1: Copy template**

```powershell
Copy-Item "c:\Users\Gaming PC\Desktop\project_andrew\lp\life-insurance.html" "c:\Users\Gaming PC\Desktop\project_andrew\lp\advanced-markets.html"
```

- [ ] **Step 2: Make exact changes in `lp/advanced-markets.html`**

Change `<title>`:
```
Advanced Markets Quote — Engel Financial Group
```

Change `<meta name="description" content="...">`:
```
Business succession, executive benefits, estate planning. Speak with a licensed advanced markets specialist.
```

Replace the `<script>` block:

```html
  <script>
    lpWizard.init({
      coverage_type: 'Advanced Markets',
      source_page: '/lp/advanced-markets',
      steps: [
        {
          type: 'dropdown',
          question: 'How old are you?',
          field: 'age',
          options: lpWizard.AGE_OPTIONS,
        },
        {
          type: 'dropdown',
          question: 'What state do you live in?',
          field: 'state',
          options: lpWizard.STATE_OPTIONS,
        },
        {
          type: 'choice',
          question: 'What best describes you?',
          field: 'describes_you',
          choices: [
            { label: 'Business owner', value: 'Business owner' },
            { label: 'High-income professional', value: 'High-income professional' },
            { label: 'Retiree', value: 'Retiree' },
            { label: 'Other', value: 'Other' },
          ],
        },
        {
          type: 'choice',
          question: 'What is your primary goal?',
          field: 'primary_goal',
          choices: [
            { label: 'Business succession', value: 'Business succession' },
            { label: 'Executive benefits', value: 'Executive benefits' },
            { label: 'Estate planning', value: 'Estate planning' },
            { label: 'Tax-efficient wealth transfer', value: 'Tax-efficient wealth transfer' },
          ],
        },
        {
          type: 'choice',
          question: 'What is your annual income?',
          field: 'annual_income',
          choices: [
            { label: '$100k–$250k', value: '$100k–$250k' },
            { label: '$250k–$500k', value: '$250k–$500k' },
            { label: '$500k+', value: '$500k+' },
          ],
        },
      ],
    });
  </script>
```

- [ ] **Step 3: Screenshot and verify**

```powershell
node screenshot.mjs http://localhost:3000/lp/advanced-markets.html step1
```

Read screenshot. Verify title and first question load correctly.

- [ ] **Step 4: Commit**

```powershell
git add lp/advanced-markets.html
git commit -m "feat: add advanced markets landing page wizard"
```

---

## Task 9: Final QA — Screenshot All 7 Pages

**Files:** None (read-only verification)

- [ ] **Step 1: Screenshot all pages and verify each loads correctly**

Run each screenshot command, read the file after each:

```powershell
node screenshot.mjs http://localhost:3000/lp/life-insurance.html final-li
node screenshot.mjs http://localhost:3000/lp/whole-life.html final-wl
node screenshot.mjs http://localhost:3000/lp/iul.html final-iul
node screenshot.mjs http://localhost:3000/lp/annuities.html final-ann
node screenshot.mjs http://localhost:3000/lp/mortgage-protection.html final-mp
node screenshot.mjs http://localhost:3000/lp/retirement-planning.html final-rp
node screenshot.mjs http://localhost:3000/lp/advanced-markets.html final-am
```

For each screenshot, verify:
1. Progress bar at very top
2. Header: logo on left, phone on right, navy background
3. Back button (hidden on step 1, correct)
4. Step label shows correct count (e.g. "Step 1 of N")
5. First question rendered as a dropdown (age question)
6. Brand colors correct: navy text, gold accents
7. No layout breaks, no JS errors in console
8. Trust section visible when scrolling down
9. Footer visible with legal links

- [ ] **Step 2: Verify run order — check JS works by opening DevTools console**

In the screenshot script, there is no way to check console errors. Visually confirm that:
- The `#lp-step` div has content (not empty)
- The `#lp-progress-fill` shows some width
- The `#lp-step-label` has text

- [ ] **Step 3: Commit final QA pass**

```powershell
git add .
git commit -m "qa: verify all 7 landing pages render correctly"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| 7 landing pages at `/lp/` | Tasks 2–8 |
| One-question-per-screen wizard | Task 1 (lp-wizard.js) |
| Progress bar | Task 1 (`#lp-progress-fill`) |
| Back arrow | Task 1 (`lp-back-btn`) |
| Logo top, phone number | Task 2 header HTML |
| Auto-advance on choice buttons | Task 1 `select()` |
| Continue button for dropdowns/text | Task 1 `continueFromInput()` |
| Closing steps: urgency → name → email → phone → OTP → done | Task 1 `CLOSING_STEPS` |
| POST `/api/send-code` on phone step | Task 1 `sendCode()` |
| POST `/api/submit-lead` on OTP verify | Task 1 `verifyOtp()` |
| `coverage_type` and `source_page` in payload | Task 1 `verifyOtp()` payload |
| 30s resend timer on OTP step | Task 1 `_startResendTimer()` |
| Service-specific question sets (all 7) | Tasks 2–8 |
| "How it works" trust section | Task 2 HTML (copied to all) |
| Life Insurance questions (age/state/beneficiary/subtype/gender/tobacco/health) | Task 2 steps config |
| Whole Life questions (age/state/beneficiary/coverage_amount/gender/tobacco/health) | Task 3 |
| IUL questions (age/state/primary_goal/annual_income/gender/tobacco/health) | Task 4 |
| Annuities questions (age/state/primary_goal/income_start/retirement_savings) | Task 5 |
| Mortgage Protection questions (age/state/mortgage_status/mortgage_balance/co_borrower/gender/tobacco/health) | Task 6 |
| Retirement Planning questions (age/state/retirement_timeline/primary_goal/retirement_savings/employment_status) | Task 7 |
| Advanced Markets questions (age/state/describes_you/primary_goal/annual_income) | Task 8 |
| `noindex` meta tag (landing pages not for SEO) | Task 2 `<meta name="robots" content="noindex">` (copied to all) |
| Legal disclaimer on phone step | Task 1 `_phoneHtml()` |
| Brand fonts (Cormorant Garamond + Jost) | Task 2 CSS |
| Brand colors (navy/gold palette) | Task 2 CSS variables |
| Mobile-first responsive | Task 2 CSS (clamp, flex, no fixed widths) |
| TCPA/Privacy/Terms links in footer | Task 2 HTML |

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency:** `lpWizard.AGE_OPTIONS`, `lpWizard.STATE_OPTIONS` exported in Task 1 and consumed in Tasks 2–8. `select(field, value)`, `continueFromInput(field, inputId)`, `submitName()`, `submitEmail()`, `sendCode()`, `verifyOtp()`, `resendCode(e)`, `back()` — all defined in Task 1, all used in HTML generated by Task 1. No inconsistencies.
