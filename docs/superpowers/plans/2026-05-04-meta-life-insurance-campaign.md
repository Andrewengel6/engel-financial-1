# Meta Life Insurance Campaign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/lp/life-insurance.html` as a 10-step qualification wizard, add Meta Pixel + CAPI tracking, expand the Supabase leads schema with campaign/UTM/pipeline fields, and update `api/submit-lead.js` to store all new data.

**Architecture:** The wizard (`lp-wizard.js`) collects qualification answers + UTM params at init, captures contact info + sends OTP via a new combined `contactCapture` step, then fires pixel events at three funnel points. The server (`api/submit-lead.js`) stores all new fields and fires a server-side CAPI event after successful OTP verification. A Supabase migration adds all new columns first so nothing breaks existing records.

**Tech Stack:** Vanilla JS (lp-wizard.js), Node.js (Vercel serverless functions), Supabase (Postgres), Meta Conversions API (REST), Meta Pixel (browser fbq())

**Start the local server before testing any step:** `node serve.mjs` (serves at http://localhost:3000)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `supabase/migrations/003_campaign_fields.sql` | Create | Add 21 new nullable columns — wizard fields, UTM fields, pipeline fields |
| `js/lp-wizard.js` | Modify | Add UTM capture at init, `contactCapture` step type, pixel event helpers |
| `lp/life-insurance.html` | Modify (full rewrite) | 10-step general qualification wizard |
| `api/submit-lead.js` | Modify | New allowed fields, CAPI call after insert |
| `privacy-policy.html` | Modify | Add suppression audience sentence to Section 4 |

---

## Task 1: Supabase Migration — Campaign Fields

**Files:**
- Create: `supabase/migrations/003_campaign_fields.sql`

- [ ] **Step 1.1: Write the migration**

Create `supabase/migrations/003_campaign_fields.sql` with this exact content:

```sql
-- Campaign wizard fields
ALTER TABLE leads ADD COLUMN IF NOT EXISTS coverage_for   text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS product_interest text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS main_reason    text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_timing text;

-- UTM / attribution fields
ALTER TABLE leads ADD COLUMN IF NOT EXISTS landing_page_url text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS query_string     text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source       text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium       text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign     text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_adset        text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_content      text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_term         text;

-- Post-lead pipeline fields (updated manually by Andrew after calls)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contacted        boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contacted_at     timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS booked_call      boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS booked_at        timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS showed           boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS showed_at        timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS qualified        boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS quoted           boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS premium_amount   numeric;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sold             boolean;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS sold_at          timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS reason_unqualified text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_status      text;
```

Note: `age`, `health`, `tobacco` columns already exist from migration 001 — do not re-add them.

- [ ] **Step 1.2: Apply the migration in Supabase**

Go to Supabase Dashboard → SQL Editor → paste the SQL above → Run.

Expected: all `ALTER TABLE` statements complete with no errors. Existing rows are unaffected (all columns nullable, no defaults).

- [ ] **Step 1.3: Verify columns exist**

In Supabase SQL Editor run:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;
```

Expected: see `coverage_for`, `product_interest`, `main_reason`, `contact_timing`, all 8 UTM columns, and all 13 pipeline columns in the result.

- [ ] **Step 1.4: Commit**

```bash
git add supabase/migrations/003_campaign_fields.sql
git commit -m "feat: add campaign wizard, UTM, and pipeline columns to leads table"
```

---

## Task 2: lp-wizard.js — UTM Capture at Init

**Files:**
- Modify: `js/lp-wizard.js`

UTM params captured from the URL at wizard load are merged into `_answers` so they are automatically included in the OTP submission payload without any extra wiring.

- [ ] **Step 2.1: Add `_captureUtm()` function**

In `js/lp-wizard.js`, add this function directly after the `_safeHref` function (around line 791, before the `return` statement of the IIFE):

```js
  function _captureUtm() {
    try {
      const params = new URLSearchParams(window.location.search);
      return {
        landing_page_url: window.location.href,
        query_string:     window.location.search || '',
        utm_source:       params.get('utm_source')   || '',
        utm_medium:       params.get('utm_medium')   || '',
        utm_campaign:     params.get('utm_campaign') || '',
        utm_adset:        params.get('utm_adset')    || '',
        utm_content:      params.get('utm_content')  || '',
        utm_term:         params.get('utm_term')     || '',
      };
    } catch {
      return {};
    }
  }
```

- [ ] **Step 2.2: Call `_captureUtm()` in `init()`**

Find the `init(config)` function (around line 185). Add one line after `_answers = {};`:

```js
  function init(config) {
    _config = config;
    _steps = [...config.steps, ...(config.closingSteps ?? CLOSING_STEPS)];
    _current = 0;
    _answers = {};
    Object.assign(_answers, _captureUtm()); // ← add this line
    _multiAnswers = {};
    _phone = '';
    clearInterval(_resendInterval);
    _resendInterval = null;
    _render(0);
  }
```

- [ ] **Step 2.3: Update the public return value**

The `return` statement at the bottom of the IIFE currently does not expose `_captureUtm`. No change needed — it's internal. Confirm the return statement still reads:

```js
  return { init, back, select, continueFromInput, continueFromNumber, submitName, submitEmail, submitNameEmail, sendCode, verifyOtp, resendCode, AGE_OPTIONS, STATE_OPTIONS, ICONS };
```

- [ ] **Step 2.4: Verify manually**

Start the local server: `node serve.mjs`

Open: `http://localhost:3000/lp/whole-life.html?utm_source=test&utm_campaign=smoke`

Open browser DevTools → Console → type:

```js
lpWizard._answers  // will be undefined since _answers is private
```

Instead, after loading the page, open the Network tab and complete the OTP flow with a test phone number. Check the `/api/submit-lead` request payload — it should include `utm_source: "test"` and `utm_campaign: "smoke"`.

- [ ] **Step 2.5: Commit**

```bash
git add js/lp-wizard.js
git commit -m "feat: capture UTM params at wizard init and merge into submission payload"
```

---

## Task 3: lp-wizard.js — `contactCapture` Step Type

**Files:**
- Modify: `js/lp-wizard.js`

The `contactCapture` step replaces the separate `nameEmail` → `phone` flow with a single screen collecting name + email + phone + TCPA. It calls `/api/send-code` internally (like the existing `phone` step) before advancing to OTP.

- [ ] **Step 3.1: Add `_contactCaptureHtml()` render function**

Add this function after `_nameEmailHtml` (around line 716), before `_phoneHtml`:

```js
  function _contactCaptureHtml(step) {
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${_h(step.question || "Where should the licensed agent reach you?")}</h2>
      <div class="lp-input-wrap">
        <input type="text"  class="lp-input" id="lp-first-name"    placeholder="First name"        autocomplete="given-name"  aria-label="First name">
        <input type="text"  class="lp-input" id="lp-last-name"     placeholder="Last name"         autocomplete="family-name" aria-label="Last name">
        <input type="email" class="lp-input" id="lp-email"         placeholder="your@email.com"    autocomplete="email"       aria-label="Email address">
        <input type="tel"   inputmode="tel" class="lp-input" id="lp-phone-input" placeholder="(555) 000-0000" autocomplete="tel" aria-label="Phone number">
        <p class="lp-err" id="lp-phone-err" style="display:none"></p>
        <button class="lp-btn-primary lp-btn-gold" id="lp-contact-capture-btn">Continue &rarr;</button>
      </div>
      <p class="lp-disclaimer">By providing your information and clicking Continue, you consent to be contacted by a licensed insurance advisor from Engel Financial Group by phone, email, or SMS. By providing your phone number you consent to receive SMS texts. Msg &amp; data rates may apply. Reply STOP to opt out. Your information will not be sold or shared with unaffiliated third parties for their own marketing purposes.</p>
    </div>`;
  }
```

- [ ] **Step 3.2: Add `submitContactCapture()` handler function**

Add this function after `submitNameEmail` (around line 253), before `sendCode`:

```js
  async function submitContactCapture() {
    const first = document.getElementById('lp-first-name').value.trim();
    const last  = document.getElementById('lp-last-name').value.trim();
    const email = document.getElementById('lp-email').value.trim();
    const rawPhone = document.getElementById('lp-phone-input').value.trim();

    if (!first)  { _shake(document.getElementById('lp-first-name')); return; }
    if (!last)   { _shake(document.getElementById('lp-last-name'));  return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      _shake(document.getElementById('lp-email')); return;
    }
    const digits = rawPhone.replace(/\D/g, '');
    if (!rawPhone || (digits.length !== 10 && !(digits.length === 11 && digits[0] === '1'))) {
      _shake(document.getElementById('lp-phone-input')); return;
    }

    _answers.first_name = first;
    _answers.last_name  = last;
    _answers.email      = email;
    _answers.phone      = rawPhone;
    _phone = rawPhone;

    const btn   = document.getElementById('lp-contact-capture-btn');
    const errEl = document.getElementById('lp-phone-err');
    btn.disabled = true;
    btn.textContent = 'Sending code…';
    errEl.style.display = 'none';

    // Fire Lead pixel event — contact info captured
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead');
    }

    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: rawPhone }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        btn.disabled = false;
        btn.textContent = 'Continue →';
        errEl.textContent = errJson.error === 'too_many_attempts'
          ? 'Too many attempts. Please wait a few minutes and try again.'
          : 'Something went wrong sending your code. Please try again.';
        errEl.style.display = '';
        return;
      }
      _render(_current + 1);
    } catch {
      btn.disabled = false;
      btn.textContent = 'Continue →';
      errEl.textContent = 'Something went wrong sending your code. Please try again.';
      errEl.style.display = '';
    }
  }
```

- [ ] **Step 3.3: Register the new step type in `_buildStepHtml()`**

Find the `switch` statement in `_buildStepHtml` (around line 554). Add the new case:

```js
  function _buildStepHtml(step) {
    switch (step.type) {
      case 'choice':          return _choiceHtml(step);
      case 'dropdown':        return _dropdownHtml(step);
      case 'number':          return _numberHtml(step);
      case 'name':            return _nameHtml(step);
      case 'email':           return _emailHtml(step);
      case 'phone':           return _phoneHtml(step);
      case 'otp':             return _otpHtml();
      case 'done':            return _doneHtml();
      case 'multiChoice':     return _multiChoiceHtml(step);
      case 'interstitial':    return _interstitialHtml(step);
      case 'redirect':        return _redirectHtml(step);
      case 'choiceWithNote':  return _choiceWithNoteHtml(step);
      case 'nameEmail':       return _nameEmailHtml(step);
      case 'contactCapture':  return _contactCaptureHtml(step); // ← add this line
      default:                return '';
    }
  }
```

- [ ] **Step 3.4: Bind the `contactCapture` button in `_render()`**

In `_render()`, find the block that binds `nameEmailBtn` (around line 534). Add the binding directly after it:

```js
    const nameEmailBtn = container.querySelector('#lp-name-email-btn');
    if (nameEmailBtn) nameEmailBtn.addEventListener('click', submitNameEmail);

    // ← Add these two lines:
    const contactCaptureBtn = container.querySelector('#lp-contact-capture-btn');
    if (contactCaptureBtn) contactCaptureBtn.addEventListener('click', submitContactCapture);
```

- [ ] **Step 3.5: Expose `submitContactCapture` in the public return**

Update the final `return` statement:

```js
  return { init, back, select, continueFromInput, continueFromNumber, submitName, submitEmail, submitNameEmail, submitContactCapture, sendCode, verifyOtp, resendCode, AGE_OPTIONS, STATE_OPTIONS, ICONS };
```

- [ ] **Step 3.6: Verify manually**

Open `http://localhost:3000/lp/whole-life.html` and complete the wizard up to the contact step. Confirm existing `nameEmail` step still works (the new step type doesn't affect it).

- [ ] **Step 3.7: Commit**

```bash
git add js/lp-wizard.js
git commit -m "feat: add contactCapture step type combining name/email/phone/TCPA on one screen"
```

---

## Task 4: lp-wizard.js — Meta Pixel Events

**Files:**
- Modify: `js/lp-wizard.js`

Three events fire at specific wizard moments. All calls are guarded with `typeof fbq !== 'undefined'` so they silently no-op when the pixel isn't loaded (e.g. ad blockers, dev environment).

- [ ] **Step 4.1: Fire `ViewContent` at wizard init**

In `init()`, add the pixel call after `_render(0)`:

```js
  function init(config) {
    _config = config;
    _steps = [...config.steps, ...(config.closingSteps ?? CLOSING_STEPS)];
    _current = 0;
    _answers = {};
    Object.assign(_answers, _captureUtm());
    _multiAnswers = {};
    _phone = '';
    clearInterval(_resendInterval);
    _resendInterval = null;
    _render(0);
    // Fire ViewContent — prospect entered the funnel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent');
    }
  }
```

- [ ] **Step 4.2: Confirm `Lead` event is already in `submitContactCapture`**

The `Lead` fbq call was added in Task 3 Step 3.2 inside `submitContactCapture()`, right before the `send-code` fetch. Verify it reads:

```js
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead');
    }
```

No change needed here — just confirm it's in place.

- [ ] **Step 4.3: Fire `CompleteRegistration` in `verifyOtp()` on success**

Find `verifyOtp()` (around line 296). Inside the `try` block, after `_render(_current + 1)` (the success path), add:

```js
      if (!json.ok) throw new Error();
      clearInterval(_resendInterval);
      // Fire CompleteRegistration — OTP verified, wizard complete
      if (typeof fbq !== 'undefined') {
        fbq('track', 'CompleteRegistration');
      }
      _render(_current + 1);
```

The complete success block should read:

```js
      if (json.error === 'invalid_code') {
        errEl.textContent = "That code didn't match. Please try again or resend.";
        errEl.style.display = '';
        document.querySelectorAll('.lp-otp-digit').forEach(d => { d.value = ''; });
        document.querySelector('.lp-otp-digit').focus();
        btn.disabled = false;
        btn.textContent = 'Verify & Submit';
        return;
      }
      if (!json.ok) throw new Error();
      clearInterval(_resendInterval);
      if (typeof fbq !== 'undefined') {
        fbq('track', 'CompleteRegistration');
      }
      _render(_current + 1);
```

- [ ] **Step 4.4: Commit**

```bash
git add js/lp-wizard.js
git commit -m "feat: add Meta Pixel ViewContent/Lead/CompleteRegistration events to wizard"
```

---

## Task 5: api/submit-lead.js — New Fields + CAPI

**Files:**
- Modify: `api/submit-lead.js`

Two changes: (1) add new wizard and UTM fields to `ALLOWED_FIELDS`, (2) fire a server-side CAPI `CompleteRegistration` event after successful Supabase insert.

- [ ] **Step 5.1: Add new fields to `ALLOWED_FIELDS`**

Replace the existing `ALLOWED_FIELDS` array with:

```js
  const ALLOWED_FIELDS = [
    // existing fields
    'first_name', 'last_name', 'email', 'state', 'coverage_type', 'contact_urgency',
    'source_page', 'message', 'age', 'gender', 'tobacco', 'health', 'beneficiary',
    'coverage_amount', 'coverage_subtype', 'primary_goal', 'annual_income',
    'income_start', 'retirement_savings', 'employment_status', 'mortgage_status',
    'mortgage_balance', 'mortgage_co_borrower', 'retirement_timeline', 'describes_you',
    // new campaign fields
    'coverage_for', 'product_interest', 'main_reason', 'contact_timing',
    // UTM / attribution fields
    'landing_page_url', 'query_string',
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_adset', 'utm_content', 'utm_term',
  ];
```

- [ ] **Step 5.2: Add `sendCapi()` helper function**

Add this function at the top of `api/submit-lead.js`, after the `require` statements:

```js
const crypto = require('crypto');

function _sha256(val) {
  return crypto.createHash('sha256').update((val || '').trim().toLowerCase()).digest('hex');
}

async function sendCapi({ email, phone, sourceUrl }) {
  const pixelId    = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return; // silently skip if not configured

  const body = JSON.stringify({
    data: [{
      event_name:       'CompleteRegistration',
      event_time:       Math.floor(Date.now() / 1000),
      action_source:    'website',
      event_source_url: sourceUrl || 'https://engelfinancialgroup.com/lp/life-insurance',
      user_data: {
        em: [_sha256(email)],
        ph: [_sha256(phone)],
      },
    }],
  });

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CAPI responded ${res.status}: ${text}`);
  }
}
```

- [ ] **Step 5.3: Call `sendCapi()` after successful Supabase insert**

Find the block after the Supabase insert (around line 46). Add the CAPI call as fire-and-forget:

```js
    const supabase = getSupabase();
    const { error: dbError } = await supabase
      .from('leads')
      .insert({ ...safeData, phone });
    if (dbError) throw dbError;

    // Fire server-side CAPI event — fire-and-forget, never fail the request
    sendCapi({
      email:     safeData.email || '',
      phone,
      sourceUrl: safeData.landing_page_url || '',
    }).catch(err => console.error('[submit-lead] CAPI failed:', err.message));

    await sendTelegram(formatSms({ ...safeData, phone }))
      .catch(err => console.error('[submit-lead] Telegram notify failed:', err.message));

    return res.json({ ok: true });
```

- [ ] **Step 5.4: Add env vars to Vercel**

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
META_PIXEL_ID      = <your Meta Pixel ID from Events Manager>
META_ACCESS_TOKEN  = <your Meta System User access token>
```

For local dev, add to `.env.local`:
```
META_PIXEL_ID=your_pixel_id
META_ACCESS_TOKEN=your_access_token
```

These are required for CAPI. If absent, `sendCapi()` silently no-ops (checked at line 1 of the function).

- [ ] **Step 5.5: Verify locally**

Start the server: `node serve.mjs`

Open `http://localhost:3000/lp/life-insurance.html?utm_source=test&utm_campaign=smoke_test&utm_content=legacy-v2-video-916_reels`

Complete the full wizard including OTP. Check the Supabase leads table — the new lead should have:
- `utm_source = "test"`
- `utm_campaign = "smoke_test"`
- `utm_content = "legacy-v2-video-916_reels"`
- `landing_page_url` populated
- `product_interest` populated from step 4 answer

- [ ] **Step 5.6: Commit**

```bash
git add api/submit-lead.js
git commit -m "feat: add new lead fields to submit-lead and fire server-side CAPI on OTP verified"
```

---

## Task 6: Rebuild /lp/life-insurance.html

**Files:**
- Modify: `lp/life-insurance.html` (full rewrite)

Replace the existing redirect wizard with a 10-step general qualification wizard. The existing `/lp/whole-life.html` is **not changed**.

- [ ] **Step 6.1: Replace `lp/life-insurance.html` entirely**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Life Insurance Review — Engel Financial Group</title>
  <meta name="description" content="Start your free life insurance review in minutes. A licensed advisor will reach out within 24 hours. No obligation.">
  <meta name="robots" content="noindex">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/lp/wizard.css">
  <!-- Meta Pixel base code -->
  <script>
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'REPLACE_WITH_YOUR_PIXEL_ID');
    fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=REPLACE_WITH_YOUR_PIXEL_ID&ev=PageView&noscript=1"
  /></noscript>
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
      <button id="lp-back-btn" aria-label="Go back">
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
            <p>Takes about 3 minutes. No social security number or medical records required.</p>
          </div>
        </div>
        <div class="lp-trust-step">
          <div class="lp-trust-num">2</div>
          <div class="lp-trust-text">
            <strong>Verify your phone number</strong>
            <p>We send a quick text to confirm it's you — no spam, ever.</p>
          </div>
        </div>
        <div class="lp-trust-step">
          <div class="lp-trust-num">3</div>
          <div class="lp-trust-text">
            <strong>Speak with a licensed advisor</strong>
            <p>Andrew Engel, licensed insurance advisor, will personally reach out within 24 hours to walk through your options.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="lp-footer">
    <p>
      &copy; 2026 Engel Financial Group. All rights reserved.<br>
      Licensed insurance professional. This site is not affiliated with or endorsed by any government agency.<br>
      <a href="/privacy-policy.html">Privacy Policy</a> &nbsp;&middot;&nbsp;
      <a href="/terms-of-service.html">Terms of Service</a> &nbsp;&middot;&nbsp;
      <a href="/tcpa-compliance.html">TCPA Compliance</a>
    </p>
  </footer>

  <script src="/js/lp-wizard.js"></script>
  <script>
    document.getElementById('lp-back-btn').addEventListener('click', function() { lpWizard.back(); });

    lpWizard.init({
      source_page: '/lp/life-insurance',
      closingSteps: [
        { type: 'contactCapture', question: 'Where should the licensed advisor reach you?' },
        { type: 'otp' },
        { type: 'done' },
      ],
      steps: [
        {
          type: 'dropdown',
          question: 'What state do you live in?',
          field: 'state',
          options: lpWizard.STATE_OPTIONS,
        },
        {
          type: 'number',
          question: 'What is your age?',
          field: 'age',
          min: 18,
          max: 85,
          placeholder: 'Enter your age',
        },
        {
          type: 'choice',
          question: 'Who are you getting this coverage for?',
          field: 'coverage_for',
          choices: [
            { label: 'Myself',              value: 'self' },
            { label: 'My spouse / partner', value: 'spouse' },
            { label: 'My children',         value: 'children' },
            { label: 'Other',               value: 'other' },
          ],
        },
        {
          type: 'choice',
          question: 'What type of coverage are you looking for?',
          field: 'product_interest',
          choices: [
            { label: 'Term Life',            value: 'term_life' },
            { label: 'Whole Life',           value: 'whole_life' },
            { label: 'IUL / Cash Value Life', value: 'iul_cash_value' },
            { label: 'Final Expense',        value: 'final_expense' },
            { label: 'Not sure yet',         value: 'not_sure' },
          ],
        },
        {
          type: 'choice',
          question: "What's your main reason for looking?",
          field: 'main_reason',
          choices: [
            { label: 'Protect my family',          value: 'protect_family' },
            { label: 'Cover mortgage / debt',      value: 'cover_mortgage' },
            { label: 'Leave money behind',         value: 'leave_money' },
            { label: 'Cover final expenses',       value: 'final_expenses' },
            { label: 'Build long-term protection', value: 'long_term_protection' },
            { label: 'Not sure yet',               value: 'not_sure' },
          ],
        },
        {
          type: 'choice',
          question: 'How would you describe your overall health?',
          field: 'health',
          choices: [
            { label: 'Great', value: 'great' },
            { label: 'Fair',  value: 'fair' },
            { label: 'Poor',  value: 'poor' },
          ],
        },
        {
          type: 'choice',
          question: 'Do you currently use tobacco products?',
          field: 'tobacco',
          choices: [
            { label: 'No',  value: 'no' },
            { label: 'Yes', value: 'yes' },
          ],
        },
        {
          type: 'choice',
          question: 'When would you like to speak with a licensed advisor?',
          field: 'contact_timing',
          choices: [
            { label: 'As soon as possible', value: 'immediately' },
            { label: 'This week',           value: 'this_week' },
            { label: 'Within a month',      value: 'within_a_month' },
            { label: 'Just looking around', value: 'just_looking' },
          ],
        },
      ],
    });
  </script>
</body>
</html>
```

- [ ] **Step 6.2: Replace the Pixel ID placeholder**

In the file you just wrote, find both instances of `REPLACE_WITH_YOUR_PIXEL_ID` and replace them with the actual Meta Pixel ID from Meta Events Manager. It's a numeric string like `1234567890123456`.

- [ ] **Step 6.3: Verify wizard flow end-to-end**

Start the server: `node serve.mjs`

Open `http://localhost:3000/lp/life-insurance.html`

Walk through all 8 qualification steps, then the contact capture step, then OTP. Verify:
- Progress bar advances on every step
- Back button works on every step
- State dropdown shows all 50 states
- Age input rejects values outside 18–85
- Step label reads "Step N of 8" (not 10 — done and OTP are excluded from count)
- Contact capture shows all 4 fields + TCPA text
- After OTP, the done screen shows the first name

- [ ] **Step 6.4: Verify Supabase record**

After completing the test flow, check Supabase → leads table. The new record should have:
- `state` populated (state selected in step 1)
- `age` populated
- `coverage_for` populated
- `product_interest` populated
- `main_reason` populated
- `health` populated
- `tobacco` populated
- `contact_timing` populated
- `source_page = "/lp/life-insurance"`
- `otp_verified` = true (set by OTP flow)
- `coverage_type` = null (not set — this is correct for the new wizard)

- [ ] **Step 6.5: Commit**

```bash
git add lp/life-insurance.html
git commit -m "feat: rebuild life-insurance wizard as 10-step general qualification funnel"
```

---

## Task 7: Install Meta Pixel Base Code on All Pages

**Files:**
- Modify: All top-level HTML pages (index.html, whole-life-insurance.html, life-insurance.html, etc.)

The pixel base code is already in `lp/life-insurance.html` (added in Task 6). It also needs to be in all other pages so Meta can build audiences from site visitors.

- [ ] **Step 7.1: Find all pages missing the pixel**

Run in the project root:

```bash
grep -rL "fbevents.js" --include="*.html" .
```

This lists every HTML file that does NOT yet have the pixel. Expected: most top-level pages and other LP pages.

- [ ] **Step 7.2: Add pixel base code to each page**

For every file listed in Step 7.1, add this block just before the closing `</head>` tag. Replace `REPLACE_WITH_YOUR_PIXEL_ID` with your actual pixel ID each time:

```html
  <!-- Meta Pixel base code -->
  <script>
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'YOUR_ACTUAL_PIXEL_ID');
    fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=YOUR_ACTUAL_PIXEL_ID&ev=PageView&noscript=1"
  /></noscript>
```

- [ ] **Step 7.3: Verify pixel fires**

Install the [Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension.

Open `http://localhost:3000/index.html` — the extension should show a green checkmark and `PageView` event.

Open `http://localhost:3000/lp/life-insurance.html` — should show `PageView` + `ViewContent` (fired by wizard init).

- [ ] **Step 7.4: Commit**

```bash
git add *.html lp/*.html
git commit -m "feat: install Meta Pixel base code across all site pages"
```

---

## Task 8: Privacy Policy — Suppression Sentence

**Files:**
- Modify: `privacy-policy.html`

- [ ] **Step 8.1: Add suppression sentence to Section 4**

In `privacy-policy.html`, find the paragraph that ends with:

```html
<p>Meta's use of data collected via the Pixel is governed by <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Meta's Data Policy</a>, which is independent of this Privacy Policy.</p>
```

Add this new paragraph directly after it:

```html
<p>We may also use contact information you submit through our forms — in hashed, non-reversible format — to create suppression audiences with advertising platforms such as Meta, so that individuals who have already completed a review do not continue to receive ads. This data is transmitted in hashed form only and is not shared with Meta in a way that allows them to identify you independently.</p>
```

- [ ] **Step 8.2: Verify in browser**

Open `http://localhost:3000/privacy-policy.html`

Scroll to Section 4 (Meta Pixel & Tracking Technologies). Confirm the new paragraph appears after the Meta Data Policy link.

- [ ] **Step 8.3: Commit**

```bash
git add privacy-policy.html
git commit -m "docs: add suppression audience disclosure to privacy policy Section 4"
```

---

## Task 9: End-to-End Smoke Test

Before deploying, run a full flow to confirm all parts work together.

- [ ] **Step 9.1: Full wizard flow with UTMs**

Open: `http://localhost:3000/lp/life-insurance.html?utm_source=meta&utm_medium=paid_social&utm_campaign=legacy-broad&utm_adset=advantage-plus&utm_content=legacy-v2-video-916_reels&utm_term=ig`

Complete all 8 steps, enter real contact details, complete OTP with a real phone number.

- [ ] **Step 9.2: Verify Supabase record**

Check the leads table. The record should have all fields populated:
- All 8 wizard answer fields
- All 6 UTM fields
- `landing_page_url` contains the full URL with query string
- `query_string` contains the raw `?utm_source=meta&...` string
- `otp_verified` = true
- `source_page` = `/lp/life-insurance`

- [ ] **Step 9.3: Verify pixel events**

With Meta Pixel Helper active, repeat the flow. Confirm:
- `PageView` fires on page load
- `ViewContent` fires immediately after (wizard init)
- `Lead` fires when you click Continue on the contact capture step
- `CompleteRegistration` fires after successful OTP

- [ ] **Step 9.4: Verify Telegram notification arrives**

After completing OTP, confirm the Telegram bot sends a lead notification to Andrew's chat. The message should include the wizard answers and contact details.

- [ ] **Step 9.5: Deploy to Vercel**

```bash
git push origin master
```

Vercel auto-deploys on push. After deploy, repeat the smoke test on the live URL to confirm everything works in production (not just local).

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Supabase migration — Task 1
- ✅ UTM capture — Task 2
- ✅ contactCapture step type — Task 3
- ✅ Pixel ViewContent event — Task 4 Step 4.1
- ✅ Pixel Lead event — Task 3 Step 3.2 (inside submitContactCapture)
- ✅ Pixel CompleteRegistration event — Task 4 Step 4.3
- ✅ CAPI server-side event — Task 5
- ✅ New allowed fields in submit-lead — Task 5 Step 5.1
- ✅ Wizard rebuild — Task 6
- ✅ Pixel on all pages — Task 7
- ✅ Privacy policy suppression sentence — Task 8
- ✅ META_PIXEL_ID / META_ACCESS_TOKEN env vars — Task 5 Step 5.4

**Not in this plan (Meta Ads Manager setup — non-code):**
- Campaign / ad set creation in Meta Ads Manager → follow spec Section 2
- Uploading creative assets (video 9:16, 4:5, static) → follow spec Section 5–6
- UTM dynamic parameter setup on ad destination URLs → follow spec Section 7
- Custom audience builds (wizard visitors, OTP-verified exclusion list) → follow spec Section 3
- Customer list upload (existing Supabase leads hashed) → manual step in Meta Audiences
