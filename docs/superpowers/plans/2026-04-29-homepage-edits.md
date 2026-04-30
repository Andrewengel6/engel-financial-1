# Homepage Edits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply 4 bug fixes and add 3 new sections to `index.html` — Independent Broker comparison table, Why Choose Andrew personal trust section, and Schedule a Call booking section.

**Architecture:** All changes are confined to `index.html` (HTML + inline `<style>` block) and `styles.css` (one additive class). No new files. New sections are inserted at specific points in the existing page body. The IntersectionObserver JS at the bottom of `index.html` is extended to animate new elements.

**Tech Stack:** Static HTML, inline CSS, vanilla JS, Tailwind CDN (not used for new sections — all new CSS is custom). Dev server: `node serve.mjs` at `http://localhost:3000`. Screenshots: `node screenshot.mjs http://localhost:3000`.

---

## File Map

| File | Change type | What changes |
|---|---|---|
| `styles.css` | Additive | Add `.cred-pill` class (reusable across pages) |
| `index.html` `<style>` | Additive | Add CSS for broker, andrew, and schedule sections |
| `index.html` nav | Fix | Logo height; phone number ×2 |
| `index.html` solution section | Fix | Sol-card top offsets + stack height |
| `index.html` body | Insert | 3 new `<section>` blocks at specific positions |
| `index.html` `<script>` | Extend | querySelectorAll selector + new element classes |

---

## Task 1: Bug Fix — Nav Dropdown Hover Gap

**Files:**
- Modify: `styles.css` — `.nav-dropdown-menu` rule (line 120–136)

The gap between the trigger button and dropdown menu (`top: calc(100% + 16px)`) causes a `mouseleave` event before the cursor reaches the menu. Fix: move the menu to `top: 100%` and add `padding-top: 16px` so the menu element starts flush with the trigger (no gap), but the visible content is still offset by 16px via padding.

- [ ] **Step 1: Start the dev server (if not already running)**

```bash
node serve.mjs
```

Expected: server running at `http://localhost:3000`. If already running, skip.

- [ ] **Step 2: Screenshot the current nav (baseline)**

```bash
node screenshot.mjs http://localhost:3000 nav-before
```

Open the screenshot at `temporary screenshots/screenshot-N-nav-before.png`. Hover over a nav dropdown to observe the bug (dropdown disappears when moving cursor down to menu items).

- [ ] **Step 3: Fix the dropdown gap in `styles.css`**

Find `.nav-dropdown-menu` (around line 120). Change:

```css
/* BEFORE */
.nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10,18,25,0.98);
  border: 1px solid rgba(184,115,51,0.2);
  border-radius: 4px;
  padding: 8px 0;
  min-width: 230px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 200;
  backdrop-filter: blur(12px);
}
```

To:

```css
/* AFTER */
.nav-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10,18,25,0.98);
  border: 1px solid rgba(184,115,51,0.2);
  border-radius: 4px;
  padding: 16px 0 8px;
  min-width: 230px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 200;
  backdrop-filter: blur(12px);
}
```

Key changes: `top: calc(100% + 16px)` → `top: 100%`, `padding: 8px 0` → `padding: 16px 0 8px`.

- [ ] **Step 4: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000 nav-after
```

Read the screenshot. The nav should look identical. Test manually: hover over "Coverage" — the dropdown should stay visible as you move down into the menu links.

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "fix: nav dropdown hover gap — bridge trigger-to-menu gap with padding-top"
```

---

## Task 2: Bug Fix — Logo Size

**Files:**
- Modify: `styles.css` — `.logo-img` rule (line 75–80)

The logo appears too small. Increase height from `44px` to `52px`.

- [ ] **Step 1: Edit `.logo-img` in `styles.css`**

Find `.logo-img` (around line 75). Change:

```css
/* BEFORE */
.logo-img {
  height: 44px;
  width: auto;
  object-fit: contain;
  border-radius: 2px;
}
```

To:

```css
/* AFTER */
.logo-img {
  height: 52px;
  width: auto;
  object-fit: contain;
  border-radius: 2px;
}
```

- [ ] **Step 2: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000 logo-after
```

Read the screenshot. The Engel Financial Group logo in the top-left nav should be noticeably larger and more prominent than before.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "fix: increase nav logo height from 44px to 52px for better visibility"
```

---

## Task 3: Bug Fix — Phone Number

**Files:**
- Modify: `index.html` — desktop nav phone link and mobile menu phone link

Replace the placeholder 800 number with Andrew's personal number in both locations.

- [ ] **Step 1: Find and replace the desktop nav phone link**

In `index.html`, find this block (around line 813):

```html
<a href="tel:+18005551234" class="phone-link">
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
  (800) 555-1234
</a>
```

Replace with:

```html
<a href="tel:+15016915508" class="phone-link">
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
  (501) 691-5508
</a>
```

- [ ] **Step 2: Find and replace the mobile menu phone link**

In `index.html`, find this block (around line 854):

```html
<a href="tel:+18005551234" class="mobile-phone-link">
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
  (800) 555-1234
</a>
```

Replace with:

```html
<a href="tel:+15016915508" class="mobile-phone-link">
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
  (501) 691-5508
</a>
```

- [ ] **Step 3: Verify both replacements are complete**

Search `index.html` for `8005551234` — it must return zero results.

- [ ] **Step 4: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000 phone-after
```

Read the screenshot. The nav should show `(501) 691-5508` in gold next to the phone icon.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "fix: update phone number to (501) 691-5508 in nav and mobile menu"
```

---

## Task 4: Bug Fix — Solution Card Stack Overlap

**Files:**
- Modify: `index.html` — inline styles on `.sol-card-1`, `.sol-card-2`, `.sol-card-3`, and `.solution-card-stack`

The three absolutely-positioned cards overlap. New `top` values: 0 / 170px / 340px. Stack height: `540px`.

- [ ] **Step 1: Screenshot the solution section (baseline)**

```bash
node screenshot.mjs http://localhost:3000/index.html#solution cards-before
```

Read the screenshot to see the current overlap.

- [ ] **Step 2: Fix `.sol-card-2` top offset**

In `index.html`, find:

```html
      <div class="sol-card sol-card-2">
```

Its surrounding inline style context is set by the CSS class `.sol-card-2` in the `<style>` block (around line 396):

```css
    .sol-card-2 {
      top: 80px; left: 40px; right: 0;
      background: rgba(184,115,51,0.08);
    }
```

Change to:

```css
    .sol-card-2 {
      top: 170px; left: 40px; right: 0;
      background: rgba(184,115,51,0.08);
    }
```

- [ ] **Step 3: Fix `.sol-card-3` top offset**

In `index.html`, find `.sol-card-3` in the `<style>` block (around line 401):

```css
    .sol-card-3 {
      top: 220px; left: 20px; right: 20px;
      background: rgba(255,255,255,0.04);
    }
```

Change to:

```css
    .sol-card-3 {
      top: 340px; left: 20px; right: 20px;
      background: rgba(255,255,255,0.04);
    }
```

- [ ] **Step 4: Increase `.solution-card-stack` height**

In `index.html`, find `.solution-card-stack` in the `<style>` block (around line 378):

```css
    .solution-card-stack {
      position: relative;
      height: 460px;
    }
```

Change to:

```css
    .solution-card-stack {
      position: relative;
      height: 540px;
    }
```

- [ ] **Step 5: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000 cards-after
```

Read the screenshot. Scroll to the solution section. All three cards (Mortgage Protection, Final Expense, Coverage Status) must be fully visible with no overlap.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "fix: solution card stack — recalculate top offsets and height to eliminate overlap"
```

---

## Task 5: New Section — Independent Broker vs Captive Agent

**Files:**
- Modify: `index.html` `<style>` block — add broker section CSS at the end (before `</style>`)
- Modify: `index.html` body — insert section between the Solution section and the Benefits section

### Step 1: Add CSS

- [ ] **Step 1: Add broker section CSS to the `<style>` block in `index.html`**

Find the closing `</style>` tag of the `<style>` block in `<head>`. Insert the following immediately before it:

```css
    /* ── Broker Advantage Section ── */
    .broker-section {
      background: var(--off-white);
      padding: 100px 0;
    }

    .broker-section h2 {
      font-size: clamp(34px, 4vw, 52px);
      font-weight: 600;
      color: var(--navy);
      line-height: 1.12;
      margin-bottom: 20px;
    }

    .broker-intro {
      font-size: 17px;
      font-weight: 300;
      line-height: 1.75;
      color: var(--text-mid);
      max-width: 680px;
      margin-bottom: 48px;
    }

    .broker-table-wrap {
      overflow-x: auto;
      margin-bottom: 32px;
    }

    .broker-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 15px;
    }

    .broker-table thead tr {
      background: rgba(184,115,51,0.08);
    }

    .broker-th-feature {
      padding: 16px 20px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(17,29,43,0.4);
      width: 28%;
    }

    .broker-th-engel {
      padding: 16px 20px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: var(--gold);
      letter-spacing: 0.04em;
      width: 36%;
    }

    .broker-th-captive {
      padding: 16px 20px;
      text-align: left;
      font-size: 13px;
      font-weight: 400;
      color: rgba(17,29,43,0.35);
      width: 36%;
    }

    .broker-row td {
      padding: 16px 20px;
      border-bottom: 1px solid rgba(17,29,43,0.07);
      vertical-align: top;
      line-height: 1.5;
    }

    .broker-feature {
      font-size: 14px;
      font-weight: 500;
      color: var(--navy);
    }

    .broker-engel {
      background: rgba(184,115,51,0.04);
      font-weight: 500;
      color: var(--navy);
    }

    .broker-captive {
      color: rgba(17,29,43,0.35);
      font-weight: 400;
    }

    .broker-trust {
      font-size: 15px;
      font-style: italic;
      color: var(--text-mid);
      max-width: 680px;
      line-height: 1.7;
      padding: 20px 0 0 20px;
      border-left: 2px solid var(--gold);
    }

    .broker-mobile-cards { display: none; }

    @media (max-width: 768px) {
      .broker-table-wrap { display: none; }
      .broker-mobile-cards {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 32px;
      }
      .broker-mobile-card {
        background: #fff;
        border: 1px solid #EAE7E0;
        border-radius: 4px;
        padding: 20px;
      }
      .broker-mobile-feature {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 10px;
      }
      .broker-mobile-engel {
        font-size: 14px;
        font-weight: 500;
        color: var(--navy);
        margin-bottom: 4px;
      }
      .broker-mobile-captive-val {
        font-size: 13px;
        color: rgba(17,29,43,0.4);
      }
    }
```

### Step 2: Add HTML

- [ ] **Step 2: Insert the broker section HTML after the Solution section**

In `index.html`, find the closing tag of the Solution section:

```html
  </section>

  <!-- ═══════════════ BENEFITS ═══════════════ -->
```

Insert the following block between those two lines:

```html
  <!-- ═══════════════ BROKER ADVANTAGE ═══════════════ -->
  <section class="broker-section" id="broker-advantage">
    <div class="section-inner">
      <div class="section-eyebrow">The Advantage</div>
      <h2>Independent Broker vs. Captive Agent —<br />Here's the Difference</h2>
      <p class="broker-intro">
        Not all insurance agents work the same way — and that difference has a direct impact on your rate and your options. As an independent broker, I have access to 40–50+ A-rated carriers, which means I can shop the market and find you the best coverage at the best price. Captive agents are locked into one company's products. I work for you, not the carrier.
      </p>

      <!-- Desktop table (hidden on mobile) -->
      <div class="broker-table-wrap">
        <table class="broker-table">
          <thead>
            <tr>
              <th class="broker-th-feature"></th>
              <th class="broker-th-engel">✦ Engel Financial (Independent)</th>
              <th class="broker-th-captive">Captive Agent</th>
            </tr>
          </thead>
          <tbody>
            <tr class="broker-row">
              <td class="broker-feature">Carriers available</td>
              <td class="broker-engel">40–50+ A-rated carriers</td>
              <td class="broker-captive">1 company only</td>
            </tr>
            <tr class="broker-row">
              <td class="broker-feature">Shops the market for you</td>
              <td class="broker-engel">✓ Yes — compares all options</td>
              <td class="broker-captive">✗ Cannot compare outside products</td>
            </tr>
            <tr class="broker-row">
              <td class="broker-feature">Who they work for</td>
              <td class="broker-engel">You, the client</td>
              <td class="broker-captive">The insurance company</td>
            </tr>
            <tr class="broker-row">
              <td class="broker-feature">Rate &amp; coverage flexibility</td>
              <td class="broker-engel">Best available rate through competition</td>
              <td class="broker-captive">Limited to one company's pricing</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile cards (shown only on mobile) -->
      <div class="broker-mobile-cards">
        <div class="broker-mobile-card">
          <div class="broker-mobile-feature">Carriers available</div>
          <div class="broker-mobile-engel">✓ 40–50+ A-rated carriers</div>
          <div class="broker-mobile-captive-val">✗ 1 company only (captive)</div>
        </div>
        <div class="broker-mobile-card">
          <div class="broker-mobile-feature">Shops the market for you</div>
          <div class="broker-mobile-engel">✓ Compares all options</div>
          <div class="broker-mobile-captive-val">✗ Cannot compare outside products</div>
        </div>
        <div class="broker-mobile-card">
          <div class="broker-mobile-feature">Who they work for</div>
          <div class="broker-mobile-engel">✓ You, the client</div>
          <div class="broker-mobile-captive-val">✗ The insurance company</div>
        </div>
        <div class="broker-mobile-card">
          <div class="broker-mobile-feature">Rate &amp; coverage flexibility</div>
          <div class="broker-mobile-engel">✓ Best available rate through competition</div>
          <div class="broker-mobile-captive-val">✗ Limited to one company's pricing</div>
        </div>
      </div>

      <p class="broker-trust">
        With access to dozens of top carriers, we shop the market so you don't have to — saving you time, money, and the headache of comparing policies on your own.
      </p>
    </div>
  </section>

```

- [ ] **Step 3: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000 broker-section
```

Read the screenshot. Scroll to the new broker section. Verify:
- Eyebrow "The Advantage" visible in gold
- Headline present
- Table has 3 columns: feature label (muted), Engel column (gold header, lightly tinted rows), Captive column (muted/grey)
- 4 data rows visible
- Trust statement below the table with left gold border

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Independent Broker vs Captive Agent comparison section"
```

---

## Task 6: New Section — Why Choose Andrew

**Files:**
- Modify: `styles.css` — add `.cred-pill` class
- Modify: `index.html` `<style>` block — add andrew section CSS
- Modify: `index.html` body — insert section between Benefits section and How It Works section

### Step 1: Add `.cred-pill` to `styles.css`

- [ ] **Step 1: Add `.cred-pill` to `styles.css`**

Append to the end of `styles.css` (after the last `@media` block):

```css
/* ── Credential Pills ── */
.cred-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(184,115,51,0.08);
  border: 1px solid rgba(184,115,51,0.25);
  border-radius: 20px;
  padding: 5px 14px;
  color: var(--gold);
  margin: 0 6px 8px 0;
}
```

### Step 2: Add Andrew section CSS

- [ ] **Step 2: Add andrew section CSS to `index.html` `<style>` block**

Find the closing `</style>` tag of the `<style>` block in `<head>`. Insert immediately before it:

```css
    /* ── Andrew Section ── */
    .andrew-section {
      background: #fff;
      padding: 100px 0;
    }

    .andrew-inner {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 72px;
      align-items: center;
    }

    .andrew-photo-wrap {
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid rgba(184,115,51,0.3);
      box-shadow:
        0 8px 32px rgba(17,29,43,0.12),
        0 2px 8px rgba(17,29,43,0.06);
    }

    .andrew-photo-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(17,29,43,0.25) 0%, transparent 50%);
      z-index: 1;
      pointer-events: none;
    }

    .andrew-photo-img {
      width: 100%;
      display: block;
      object-fit: cover;
      object-position: top center;
    }

    .andrew-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 38px;
      font-weight: 600;
      color: var(--navy);
      margin-bottom: 8px;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .andrew-title {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 20px;
    }

    .andrew-bio {
      font-size: 16px;
      font-weight: 300;
      line-height: 1.8;
      color: var(--text-mid);
      margin-bottom: 28px;
    }

    .andrew-pills {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 32px;
    }

    @media (max-width: 768px) {
      .andrew-inner {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      .andrew-photo-img {
        max-height: 360px;
        object-fit: cover;
        object-position: top center;
      }
    }
```

### Step 3: Add HTML

- [ ] **Step 3: Insert the Andrew section HTML after the Benefits section**

In `index.html`, find:

```html
  <!-- ═══════════════ HOW IT WORKS ═══════════════ -->
```

Insert the following block immediately before that comment:

```html
  <!-- ═══════════════ MEET ANDREW ═══════════════ -->
  <section class="andrew-section" id="meet-andrew">
    <div class="section-inner">
      <div class="andrew-inner">
        <div class="andrew-photo-wrap andrew-photo">
          <div class="andrew-photo-overlay"></div>
          <img src="brand_assets/andrew business guy 7 figures..png" alt="Andrew Engel — Licensed Senior Underwriter" class="andrew-photo-img" />
        </div>
        <div class="andrew-content">
          <div class="section-eyebrow">Who You're Working With</div>
          <h2 class="andrew-name">Andrew Engel</h2>
          <p class="andrew-title">Licensed Senior Underwriter &amp; Independent Insurance Broker</p>
          <div class="gold-divider"></div>
          <p class="andrew-bio">
            I didn't grow up with safety nets or stability. I've seen firsthand how quickly everything can fall apart when there's no protection in place — and those experiences are what led me into this industry. Today, I help families create the kind of security I wish my own had. This isn't just a career. This is personal.
          </p>
          <div class="andrew-pills">
            <span class="cred-pill">NPN 21546368</span>
            <span class="cred-pill">Licensed in 15 States</span>
            <span class="cred-pill">40–50+ Carrier Network</span>
            <span class="cred-pill">Independent Broker</span>
          </div>
          <a href="/about-andrew.html" class="btn-dark">Learn More About Andrew →</a>
        </div>
      </div>
    </div>
  </section>

```

- [ ] **Step 4: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000 andrew-section
```

Read the screenshot. Scroll to the Andrew section. Verify:
- Andrew's photo is on the left with a gold border and subtle shadow
- "Who You're Working With" eyebrow in gold
- "Andrew Engel" in large Cormorant Garamond serif
- Title line in small gold uppercase
- Gold divider line visible
- Bio text (3 sentences)
- 4 credential pills in gold
- "Learn More About Andrew →" gold button

- [ ] **Step 5: Commit**

```bash
git add styles.css index.html
git commit -m "feat: add Why Choose Andrew section with photo, bio, and credential pills"
```

---

## Task 7: New Section — Schedule a Call (+ Scroll Animations)

**Files:**
- Modify: `index.html` `<style>` block — add schedule section CSS
- Modify: `index.html` body — insert section between Testimonials and CTA Band
- Modify: `index.html` `<script>` block — extend IntersectionObserver querySelectorAll

### Step 1: Add Schedule section CSS

- [ ] **Step 1: Add schedule section CSS to `index.html` `<style>` block**

Find the closing `</style>` tag of the `<style>` block in `<head>`. Insert immediately before it:

```css
    /* ── Schedule Section ── */
    .schedule-section {
      background: var(--navy);
      padding: 100px 0;
    }

    .schedule-content {
      max-width: 720px;
      margin: 0 auto;
      text-align: center;
    }

    .schedule-section h2 {
      font-size: clamp(34px, 4vw, 52px);
      font-weight: 600;
      color: #fff;
      line-height: 1.12;
      margin-bottom: 20px;
    }

    .schedule-sub {
      font-size: 17px;
      font-weight: 300;
      line-height: 1.75;
      color: rgba(255,255,255,0.65);
      margin-bottom: 40px;
    }

    .btn-calendar {
      display: inline-block;
      padding: 16px 40px;
      font-family: 'Jost', sans-serif;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.06em;
      border: 1.5px solid var(--gold);
      color: var(--gold);
      border-radius: 2px;
      text-decoration: none;
      transition: background 0.25s ease, color 0.25s ease;
      margin-bottom: 20px;
    }

    .btn-calendar:hover {
      background: var(--gold);
      color: var(--navy);
    }

    .btn-calendar:focus-visible {
      outline: 2px solid var(--gold);
      outline-offset: 3px;
    }

    .schedule-reassure {
      font-size: 12px;
      letter-spacing: 0.1em;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase;
    }
```

### Step 2: Add HTML

- [ ] **Step 2: Insert the Schedule section HTML between Testimonials and CTA Band**

In `index.html`, find:

```html
  <!-- ═══════════════ CTA BAND ═══════════════ -->
```

Insert the following block immediately before that comment:

```html
  <!-- ═══════════════ SCHEDULE ═══════════════ -->
  <section class="schedule-section" id="schedule">
    <div class="section-inner">
      <div class="schedule-content">
        <div class="section-eyebrow" style="justify-content:center; display:flex;">Book Your Free Consultation</div>
        <h2>Ready to Get Protected?<br />Let's Talk.</h2>
        <p class="schedule-sub">
          Pick a time that works for you — no pressure, no commitment required. A short 15-minute call is all it takes to understand your options and what coverage looks like for your situation.
        </p>
        <!-- Replace PLACEHOLDER with the actual Google Calendar appointment URL when ready -->
        <a href="https://calendar.google.com/calendar/appointments/PLACEHOLDER"
           class="btn-calendar"
           target="_blank"
           rel="noopener noreferrer">
          View My Calendar &amp; Book a Call →
        </a>
        <p class="schedule-reassure">Free &middot; No obligation &middot; 15 minutes</p>
      </div>
    </div>
  </section>

```

### Step 3: Extend IntersectionObserver

- [ ] **Step 3: Update the IntersectionObserver querySelectorAll in `index.html`**

In `index.html`, find the `<script>` block near the bottom. Find this line:

```js
    document.querySelectorAll('.pain-card, .benefit-item, .testimonial-card, .step').forEach(el => {
```

Replace with:

```js
    document.querySelectorAll('.pain-card, .benefit-item, .testimonial-card, .step, .broker-table-wrap, .broker-trust, .andrew-photo, .andrew-content, .schedule-content').forEach(el => {
```

- [ ] **Step 4: Add animation classes to Andrew section elements**

The IntersectionObserver targets by class. The Andrew section photo wrapper uses class `andrew-photo` and the content div uses `andrew-content`. Confirm these class names are present in the HTML added in Task 6 Step 3:
- `<div class="andrew-photo-wrap andrew-photo">` — has `andrew-photo` ✓
- `<div class="andrew-content">` — has `andrew-content` ✓

No HTML changes needed if Task 6 was implemented correctly.

- [ ] **Step 5: Screenshot full page and verify all three new sections**

```bash
node screenshot.mjs http://localhost:3000 full-page-final
```

Read the screenshot. Scroll through the complete page and verify the order:
1. Hero → Stats → Pain → Solution → **Broker** → Benefits → **Andrew** → How It Works → Testimonials → **Schedule** → CTA Band → Footer

Verify the Schedule section shows a navy background, the headline, subtext, and a gold-outlined "View My Calendar & Book a Call →" button with the reassurance line below.

- [ ] **Step 6: Take a second screenshot of the full page at mobile width**

```bash
node screenshot.mjs http://localhost:3000?width=390 mobile-final
```

If `screenshot.mjs` doesn't support a `?width` param, open DevTools and inspect manually, or screenshot at default and check responsiveness visually.

- [ ] **Step 7: Final commit**

```bash
git add index.html
git commit -m "feat: add Schedule a Call section and extend scroll animations to new sections"
```

---

## Self-Review Checklist

After all tasks are complete, verify against the spec:

- [ ] Logo larger in nav (Task 2)
- [ ] Phone number `(501) 691-5508` in desktop nav and mobile menu (Task 3)
- [ ] Nav dropdown items are selectable without hover gap (Task 1)
- [ ] Solution cards no longer overlap (Task 4)
- [ ] Broker comparison table section exists between Solution and Benefits (Task 5)
- [ ] Andrew section exists between Benefits and How It Works (Task 6)
- [ ] Schedule section exists between Testimonials and CTA Band (Task 7)
- [ ] Google Calendar URL has `PLACEHOLDER` clearly noted in HTML comment (Task 7)
- [ ] `.cred-pill` added to `styles.css` (Task 6)
- [ ] IntersectionObserver includes new elements (Task 7)
- [ ] No `(800) 555-1234` or `+18005551234` remaining in `index.html`
