# Life Insurance Pre-Sell Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Insert a trust-building pre-sell landing page at `/lp/life-insurance` before the 10-step wizard, matching the LegacyFinancial reference design with Engel Financial Group branding.

**Architecture:** Rename the existing wizard to `life-insurance-form.html`, create a new standalone `life-insurance.html` presell page (no shared CSS dependencies, all styles inline), and add `vercel.json` with `cleanUrls: true`. The presell CTA passes UTM params through to the wizard via a small inline JS snippet.

**Tech Stack:** Vanilla HTML/CSS/JS, Google Fonts CDN (Cormorant Garamond + Jost), Meta Pixel base code, no frameworks, no Tailwind. Local dev: `node serve.mjs` at `http://localhost:3000`. Screenshots: `node screenshot.mjs http://localhost:3000/lp/life-insurance.html [label]`.

---

## File Map

| Action | Path | Purpose |
|---|---|---|
| `git mv` | `lp/life-insurance.html` → `lp/life-insurance-form.html` | Wizard (unchanged except source_page) |
| Edit | `lp/life-insurance-form.html` | Update source_page value |
| Create | `lp/life-insurance.html` | New presell landing page |
| Create | `vercel.json` | Enable cleanUrls (strip .html from deployed URLs) |

---

## Task 1: Rename wizard + update source_page + create vercel.json

**Files:**
- Rename: `lp/life-insurance.html` → `lp/life-insurance-form.html`
- Edit: `lp/life-insurance-form.html` (one value change)
- Create: `vercel.json`

- [ ] **Step 1: Rename the wizard file using git mv**

```bash
git mv lp/life-insurance.html lp/life-insurance-form.html
```

Expected: no output, file renamed.

- [ ] **Step 2: Update source_page in the renamed wizard**

In `lp/life-insurance-form.html`, find and change this one value inside the `lpWizard.init()` call (around line 102):

```js
// BEFORE:
source_page: '/lp/life-insurance',

// AFTER:
source_page: '/lp/life-insurance-form',
```

- [ ] **Step 3: Create vercel.json at project root**

Create `vercel.json` with this exact content:

```json
{
  "cleanUrls": true
}
```

- [ ] **Step 4: Verify serve.mjs still finds the renamed wizard**

Start the server if not running:
```bash
node serve.mjs &
```

Then open `http://localhost:3000/lp/life-insurance-form.html` in a browser and confirm the wizard loads (Step 1 of the form should appear).

- [ ] **Step 5: Commit**

```bash
git add lp/life-insurance-form.html vercel.json
git commit -m "feat: rename wizard to life-insurance-form, add vercel cleanUrls"
```

---

## Task 2: Create presell page — head, CSS variables, base reset

**Files:**
- Create: `lp/life-insurance.html`

- [ ] **Step 1: Create the file with head, fonts, pixel, and all CSS**

Create `lp/life-insurance.html` with the following content. This is the complete `<head>` and `<style>` block — the body sections are added in later tasks.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Life Insurance Options — Engel Financial Group</title>
  <meta name="description" content="Get your free life insurance review in minutes. Compare options from 14 top carriers. No obligation, no pressure.">
  <meta name="robots" content="noindex">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
  <!-- Meta Pixel base code -->
  <script>
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1273293374914132');
    fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=1273293374914132&ev=PageView&noscript=1"
  /></noscript>
  <style>
    :root {
      --navy: #111d2b;
      --gold: #b87333;
      --gold-dark: #a36528;
      --text-dark: #111d2b;
      --text-mid: #3C4C62;
      --text-soft: #6B7A8D;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Jost', sans-serif;
      color: var(--text-dark);
      background: #fff;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Header ── */
    .ps-header {
      background: #fff;
      border-bottom: 1px solid rgba(17,29,43,0.08);
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .ps-logo img { height: 42px; width: auto; }
    .ps-phone { text-align: right; text-decoration: none; color: var(--text-dark); }
    .ps-phone span {
      display: block;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.10em;
      text-transform: uppercase;
      color: var(--text-soft);
    }
    .ps-phone strong { font-size: 16px; font-weight: 600; }

    /* ── Hero ── */
    .ps-hero {
      text-align: center;
      padding: 56px 24px 48px;
      max-width: 640px;
      margin: 0 auto;
    }
    .ps-badge {
      display: inline-block;
      background: rgba(17,29,43,0.06);
      border-radius: 20px;
      padding: 6px 18px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-mid);
      margin-bottom: 24px;
    }
    .ps-hero h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(36px, 7vw, 52px);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.02em;
      color: var(--navy);
      margin-bottom: 28px;
    }
    .ps-bullets {
      list-style: none;
      display: inline-flex;
      flex-direction: column;
      gap: 10px;
      text-align: left;
      margin-bottom: 36px;
    }
    .ps-bullets li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      color: var(--text-mid);
    }
    .ps-check {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--gold);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ps-check svg {
      width: 11px; height: 11px;
      stroke: #fff; stroke-width: 2.5; fill: none;
      stroke-linecap: round; stroke-linejoin: round;
    }
    .ps-cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: var(--gold);
      color: #fff;
      text-decoration: none;
      font-family: 'Jost', sans-serif;
      font-size: 17px;
      font-weight: 600;
      padding: 18px 48px;
      border-radius: 8px;
      letter-spacing: 0.01em;
      transition: background 0.2s ease, transform 0.15s ease;
      margin-bottom: 28px;
    }
    .ps-cta:hover { background: var(--gold-dark); }
    .ps-cta:active { transform: scale(0.98); }
    .ps-cta:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
    .ps-divider {
      border: none;
      border-top: 1px solid rgba(17,29,43,0.10);
      margin: 0 auto 22px;
      max-width: 480px;
    }
    .ps-stars { font-size: 14px; color: var(--text-soft); }
    .ps-stars .stars { color: var(--gold); letter-spacing: 2px; }
    .ps-stars strong { color: var(--text-dark); }

    /* ── Carriers ── */
    .ps-carriers {
      background: var(--navy);
      padding: 40px 24px;
      text-align: center;
    }
    .ps-carriers-label {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.55);
      margin-bottom: 28px;
    }
    .ps-carriers-logos {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 24px 36px;
      max-width: 660px;
      margin: 0 auto;
    }
    .ps-carriers-logos img {
      height: 28px;
      width: auto;
      filter: brightness(0) invert(1);
      opacity: 0.75;
    }

    /* ── Pain ── */
    .ps-pain {
      padding: 64px 24px;
      max-width: 700px;
      margin: 0 auto;
    }
    .ps-pain-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 40px;
    }
    @media (min-width: 600px) {
      .ps-pain-grid { grid-template-columns: 1fr 1fr; align-items: start; }
    }
    .ps-pain h2 {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(24px, 4vw, 32px);
      font-weight: 700;
      line-height: 1.25;
      color: var(--navy);
      margin-bottom: 28px;
    }
    .ps-risks { list-style: none; display: flex; flex-direction: column; gap: 16px; }
    .ps-risk { display: flex; align-items: center; gap: 14px; font-size: 14px; color: var(--text-mid); }
    .ps-risk-icon {
      width: 38px; height: 38px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; font-size: 17px;
    }
    .ps-risk-icon--illness { background: rgba(184,115,51,0.12); }
    .ps-risk-icon--injury  { background: rgba(253,191,77,0.18); }
    .ps-risk-icon--death   { background: rgba(17,29,43,0.08); }
    .ps-stats-row {
      display: flex; gap: 14px; margin-bottom: 22px;
    }
    .ps-stat {
      flex: 1;
      background: var(--navy);
      border-radius: 8px;
      padding: 20px 12px;
      text-align: center;
    }
    .ps-stat-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 42px; font-weight: 700; line-height: 1;
      color: var(--gold);
    }
    .ps-stat-label {
      font-size: 10px; font-weight: 600;
      letter-spacing: 0.09em; text-transform: uppercase;
      color: rgba(255,255,255,0.65); margin-top: 6px;
    }
    .ps-stats-heading {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22px; font-weight: 700;
      color: var(--navy); margin-bottom: 10px;
    }
    .ps-stats-copy {
      font-size: 14px; line-height: 1.75; color: var(--text-soft);
    }

    /* ── Social proof ── */
    .ps-proof {
      background: var(--navy);
      padding: 56px 24px;
      text-align: center;
    }
    .ps-proof-logo {
      height: 46px; width: auto;
      margin-bottom: 20px;
      filter: brightness(0) invert(1);
      opacity: 0.88;
    }
    .ps-proof-line1 { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 8px; }
    .ps-proof-line2 { font-size: 14px; color: rgba(255,255,255,0.50); margin-bottom: 6px; }
    .ps-proof-line3 { font-size: 14px; color: rgba(255,255,255,0.50); }

    /* ── FAQ ── */
    .ps-faq {
      padding: 64px 24px;
      max-width: 640px;
      margin: 0 auto;
    }
    .ps-faq h2 {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(28px, 4vw, 36px);
      font-weight: 700;
      color: var(--navy);
      text-align: center;
      margin-bottom: 40px;
    }
    .ps-faq-list { border-top: 1px solid rgba(17,29,43,0.10); }
    .ps-faq-item { border-bottom: 1px solid rgba(17,29,43,0.10); }
    .ps-faq-trigger {
      width: 100%; background: none; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: space-between;
      gap: 16px; padding: 20px 0; text-align: left;
      font-family: 'Jost', sans-serif; font-size: 15px; font-weight: 500;
      color: var(--text-dark);
      transition: color 0.15s;
    }
    .ps-faq-trigger:hover { color: var(--gold); }
    .ps-faq-trigger:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; border-radius: 2px; }
    .ps-faq-chevron {
      width: 20px; height: 20px; flex-shrink: 0;
      stroke: currentColor; fill: none; stroke-width: 2;
      stroke-linecap: round; stroke-linejoin: round;
      transition: transform 0.2s ease;
    }
    .ps-faq-item.open .ps-faq-chevron { transform: rotate(180deg); }
    .ps-faq-answer { display: none; padding-bottom: 20px; }
    .ps-faq-item.open .ps-faq-answer { display: block; }
    .ps-faq-answer p { font-size: 14px; line-height: 1.8; color: var(--text-soft); }
    .ps-faq-cta { text-align: center; margin-top: 40px; }
    .ps-faq-cta .ps-cta { margin-bottom: 0; }

    /* ── Footer ── */
    .ps-footer {
      background: var(--navy);
      padding: 32px 24px;
      text-align: center;
    }
    .ps-footer p { font-size: 12px; line-height: 1.9; color: rgba(255,255,255,0.35); }
    .ps-footer a { color: rgba(255,255,255,0.45); text-decoration: none; }
    .ps-footer a:hover { color: rgba(255,255,255,0.75); }

    /* ── Mobile ── */
    @media (max-width: 480px) {
      .ps-cta { display: flex; width: 100%; justify-content: center; padding: 18px 24px; }
    }
  </style>
</head>
<body>
</body>
</html>
```

- [ ] **Step 2: Start the dev server (if not already running)**

```bash
node serve.mjs &
```

- [ ] **Step 3: Screenshot to confirm page loads (blank white page is correct at this stage)**

```bash
node screenshot.mjs http://localhost:3000/lp/life-insurance.html scaffold
```

Read `temporary screenshots/screenshot-N-scaffold.png` — expect a blank white page. No errors in the terminal.

- [ ] **Step 4: Commit**

```bash
git add lp/life-insurance.html
git commit -m "feat: add presell page scaffold (head, CSS, empty body)"
```

---

## Task 3: Header + Hero sections

**Files:**
- Edit: `lp/life-insurance.html` — replace `<body>\n</body>` with full body content through the hero section

- [ ] **Step 1: Replace the empty body with header + hero**

Replace the existing `<body>\n</body>` in `lp/life-insurance.html` with:

```html
<body>

  <!-- Header -->
  <header class="ps-header">
    <a href="/" class="ps-logo">
      <img src="/brand_assets/engel-financial-group.jpg" alt="Engel Financial Group">
    </a>
    <a href="tel:+15016915508" class="ps-phone">
      <span>Prefer to talk?</span>
      <strong>(501) 691-5508</strong>
    </a>
  </header>

  <!-- Hero -->
  <section class="ps-hero">
    <div class="ps-badge">Free &middot; No Obligation &middot; 5 Minutes</div>
    <h1>Life Insurance Protection<br>In Minutes</h1>
    <ul class="ps-bullets">
      <li>
        <span class="ps-check">
          <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>
        </span>
        Covers illness, disability &amp; death
      </li>
      <li>
        <span class="ps-check">
          <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>
        </span>
        Access 14 top carriers instantly
      </li>
      <li>
        <span class="ps-check">
          <svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>
        </span>
        No medical exam required for many plans
      </li>
    </ul>
    <a href="/lp/life-insurance-form" class="ps-cta" data-utm-passthrough>
      Check My Options &rarr;
    </a>
    <hr class="ps-divider">
    <p class="ps-stars">
      <span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
      <strong>4.9</strong> rated by families nationwide
    </p>
  </section>

</body>
```

- [ ] **Step 2: Screenshot desktop hero**

```bash
node screenshot.mjs http://localhost:3000/lp/life-insurance.html hero
```

Read the screenshot. Check against the reference image:
- Logo left, phone right in header ✓
- Gold pill badge ✓
- Large serif heading ✓
- Three bullet points with gold checkmarks ✓
- Gold CTA button ✓
- Divider + star rating ✓

- [ ] **Step 3: Commit if it looks right**

```bash
git add lp/life-insurance.html
git commit -m "feat: add presell header and hero sections"
```

---

## Task 4: Carriers strip section

**Files:**
- Edit: `lp/life-insurance.html` — add carriers section after `</section>` (hero close tag)

- [ ] **Step 1: Add the carriers section**

After the closing `</section>` of the hero and before `</body>`, insert:

```html
  <!-- Carriers -->
  <section class="ps-carriers">
    <p class="ps-carriers-label">Easily compare options from leading carriers</p>
    <div class="ps-carriers-logos">
      <img src="/brand_assets/carriers/transamerica.png" alt="Transamerica">
      <img src="/brand_assets/carriers/foresters-financial.svg" alt="Foresters Financial">
      <img src="/brand_assets/carriers/mutual-of-omaha.svg" alt="Mutual of Omaha">
      <img src="/brand_assets/carriers/sbli.png" alt="SBLI">
      <img src="/brand_assets/carriers/fg.png" alt="F&amp;G Annuities &amp; Life">
      <img src="/brand_assets/carriers/aetna.svg" alt="Aetna">
      <img src="/brand_assets/carriers/corebridge.jpg" alt="Corebridge Financial">
    </div>
  </section>
```

- [ ] **Step 2: Screenshot the carriers section**

```bash
node screenshot.mjs http://localhost:3000/lp/life-insurance.html carriers
```

Read the screenshot. Check:
- Dark navy background strip ✓
- All 7 logos appear as white silhouettes on navy ✓
- Logos flex-wrap cleanly, centered ✓
- Label text visible above logos ✓

If any logo appears as a white square (missing transparency), it means the source file has a solid white background — the `brightness(0) invert(1)` filter will still make it white-on-navy which is fine visually.

- [ ] **Step 3: Commit**

```bash
git add lp/life-insurance.html
git commit -m "feat: add carrier logos strip to presell page"
```

---

## Task 5: Pain section

**Files:**
- Edit: `lp/life-insurance.html` — add pain section after carriers section

- [ ] **Step 1: Add the pain section**

After the carriers `</section>` and before `</body>`, insert:

```html
  <!-- Pain -->
  <section class="ps-pain">
    <div class="ps-pain-grid">
      <div>
        <h2>Protect your home and family from the unexpected&hellip;</h2>
        <ul class="ps-risks">
          <li class="ps-risk">
            <span class="ps-risk-icon ps-risk-icon--illness">🛡️</span>
            Diagnosis of a Critical Illness
          </li>
          <li class="ps-risk">
            <span class="ps-risk-icon ps-risk-icon--injury">⚡</span>
            Becoming Disabled from Illness/Injury
          </li>
          <li class="ps-risk">
            <span class="ps-risk-icon ps-risk-icon--death">💙</span>
            Passing Away
          </li>
        </ul>
      </div>
      <div>
        <div class="ps-stats-row">
          <div class="ps-stat">
            <div class="ps-stat-num">54%</div>
            <div class="ps-stat-label">Foreclosures</div>
          </div>
          <div class="ps-stat">
            <div class="ps-stat-num">81%</div>
            <div class="ps-stat-label">Bankruptcies</div>
          </div>
        </div>
        <h3 class="ps-stats-heading">Medical crises often cause financial crises</h3>
        <p class="ps-stats-copy">Studies show that up to 54% of home foreclosures and more than 81% of personal bankruptcies are linked to medical debt from illness or injuries.</p>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Screenshot pain section**

```bash
node screenshot.mjs http://localhost:3000/lp/life-insurance.html pain
```

Read the screenshot. Check:
- Two-column layout on desktop (risks left, stats right) ✓
- Three risk items with colored circle icons ✓
- Two navy stat boxes with gold large numbers (54% / 81%) ✓
- Stat label text ("FORECLOSURES" / "BANKRUPTCIES") ✓
- Heading + body copy below stats ✓

- [ ] **Step 3: Commit**

```bash
git add lp/life-insurance.html
git commit -m "feat: add pain section with risk icons and stats to presell page"
```

---

## Task 6: Social proof, FAQ, Footer, JS

**Files:**
- Edit: `lp/life-insurance.html` — add remaining sections + script block

- [ ] **Step 1: Add social proof, FAQ, footer, and script**

After the pain `</section>` and before `</body>`, insert:

```html
  <!-- Social proof -->
  <section class="ps-proof">
    <img src="/brand_assets/engel-financial-group-trasnarent.png" alt="Engel Financial Group" class="ps-proof-logo">
    <p class="ps-proof-line1">Independent Broker &middot; Licensed in 15 States</p>
    <p class="ps-proof-line2">Access to 14 top-rated carriers &middot; No carrier bias</p>
    <p class="ps-proof-line3">Offering affordable coverage nationwide since 2020</p>
  </section>

  <!-- FAQ -->
  <section class="ps-faq">
    <h2>Frequently Asked Questions</h2>
    <div class="ps-faq-list">

      <div class="ps-faq-item">
        <button class="ps-faq-trigger" aria-expanded="false">
          What is life insurance and why do I need it?
          <svg class="ps-faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="ps-faq-answer">
          <p>Life insurance provides a tax-free payout to your beneficiaries if you pass away, ensuring your family can maintain their home, pay off debts, and cover everyday expenses without financial hardship. It&rsquo;s one of the most important safety nets a family can have.</p>
        </div>
      </div>

      <div class="ps-faq-item">
        <button class="ps-faq-trigger" aria-expanded="false">
          How much does life insurance cost?
          <svg class="ps-faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="ps-faq-answer">
          <p>Costs vary based on your age, health, coverage amount, and policy type. Many healthy adults qualify for coverage starting under $30/month. As an independent broker, we compare options across 14 carriers to find what fits your budget.</p>
        </div>
      </div>

      <div class="ps-faq-item">
        <button class="ps-faq-trigger" aria-expanded="false">
          Do I need a medical exam to qualify?
          <svg class="ps-faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="ps-faq-answer">
          <p>Not always. Many carriers offer simplified-issue or no-exam policies, especially for term and final expense coverage. Your advisor will identify which options you may qualify for without an exam.</p>
        </div>
      </div>

      <div class="ps-faq-item">
        <button class="ps-faq-trigger" aria-expanded="false">
          Can I still qualify if I have a health condition?
          <svg class="ps-faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="ps-faq-answer">
          <p>Yes, in many cases. As an independent broker with access to 14 carriers, we can match you with plans designed for various health profiles. A short review helps us identify what fits your situation.</p>
        </div>
      </div>

      <div class="ps-faq-item">
        <button class="ps-faq-trigger" aria-expanded="false">
          How does the free review work?
          <svg class="ps-faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="ps-faq-answer">
          <p>Answer a few short questions &mdash; about 5 minutes. A licensed advisor from Engel Financial Group will then reach out personally to walk through your options. No obligation, no pressure, no pushy sales calls.</p>
        </div>
      </div>

    </div>
    <div class="ps-faq-cta">
      <a href="/lp/life-insurance-form" class="ps-cta" data-utm-passthrough>Get My Free Review</a>
    </div>
  </section>

  <!-- Footer -->
  <footer class="ps-footer">
    <p>
      &copy; 2026 Engel Financial Group. All rights reserved.<br>
      Licensed insurance professional. This site is not affiliated with or endorsed by any government agency.<br>
      <a href="/privacy-policy">Privacy Policy</a> &nbsp;&middot;&nbsp;
      <a href="/terms-of-service">Terms of Service</a> &nbsp;&middot;&nbsp;
      <a href="/tcpa-compliance">TCPA Compliance</a>
    </p>
  </footer>

  <script>
    // UTM passthrough — forward query string from presell URL into wizard CTA links
    (function () {
      var qs = window.location.search;
      if (!qs) return;
      document.querySelectorAll('[data-utm-passthrough]').forEach(function (el) {
        var base = el.getAttribute('href').split('?')[0];
        el.setAttribute('href', base + qs);
      });
    }());

    // FAQ accordion
    document.querySelectorAll('.ps-faq-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.ps-faq-item');
        var wasOpen = item.classList.contains('open');
        // close all
        document.querySelectorAll('.ps-faq-item.open').forEach(function (i) {
          i.classList.remove('open');
          i.querySelector('.ps-faq-trigger').setAttribute('aria-expanded', 'false');
        });
        // open clicked if it was closed
        if (!wasOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  </script>
```

- [ ] **Step 2: Screenshot the full page**

```bash
node screenshot.mjs http://localhost:3000/lp/life-insurance.html full
```

Read the screenshot. Verify all sections are present top to bottom:
1. Header (logo + phone) ✓
2. Hero (badge, heading, bullets, CTA, stars) ✓
3. Carriers strip (dark navy, 7 white logos) ✓
4. Pain section (risks + stats) ✓
5. Social proof (dark navy, EFG logo, trust lines) ✓
6. FAQ (heading, 5 accordion items, CTA) ✓
7. Footer (dark navy, legal text) ✓

- [ ] **Step 3: Commit**

```bash
git add lp/life-insurance.html
git commit -m "feat: complete presell page — proof, FAQ, footer, UTM passthrough, accordion JS"
```

---

## Task 7: Visual comparison pass — desktop

**Files:**
- No file changes expected unless issues found

- [ ] **Step 1: Side-by-side comparison screenshot**

```bash
node screenshot.mjs http://localhost:3000/lp/life-insurance.html compare-desktop
```

Read the screenshot and compare it against the reference image `brand_assets/Form-example-first-page.png`.

Check each section against the reference for:
- **Spacing/padding** — hero top padding, section gaps
- **Typography** — heading size, font weight, bullet text size
- **Colors** — gold (#b87333), navy (#111d2b), button color
- **CTA button** — padding, border-radius, arrow character
- **Carriers strip** — logo size, gap, label
- **Stats** — number size (should be large), label capitalisation
- **FAQ** — divider lines, chevron alignment

Note any specific pixel-level discrepancies.

- [ ] **Step 2: Fix any spacing or typography issues**

If the hero heading is too large/small, adjust `clamp()` bounds in `.ps-hero h1`.
If bullet text is too large/small, adjust `.ps-bullets li font-size`.
If the CTA button padding looks off, adjust `.ps-cta padding`.
If carrier logos are too large/small, adjust `.ps-carriers-logos img height`.

After each fix, re-screenshot:
```bash
node screenshot.mjs http://localhost:3000/lp/life-insurance.html fix1
```

- [ ] **Step 3: Screenshot pass 2 after fixes**

```bash
node screenshot.mjs http://localhost:3000/lp/life-insurance.html compare-desktop-2
```

Read and verify no remaining visual differences from the reference.

- [ ] **Step 4: Commit any fixes**

```bash
git add lp/life-insurance.html
git commit -m "fix: presell page visual alignment — spacing, typography, CTA"
```

---

## Task 8: Mobile screenshot verification

**Files:**
- Edit: `lp/life-insurance.html` if mobile issues found

- [ ] **Step 1: Screenshot at mobile width**

```bash
node screenshot.mjs http://localhost:3000/lp/life-insurance.html mobile
```

Then check the screenshot at 390px viewport width (Puppeteer default may be desktop — if so, check for `screenshot.mjs` viewport options, or look at the mobile rendering and note overflow/layout issues).

Look for:
- Pain section: should stack single column on mobile (grid collapses) ✓
- CTA button: should be full-width on mobile ✓
- Carriers: logos should wrap to 2–3 per row ✓
- No horizontal scroll ✓
- Header: logo + phone should fit without overflow ✓

- [ ] **Step 2: Fix any mobile issues found**

Common fixes:
- If header overflows: reduce `.ps-logo img` height or `.ps-phone strong font-size`
- If carriers overflow: reduce `gap` or logo `height`
- If stats boxes too narrow on mobile: add `@media (max-width: 400px)` reducing `.ps-stat-num font-size`

- [ ] **Step 3: Commit if changes were made**

```bash
git add lp/life-insurance.html
git commit -m "fix: presell page mobile layout"
```

---

## Task 9: Verify UTM passthrough and FAQ interaction

**Files:**
- No changes expected

- [ ] **Step 1: Test UTM passthrough in browser**

Open: `http://localhost:3000/lp/life-insurance.html?utm_source=meta&utm_campaign=test`

Right-click the "Check My Options" CTA button → Inspect → check its `href` attribute.

Expected: `href="/lp/life-insurance-form?utm_source=meta&utm_campaign=test"`

If `href` is still just `/lp/life-insurance-form` (no query string), the JS isn't running — check browser console for errors.

- [ ] **Step 2: Test FAQ accordion**

Click the first FAQ question. The answer should expand and the chevron should rotate 180°.
Click it again — it should collapse.
Click a second question — it should open, and the first should close (one-at-a-time behaviour).

- [ ] **Step 3: Test CTA links navigate to wizard**

Click "Check My Options" — should navigate to `/lp/life-insurance-form.html` (wizard step 1 appears).
Click the browser back button — should return to the presell page.

- [ ] **Step 4: Test social proof logo on dark background**

Look at the social proof section. The EFG logo (rendered white via CSS filter) should be legible on the dark navy background.

If the logo is not visible (white-on-white, meaning the PNG has transparency already with white logo), switch to using `engel-financial-group.jpg` without the `brightness(0) invert(1)` filter and instead use a low `opacity: 0.85`. Update the CSS:

```css
/* If transparent logo is already white — just use opacity */
.ps-proof-logo {
  height: 46px; width: auto;
  margin-bottom: 20px;
  opacity: 0.85;
  /* remove the filter: brightness(0) invert(1) line */
}
```

Screenshot and verify legibility.

---

## Task 10: Final commit and deploy

**Files:**
- No new changes

- [ ] **Step 1: Full page final screenshot**

```bash
node screenshot.mjs http://localhost:3000/lp/life-insurance.html final
```

Read the screenshot. Confirm the page looks polished end-to-end.

- [ ] **Step 2: Verify wizard still works at new URL**

Open `http://localhost:3000/lp/life-insurance-form.html` — wizard step 1 should render. Complete 2–3 steps to confirm no regressions.

- [ ] **Step 3: Commit and push**

```bash
git status
git push
```

After pushing, Vercel will deploy automatically. Verify at the live URL that:
1. `/lp/life-insurance` (no .html) loads the presell page
2. `/lp/life-insurance-form` (no .html) loads the wizard
3. Old `.html` URLs redirect to clean URLs (Vercel handles this automatically with `cleanUrls: true`)

- [ ] **Step 4: Update Ads Manager destination URL (if applicable)**

The Meta ad destination URL was set to `/lp/life-insurance` with UTM dynamic macros — this URL still works, no Ads Manager change needed.

If the URL in Ads Manager has `.html` (e.g. `/lp/life-insurance.html`), update it to `/lp/life-insurance` (no extension) since cleanUrls are now live.

---

## Self-Review Checklist

**Spec coverage:**
- ✅ URL strategy (Approach A: presell at `life-insurance.html`, wizard at `life-insurance-form.html`)
- ✅ Meta Pixel PageView on presell page
- ✅ All 7 sections from reference (header, hero, carriers, pain, social proof, FAQ, footer)
- ✅ Carrier logos with CSS filter for dark background
- ✅ UTM passthrough JS
- ✅ FAQ accordion JS (one-at-a-time open)
- ✅ Mobile-first responsive (grid collapses, CTA full-width on mobile)
- ✅ `vercel.json` cleanUrls
- ✅ source_page updated in wizard
- ✅ Visual comparison pass against reference
- ✅ Mobile verification pass

**No placeholders:** All code blocks contain complete, copy-pasteable HTML/CSS/JS.

**Type consistency:**
- `.ps-cta` class used consistently for all CTA buttons
- `data-utm-passthrough` attribute matches the JS `querySelectorAll` selector
- `.ps-faq-item` / `.ps-faq-trigger` / `.ps-faq-chevron` / `.open` — consistent across CSS and JS
