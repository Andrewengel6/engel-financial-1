# Phase 3: SMS Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Supabase lead storage + Twilio OTP phone verification to all 9 existing forms, and SMS-notify Andrew on every verified lead.

**Architecture:** Two Vercel serverless functions (`api/send-code.js`, `api/submit-lead.js`) use Twilio Verify for OTP and Supabase for lead storage. A shared frontend module (`js/otp-form.js`) handles the two-step form UX identically across all 9 pages. Every row written to Supabase is a verified lead — nothing is stored until OTP passes.

**Tech Stack:** Node.js 18, Twilio SDK v5, @supabase/supabase-js v2, Jest 29, Vercel serverless functions (CommonJS)

---

## File Map

**Create:**
- `package.json` — npm deps + Jest config
- `.env.example` — env var template
- `supabase/migrations/001_create_leads.sql` — table DDL
- `api/utils/twilio.js` — Twilio client helpers (sendVerification, checkVerification, sendSms)
- `api/utils/supabase.js` — Supabase singleton
- `api/utils/format-sms.js` — Andrew's SMS formatter
- `api/send-code.js` — Vercel function: normalize phone → trigger OTP
- `api/submit-lead.js` — Vercel function: verify OTP → insert lead → SMS Andrew
- `js/otp-form.js` — shared frontend two-step OTP UI module
- `tests/api/format-sms.test.js`
- `tests/api/send-code.test.js`
- `tests/api/submit-lead.test.js`

**Modify:**
- `styles.css` — add OTP digit input styles
- `contact.html` — add state/urgency fields, OTP screens, wire `otpForm`
- `life-insurance.html` — same pattern
- `whole-life-insurance.html` — same pattern
- `iuls.html` — same pattern
- `annuities.html` — same pattern
- `mortgage-protection.html` — same pattern
- `retirement-planning.html` — same pattern
- `advanced-markets.html` — same pattern
- `index.html` — same pattern

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `.env.example`
- Modify: `.gitignore` (ensure `.env` is listed)

- [ ] **Step 1: Create package.json**

```json
{
  "name": "engel-financial-group",
  "version": "1.0.0",
  "engines": { "node": "18.x" },
  "dependencies": {
    "@supabase/supabase-js": "^2.43.0",
    "twilio": "^5.3.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  },
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "testEnvironment": "node",
    "testMatch": ["**/tests/**/*.test.js"]
  }
}
```

- [ ] **Step 2: Create .env.example**

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_VERIFY_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_FROM_NUMBER=+1XXXXXXXXXX
ANDREW_PHONE=+1XXXXXXXXXX
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- [ ] **Step 3: Ensure .gitignore has .env**

Open `.gitignore`. If it doesn't already contain `.env`, add this line:
```
.env
```

- [ ] **Step 4: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 5: Verify Jest works**

```bash
npx jest --listTests
```

Expected: empty list (no tests yet), exit code 0.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .env.example .gitignore
git commit -m "chore: add npm deps (twilio, supabase, jest) for Phase 3"
```

---

## Task 2: Supabase Table Setup

**Files:**
- Create: `supabase/migrations/001_create_leads.sql`

- [ ] **Step 1: Create the SQL migration file**

Create `supabase/migrations/001_create_leads.sql`:

```sql
create table leads (
  id                 uuid        primary key default gen_random_uuid(),
  created_at         timestamptz not null    default now(),
  first_name         text        not null,
  last_name          text        not null,
  phone              text        not null,
  email              text        not null,
  state              text        not null,
  coverage_type      text        not null,
  contact_urgency    text        not null,
  source_page        text        not null,
  message            text,
  age                text,
  gender             text,
  tobacco            text,
  health             text,
  beneficiary        text,
  coverage_amount    text,
  coverage_subtype   text,
  primary_goal       text,
  annual_income      text,
  income_start       text,
  retirement_savings text,
  employment_status  text,
  mortgage_status    text,
  mortgage_balance   text,
  mortgage_co_borrower text,
  retirement_timeline text,
  describes_you      text
);

alter table leads enable row level security;
```

- [ ] **Step 2: Create a Supabase project**

1. Go to https://supabase.com → New project
2. Name: `engel-financial-group` | Region: US East | Save the DB password
3. Wait for project to provision (~2 min)

- [ ] **Step 3: Run the migration**

In Supabase dashboard → SQL Editor → New query → paste the entire SQL from Step 1 → Run.

Expected: "Success. No rows returned."

- [ ] **Step 4: Get credentials**

In Supabase dashboard → Settings → API:
- Copy **Project URL** → this is `SUPABASE_URL`
- Copy **service_role** secret key (NOT the anon key) → this is `SUPABASE_SERVICE_KEY`

Create a local `.env` file (never commit this):
```
SUPABASE_URL=<paste Project URL>
SUPABASE_SERVICE_KEY=<paste service_role key>
```

- [ ] **Step 5: Commit the migration file**

```bash
git add supabase/migrations/001_create_leads.sql
git commit -m "chore: add Supabase leads table migration"
```

---

## Task 3: Twilio Account Setup

No code files. External account configuration only.

- [ ] **Step 1: Create Twilio account**

Go to https://twilio.com → Sign up (free trial gives $15 credit — enough for testing).

- [ ] **Step 2: Get Account SID and Auth Token**

Twilio Console → Dashboard → copy **Account SID** and **Auth Token**.

Add to your local `.env`:
```
TWILIO_ACCOUNT_SID=<paste>
TWILIO_AUTH_TOKEN=<paste>
```

- [ ] **Step 3: Create a Verify service**

Twilio Console → Verify → Services → Create new service.
- Friendly name: `Engel Financial Group`
- Copy the **Service SID** (starts with `VA`)

Add to `.env`:
```
TWILIO_VERIFY_SID=<paste>
```

- [ ] **Step 4: Buy a phone number**

Twilio Console → Phone Numbers → Buy a number → pick a US number with SMS capability.
- Copy the purchased number in E.164 format e.g. `+15015559876`

Add to `.env`:
```
TWILIO_FROM_NUMBER=<purchased number>
ANDREW_PHONE=<Andrew's personal mobile in E.164, e.g. +15016915508>
```

---

## Task 4: Format-SMS Utility + Tests

**Files:**
- Create: `api/utils/format-sms.js`
- Create: `tests/api/format-sms.test.js`

- [ ] **Step 1: Write the failing tests**

Create `tests/api/format-sms.test.js`:

```js
const { formatSms } = require('../../api/utils/format-sms');

const base = {
  first_name: 'John', last_name: 'Smith',
  phone: '+15015551234', email: 'john@example.com',
  state: 'Texas', coverage_type: 'Life Insurance',
  contact_urgency: 'immediately', source_page: '/life-insurance.html',
};

test('formats a basic lead with no optional fields', () => {
  expect(formatSms(base)).toBe(
    'New lead: John Smith | Texas | +15015551234 | john@example.com | Life Insurance | Urgency: Immediately | /life-insurance.html'
  );
});

test('includes age when present', () => {
  expect(formatSms({ ...base, age: '35–44' })).toContain('Age: 35–44');
});

test('capitalises health value', () => {
  expect(formatSms({ ...base, health: 'great' })).toContain('Health: Great');
});

test('includes mortgage_balance when present', () => {
  expect(formatSms({ ...base, mortgage_balance: '$150k–$300k' })).toContain('Mortgage: $150k–$300k');
});

test('includes retirement_savings when present', () => {
  expect(formatSms({ ...base, retirement_savings: '$200k–$500k' })).toContain('Savings: $200k–$500k');
});

test('includes annual_income when present', () => {
  expect(formatSms({ ...base, annual_income: '$100k–$200k' })).toContain('Income: $100k–$200k');
});

test('includes primary_goal when present', () => {
  expect(formatSms({ ...base, primary_goal: 'Tax-free retirement income' }))
    .toContain('Goal: Tax-free retirement income');
});

test('omits optional fields when absent', () => {
  const msg = formatSms(base);
  expect(msg).not.toContain('Age:');
  expect(msg).not.toContain('Health:');
  expect(msg).not.toContain('Mortgage:');
});

test('handles within_a_week urgency label', () => {
  expect(formatSms({ ...base, contact_urgency: 'within_a_week' })).toContain('Urgency: Within a week');
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npx jest tests/api/format-sms.test.js
```

Expected: FAIL — "Cannot find module '../../api/utils/format-sms'"

- [ ] **Step 3: Create `api/utils/format-sms.js`**

```js
const URGENCY_LABELS = {
  immediately: 'Immediately',
  within_a_week: 'Within a week',
  within_a_month: 'Within a month',
  just_looking: 'Just looking',
};

function formatSms(lead) {
  const parts = [
    `New lead: ${lead.first_name} ${lead.last_name}`,
    lead.state,
    lead.phone,
    lead.email,
    lead.coverage_type,
    `Urgency: ${URGENCY_LABELS[lead.contact_urgency] || lead.contact_urgency}`,
  ];
  if (lead.age)                parts.push(`Age: ${lead.age}`);
  if (lead.health)             parts.push(`Health: ${lead.health.charAt(0).toUpperCase() + lead.health.slice(1)}`);
  if (lead.tobacco)            parts.push(`Tobacco: ${lead.tobacco}`);
  if (lead.mortgage_balance)   parts.push(`Mortgage: ${lead.mortgage_balance}`);
  if (lead.retirement_savings) parts.push(`Savings: ${lead.retirement_savings}`);
  if (lead.annual_income)      parts.push(`Income: ${lead.annual_income}`);
  if (lead.primary_goal)       parts.push(`Goal: ${lead.primary_goal}`);
  parts.push(lead.source_page);
  return parts.join(' | ');
}

module.exports = { formatSms, URGENCY_LABELS };
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npx jest tests/api/format-sms.test.js
```

Expected: PASS, 9 tests.

- [ ] **Step 5: Commit**

```bash
git add api/utils/format-sms.js tests/api/format-sms.test.js
git commit -m "feat: add SMS formatter utility with tests"
```

---

## Task 5: Twilio + Supabase Utility Modules

**Files:**
- Create: `api/utils/twilio.js`
- Create: `api/utils/supabase.js`

No unit tests for these — they are thin SDK wrappers. They are integration-tested via end-to-end smoke test in Task 12.

- [ ] **Step 1: Create `api/utils/twilio.js`**

```js
const twilio = require('twilio');

let _client = null;

function getClient() {
  if (!_client) {
    _client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return _client;
}

async function sendVerification(phone) {
  return getClient()
    .verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verifications.create({ to: phone, channel: 'sms' });
}

async function checkVerification(phone, code) {
  const check = await getClient()
    .verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verificationChecks.create({ to: phone, code });
  return check.status === 'approved';
}

async function sendSms(to, body) {
  return getClient().messages.create({
    body,
    from: process.env.TWILIO_FROM_NUMBER,
    to,
  });
}

module.exports = { sendVerification, checkVerification, sendSms };
```

- [ ] **Step 2: Create `api/utils/supabase.js`**

```js
const { createClient } = require('@supabase/supabase-js');

let _client = null;

function getSupabase() {
  if (!_client) {
    _client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return _client;
}

module.exports = { getSupabase };
```

- [ ] **Step 3: Commit**

```bash
git add api/utils/twilio.js api/utils/supabase.js
git commit -m "feat: add Twilio and Supabase utility modules"
```

---

## Task 6: `api/send-code.js` + Tests

**Files:**
- Create: `api/send-code.js`
- Create: `tests/api/send-code.test.js`

- [ ] **Step 1: Write the failing tests**

Create `tests/api/send-code.test.js`:

```js
jest.mock('../../api/utils/twilio', () => ({
  sendVerification: jest.fn(),
}));

const handler = require('../../api/send-code');
const { sendVerification } = require('../../api/utils/twilio');

function makeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

test('returns 405 for GET', async () => {
  const res = makeRes();
  await handler({ method: 'GET', body: {} }, res);
  expect(res.status).toHaveBeenCalledWith(405);
});

test('returns 400 for missing phone', async () => {
  const res = makeRes();
  await handler({ method: 'POST', body: {} }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'invalid_phone' });
});

test('returns 400 for invalid phone (too short)', async () => {
  const res = makeRes();
  await handler({ method: 'POST', body: { phone: '123' } }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'invalid_phone' });
});

test('normalises formatted phone and calls sendVerification', async () => {
  sendVerification.mockResolvedValueOnce({});
  const res = makeRes();
  await handler({ method: 'POST', body: { phone: '(501) 555-1234' } }, res);
  expect(sendVerification).toHaveBeenCalledWith('+15015551234');
  expect(res.json).toHaveBeenCalledWith({ ok: true });
});

test('normalises 10-digit plain phone', async () => {
  sendVerification.mockResolvedValueOnce({});
  const res = makeRes();
  await handler({ method: 'POST', body: { phone: '5015551234' } }, res);
  expect(sendVerification).toHaveBeenCalledWith('+15015551234');
  expect(res.json).toHaveBeenCalledWith({ ok: true });
});

test('returns 429 on Twilio rate-limit error (code 60203)', async () => {
  const err = Object.assign(new Error('max attempts'), { code: 60203 });
  sendVerification.mockRejectedValueOnce(err);
  const res = makeRes();
  await handler({ method: 'POST', body: { phone: '5015551234' } }, res);
  expect(res.status).toHaveBeenCalledWith(429);
  expect(res.json).toHaveBeenCalledWith({ error: 'too_many_attempts' });
});

test('returns 500 on unexpected Twilio error', async () => {
  sendVerification.mockRejectedValueOnce(new Error('network error'));
  const res = makeRes();
  await handler({ method: 'POST', body: { phone: '5015551234' } }, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'send_failed' });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npx jest tests/api/send-code.test.js
```

Expected: FAIL — "Cannot find module '../../api/send-code'"

- [ ] **Step 3: Create `api/send-code.js`**

```js
const { sendVerification } = require('./utils/twilio');

function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits[0] === '1') return `+${digits}`;
  return null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const phone = normalizePhone(req.body?.phone);
  if (!phone) {
    return res.status(400).json({ error: 'invalid_phone' });
  }

  try {
    await sendVerification(phone);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[send-code]', err.message);
    if (err.code === 60203) {
      return res.status(429).json({ error: 'too_many_attempts' });
    }
    return res.status(500).json({ error: 'send_failed' });
  }
};
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npx jest tests/api/send-code.test.js
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add api/send-code.js tests/api/send-code.test.js
git commit -m "feat: add /api/send-code Vercel function with tests"
```

---

## Task 7: `api/submit-lead.js` + Tests

**Files:**
- Create: `api/submit-lead.js`
- Create: `tests/api/submit-lead.test.js`

- [ ] **Step 1: Write the failing tests**

Create `tests/api/submit-lead.test.js`:

```js
jest.mock('../../api/utils/twilio', () => ({
  checkVerification: jest.fn(),
  sendSms: jest.fn(),
}));

const mockInsert = jest.fn().mockResolvedValue({ error: null });
jest.mock('../../api/utils/supabase', () => ({
  getSupabase: jest.fn(() => ({
    from: jest.fn(() => ({ insert: mockInsert })),
  })),
}));

const handler = require('../../api/submit-lead');
const { checkVerification, sendSms } = require('../../api/utils/twilio');

process.env.ANDREW_PHONE = '+15010000000';
process.env.TWILIO_FROM_NUMBER = '+15019999999';

function makeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
}

const validBody = {
  code: '123456',
  phone: '(501) 555-1234',
  first_name: 'Jane', last_name: 'Doe',
  email: 'jane@example.com', state: 'Texas',
  coverage_type: 'Life Insurance',
  contact_urgency: 'immediately',
  source_page: '/life-insurance.html',
};

beforeEach(() => jest.clearAllMocks());

test('returns 405 for GET', async () => {
  const res = makeRes();
  await handler({ method: 'GET', body: {} }, res);
  expect(res.status).toHaveBeenCalledWith(405);
});

test('returns 400 when phone missing', async () => {
  const res = makeRes();
  await handler({ method: 'POST', body: { code: '123456' } }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'missing_fields' });
});

test('returns 400 when code missing', async () => {
  const res = makeRes();
  await handler({ method: 'POST', body: { phone: '5015551234' } }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'missing_fields' });
});

test('returns 400 with invalid_code when OTP rejected', async () => {
  checkVerification.mockResolvedValueOnce(false);
  const res = makeRes();
  await handler({ method: 'POST', body: validBody }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'invalid_code' });
});

test('inserts lead and SMSes Andrew on valid code', async () => {
  checkVerification.mockResolvedValueOnce(true);
  sendSms.mockResolvedValueOnce({});
  const res = makeRes();
  await handler({ method: 'POST', body: validBody }, res);
  expect(mockInsert).toHaveBeenCalledWith(
    expect.objectContaining({ phone: '+15015551234', first_name: 'Jane' })
  );
  expect(sendSms).toHaveBeenCalledWith('+15010000000', expect.stringContaining('Jane Doe'));
  expect(res.json).toHaveBeenCalledWith({ ok: true });
});

test('passes normalised E.164 phone to checkVerification', async () => {
  checkVerification.mockResolvedValueOnce(true);
  sendSms.mockResolvedValueOnce({});
  const res = makeRes();
  await handler({ method: 'POST', body: { ...validBody, phone: '(501) 555-1234' } }, res);
  expect(checkVerification).toHaveBeenCalledWith('+15015551234', '123456');
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npx jest tests/api/submit-lead.test.js
```

Expected: FAIL — "Cannot find module '../../api/submit-lead'"

- [ ] **Step 3: Create `api/submit-lead.js`**

```js
const { checkVerification, sendSms } = require('./utils/twilio');
const { getSupabase } = require('./utils/supabase');
const { formatSms } = require('./utils/format-sms');

function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits[0] === '1') return `+${digits}`;
  return null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { code, ...leadData } = req.body || {};
  const phone = normalizePhone(leadData.phone);

  if (!phone || !code) {
    return res.status(400).json({ error: 'missing_fields' });
  }

  try {
    const approved = await checkVerification(phone, code);
    if (!approved) {
      return res.status(400).json({ ok: false, error: 'invalid_code' });
    }

    const supabase = getSupabase();
    const { error: dbError } = await supabase
      .from('leads')
      .insert({ ...leadData, phone });
    if (dbError) throw dbError;

    await sendSms(process.env.ANDREW_PHONE, formatSms({ ...leadData, phone }));

    return res.json({ ok: true });
  } catch (err) {
    console.error('[submit-lead]', err.message);
    return res.status(500).json({ error: 'submit_failed' });
  }
};
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npx jest tests/api/submit-lead.test.js
```

Expected: PASS, 6 tests.

- [ ] **Step 5: Run full test suite**

```bash
npx jest
```

Expected: PASS, all 22 tests across 3 files.

- [ ] **Step 6: Commit**

```bash
git add api/submit-lead.js tests/api/submit-lead.test.js
git commit -m "feat: add /api/submit-lead Vercel function with tests"
```

---

## Task 8: Frontend OTP Module + CSS

**Files:**
- Create: `js/otp-form.js`
- Modify: `styles.css` (add OTP styles)

- [ ] **Step 1: Add OTP styles to `styles.css`**

Append to the end of `styles.css`:

```css
/* ── OTP VERIFICATION FLOW ── */
.otp-digit-wrap { display: flex; gap: 10px; justify-content: center; margin: 28px 0 8px; }
.otp-digit {
  width: 44px; height: 56px; text-align: center; font-size: 24px; font-weight: 700;
  font-family: 'Cormorant Garamond', serif; color: var(--navy);
  border: 2px solid rgba(17,29,43,.2); border-radius: 8px; background: #fff;
  outline: none; transition: border-color .15s;
}
.otp-digit:focus { border-color: var(--gold); }
.otp-error-msg { color: #c0392b; font-size: 14px; margin: 0 0 12px; display: none; }
.otp-resend-row { margin-top: 18px; font-size: 13px; color: var(--text-soft); }
.otp-resend-row a { color: var(--gold); text-decoration: none; }
.otp-resend-row a:hover { text-decoration: underline; }
.success-check {
  width: 64px; height: 64px; border-radius: 50%; background: var(--gold);
  display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
}
.success-check svg { color: #fff; }
```

- [ ] **Step 2: Create `js/otp-form.js`**

```js
// Shared OTP verification flow for all site forms.
// Usage on each page:
//   otpForm.init({ getFormData, formCardId })
//   Button onclick: otpForm.sendCode()
const otpForm = (() => {
  let _getFormData = null;
  let _formCardId = null;
  let _collected = null;
  let _resendInterval = null;

  function init({ getFormData, formCardId }) {
    _getFormData = getFormData;
    _formCardId = formCardId;

    document.querySelectorAll('.otp-digit').forEach((el, i, all) => {
      el.addEventListener('input', () => {
        el.value = el.value.replace(/\D/g, '').slice(0, 1);
        if (el.value && i < all.length - 1) all[i + 1].focus();
      });
      el.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !el.value && i > 0) all[i - 1].focus();
      });
      el.addEventListener('paste', e => {
        e.preventDefault();
        const digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
        [...all].forEach((d, idx) => { d.value = digits[idx] || ''; });
        const last = Math.min(digits.length, all.length - 1);
        all[last].focus();
      });
    });
  }

  async function sendCode() {
    const data = _getFormData();
    if (!data) return;
    _collected = data;

    const btn = document.getElementById('send-btn');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: data.phone }),
      });
      if (!res.ok) throw new Error('send_failed');

      document.getElementById(_formCardId).style.display = 'none';
      document.getElementById('otp-screen').style.display = '';
      document.getElementById('otp-phone-display').textContent = data.phone;
      document.querySelector('.otp-digit').focus();
      _startResendTimer();
    } catch {
      btn.disabled = false;
      btn.textContent = 'Send Verification Code';
      alert('Something went wrong sending your code. Please try again.');
    }
  }

  async function verify() {
    const code = [...document.querySelectorAll('.otp-digit')].map(d => d.value).join('');
    if (code.length < 6) { alert('Please enter all 6 digits.'); return; }

    const verifyBtn = document.getElementById('verify-btn');
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying…';
    document.querySelector('.otp-error-msg').style.display = 'none';

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ..._collected, code }),
      });
      const json = await res.json();

      if (json.error === 'invalid_code') {
        document.querySelector('.otp-error-msg').style.display = '';
        document.querySelectorAll('.otp-digit').forEach(d => { d.value = ''; });
        document.querySelector('.otp-digit').focus();
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify & Submit';
        return;
      }
      if (!res.ok || !json.ok) throw new Error('submit_failed');

      clearInterval(_resendInterval);
      document.getElementById('otp-screen').style.display = 'none';
      document.getElementById('success-screen').style.display = '';
    } catch {
      verifyBtn.disabled = false;
      verifyBtn.textContent = 'Verify & Submit';
      alert('Something went wrong. Please try again.');
    }
  }

  async function resend(e) {
    e.preventDefault();
    const link = document.getElementById('resend-link');
    if (link.dataset.disabled === 'true') return;
    link.dataset.disabled = 'true';
    try {
      await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: _collected.phone }),
      });
      _startResendTimer();
    } catch {
      link.dataset.disabled = 'false';
      alert('Could not resend. Please try again.');
    }
  }

  function _startResendTimer() {
    let secs = 30;
    const timerEl = document.getElementById('resend-timer');
    const linkEl = document.getElementById('resend-link');
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

  return { init, sendCode, verify, resend };
})();
```

- [ ] **Step 3: Commit**

```bash
git add js/otp-form.js styles.css
git commit -m "feat: add shared OTP form module and CSS"
```

---

## Task 9: Update `contact.html`

**Files:**
- Modify: `contact.html`

The contact form currently has: first-name, last-name, phone, email, coverage-type, message.
Changes: add state + urgency fields after email; add `id="main-form"` to the `.form-card`; add OTP/success screens; replace `handleContactSubmit()` with `otpForm`; link `otp-form.js`.

- [ ] **Step 1: Add `id="main-form"` to the form card**

Find (line ~186):
```html
      <div class="form-card">
```
Replace with:
```html
      <div class="form-card" id="main-form">
```

- [ ] **Step 2: Add state and urgency fields after the email input**

Find (line ~205):
```html
        </div>
        <div class="form-group">
          <label for="coverage-type">Coverage Interest</label>
```
Replace with:
```html
        </div>
        <div class="form-group">
          <label for="state">State</label>
          <select id="state" name="state" required>
            <option value="">Select your state</option>
            <option>Alabama</option><option>Alaska</option><option>Arizona</option>
            <option>Arkansas</option><option>California</option><option>Colorado</option>
            <option>Connecticut</option><option>Delaware</option><option>Florida</option>
            <option>Georgia</option><option>Hawaii</option><option>Idaho</option>
            <option>Illinois</option><option>Indiana</option><option>Iowa</option>
            <option>Kansas</option><option>Kentucky</option><option>Louisiana</option>
            <option>Maine</option><option>Maryland</option><option>Massachusetts</option>
            <option>Michigan</option><option>Minnesota</option><option>Mississippi</option>
            <option>Missouri</option><option>Montana</option><option>Nebraska</option>
            <option>Nevada</option><option>New Hampshire</option><option>New Jersey</option>
            <option>New Mexico</option><option>New York</option><option>North Carolina</option>
            <option>North Dakota</option><option>Ohio</option><option>Oklahoma</option>
            <option>Oregon</option><option>Pennsylvania</option><option>Rhode Island</option>
            <option>South Carolina</option><option>South Dakota</option><option>Tennessee</option>
            <option>Texas</option><option>Utah</option><option>Vermont</option>
            <option>Virginia</option><option>Washington</option><option>West Virginia</option>
            <option>Wisconsin</option><option>Wyoming</option>
          </select>
        </div>
        <div class="form-group">
          <label for="contact-urgency">When would you like to be contacted?</label>
          <select id="contact-urgency" name="contact_urgency" required>
            <option value="">Select...</option>
            <option value="immediately">I want to be contacted immediately</option>
            <option value="within_a_week">Within a week</option>
            <option value="within_a_month">Within a month</option>
            <option value="just_looking">I'm just looking around</option>
          </select>
        </div>
        <div class="form-group">
          <label for="coverage-type">Coverage Interest</label>
```

- [ ] **Step 3: Change the submit button id and onclick**

Find:
```html
        <button class="btn-primary" onclick="handleContactSubmit()">Send My Message</button>
```
Replace with:
```html
        <button class="btn-primary" id="send-btn" onclick="otpForm.sendCode()">Send Verification Code</button>
```

- [ ] **Step 4: Add OTP and success screens after the closing `</div>` of `#main-form`**

Find (line ~228):
```html
      </div>
    </div>
  </div>
</section>
```
Replace with:
```html
      </div>

      <!-- OTP verification screen -->
      <div id="otp-screen" class="form-card" style="display:none; text-align:center; padding:48px 32px;">
        <div class="form-card-title">Verify Your Phone</div>
        <div class="form-card-sub">We sent a 6-digit code to <strong id="otp-phone-display"></strong></div>
        <div class="otp-digit-wrap">
          <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
          <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
          <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
          <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
          <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
          <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
        </div>
        <p class="otp-error-msg">That code didn't match. Please try again or resend.</p>
        <button class="btn-primary" id="verify-btn" onclick="otpForm.verify()">Verify &amp; Submit</button>
        <p class="otp-resend-row">
          <a href="#" id="resend-link" onclick="otpForm.resend(event)" data-disabled="true" style="opacity:.4">Resend code</a>
          <span id="resend-timer"></span>
        </p>
      </div>

      <!-- Success screen -->
      <div id="success-screen" class="form-card" style="display:none; text-align:center; padding:48px 32px;">
        <div class="success-check">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="form-card-title">You're all set!</div>
        <div class="form-card-sub">One of our agents will reach out to you within 24 hours.</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Replace `handleContactSubmit()` with `otpForm` init**

Find the script block containing `function handleContactSubmit()`. Replace the entire function with:

```js
// OTP form init — contact page
otpForm.init({
  formCardId: 'main-form',
  getFormData() {
    const coverageMap = {
      'life': 'Life Insurance', 'whole-life': 'Whole Life Insurance',
      'iul': 'IUL', 'annuity': 'Annuities', 'mortgage': 'Mortgage Protection',
      'retirement': 'Retirement Planning', 'advanced': 'Advanced Markets',
      'general': 'General Inquiry',
    };
    const vals = {
      first_name: document.getElementById('first-name').value.trim(),
      last_name:  document.getElementById('last-name').value.trim(),
      phone:      document.getElementById('phone').value.trim(),
      email:      document.getElementById('email').value.trim(),
      state:      document.getElementById('state').value,
      contact_urgency: document.getElementById('contact-urgency').value,
      coverage_type: coverageMap[document.getElementById('coverage-type').value] || 'General Inquiry',
      message:    document.getElementById('message').value.trim(),
      source_page: '/contact.html',
    };
    const required = ['first_name','last_name','phone','email','state','contact_urgency'];
    if (required.some(k => !vals[k])) {
      alert('Please fill in all required fields.');
      return null;
    }
    return vals;
  },
});
```

- [ ] **Step 6: Add the script tag before `</body>`**

Find `</body>` in contact.html. Just before it, add:
```html
<script src="/js/otp-form.js"></script>
```

- [ ] **Step 7: Start the dev server and verify contact form manually**

```bash
node serve.mjs
```

Open http://localhost:3000/contact.html. Fill all fields → click "Send Verification Code". Confirm the OTP screen appears (will fail at the API call since no Vercel functions locally — that's expected at this stage).

- [ ] **Step 8: Commit**

```bash
git add contact.html
git commit -m "feat: add state/urgency fields and OTP flow to contact.html"
```

---

## Task 10: Update 7 Coverage Pages

**Files:**
- Modify: `life-insurance.html`, `whole-life-insurance.html`, `iuls.html`, `annuities.html`, `mortgage-protection.html`, `retirement-planning.html`, `advanced-markets.html`

Each coverage page has an identical form structure. Apply the same changes to all 7, substituting the values from the table below.

| File | `coverage_type` value | `source_page` value |
|---|---|---|
| `life-insurance.html` | `'Life Insurance'` | `'/life-insurance.html'` |
| `whole-life-insurance.html` | `'Whole Life Insurance'` | `'/whole-life-insurance.html'` |
| `iuls.html` | `'IUL'` | `'/iuls.html'` |
| `annuities.html` | `'Annuities'` | `'/annuities.html'` |
| `mortgage-protection.html` | `'Mortgage Protection'` | `'/mortgage-protection.html'` |
| `retirement-planning.html` | `'Retirement Planning'` | `'/retirement-planning.html'` |
| `advanced-markets.html` | `'Advanced Markets'` | `'/advanced-markets.html'` |

**Apply every step below to all 7 files. Process them one at a time.**

- [ ] **Step 1: Add `id="main-form"` to the form card**

Find (inside the `<!-- ═══ LEAD FORM ═══ -->` section):
```html
    <div class="form-card fade-up">
```
Replace with:
```html
    <div class="form-card fade-up" id="main-form">
```

- [ ] **Step 2: Replace the zip field with the state dropdown**

Find:
```html
      <div class="form-group">
        <label for="zip">Zip Code</label>
        <input type="text" id="zip" placeholder="90210" maxlength="5" />
      </div>
```
Replace with:
```html
      <div class="form-group">
        <label for="state">State</label>
        <select id="state" name="state" required>
          <option value="">Select your state</option>
          <option>Alabama</option><option>Alaska</option><option>Arizona</option>
          <option>Arkansas</option><option>California</option><option>Colorado</option>
          <option>Connecticut</option><option>Delaware</option><option>Florida</option>
          <option>Georgia</option><option>Hawaii</option><option>Idaho</option>
          <option>Illinois</option><option>Indiana</option><option>Iowa</option>
          <option>Kansas</option><option>Kentucky</option><option>Louisiana</option>
          <option>Maine</option><option>Maryland</option><option>Massachusetts</option>
          <option>Michigan</option><option>Minnesota</option><option>Mississippi</option>
          <option>Missouri</option><option>Montana</option><option>Nebraska</option>
          <option>Nevada</option><option>New Hampshire</option><option>New Jersey</option>
          <option>New Mexico</option><option>New York</option><option>North Carolina</option>
          <option>North Dakota</option><option>Ohio</option><option>Oklahoma</option>
          <option>Oregon</option><option>Pennsylvania</option><option>Rhode Island</option>
          <option>South Carolina</option><option>South Dakota</option><option>Tennessee</option>
          <option>Texas</option><option>Utah</option><option>Vermont</option>
          <option>Virginia</option><option>Washington</option><option>West Virginia</option>
          <option>Wisconsin</option><option>Wyoming</option>
        </select>
      </div>
      <div class="form-group">
        <label for="contact-urgency">When would you like to be contacted?</label>
        <select id="contact-urgency" name="contact_urgency" required>
          <option value="">Select...</option>
          <option value="immediately">I want to be contacted immediately</option>
          <option value="within_a_week">Within a week</option>
          <option value="within_a_month">Within a month</option>
          <option value="just_looking">I'm just looking around</option>
        </select>
      </div>
```

- [ ] **Step 3: Change the submit button**

Find:
```html
      <button class="btn-primary" onclick="handleSubmit()">Get My Free Quote</button>
```
Replace with:
```html
      <button class="btn-primary" id="send-btn" onclick="otpForm.sendCode()">Send Verification Code</button>
```

- [ ] **Step 4: Add OTP and success screens**

Find the closing `</div>` of `#main-form` (the `</div>` that closes the `.form-card` right before `</div>` closing `.form-section-inner`):
```html
    </div>
  </div>
</section>

<!-- ═══ FAQ ═══ -->
```
Replace with:
```html
    </div>

    <!-- OTP verification screen -->
    <div id="otp-screen" class="form-card" style="display:none; text-align:center; padding:48px 32px;">
      <div class="form-card-title">Verify Your Phone</div>
      <div class="form-card-sub">We sent a 6-digit code to <strong id="otp-phone-display"></strong></div>
      <div class="otp-digit-wrap">
        <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
        <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
        <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
        <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
        <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
        <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
      </div>
      <p class="otp-error-msg">That code didn't match. Please try again or resend.</p>
      <button class="btn-primary" id="verify-btn" onclick="otpForm.verify()">Verify &amp; Submit</button>
      <p class="otp-resend-row">
        <a href="#" id="resend-link" onclick="otpForm.resend(event)" data-disabled="true" style="opacity:.4">Resend code</a>
        <span id="resend-timer"></span>
      </p>
    </div>

    <!-- Success screen -->
    <div id="success-screen" class="form-card" style="display:none; text-align:center; padding:48px 32px;">
      <div class="success-check">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="form-card-title">You're all set!</div>
      <div class="form-card-sub">One of our agents will reach out to you within 24 hours.</div>
    </div>
  </div>
</section>

<!-- ═══ FAQ ═══ -->
```

- [ ] **Step 5: Replace `handleSubmit()` with `otpForm` init**

Find the script block containing `function handleSubmit()`. Replace the entire function with the following, substituting `coverage_type` and `source_page` from the table at the top of this task:

```js
// OTP form init — [PAGE NAME] page
otpForm.init({
  formCardId: 'main-form',
  getFormData() {
    const vals = {
      first_name: document.getElementById('first-name').value.trim(),
      last_name:  document.getElementById('last-name').value.trim(),
      phone:      document.getElementById('phone').value.trim(),
      email:      document.getElementById('email').value.trim(),
      state:      document.getElementById('state').value,
      contact_urgency: document.getElementById('contact-urgency').value,
      coverage_type: 'Life Insurance',          // ← substitute from table
      source_page:   '/life-insurance.html',    // ← substitute from table
    };
    const required = ['first_name','last_name','phone','email','state','contact_urgency'];
    if (required.some(k => !vals[k])) {
      alert('Please fill in all required fields.');
      return null;
    }
    return vals;
  },
});
```

- [ ] **Step 6: Add the script tag before `</body>`**

Add just before `</body>`:
```html
<script src="/js/otp-form.js"></script>
```

- [ ] **Step 7: Commit after all 7 pages are done**

```bash
git add life-insurance.html whole-life-insurance.html iuls.html annuities.html mortgage-protection.html retirement-planning.html advanced-markets.html
git commit -m "feat: add state/urgency fields and OTP flow to all 7 coverage pages"
```

---

## Task 11: Update `index.html` (Homepage)

**Files:**
- Modify: `index.html`

The homepage form currently has: first-name, last-name, phone, email, zip, age (select), coverage (select). Replace `zip` with `state`; add `contact-urgency` after `coverage`.

- [ ] **Step 1: Add `id="main-form"` to the form card**

Find (inside `<div id="get-quote">`):
```html
        <div class="form-card fade-up-2">
```
Replace with:
```html
        <div class="form-card fade-up-2" id="main-form">
```

- [ ] **Step 2: Replace the zip field with the state dropdown**

Find:
```html
            <div class="form-group">
              <label for="zip">Zip Code</label>
              <input type="text" id="zip" placeholder="90210" maxlength="5" />
            </div>
```
Replace with:
```html
            <div class="form-group">
              <label for="state">State</label>
              <select id="state" name="state" required>
                <option value="">Select your state</option>
                <option>Alabama</option><option>Alaska</option><option>Arizona</option>
                <option>Arkansas</option><option>California</option><option>Colorado</option>
                <option>Connecticut</option><option>Delaware</option><option>Florida</option>
                <option>Georgia</option><option>Hawaii</option><option>Idaho</option>
                <option>Illinois</option><option>Indiana</option><option>Iowa</option>
                <option>Kansas</option><option>Kentucky</option><option>Louisiana</option>
                <option>Maine</option><option>Maryland</option><option>Massachusetts</option>
                <option>Michigan</option><option>Minnesota</option><option>Mississippi</option>
                <option>Missouri</option><option>Montana</option><option>Nebraska</option>
                <option>Nevada</option><option>New Hampshire</option><option>New Jersey</option>
                <option>New Mexico</option><option>New York</option><option>North Carolina</option>
                <option>North Dakota</option><option>Ohio</option><option>Oklahoma</option>
                <option>Oregon</option><option>Pennsylvania</option><option>Rhode Island</option>
                <option>South Carolina</option><option>South Dakota</option><option>Tennessee</option>
                <option>Texas</option><option>Utah</option><option>Vermont</option>
                <option>Virginia</option><option>Washington</option><option>West Virginia</option>
                <option>Wisconsin</option><option>Wyoming</option>
              </select>
            </div>
```

- [ ] **Step 3: Add contact urgency after the coverage select**

Find (the closing div after the coverage select):
```html
          </div>

          <button class="btn-primary" type="button" onclick="handleSubmit()">
```
Replace with:
```html
          </div>

          <div class="form-group">
            <label for="contact-urgency">When would you like to be contacted?</label>
            <select id="contact-urgency" name="contact_urgency" required>
              <option value="">Select...</option>
              <option value="immediately">I want to be contacted immediately</option>
              <option value="within_a_week">Within a week</option>
              <option value="within_a_month">Within a month</option>
              <option value="just_looking">I'm just looking around</option>
            </select>
          </div>

          <button class="btn-primary" id="send-btn" type="button" onclick="otpForm.sendCode()">
```

- [ ] **Step 4: Fix the button label**

The button text is currently `Get My Free Quote →`. Change it to:
```html
            Send Verification Code
```

- [ ] **Step 5: Add OTP and success screens**

Find (after the closing `</div>` of `#main-form`, inside `<div id="get-quote">`):
```html
        </div>
      </div>
    </div>
  </section>
```
Replace with:
```html
        </div>

        <!-- OTP verification screen -->
        <div id="otp-screen" class="form-card" style="display:none; text-align:center; padding:48px 32px;">
          <div class="form-card-title">Verify Your Phone</div>
          <div class="form-card-sub">We sent a 6-digit code to <strong id="otp-phone-display"></strong></div>
          <div class="otp-digit-wrap">
            <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
            <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
            <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
            <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
            <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
            <input class="otp-digit" type="text" inputmode="numeric" maxlength="1" />
          </div>
          <p class="otp-error-msg">That code didn't match. Please try again or resend.</p>
          <button class="btn-primary" id="verify-btn" onclick="otpForm.verify()">Verify &amp; Submit</button>
          <p class="otp-resend-row">
            <a href="#" id="resend-link" onclick="otpForm.resend(event)" data-disabled="true" style="opacity:.4">Resend code</a>
            <span id="resend-timer"></span>
          </p>
        </div>

        <!-- Success screen -->
        <div id="success-screen" class="form-card" style="display:none; text-align:center; padding:48px 32px;">
          <div class="success-check">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="form-card-title">You're all set!</div>
          <div class="form-card-sub">One of our agents will reach out to you within 24 hours.</div>
        </div>
      </div>
    </div>
  </section>
```

- [ ] **Step 6: Replace `handleSubmit()` with `otpForm` init**

Find the `function handleSubmit()` block in the `<script>` section. Replace the entire function with:

```js
otpForm.init({
  formCardId: 'main-form',
  getFormData() {
    const coverageMap = {
      'Mortgage Protection': 'Mortgage Protection',
      'Final Expense': 'Final Expense',
      'Both': 'Mortgage Protection / Final Expense',
      'Not Sure — Need Guidance': 'Not Sure',
    };
    const vals = {
      first_name: document.getElementById('first-name').value.trim(),
      last_name:  document.getElementById('last-name').value.trim(),
      phone:      document.getElementById('phone').value.trim(),
      email:      document.getElementById('email').value.trim(),
      state:      document.getElementById('state').value,
      contact_urgency: document.getElementById('contact-urgency').value,
      coverage_type: coverageMap[document.getElementById('coverage').value] || document.getElementById('coverage').value || 'General Inquiry',
      age:        document.getElementById('age').value,
      source_page: '/',
    };
    const required = ['first_name','last_name','phone','email','state','contact_urgency'];
    if (required.some(k => !vals[k])) {
      alert('Please fill in all required fields.');
      return null;
    }
    return vals;
  },
});
```

- [ ] **Step 7: Add script tag before `</body>`**

Add just before `</body>`:
```html
<script src="/js/otp-form.js"></script>
```

- [ ] **Step 8: Commit**

```bash
git add index.html
git commit -m "feat: add state/urgency fields and OTP flow to index.html"
```

---

## Task 12: Deploy to Vercel + End-to-End Smoke Test

- [ ] **Step 1: Install Vercel CLI if not already installed**

```bash
npm install -g vercel
```

- [ ] **Step 2: Link project to Vercel**

```bash
vercel link
```

Follow prompts: log in, select your team/account, confirm project name.

- [ ] **Step 3: Set all environment variables in Vercel dashboard**

Go to https://vercel.com → your project → Settings → Environment Variables. Add each of these (Production + Preview):

```
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_VERIFY_SID
TWILIO_FROM_NUMBER
ANDREW_PHONE
SUPABASE_URL
SUPABASE_SERVICE_KEY
```

- [ ] **Step 4: Deploy**

```bash
vercel --prod
```

Expected: deployment URL printed, e.g. `https://engel-financial-group.vercel.app`

- [ ] **Step 5: Smoke test — send-code API**

```bash
curl -s -X POST https://<your-vercel-url>/api/send-code \
  -H "Content-Type: application/json" \
  -d '{"phone":"YOUR_REAL_MOBILE_NUMBER"}' | cat
```

Expected response: `{"ok":true}` and a 6-digit SMS arrives on your phone within 30 seconds.

- [ ] **Step 6: Smoke test — submit-lead API**

Using the code you just received:

```bash
curl -s -X POST https://<your-vercel-url>/api/submit-lead \
  -H "Content-Type: application/json" \
  -d '{
    "code":"<6-DIGIT-CODE>",
    "phone":"YOUR_REAL_MOBILE_NUMBER",
    "first_name":"Test","last_name":"Lead",
    "email":"test@example.com","state":"Texas",
    "coverage_type":"Life Insurance",
    "contact_urgency":"immediately",
    "source_page":"/life-insurance.html"
  }' | cat
```

Expected: `{"ok":true}`, a lead row appears in Supabase dashboard → Table Editor → leads, and Andrew receives an SMS.

- [ ] **Step 7: Manual browser test of contact form**

Open your deployed URL + `/contact.html`. Fill all fields with your real phone number → click "Send Verification Code" → enter the code → click "Verify & Submit". Confirm the success message appears inline (no redirect).

- [ ] **Step 8: Run all unit tests one final time**

```bash
npx jest
```

Expected: PASS, 22 tests.

- [ ] **Step 9: Final commit**

```bash
git add -A
git commit -m "feat: Phase 3 complete — SMS verification live on all 9 forms"
```

---

## Notes for Phase 4

Phase 4 (7 service-specific landing pages + homepage minor tweaks) will be a separate plan. It reuses `api/send-code.js` and `api/submit-lead.js` from this phase with no changes. The landing page wizard is a new frontend-only build on top of the same backend.
