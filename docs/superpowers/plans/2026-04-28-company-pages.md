# Company Pages — Phase 1.2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **CLAUDE.md requirement:** Invoke the `frontend-design` skill before writing any frontend HTML, every session, no exceptions.

**Goal:** Build 4 company pages (About, About Andrew, How It Works, Contact) and update the nav on all existing pages to add a Company dropdown.

**Architecture:** All pages follow the established Phase 1.1 pattern — `styles.css` for shared styles, page-specific inline styles, shared nav + footer. Company pages use the Smart CTA approach: trust pages end with a CTA banner linking to `contact.html`; `contact.html` is the sole conversion destination with the full form.

**Tech Stack:** Vanilla HTML/CSS/JS, Google Fonts (Cormorant Garamond + Jost), Tailwind CDN not used (custom CSS in styles.css). Local server via `node serve.mjs`. Screenshots via `node screenshot.mjs http://localhost:3000`.

---

## File Map

| File | Action | Notes |
|------|--------|-------|
| `index.html` | Modify | Add Company nav dropdown + update footer Company links |
| `thank-you.html` | Modify | Same |
| `life-insurance.html` | Modify | Same |
| `whole-life-insurance.html` | Modify | Same |
| `iuls.html` | Modify | Same |
| `annuities.html` | Modify | Same |
| `mortgage-protection.html` | Modify | Same |
| `retirement-planning.html` | Modify | Same |
| `advanced-markets.html` | Modify | Same |
| `about.html` | Create | 7 sections |
| `about-andrew.html` | Create | 7 sections, uses `brand_assets/andrew business guy 7 figures..png` |
| `how-it-works.html` | Create | 7 sections |
| `contact.html` | Create | 4 sections, full lead form |

---

## Shared HTML Snippets (reference for all tasks)

### Desktop nav-center — NEW (replaces existing `<div class="nav-center">` block)

```html
    <div class="nav-center">
      <div class="nav-dropdown">
        <button class="nav-dropdown-trigger" aria-expanded="false">
          Coverage
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/life-insurance.html">Life Insurance</a>
          <a href="/whole-life-insurance.html">Whole Life Insurance</a>
          <a href="/iuls.html">IULs</a>
          <a href="/annuities.html">Annuities</a>
          <a href="/mortgage-protection.html">Mortgage Protection</a>
          <a href="/retirement-planning.html">Retirement Planning</a>
          <a href="/advanced-markets.html">Advanced Markets</a>
        </div>
      </div>
      <div class="nav-dropdown" style="margin-left:32px;">
        <button class="nav-dropdown-trigger" aria-expanded="false">
          Company
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/about.html">About</a>
          <a href="/about-andrew.html">About Andrew</a>
          <a href="/how-it-works.html">How It Works</a>
          <a href="/contact.html">Contact</a>
        </div>
      </div>
    </div>
```

### Mobile Company accordion — INSERT after Coverage `.mobile-section`, before `.mobile-cta-area`

```html
    <div class="mobile-section">
      <button class="mobile-accordion-trigger" onclick="toggleMobileCompany(this)">
        Company
        <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="mobile-accordion-content" id="mobile-company">
        <a href="/about.html">About</a>
        <a href="/about-andrew.html">About Andrew</a>
        <a href="/how-it-works.html">How It Works</a>
        <a href="/contact.html">Contact</a>
      </div>
    </div>
```

### JS function — INSERT after `toggleMobileCoverage` function in each page's `<script>` block

```javascript
function toggleMobileCompany(btn) {
  const content = document.getElementById('mobile-company');
  content.classList.toggle('open');
  btn.classList.toggle('open');
}
```

### Footer Company column — REPLACE existing `<div class="footer-col">` block that has `<h4>Company</h4>`

```html
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="/about.html">About</a></li>
          <li><a href="/about-andrew.html">About Andrew</a></li>
          <li><a href="/how-it-works.html">How It Works</a></li>
          <li><a href="/carriers.html">Carriers We Work With</a></li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </div>
```

### Shared head block (use for all 4 new pages — swap title/description)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PAGE_TITLE — Engel Financial Group</title>
  <meta name="description" content="PAGE_DESCRIPTION" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
```

### Shared nav block for new company pages (CTA → /contact.html, not #get-quote)

```html
<nav>
  <div class="nav-inner">
    <a href="/" class="logo">
      <img src="brand_assets/engel-financial-group.jpg" alt="Engel Financial Group" class="logo-img" />
    </a>
    <div class="nav-center">
      <div class="nav-dropdown">
        <button class="nav-dropdown-trigger" aria-expanded="false">
          Coverage
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/life-insurance.html">Life Insurance</a>
          <a href="/whole-life-insurance.html">Whole Life Insurance</a>
          <a href="/iuls.html">IULs</a>
          <a href="/annuities.html">Annuities</a>
          <a href="/mortgage-protection.html">Mortgage Protection</a>
          <a href="/retirement-planning.html">Retirement Planning</a>
          <a href="/advanced-markets.html">Advanced Markets</a>
        </div>
      </div>
      <div class="nav-dropdown" style="margin-left:32px;">
        <button class="nav-dropdown-trigger" aria-expanded="false">
          Company
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/about.html">About</a>
          <a href="/about-andrew.html">About Andrew</a>
          <a href="/how-it-works.html">How It Works</a>
          <a href="/contact.html">Contact</a>
        </div>
      </div>
    </div>
    <div class="nav-right">
      <div class="nav-phone">
        <a href="tel:+18005551234" class="phone-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
          (800) 555-1234
        </a>
        <a href="/contact.html" class="btn-nav">Get a Free Quote</a>
      </div>
      <button class="burger-btn" onclick="toggleMobileMenu()" aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu">
    <div class="mobile-section">
      <button class="mobile-accordion-trigger" onclick="toggleMobileCoverage(this)">
        Coverage
        <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="mobile-accordion-content" id="mobile-coverage">
        <a href="/life-insurance.html">Life Insurance</a>
        <a href="/whole-life-insurance.html">Whole Life Insurance</a>
        <a href="/iuls.html">IULs</a>
        <a href="/annuities.html">Annuities</a>
        <a href="/mortgage-protection.html">Mortgage Protection</a>
        <a href="/retirement-planning.html">Retirement Planning</a>
        <a href="/advanced-markets.html">Advanced Markets</a>
      </div>
    </div>
    <div class="mobile-section">
      <button class="mobile-accordion-trigger" onclick="toggleMobileCompany(this)">
        Company
        <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="mobile-accordion-content" id="mobile-company">
        <a href="/about.html">About</a>
        <a href="/about-andrew.html">About Andrew</a>
        <a href="/how-it-works.html">How It Works</a>
        <a href="/contact.html">Contact</a>
      </div>
    </div>
    <div class="mobile-cta-area">
      <a href="tel:+18005551234" class="mobile-phone-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
        (800) 555-1234
      </a>
      <a href="/contact.html" class="mobile-btn-nav">Get a Free Quote</a>
    </div>
  </div>
</nav>
```

### Shared footer block (identical across all pages)

```html
<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="logo">
          <img src="brand_assets/engel-financial-group.jpg" alt="Engel Financial Group" class="logo-img logo-img--footer" />
        </div>
        <p>Protecting families across America with trusted, affordable life insurance solutions.</p>
      </div>
      <div class="footer-col">
        <h4>Coverage</h4>
        <ul>
          <li><a href="/life-insurance.html">Life Insurance</a></li>
          <li><a href="/whole-life-insurance.html">Whole Life Insurance</a></li>
          <li><a href="/iuls.html">IULs</a></li>
          <li><a href="/annuities.html">Annuities</a></li>
          <li><a href="/mortgage-protection.html">Mortgage Protection</a></li>
          <li><a href="/retirement-planning.html">Retirement Planning</a></li>
          <li><a href="/advanced-markets.html">Advanced Markets</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="/about.html">About</a></li>
          <li><a href="/about-andrew.html">About Andrew</a></li>
          <li><a href="/how-it-works.html">How It Works</a></li>
          <li><a href="/carriers.html">Carriers We Work With</a></li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Licensing</a></li>
          <li><a href="#">TCPA Compliance</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div>© 2026 Engel Financial Group. All rights reserved.</div>
      <div class="footer-license">
        <div class="license-dot"></div>
        <span>Licensed &amp; Compliant</span>
      </div>
    </div>
  </div>
</footer>
```

### Shared script block (use for all 4 new pages — no FAQ or form on non-contact pages, adjust accordingly)

```javascript
<script>
document.body.classList.add('js-animations');
function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}
function toggleMobileCoverage(btn) {
  const content = document.getElementById('mobile-coverage');
  content.classList.toggle('open');
  btn.classList.toggle('open');
}
function toggleMobileCompany(btn) {
  const content = document.getElementById('mobile-company');
  content.classList.toggle('open');
  btn.classList.toggle('open');
}
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
</script>
```

---

## Task 1: Update Nav + Footer on All 9 Existing Pages

**Files:**
- Modify: `index.html`, `thank-you.html`, `life-insurance.html`, `whole-life-insurance.html`, `iuls.html`, `annuities.html`, `mortgage-protection.html`, `retirement-planning.html`, `advanced-markets.html`

- [ ] **Step 1: Apply nav-center update to all 9 files**

For each of the 9 files, use the Edit tool to replace the `<div class="nav-center">` block (Coverage dropdown only) with the new nav-center block (Coverage + Company dropdowns) from the **Shared HTML Snippets** section above. The old_string to match in every file:

```
    <div class="nav-center">
      <div class="nav-dropdown">
        <button class="nav-dropdown-trigger" aria-expanded="false">
          Coverage
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-dropdown-menu">
          <a href="/life-insurance.html">Life Insurance</a>
          <a href="/whole-life-insurance.html">Whole Life Insurance</a>
          <a href="/iuls.html">IULs</a>
          <a href="/annuities.html">Annuities</a>
          <a href="/mortgage-protection.html">Mortgage Protection</a>
          <a href="/retirement-planning.html">Retirement Planning</a>
          <a href="/advanced-markets.html">Advanced Markets</a>
        </div>
      </div>
    </div>
```

- [ ] **Step 2: Add Company mobile accordion to all 9 files**

For each file, use the Edit tool to replace the Coverage mobile-section + opening of mobile-cta-area with the version that includes the new Company accordion. The old_string to match in every file:

```
    <div class="mobile-section">
      <button class="mobile-accordion-trigger" onclick="toggleMobileCoverage(this)">
        Coverage
        <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="mobile-accordion-content" id="mobile-coverage">
        <a href="/life-insurance.html">Life Insurance</a>
        <a href="/whole-life-insurance.html">Whole Life Insurance</a>
        <a href="/iuls.html">IULs</a>
        <a href="/annuities.html">Annuities</a>
        <a href="/mortgage-protection.html">Mortgage Protection</a>
        <a href="/retirement-planning.html">Retirement Planning</a>
        <a href="/advanced-markets.html">Advanced Markets</a>
      </div>
    </div>
    <div class="mobile-cta-area">
```

Replace with Coverage section + new Company section + opening of mobile-cta-area:

```
    <div class="mobile-section">
      <button class="mobile-accordion-trigger" onclick="toggleMobileCoverage(this)">
        Coverage
        <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="mobile-accordion-content" id="mobile-coverage">
        <a href="/life-insurance.html">Life Insurance</a>
        <a href="/whole-life-insurance.html">Whole Life Insurance</a>
        <a href="/iuls.html">IULs</a>
        <a href="/annuities.html">Annuities</a>
        <a href="/mortgage-protection.html">Mortgage Protection</a>
        <a href="/retirement-planning.html">Retirement Planning</a>
        <a href="/advanced-markets.html">Advanced Markets</a>
      </div>
    </div>
    <div class="mobile-section">
      <button class="mobile-accordion-trigger" onclick="toggleMobileCompany(this)">
        Company
        <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="mobile-accordion-content" id="mobile-company">
        <a href="/about.html">About</a>
        <a href="/about-andrew.html">About Andrew</a>
        <a href="/how-it-works.html">How It Works</a>
        <a href="/contact.html">Contact</a>
      </div>
    </div>
    <div class="mobile-cta-area">
```

- [ ] **Step 3: Add `toggleMobileCompany()` to JS block in all 9 files**

For each file, use Edit to replace the `toggleMobileCoverage` function with itself plus the new function:

```javascript
function toggleMobileCoverage(btn) {
  const content = document.getElementById('mobile-coverage');
  content.classList.toggle('open');
  btn.classList.toggle('open');
}
```

Replace with:

```javascript
function toggleMobileCoverage(btn) {
  const content = document.getElementById('mobile-coverage');
  content.classList.toggle('open');
  btn.classList.toggle('open');
}
function toggleMobileCompany(btn) {
  const content = document.getElementById('mobile-company');
  content.classList.toggle('open');
  btn.classList.toggle('open');
}
```

- [ ] **Step 4: Update footer Company column links in all 9 files**

For each file, use Edit to replace the footer Company column. Old_string to match in every file:

```
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About</a></li>
          <li><a href="#">How It Works</a></li>
          <li><a href="#">Carriers We Work With</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
```

New_string:

```
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="/about.html">About</a></li>
          <li><a href="/about-andrew.html">About Andrew</a></li>
          <li><a href="/how-it-works.html">How It Works</a></li>
          <li><a href="/carriers.html">Carriers We Work With</a></li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </div>
```

- [ ] **Step 5: Start local server (if not running) and screenshot to verify**

```bash
node serve.mjs &
node screenshot.mjs http://localhost:3000 nav-update
```

Read the screenshot from `temporary screenshots/`. Verify: Coverage and Company dropdowns both visible in nav. If server is already running, skip the first command.

- [ ] **Step 6: Commit**

```bash
git add index.html thank-you.html life-insurance.html whole-life-insurance.html iuls.html annuities.html mortgage-protection.html retirement-planning.html advanced-markets.html
git commit -m "feat: add Company nav dropdown and update footer links on all existing pages"
```

---

## Task 2: Build about.html

**Files:**
- Create: `about.html`

- [ ] **Step 1: Invoke frontend-design skill**

Per CLAUDE.md, invoke `frontend-design` skill before writing any HTML.

- [ ] **Step 2: Create about.html**

Create `about.html` with the following complete content. Use the **Shared head block** (title: "About Us — Engel Financial Group", description: "Engel Financial Group is an independent life insurance brokerage built on integrity, independence, and advocacy. We work for you — not an insurance company."), the **Shared nav block** (company pages version), and the **Shared footer block** from the snippets above.

Page-specific styles (inline in `<head>` after the `styles.css` link):

```html
<style>
  /* Stats section */
  .stats-section { background: var(--navy-mid); padding: 80px 32px; }
  .stats-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 40px; text-align: center; }
  .stat-item { }
  .stat-num { font-family: 'Cormorant Garamond', serif; font-size: clamp(48px, 6vw, 72px); font-weight: 700; color: var(--gold); line-height: 1; }
  .stat-label { font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.6); margin-top: 8px; }
  .stat-desc { font-size: 13px; color: rgba(255,255,255,.45); margin-top: 4px; line-height: 1.5; }
  @media(max-width:700px) { .stats-inner { grid-template-columns: repeat(2,1fr); } }

  /* Founder section */
  .founder-section { background: var(--off-white); padding: 100px 32px; }
  .founder-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .founder-image { position: relative; border-radius: 4px; overflow: hidden; }
  .founder-image img { width: 100%; height: 560px; object-fit: cover; display: block; }
  .founder-image::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(184,115,51,.4) 0%, transparent 60%); }
  .founder-content { }
  .founder-content h2 { font-size: clamp(32px, 4vw, 48px); margin: 12px 0 20px; }
  .founder-content p { color: var(--text-mid); line-height: 1.75; margin-bottom: 16px; }
  @media(max-width:800px) { .founder-inner { grid-template-columns: 1fr; gap: 40px; } .founder-image img { height: 360px; } }
</style>
```

Sections in order:

**Hero:**
```html
<section class="page-hero">
  <div class="page-hero-inner">
    <span class="section-label">About Us</span>
    <h1>Protecting Families<br /><em>Across America.</em></h1>
    <p>We're an independent life insurance brokerage built on one belief — every family deserves real protection.</p>
    <div class="hero-ctas">
      <a href="/contact.html" class="btn-dark">Get a Free Quote</a>
      <a href="/about-andrew.html" class="btn-ghost">Meet Our Founder</a>
    </div>
  </div>
</section>
```

**Mission & Values (reuses `.who-section` / `.who-cards` / `.who-card`):**
```html
<section class="who-section">
  <div class="who-inner">
    <div class="section-header fade-up">
      <span class="section-label">Our Values</span>
      <h2>Built on Integrity.<br /><em>Driven by Purpose.</em></h2>
    </div>
    <div class="who-cards">
      <div class="who-card fade-up">
        <div class="who-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h3>Integrity</h3>
        <p>We never push a product that isn't right for you. Our only agenda is your protection.</p>
      </div>
      <div class="who-card fade-up">
        <div class="who-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <h3>Independence</h3>
        <p>As independent brokers, we shop every major carrier to find your best fit — not ours.</p>
      </div>
      <div class="who-card fade-up">
        <div class="who-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <h3>Advocacy</h3>
        <p>We work for you, not an insurance company. Your family's security is our only goal.</p>
      </div>
    </div>
  </div>
</section>
```

**Why Independent Broker (reuses `.what-section` / `.what-inner` / `.what-content` / `.what-image`):**
```html
<section class="what-section">
  <div class="what-inner">
    <div class="what-content fade-up">
      <span class="section-label">Why It Matters</span>
      <h2>We Work for You —<br />Not an Insurance Company.</h2>
      <p>Most insurance agents are captive — they work for a single carrier and can only offer that company's products. That means their recommendations are limited by who pays their salary, not what's best for your family.</p>
      <p>As independent brokers, we have access to 20+ top carriers. We compare policies across all of them to find the coverage that genuinely fits your situation and budget — with no bias, no quotas, and no conflicts of interest.</p>
      <div class="fact-chips">
        <span class="fact-chip">Access to 20+ Carriers</span>
        <span class="fact-chip">No Carrier Bias</span>
        <span class="fact-chip">Advocate, Not Salesperson</span>
      </div>
    </div>
    <div class="what-image fade-up">
      <img src="https://placehold.co/600x480/111d2b/bd9468?text=Independent+Broker" alt="Independent insurance broker working for clients" />
    </div>
  </div>
</section>
```

**By the Numbers (uses custom `.stats-section`):**
```html
<section class="stats-section">
  <div class="stats-inner">
    <div class="stat-item fade-up">
      <div class="stat-num">20+</div>
      <div class="stat-label">Carriers</div>
      <div class="stat-desc">Access to the nation's top life insurance providers</div>
    </div>
    <div class="stat-item fade-up">
      <div class="stat-num">50</div>
      <div class="stat-label">States</div>
      <div class="stat-desc">Licensed to serve families across America</div>
    </div>
    <div class="stat-item fade-up">
      <div class="stat-num">1,000+</div>
      <div class="stat-label">Families</div>
      <div class="stat-desc">Protected and counting</div>
    </div>
    <div class="stat-item fade-up">
      <div class="stat-num">100%</div>
      <div class="stat-label">Independent</div>
      <div class="stat-desc">No quotas, no pressure, no bias</div>
    </div>
  </div>
</section>
```

**Meet the Founder (uses custom `.founder-section`):**
```html
<section class="founder-section">
  <div class="founder-inner">
    <div class="founder-image fade-up">
      <img src="https://placehold.co/480x560/1a2d3f/bd9468?text=Andrew+Engel" alt="Andrew Engel, founder of Engel Financial Group" />
    </div>
    <div class="founder-content fade-up">
      <span class="section-label">Our Founder</span>
      <h2>Meet Andrew Engel</h2>
      <p>Andrew built Engel Financial Group from a deeply personal mission — to make sure no family goes through what his did. Growing up without a financial safety net, he saw firsthand the devastation that comes when loved ones aren't protected.</p>
      <p>As an independent broker and senior underwriter, he brings the same care and urgency to every client he serves. This isn't just a career for Andrew — it's a responsibility.</p>
      <a href="/about-andrew.html" class="btn-primary" style="display:inline-block;margin-top:8px;">Read Andrew's Story →</a>
    </div>
  </div>
</section>
```

**CTA Banner (reuses `.bottom-cta` / `.bottom-cta-inner`):**
```html
<section class="bottom-cta">
  <div class="bottom-cta-inner">
    <h2>Ready to Protect<br /><em>What Matters Most?</em></h2>
    <p>One conversation is all it takes. No pressure, no obligation.</p>
    <a href="/contact.html" class="btn-dark">Get in Touch</a>
  </div>
</section>
```

Use the **Shared script block** (no FAQ or form on this page — omit those listeners).

- [ ] **Step 3: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/about.html about
```

Read the screenshot. Verify: nav shows Coverage + Company dropdowns, hero renders, all 6 sections present, CTA banner links to /contact.html.

- [ ] **Step 4: Fix any visual issues found, re-screenshot**

```bash
node screenshot.mjs http://localhost:3000/about.html about-v2
```

- [ ] **Step 5: Commit**

```bash
git add about.html
git commit -m "feat: add about.html — Engel Financial Group company page"
```

---

## Task 3: Build about-andrew.html

**Files:**
- Create: `about-andrew.html`
- Reference asset: `brand_assets/andrew business guy 7 figures..png`

- [ ] **Step 1: Invoke frontend-design skill**

Per CLAUDE.md, invoke `frontend-design` skill before writing any HTML.

- [ ] **Step 2: Create about-andrew.html**

Use the **Shared head block** (title: "About Andrew Engel — Founder & Independent Broker", description: "Andrew Engel built Engel Financial Group from a personal mission — ensuring no family suffers the financial devastation he witnessed growing up. Read his story."), **Shared nav block**, and **Shared footer block**.

Page-specific styles (inline in `<head>`):

```html
<style>
  /* Andrew hero — photo-forward layout */
  .andrew-hero { background: var(--navy); padding: 140px 32px 80px; position: relative; overflow: hidden; }
  .andrew-hero::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse at 30% 50%, rgba(184,115,51,.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(36,56,81,.8) 0%, transparent 50%); }
  .andrew-hero-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; z-index: 1; }
  .andrew-hero-text span.section-label { display: block; margin-bottom: 16px; }
  .andrew-hero-text h1 { font-size: clamp(40px, 6vw, 72px); color: #fff; line-height: 1.08; margin-bottom: 20px; }
  .andrew-hero-text p { font-size: 18px; color: rgba(255,255,255,.65); line-height: 1.7; }
  .andrew-hero-photo { position: relative; border-radius: 4px; overflow: hidden; }
  .andrew-hero-photo img { width: 100%; height: 560px; object-fit: cover; object-position: top center; display: block; }
  .andrew-hero-photo::after { content:''; position:absolute; inset:0; background: linear-gradient(to top, rgba(17,29,43,.5) 0%, transparent 50%); mix-blend-mode: multiply; }
  @media(max-width:800px) { .andrew-hero-inner { grid-template-columns: 1fr; gap: 40px; } .andrew-hero { padding: 120px 24px 60px; } .andrew-hero-photo img { height: 420px; } }

  /* Editorial story section */
  .story-section { background: var(--off-white); padding: 100px 32px; }
  .story-inner { max-width: 760px; margin: 0 auto; }
  .story-inner h2 { font-size: clamp(32px, 4vw, 48px); margin: 12px 0 32px; }
  .story-body p { font-size: 18px; color: var(--text-mid); line-height: 1.8; margin-bottom: 24px; }
  .story-body p.pull { font-family: 'Cormorant Garamond', serif; font-size: clamp(22px, 3vw, 30px); color: var(--text-dark); line-height: 1.4; font-style: italic; border-left: 3px solid var(--gold); padding-left: 24px; margin: 40px 0; }

  /* Pull quote band */
  .quote-band { background: var(--navy-mid); padding: 80px 32px; text-align: center; }
  .quote-band blockquote { max-width: 800px; margin: 0 auto; font-family: 'Cormorant Garamond', serif; font-size: clamp(24px, 3.5vw, 40px); font-style: italic; color: #fff; line-height: 1.4; position: relative; }
  .quote-band blockquote::before, .quote-band blockquote::after { content:''; display:block; height:1px; background:var(--gold); opacity:.5; margin:24px auto; width:80px; }

  /* Mission section */
  .mission-section { background: var(--warm-white); padding: 100px 32px; }
  .mission-inner { max-width: 760px; margin: 0 auto; }
  .mission-inner h2 { font-size: clamp(32px, 4vw, 48px); margin: 12px 0 32px; }
  .mission-body p { font-size: 18px; color: var(--text-mid); line-height: 1.8; margin-bottom: 24px; }
  .mission-close { font-family: 'Cormorant Garamond', serif; font-size: clamp(20px, 2.5vw, 28px); font-style: italic; color: var(--text-dark); margin-top: 40px; }
</style>
```

**Hero section:**
```html
<section class="andrew-hero">
  <div class="andrew-hero-inner">
    <div class="andrew-hero-text">
      <span class="section-label">Our Founder</span>
      <h1>This Isn't<br />Just Business.</h1>
      <p>It's personal. And that's exactly why Andrew does it.</p>
    </div>
    <div class="andrew-hero-photo fade-up">
      <img src="brand_assets/andrew business guy 7 figures..png" alt="Andrew Engel, founder of Engel Financial Group" />
    </div>
  </div>
</section>
```

**His Story (editorial section):**
```html
<section class="story-section">
  <div class="story-inner">
    <span class="section-label">Andrew's Story</span>
    <h2>Where It All Began.</h2>
    <div class="story-body fade-up">
      <p>I didn't grow up around money, stability, or safety nets. My early life was shaped by a broken home, financial struggle, and uncertainty. We were on welfare at times, and something like life insurance wasn't even a conversation — it simply wasn't an option. When someone in my family passed, it didn't just bring emotional pain… it often created financial devastation. I've seen firsthand how quickly everything can fall apart when there's no protection in place.</p>
      <p class="pull">"Those experiences are what shaped me."</p>
      <p>They taught me that real security isn't about how much money you make — it's about what you protect, and who you protect it for.</p>
      <p>As I got older, I realized something powerful: the people who succeed in life, especially in business, are the ones who genuinely care about others. Sales, at its core, isn't about convincing people — it's about connecting with them, understanding their situation, and helping them make the best decision for their family. That realization is what led me into the insurance industry.</p>
      <p>Today, as an independent insurance broker and senior underwriter, I don't look at what I do as just a career — I see it as a responsibility.</p>
    </div>
  </div>
</section>
```

**Pull Quote Band:**
```html
<section class="quote-band">
  <blockquote class="fade-up">
    "Insurance isn't a selfish act. It's one of the most selfless decisions a person can make."
  </blockquote>
</section>
```

**His Mission:**
```html
<section class="mission-section">
  <div class="mission-inner">
    <span class="section-label">His Mission</span>
    <h2>Why He Does This.</h2>
    <div class="mission-body fade-up">
      <p>Insurance isn't a selfish act. It's one of the most selfless decisions a person can make. It's a contract you put in place, not for yourself, but for the people you love most. It's making sure that if something unexpected happens, your family doesn't have to suffer financially on top of everything else.</p>
      <p>I've built my business around helping families create protection, stability, and peace of mind — especially those who, like me, didn't grow up with those things. My mission is simple: to help as many people as possible avoid the same hardships I witnessed growing up, and to make sure their loved ones are taken care of no matter what.</p>
      <p class="mission-close">This isn't just business for me. This is personal.</p>
    </div>
  </div>
</section>
```

**His Approach — 3 cards (reuses `.who-section` / `.who-cards` / `.who-card`):**
```html
<section class="who-section">
  <div class="who-inner">
    <div class="section-header fade-up">
      <span class="section-label">How Andrew Works</span>
      <h2>What You Can Expect.</h2>
    </div>
    <div class="who-cards">
      <div class="who-card fade-up">
        <div class="who-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <h3>Honesty First</h3>
        <p>If a policy isn't right for you, Andrew will tell you. No pressure, no upsells — just honest guidance.</p>
      </div>
      <div class="who-card fade-up">
        <div class="who-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        </div>
        <h3>Your Family, Your Plan</h3>
        <p>Every situation is different. Andrew listens before he recommends — your needs come first, always.</p>
      </div>
      <div class="who-card fade-up">
        <div class="who-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </div>
        <h3>Long-Term Relationship</h3>
        <p>Andrew doesn't disappear after the sale. He's your advocate for the life of your policy.</p>
      </div>
    </div>
  </div>
</section>
```

**CTA Banner:**
```html
<section class="bottom-cta">
  <div class="bottom-cta-inner">
    <h2>Let's Protect Your<br /><em>Family Together.</em></h2>
    <p>Start with a free, no-obligation conversation.</p>
    <a href="/contact.html" class="btn-dark">Get in Touch</a>
  </div>
</section>
```

Use the **Shared script block**.

- [ ] **Step 3: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/about-andrew.html andrew
```

Read the screenshot. Verify: Andrew's real photo renders in hero, story text is present, pull quote band is dark navy with gold rules, 3 approach cards render correctly.

- [ ] **Step 4: Fix any visual issues, re-screenshot**

```bash
node screenshot.mjs http://localhost:3000/about-andrew.html andrew-v2
```

- [ ] **Step 5: Commit**

```bash
git add about-andrew.html
git commit -m "feat: add about-andrew.html — Andrew Engel founder story page"
```

---

## Task 4: Build how-it-works.html

**Files:**
- Create: `how-it-works.html`

- [ ] **Step 1: Invoke frontend-design skill**

Per CLAUDE.md, invoke `frontend-design` skill before writing any HTML.

- [ ] **Step 2: Create how-it-works.html**

Use the **Shared head block** (title: "How It Works — Independent Life Insurance Broker Process", description: "See how Andrew Engel shops 20+ carriers to find you the best life insurance policy. Simple, transparent, and always on your side. Free consultation."), **Shared nav block**, and **Shared footer block**.

Page-specific styles (inline in `<head>`):

```html
<style>
  /* Process steps */
  .process-section { background: var(--warm-white); padding: 100px 32px; }
  .process-inner { max-width: 1100px; margin: 0 auto; }
  .process-steps { margin-top: 60px; display: flex; flex-direction: column; gap: 0; }
  .process-step { display: grid; grid-template-columns: 80px 1fr; gap: 32px; align-items: flex-start; padding: 40px 0; border-bottom: 1px solid rgba(17,29,43,.1); }
  .process-step:last-child { border-bottom: none; }
  .step-circle { width: 64px; height: 64px; border-radius: 50%; background: var(--gold); display: flex; align-items: center; justify-content: center; font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .step-body h3 { font-size: 22px; margin-bottom: 10px; padding-top: 14px; }
  .step-body p { color: var(--text-mid); line-height: 1.75; }
  @media(max-width:600px) { .process-step { grid-template-columns: 56px 1fr; gap: 20px; } .step-circle { width: 52px; height: 52px; font-size: 22px; } }

  /* Comparison table */
  .compare-section { background: var(--navy); padding: 100px 32px; }
  .compare-inner { max-width: 900px; margin: 0 auto; }
  .compare-inner .section-header h2 { color: #fff; }
  .compare-table { width: 100%; border-collapse: collapse; margin-top: 48px; }
  .compare-table th { font-family: 'Jost', sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: .1em; padding: 12px 20px; }
  .compare-table th:first-child { color: rgba(255,255,255,.4); text-align: left; }
  .compare-table th:nth-child(2) { background: rgba(184,115,51,.15); color: var(--gold); border-radius: 6px 6px 0 0; }
  .compare-table th:nth-child(3) { color: rgba(255,255,255,.4); }
  .compare-table td { padding: 14px 20px; font-size: 14px; border-top: 1px solid rgba(255,255,255,.08); }
  .compare-table td:first-child { color: rgba(255,255,255,.55); font-size: 13px; }
  .compare-table td:nth-child(2) { background: rgba(184,115,51,.08); color: #fff; font-weight: 500; }
  .compare-table td:nth-child(3) { color: rgba(255,255,255,.4); }
  .compare-table .check { color: var(--gold); font-size: 16px; }
  .compare-table .cross { color: rgba(255,255,255,.3); }
  @media(max-width:600px) { .compare-table td, .compare-table th { padding: 10px 12px; font-size: 13px; } }
</style>
```

**Hero:**
```html
<section class="page-hero">
  <div class="page-hero-inner">
    <span class="section-label">How It Works</span>
    <h1>Simple. Transparent.<br /><em>On Your Side.</em></h1>
    <p>As an independent broker, Andrew shops every major carrier to find you the best policy — not the most profitable one.</p>
    <div class="hero-ctas">
      <a href="/contact.html" class="btn-dark">Get a Free Quote</a>
      <a href="tel:+18005551234" class="btn-ghost">Call Us Now</a>
    </div>
  </div>
</section>
```

**The Independent Advantage (reuses `.what-section`):**
```html
<section class="what-section">
  <div class="what-inner">
    <div class="what-content fade-up">
      <span class="section-label">Why Independent Matters</span>
      <h2>We're Not Tied to Anyone —<br />Except You.</h2>
      <p>Most insurance agents are captive agents — they're employees of a single insurance company and can only sell that company's products. Their job is to sell you their employer's policies, not to find the best deal for your family.</p>
      <p>Independent brokers like Andrew operate differently. We're not employed by any carrier, which means we have zero incentive to favor one over another. Our only job is to find you the policy that fits your life best.</p>
      <p>With access to 20+ top carriers, Andrew compares rates, coverage levels, and policy structures side-by-side — and presents you with the options that make sense, explained in plain language.</p>
      <div class="fact-chips">
        <span class="fact-chip">20+ Carriers</span>
        <span class="fact-chip">Unbiased Recommendations</span>
        <span class="fact-chip">100% On Your Side</span>
      </div>
    </div>
    <div class="what-image fade-up">
      <img src="https://placehold.co/600x480/111d2b/bd9468?text=Independent+Broker" alt="Independent broker comparing insurance carriers" />
    </div>
  </div>
</section>
```

**The 5-Step Process (uses custom `.process-section`):**
```html
<section class="process-section">
  <div class="process-inner">
    <div class="section-header fade-up">
      <span class="section-label">The Process</span>
      <h2>From First Call to<br /><em>Full Coverage.</em></h2>
    </div>
    <div class="process-steps">
      <div class="process-step fade-up">
        <div class="step-circle">1</div>
        <div class="step-body">
          <h3>We Talk</h3>
          <p>A free, no-pressure conversation about your situation, your family, and your goals. No forms, no commitment — just an honest conversation about what protection looks like for you.</p>
        </div>
      </div>
      <div class="process-step fade-up">
        <div class="step-circle">2</div>
        <div class="step-body">
          <h3>We Assess</h3>
          <p>Andrew reviews your needs, health profile, and budget to understand what kind of coverage makes sense for your specific situation. No one-size-fits-all recommendations here.</p>
        </div>
      </div>
      <div class="process-step fade-up">
        <div class="step-circle">3</div>
        <div class="step-body">
          <h3>We Shop</h3>
          <p>Using access to 20+ top-rated carriers, Andrew compares policies side-by-side — rates, coverage, riders, and approval requirements — to find your best option.</p>
        </div>
      </div>
      <div class="process-step fade-up">
        <div class="step-circle">4</div>
        <div class="step-body">
          <h3>We Present</h3>
          <p>Andrew walks you through the top options in plain language. No jargon, no confusion — just clear information so you can make the best decision for your family.</p>
        </div>
      </div>
      <div class="process-step fade-up">
        <div class="step-circle">5</div>
        <div class="step-body">
          <h3>You're Covered</h3>
          <p>Once you choose, Andrew handles the application and follows it through to approval. He stays with you every step of the way until your coverage is active.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Independent vs. Captive Comparison Table (uses custom `.compare-section`):**
```html
<section class="compare-section">
  <div class="compare-inner">
    <div class="section-header fade-up">
      <span class="section-label">Know the Difference</span>
      <h2>Independent Broker<br /><em style="color:var(--gold-light)">vs. Captive Agent.</em></h2>
    </div>
    <table class="compare-table fade-up">
      <thead>
        <tr>
          <th></th>
          <th>Independent Broker (Andrew)</th>
          <th>Captive Agent</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Carrier access</td>
          <td><span class="check">✓</span> 20+ carriers</td>
          <td><span class="cross">✗</span> 1 carrier only</td>
        </tr>
        <tr>
          <td>Works for</td>
          <td><span class="check">✓</span> You</td>
          <td><span class="cross">✗</span> Their employer</td>
        </tr>
        <tr>
          <td>Recommendation bias</td>
          <td><span class="check">✓</span> None</td>
          <td><span class="cross">✗</span> Company-first</td>
        </tr>
        <tr>
          <td>Price comparison</td>
          <td><span class="check">✓</span> Yes — across all carriers</td>
          <td><span class="cross">✗</span> No</td>
        </tr>
        <tr>
          <td>Your advocate</td>
          <td><span class="check">✓</span> Always</td>
          <td><span class="cross">✗</span> Rarely</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
```

**FAQ (reuses `.faq-section` / `.faq-list` / `.faq-item`):**
```html
<section class="faq-section">
  <div class="faq-inner">
    <div class="section-header fade-up">
      <span class="section-label">Common Questions</span>
      <h2>Answers You <em>Actually Need</em></h2>
    </div>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-trigger">
          <span>Do I have to commit to anything on the first call?</span>
          <svg class="faq-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer"><div class="faq-answer-inner">No. The first conversation is completely free and obligation-free. Andrew will ask questions about your situation and explain your options. There's no pressure and no follow-up pitch if you decide it's not the right time.</div></div>
      </div>
      <div class="faq-item">
        <button class="faq-trigger">
          <span>How long does it take to get covered?</span>
          <svg class="faq-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer"><div class="faq-answer-inner">Most clients are approved within a few days. Some policies offer same-day or next-day coverage with no medical exam required. Andrew will let you know the typical timeline for the specific carrier and product that fits your situation.</div></div>
      </div>
      <div class="faq-item">
        <button class="faq-trigger">
          <span>What if I have a pre-existing condition?</span>
          <svg class="faq-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer"><div class="faq-answer-inner">Many carriers still offer excellent coverage options for people with pre-existing conditions. Because Andrew works with 20+ carriers, he can find carriers with more favorable underwriting for your specific health history — something a captive agent simply cannot do.</div></div>
      </div>
      <div class="faq-item">
        <button class="faq-trigger">
          <span>Does it cost more to use an independent broker?</span>
          <svg class="faq-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-answer"><div class="faq-answer-inner">No. Andrew is compensated by the insurance carrier when a policy is issued — not by you. This means you get access to unbiased advice across 20+ carriers at no extra cost compared to going directly to an insurer.</div></div>
      </div>
    </div>
  </div>
</section>
```

**CTA Banner:**
```html
<section class="bottom-cta">
  <div class="bottom-cta-inner">
    <h2>Ready to See What<br /><em>You Qualify For?</em></h2>
    <p>Free consultation. No obligation. No pressure.</p>
    <a href="/contact.html" class="btn-dark">Get in Touch</a>
  </div>
</section>
```

Use the **Shared script block** plus the FAQ accordion listener:

```javascript
document.querySelectorAll('.faq-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});
```

- [ ] **Step 3: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/how-it-works.html how-it-works
```

Read screenshot. Verify: 5 process steps render with gold numbered circles, comparison table has gold-tinted "Andrew" column, FAQ accordion is present.

- [ ] **Step 4: Fix any visual issues, re-screenshot**

```bash
node screenshot.mjs http://localhost:3000/how-it-works.html how-it-works-v2
```

- [ ] **Step 5: Commit**

```bash
git add how-it-works.html
git commit -m "feat: add how-it-works.html — process and independent broker advantage page"
```

---

## Task 5: Build contact.html

**Files:**
- Create: `contact.html`

- [ ] **Step 1: Invoke frontend-design skill**

Per CLAUDE.md, invoke `frontend-design` skill before writing any HTML.

- [ ] **Step 2: Create contact.html**

Use the **Shared head block** with:
- title: `Contact Us — Engel Financial Group | Free Life Insurance Consultation`
- description: `Talk to Andrew Engel, independent life insurance broker. Free consultation, no obligation. We help families across America find the right coverage.`

Add LocalBusiness structured data after the `<title>` tag in `<head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Engel Financial Group",
  "description": "Independent life insurance broker serving families across America.",
  "telephone": "+18005551234",
  "email": "hello@engelfinancialgroup.com",
  "url": "https://engelfinancialgroup.com",
  "areaServed": "United States",
  "priceRange": "Free consultation"
}
</script>
```

Page-specific styles (inline in `<head>`):

```html
<style>
  /* Short hero */
  .contact-hero { background: var(--navy); padding: 140px 32px 80px; position: relative; overflow: hidden; text-align: center; }
  .contact-hero::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse at 50% 60%, rgba(184,115,51,.1) 0%, transparent 55%); }
  .contact-hero-inner { max-width: 700px; margin: 0 auto; position: relative; z-index: 1; }
  .contact-hero-inner h1 { font-size: clamp(36px, 5vw, 60px); color: #fff; margin: 12px 0 20px; }
  .contact-hero-inner p { font-size: 18px; color: rgba(255,255,255,.65); line-height: 1.7; }

  /* Contact split */
  .contact-split { background: var(--off-white); padding: 100px 32px; }
  .contact-split-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: flex-start; }
  .contact-info { }
  .contact-info h2 { font-size: clamp(28px, 3.5vw, 42px); margin: 12px 0 32px; }
  .contact-phone { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .contact-phone a { font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 4vw, 40px); font-weight: 700; color: var(--gold); text-decoration: none; line-height: 1; }
  .contact-phone a:hover { color: var(--gold-light); }
  .contact-email { margin-bottom: 40px; }
  .contact-email a { font-size: 16px; color: var(--text-mid); text-decoration: none; border-bottom: 1px solid var(--gold); padding-bottom: 2px; }
  .contact-email a:hover { color: var(--gold); }
  .contact-badge { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #fff; border-radius: 8px; margin-bottom: 12px; border: 1px solid rgba(17,29,43,.08); }
  .contact-badge svg { color: var(--gold); flex-shrink: 0; }
  .contact-badge span { font-size: 14px; color: var(--text-mid); font-weight: 500; }
  .contact-reassurance { margin-top: 24px; font-size: 14px; color: var(--text-soft); font-style: italic; }

  /* Contact form card */
  .contact-form-wrap { }
  .contact-form-wrap .form-card { box-shadow: 0 8px 40px rgba(17,29,43,.12), 0 2px 8px rgba(17,29,43,.06); }
  .contact-form-wrap textarea { width: 100%; padding: 12px 14px; border: 1px solid rgba(17,29,43,.15); border-radius: 6px; font-family: 'Jost', sans-serif; font-size: 14px; background: #fff; color: var(--text-dark); resize: vertical; min-height: 100px; outline: none; transition: border-color .2s; }
  .contact-form-wrap textarea:focus { border-color: var(--gold); }
  @media(max-width:800px) { .contact-split-inner { grid-template-columns: 1fr; gap: 48px; } }

  /* Trust strip */
  .trust-strip { background: var(--warm-white); padding: 60px 32px; border-top: 1px solid rgba(17,29,43,.08); }
  .trust-strip-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 32px; text-align: center; }
  .trust-item svg { color: var(--gold); margin-bottom: 12px; }
  .trust-item strong { display: block; font-size: 14px; font-weight: 600; color: var(--text-dark); margin-bottom: 4px; }
  .trust-item span { font-size: 13px; color: var(--text-soft); }
  @media(max-width:700px) { .trust-strip-inner { grid-template-columns: repeat(2,1fr); } }
</style>
```

**Short Hero:**
```html
<section class="contact-hero">
  <div class="contact-hero-inner">
    <span class="section-label">Contact</span>
    <h1>Let's Find the Right<br /><em>Coverage for You.</em></h1>
    <p>Reach out any way that works for you. We respond fast.</p>
  </div>
</section>
```

**Contact Split:**
```html
<section class="contact-split">
  <div class="contact-split-inner">
    <!-- Left: contact info -->
    <div class="contact-info fade-up">
      <span class="section-label">Get in Touch</span>
      <h2>We're Here When<br />You're Ready.</h2>
      <div class="contact-phone">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
        <a href="tel:+18005551234">(800) 555-1234</a>
      </div>
      <div class="contact-email">
        <a href="mailto:hello@engelfinancialgroup.com">hello@engelfinancialgroup.com</a>
      </div>
      <div class="contact-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>We respond within 24 hours</span>
      </div>
      <div class="contact-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>Licensed Independent Broker</span>
      </div>
      <p class="contact-reassurance">No pressure. No obligation. Just honest answers.</p>
    </div>
    <!-- Right: contact form -->
    <div class="contact-form-wrap fade-up">
      <div class="form-card">
        <div class="form-card-title">Send Us a Message</div>
        <div class="form-card-sub">We'll get back to you within 24 hours.</div>
        <div class="form-row">
          <div class="form-group">
            <label for="first-name">First Name</label>
            <input type="text" id="first-name" placeholder="John" />
          </div>
          <div class="form-group">
            <label for="last-name">Last Name</label>
            <input type="text" id="last-name" placeholder="Smith" />
          </div>
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input type="tel" id="phone" placeholder="(555) 000-0000" />
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" placeholder="john@example.com" />
        </div>
        <div class="form-group">
          <label for="coverage-type">Coverage Interest</label>
          <select id="coverage-type">
            <option value="">Select a coverage type...</option>
            <option value="life">Life Insurance</option>
            <option value="whole-life">Whole Life Insurance</option>
            <option value="iul">IUL (Indexed Universal Life)</option>
            <option value="annuity">Annuities</option>
            <option value="mortgage">Mortgage Protection</option>
            <option value="retirement">Retirement Planning</option>
            <option value="advanced">Advanced Markets / Business</option>
            <option value="general">General Question</option>
          </select>
        </div>
        <div class="form-group">
          <label for="message">Message <span style="font-weight:400;color:var(--text-soft)">(optional)</span></label>
          <textarea id="message" placeholder="Tell us a bit about your situation or what you're looking for..."></textarea>
        </div>
        <button class="btn-primary" onclick="handleContactSubmit()">Send My Message</button>
        <p class="form-disclaimer">By submitting, you agree to be contacted by a licensed agent. Your information is 100% private and never sold to third parties.</p>
      </div>
    </div>
  </div>
</section>
```

**Trust Strip:**
```html
<section class="trust-strip">
  <div class="trust-strip-inner">
    <div class="trust-item fade-up">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      <strong>Licensed &amp; Compliant</strong>
      <span>Independent broker, fully licensed</span>
    </div>
    <div class="trust-item fade-up">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <strong>Your Info is Private</strong>
      <span>Never sold to third parties</span>
    </div>
    <div class="trust-item fade-up">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <strong>24-Hour Response</strong>
      <span>We get back to you fast</span>
    </div>
    <div class="trust-item fade-up">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      <strong>Real Person, Every Time</strong>
      <span>You talk to Andrew directly</span>
    </div>
  </div>
</section>
```

Use the **Shared script block** plus the contact form submit handler:

```javascript
function handleContactSubmit() {
  const required = ['first-name','last-name','phone','email'];
  const missing = required.some(id => !document.getElementById(id).value.trim());
  if (missing) { alert('Please fill in all required fields.'); return; }
  window.location.href = '/thank-you.html';
}
```

- [ ] **Step 3: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/contact.html contact
```

Read screenshot. Verify: gold phone number large and prominent, form card renders on right with all fields, trust strip shows 4 icons, no embedded lead form (correct — this is the contact form itself).

- [ ] **Step 4: Fix any visual issues, re-screenshot**

```bash
node screenshot.mjs http://localhost:3000/contact.html contact-v2
```

- [ ] **Step 5: Commit**

```bash
git add contact.html
git commit -m "feat: add contact.html — primary conversion page with form and contact info"
```

---

## Self-Review Checklist (run after all tasks complete)

- [ ] All 4 new pages have Company + Coverage dropdowns in nav
- [ ] All 9 existing pages have Company dropdown added to nav and updated footer links
- [ ] `about-andrew.html` uses the real photo (`brand_assets/andrew business guy 7 figures..png`), not a placeholder
- [ ] Andrew's bio text on `about-andrew.html` matches `brand_assets/About me - Andrew.txt` verbatim
- [ ] Contact page has LocalBusiness structured data in `<head>`
- [ ] All CTA banners on about/andrew/how-it-works link to `/contact.html`
- [ ] Contact form validates required fields and redirects to `/thank-you.html`
- [ ] Mobile menu has both Coverage and Company accordions on all pages
- [ ] `toggleMobileCompany()` function present in every page's script block
