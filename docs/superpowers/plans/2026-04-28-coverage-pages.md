# Coverage Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 7 coverage product pages, extract shared styles into `styles.css`, and update nav/footer across all pages to include a Coverage dropdown (desktop) and burger menu (mobile).

**Architecture:** Shared `styles.css` for all common styles (nav, footer, form-card, buttons, typography, coverage page section templates). Page-specific styles stay inline. Nav and footer HTML is copy-pasted identically into every page — no JS injection. Coverage pages follow a fixed 9-section template.

**Tech Stack:** Vanilla HTML/CSS/JS · Google Fonts (Cormorant Garamond + Jost) · placehold.co for placeholder images · `node serve.mjs` (localhost:3000) · `node screenshot.mjs` for visual QA

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `styles.css` | CREATE | CSS vars · reset · body · headings · grain · nav (dropdown + burger + mobile menu) · footer · buttons · form-card · coverage section templates · shared responsive |
| `index.html` | MODIFY | Add `<link>` to styles.css · replace nav HTML · replace footer HTML · remove styles now in styles.css |
| `thank-you.html` | MODIFY | Add `<link>` to styles.css · add full nav + footer |
| `life-insurance.html` | CREATE | Life Insurance overview (gateway page) |
| `whole-life-insurance.html` | CREATE | Whole Life Insurance product page |
| `iuls.html` | CREATE | IULs product page |
| `annuities.html` | CREATE | Annuities product page |
| `mortgage-protection.html` | CREATE | Mortgage Protection product page |
| `retirement-planning.html` | CREATE | Retirement Planning product page |
| `advanced-markets.html` | CREATE | Advanced Markets / Business product page |

---

## Canonical HTML Blocks (referenced in all tasks)

### NAV HTML — use verbatim on every page

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
    </div>
    <div class="nav-right">
      <div class="nav-phone">
        <a href="tel:+18005551234" class="phone-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
          (800) 555-1234
        </a>
        <a href="#get-quote" class="btn-nav">Get a Free Quote</a>
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
    <div class="mobile-cta-area">
      <a href="tel:+18005551234" class="mobile-phone-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
        (800) 555-1234
      </a>
      <a href="#get-quote" class="mobile-btn-nav">Get a Free Quote</a>
    </div>
  </div>
</nav>
```

### FOOTER HTML — use verbatim on every page

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
          <li><a href="#">About</a></li>
          <li><a href="#">How It Works</a></li>
          <li><a href="#">Carriers We Work With</a></li>
          <li><a href="#">Contact</a></li>
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

### SHARED JS — include in every page's `<script>` block

```javascript
function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}
function toggleMobileCoverage(btn) {
  const content = document.getElementById('mobile-coverage');
  content.classList.toggle('open');
  btn.classList.toggle('open');
}
document.querySelectorAll('.faq-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});
function handleSubmit() {
  const fields = ['first-name','last-name','phone','email','zip'];
  const missing = fields.some(id => !document.getElementById(id).value.trim());
  if (missing) { alert('Please fill in all required fields.'); return; }
  window.location.href = '/thank-you.html';
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
```

---

## Task 1: Create styles.css

**Files:**
- Create: `styles.css`

- [ ] **Step 1: Create `styles.css` with the following complete content**

```css
/* ═══════════════════════════════════════
   ENGEL FINANCIAL GROUP — Shared Styles
   ═══════════════════════════════════════ */

/* ── Variables ── */
:root {
  --navy:       #111d2b;
  --navy-mid:   #1a2d3f;
  --navy-light: #243851;
  --gold:       #b87333;
  --gold-light: #bd9468;
  --gold-pale:  #fbf3da;
  --off-white:  #f5ede0;
  --warm-white: #fbf3da;
  --text-dark:  #111d2b;
  --text-mid:   #3C4C62;
  --text-soft:  #6B7A8D;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Jost', sans-serif;
  background: var(--warm-white);
  color: var(--text-dark);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: 'Cormorant Garamond', serif;
  letter-spacing: -0.02em;
}

/* ── Grain overlay ── */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px;
}

/* ══════════════════════════════
   NAV
   ══════════════════════════════ */
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  background: rgba(17, 29, 43, 0.97);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(184, 115, 51, 0.2);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-img {
  height: 44px;
  width: auto;
  object-fit: contain;
  border-radius: 2px;
}

.logo-img--footer { height: 56px; }

/* Desktop dropdown */
.nav-center { display: flex; align-items: center; }

.nav-dropdown { position: relative; }

.nav-dropdown-trigger {
  background: none;
  border: none;
  color: rgba(255,255,255,0.75);
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s;
}

.nav-dropdown-trigger:hover { color: var(--gold-light); }

.nav-dropdown-trigger .chevron { transition: transform 0.2s; }

.nav-dropdown:hover .nav-dropdown-trigger .chevron { transform: rotate(180deg); }

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

.nav-dropdown:hover .nav-dropdown-menu {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.nav-dropdown-menu a {
  display: block;
  padding: 10px 20px;
  color: rgba(255,255,255,0.7);
  font-size: 13px;
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
}

.nav-dropdown-menu a:hover {
  color: var(--gold-light);
  background: rgba(184,115,51,0.08);
}

/* Nav right */
.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-phone {
  display: flex;
  align-items: center;
  gap: 24px;
}

.phone-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gold-light);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: color 0.2s;
}

.phone-link:hover { color: #fff; }

/* Burger */
.burger-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: rgba(255,255,255,0.8);
  line-height: 0;
}

/* Mobile menu */
.mobile-menu {
  display: none;
  background: rgba(10,18,25,0.99);
  border-top: 1px solid rgba(184,115,51,0.15);
  padding: 16px 24px 28px;
  position: absolute;
  top: 72px;
  left: 0; right: 0;
  z-index: 99;
}

.mobile-menu.open { display: block; }

.mobile-section { border-bottom: 1px solid rgba(255,255,255,0.07); }

.mobile-accordion-trigger {
  width: 100%;
  background: none;
  border: none;
  color: rgba(255,255,255,0.75);
  font-family: 'Jost', sans-serif;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
  cursor: pointer;
  padding: 14px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-accordion-trigger .chevron { transition: transform 0.2s; }
.mobile-accordion-trigger.open .chevron { transform: rotate(180deg); }

.mobile-accordion-content { display: none; padding: 4px 0 12px 12px; }
.mobile-accordion-content.open { display: block; }

.mobile-accordion-content a {
  display: block;
  padding: 8px 0;
  color: rgba(255,255,255,0.55);
  font-size: 13px;
  text-decoration: none;
  transition: color 0.15s;
}

.mobile-accordion-content a:hover { color: var(--gold-light); }

.mobile-cta-area { padding-top: 16px; }

.mobile-phone-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.65);
  font-size: 14px;
  text-decoration: none;
  padding: 8px 0;
  margin-bottom: 12px;
}

.mobile-btn-nav {
  display: block;
  width: 100%;
  text-align: center;
  padding: 13px;
  background: var(--gold);
  color: var(--navy);
  font-family: 'Jost', sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 2px;
  text-decoration: none;
  transition: background 0.2s;
}

.mobile-btn-nav:hover { background: var(--gold-light); }

/* ══════════════════════════════
   BUTTONS
   ══════════════════════════════ */
.btn-nav {
  background: var(--gold);
  color: var(--navy);
  font-family: 'Jost', sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 10px 24px;
  border-radius: 2px;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
  border: none;
  cursor: pointer;
  display: inline-block;
}

.btn-nav:hover { background: var(--gold-light); transform: translateY(-1px); }
.btn-nav:active { transform: translateY(0); }

.btn-primary {
  width: 100%;
  padding: 16px;
  background: var(--gold);
  color: var(--navy);
  font-family: 'Jost', sans-serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(184,115,51,0.35);
  margin-top: 4px;
}

.btn-primary:hover {
  background: var(--gold-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(184,115,51,0.4);
}

.btn-primary:active { transform: translateY(0); }

.btn-dark {
  display: inline-block;
  padding: 16px 40px;
  background: var(--gold);
  color: var(--navy);
  font-family: 'Jost', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 2px;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}

.btn-dark:hover {
  background: var(--gold-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(184,115,51,0.3);
}

.btn-dark:active { transform: translateY(0); }

.btn-ghost {
  display: inline-block;
  padding: 16px 40px;
  background: transparent;
  color: rgba(255,255,255,0.75);
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 2px;
  text-decoration: none;
  transition: border-color 0.2s, color 0.2s;
}

.btn-ghost:hover {
  border-color: rgba(184,115,51,0.5);
  color: var(--gold-light);
}

/* ══════════════════════════════
   FORM CARD
   ══════════════════════════════ */
.form-card {
  background: var(--warm-white);
  border-radius: 4px;
  padding: 40px 36px;
  box-shadow:
    0 2px 4px rgba(0,0,0,0.08),
    0 8px 24px rgba(0,0,0,0.16),
    0 32px 64px rgba(0,0,0,0.2);
  position: relative;
}

.form-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 100%);
  border-radius: 4px 4px 0 0;
}

.form-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 6px;
  line-height: 1.2;
}

.form-card-sub {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-soft);
  margin-bottom: 28px;
  line-height: 1.5;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.form-group label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-mid);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #DDD9D0;
  border-radius: 2px;
  font-family: 'Jost', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: var(--text-dark);
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.form-group select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23b87333' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 44px;
  cursor: pointer;
}

.form-group select option { color: var(--text-dark); background: #fff; }

.form-group input:focus,
.form-group select:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(184,115,51,0.12);
}

.form-group input::placeholder { color: #BBBBBB; }

.form-disclaimer {
  margin-top: 14px;
  font-size: 11px;
  color: var(--text-soft);
  line-height: 1.5;
  text-align: center;
}

/* ══════════════════════════════
   FOOTER
   ══════════════════════════════ */
footer {
  background: #0a1219;
  padding: 72px 0 0;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 56px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.footer-brand p {
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255,255,255,0.4);
  margin-top: 20px;
  max-width: 280px;
}

.footer-col h4 {
  font-family: 'Jost', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 20px;
}

.footer-col ul { list-style: none; }
.footer-col ul li { margin-bottom: 10px; }

.footer-col ul li a {
  font-size: 14px;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-col ul li a:hover { color: var(--gold-light); }

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
  font-size: 13px;
  color: rgba(255,255,255,0.3);
}

.footer-bottom a { color: rgba(255,255,255,0.35); text-decoration: none; }
.footer-bottom a:hover { color: var(--gold); }

.footer-license { display: flex; align-items: center; gap: 8px; }

.license-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
}

/* ══════════════════════════════
   COVERAGE PAGE SECTIONS
   ══════════════════════════════ */

/* Section base helpers */
.section-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 12px;
  display: block;
}

.section-header { text-align: center; margin-bottom: 56px; }

.section-header h2 {
  font-size: clamp(30px, 4vw, 46px);
  font-weight: 600;
  color: var(--navy);
  line-height: 1.1;
}

.section-header h2 em { font-style: italic; color: var(--gold-light); }

/* Hero */
.page-hero {
  background: var(--navy);
  padding: 148px 0 96px;
  position: relative;
  overflow: hidden;
}

.page-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 15% 60%, rgba(184,115,51,0.07) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 20%, rgba(36,56,81,0.5) 0%, transparent 50%);
}

.page-hero-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 32px;
  text-align: center;
  position: relative;
}

.page-hero-inner .section-label { color: var(--gold); margin-bottom: 20px; }

.page-hero h1 {
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 600;
  line-height: 1.05;
  color: #fff;
  margin-bottom: 24px;
}

.page-hero h1 em { font-style: italic; color: var(--gold-light); }

.page-hero p {
  font-size: 18px;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(255,255,255,0.6);
  max-width: 580px;
  margin: 0 auto 44px;
}

.hero-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

/* What Is It */
.what-section { padding: 96px 0; background: var(--warm-white); }

.what-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.what-content h2 {
  font-size: clamp(30px, 4vw, 46px);
  font-weight: 600;
  line-height: 1.1;
  color: var(--navy);
  margin-bottom: 24px;
}

.what-content p {
  font-size: 16px;
  line-height: 1.75;
  color: var(--text-mid);
  margin-bottom: 16px;
}

.fact-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }

.fact-chip {
  padding: 8px 16px;
  background: rgba(184,115,51,0.08);
  border: 1px solid rgba(184,115,51,0.25);
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--navy);
}

.what-image {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(17,29,43,0.15);
}

.what-image img { width: 100%; height: 420px; object-fit: cover; display: block; }

.what-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(184,115,51,0.2) 0%, rgba(17,29,43,0.4) 100%);
  mix-blend-mode: multiply;
}

/* Who It's For */
.who-section { padding: 96px 0; background: #ede4d3; }

.who-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; }

.who-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

.who-card {
  background: var(--warm-white);
  border: 1px solid rgba(184,115,51,0.15);
  border-radius: 4px;
  padding: 36px 28px;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
}

.who-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(17,29,43,0.10), 0 2px 8px rgba(184,115,51,0.07);
}

.who-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.who-card:hover::before { transform: scaleX(1); }

.who-icon {
  width: 48px; height: 48px;
  background: rgba(184,115,51,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--gold);
}

.who-card h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.who-card p { font-size: 14px; line-height: 1.7; color: var(--text-mid); }

/* How It Works */
.how-section { padding: 96px 0; background: var(--navy); }
.how-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; }

.how-section .section-header h2 { color: #fff; }
.how-section .section-label { color: var(--gold); }

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  margin-top: 56px;
}

.step-item { text-align: center; }

.step-num {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: rgba(184,115,51,0.12);
  border: 2px solid var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 600;
  color: var(--gold);
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
}

.step-item:hover .step-num { transform: scale(1.08); }

.step-item h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
}

.step-item p { font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.5); }

/* Benefits */
.benefits-section { padding: 96px 0; background: var(--warm-white); }
.benefits-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; }

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px 40px;
  margin-top: 56px;
}

.benefit-item { display: flex; gap: 14px; align-items: flex-start; }

.benefit-icon {
  flex-shrink: 0;
  width: 20px; height: 20px;
  margin-top: 3px;
  color: var(--gold);
}

.benefit-text strong {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 4px;
}

.benefit-text span { font-size: 13px; color: var(--text-soft); line-height: 1.6; }

/* Form section */
.form-section { padding: 96px 0; background: var(--navy); }

.form-section-inner { max-width: 620px; margin: 0 auto; padding: 0 32px; }

.form-section-header { text-align: center; margin-bottom: 40px; }
.form-section-header h2 {
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 600;
  color: #fff;
  line-height: 1.1;
}

/* FAQ */
.faq-section { padding: 96px 0; background: #ede4d3; }
.faq-inner { max-width: 760px; margin: 0 auto; padding: 0 32px; }
.faq-list { margin-top: 48px; }
.faq-item { border-bottom: 1px solid rgba(17,29,43,0.12); }

.faq-trigger {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  padding: 22px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  gap: 20px;
}

.faq-trigger span { font-size: 16px; font-weight: 500; color: var(--navy); line-height: 1.4; }

.faq-chevron {
  flex-shrink: 0;
  width: 18px; height: 18px;
  color: var(--gold);
  transition: transform 0.25s;
}

.faq-item.open .faq-chevron { transform: rotate(180deg); }

.faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.faq-item.open .faq-answer { max-height: 300px; }

.faq-answer-inner {
  padding: 0 0 20px;
  font-size: 15px;
  line-height: 1.75;
  color: var(--text-mid);
}

/* Bottom CTA */
.bottom-cta { padding: 96px 0; background: #0a1219; }

.bottom-cta-inner {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 32px;
  text-align: center;
}

.bottom-cta h2 {
  font-size: clamp(32px, 4vw, 54px);
  font-weight: 600;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 16px;
}

.bottom-cta h2 em { font-style: italic; color: var(--gold-light); }

.bottom-cta > .bottom-cta-inner > p {
  font-size: 16px;
  color: rgba(255,255,255,0.5);
  line-height: 1.7;
  margin-bottom: 40px;
}

/* ══════════════════════════════
   SCROLL ANIMATIONS
   ══════════════════════════════ */
.fade-up {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1);
}
.fade-up.in-view { opacity: 1; transform: translateY(0); }

/* ══════════════════════════════
   SHARED RESPONSIVE
   ══════════════════════════════ */
@media (max-width: 1024px) {
  .what-inner { grid-template-columns: 1fr; gap: 48px; }
  .what-image { display: none; }
  .benefits-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-top { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .nav-center { display: none; }
  .nav-phone { display: none; }
  .burger-btn { display: block; }
  .who-cards { grid-template-columns: 1fr; }
  .steps-grid { grid-template-columns: 1fr; gap: 32px; }
  .form-row { grid-template-columns: 1fr; }
  .hero-ctas { flex-direction: column; align-items: center; }
  .footer-top { grid-template-columns: 1fr 1fr; }
  .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
}

@media (max-width: 480px) {
  .benefits-grid { grid-template-columns: 1fr; }
  .footer-top { grid-template-columns: 1fr; }
  .page-hero-inner { padding: 0 20px; }
  .form-section-inner { padding: 0 20px; }
}
```

- [ ] **Step 2: Verify styles.css exists**

Run: `node serve.mjs` (background) then open `http://localhost:3000/styles.css` — browser should return the CSS text.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add shared styles.css with nav dropdown, burger menu, and coverage page sections"
```

---

## Task 2: Refactor index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the stylesheet link in `<head>`**

Add this line after the Google Fonts `<link>` tag (around line 10):

```html
<link rel="stylesheet" href="styles.css" />
```

- [ ] **Step 2: Replace the existing `<nav>` element with the Canonical NAV HTML** from the top of this plan.

The existing nav starts at the line containing `<nav>` and ends at `</nav>`. Replace the entire block.

- [ ] **Step 3: Replace the existing `<footer>` element with the Canonical FOOTER HTML** from the top of this plan.

- [ ] **Step 4: Remove these selectors from the `<style>` block** (they are now in styles.css):

Remove: `:root`, `*`, `body`, `h1, h2, h3, h4`, `body::before`, `nav`, `.nav-inner`, `.logo`, `.logo-img`, `.logo-img--footer`, `.nav-phone`, `.nav-phone a.phone-link`, `.btn-nav`, `.btn-nav:hover`, `.btn-nav:active`, `.btn-primary`, `.btn-primary:hover`, `.btn-primary:active`, `.btn-dark`, `.btn-dark:hover`, `.btn-dark:active`, `.form-card`, `.form-card::before`, `.form-card-title`, `.form-card-sub`, `.form-row`, `.form-group`, `.form-group label`, `.form-group input, .form-group select`, `.form-group input:focus, .form-group select:focus`, `.form-group input::placeholder`, `.form-disclaimer`, `footer`, `.footer-inner`, `.footer-top`, `.footer-brand p`, `.footer-col h4`, `.footer-col ul`, `.footer-col ul li`, `.footer-col ul li a`, `.footer-col ul li a:hover`, `.footer-bottom`, `.footer-bottom a`, `.footer-bottom a:hover`, `.footer-license`, `.license-dot`, and any responsive rules that targeted only those selectors.

Keep everything else inline (hero, stats, pain, benefits, testimonials, steps, CTA sections, and their responsive rules).

- [ ] **Step 5: Screenshot and verify no regressions**

```bash
node screenshot.mjs http://localhost:3000 index-refactor
```

Read the screenshot from `temporary screenshots/`. Confirm: nav shows Coverage dropdown on hover, logo visible, form card renders correctly, footer shows 7 coverage links, all colors correct.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: update index.html nav (dropdown) and footer (7 coverage links), link styles.css"
```

---

## Task 3: Refactor thank-you.html

**Files:**
- Modify: `thank-you.html`

- [ ] **Step 1: Add stylesheet link in `<head>`** after the Google Fonts link:

```html
<link rel="stylesheet" href="styles.css" />
```

- [ ] **Step 2: Remove from the `<style>` block** any selectors that are now in styles.css: `:root`, `*`, `body`, `h1-h4`, `body::before`. Keep `.page-logo`, `.card`, `.card::before`, `.check-wrap`, `.btn` and all thank-you-specific styles.

- [ ] **Step 3: Add the Canonical NAV HTML** immediately after `<body>`.

- [ ] **Step 4: Add the Canonical FOOTER HTML** immediately before `</body>`, after the existing `.card` div.

- [ ] **Step 5: Add `padding-top: 72px` to the `body` style** so the fixed nav doesn't overlap content:

In the `<style>` block, update the body rule to include `padding-top: 72px;`.

- [ ] **Step 6: Add the Shared JS** in a `<script>` block before `</body>`.

- [ ] **Step 7: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/thank-you.html thank-you
```

Read screenshot. Confirm: nav and footer present, card centered, no layout breaks.

- [ ] **Step 8: Commit**

```bash
git add thank-you.html
git commit -m "feat: add shared nav and footer to thank-you page"
```

---

## Task 4: Build life-insurance.html

**Files:**
- Create: `life-insurance.html`

- [ ] **Step 1: Create the complete file**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Life Insurance — Engel Financial Group</title>
  <meta name="description" content="Find the right life insurance coverage for your family. Term, whole life, IUL, and more — compare options with a licensed agent at no cost." />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  <!-- NAV — identical on every page -->
  <!-- paste Canonical NAV HTML here -->

  <!-- ═══ HERO ═══ -->
  <section class="page-hero">
    <div class="page-hero-inner">
      <span class="section-label">Life Insurance</span>
      <h1>Protection That Follows Your<br /><em>Family, Not Just a Policy</em></h1>
      <p>Find the right coverage for where you are in life — from protecting your mortgage to building lifelong wealth. Our licensed agents compare top-rated carriers at zero cost to you.</p>
      <div class="hero-ctas">
        <a href="#get-quote" class="btn-dark">See If You Qualify</a>
        <a href="tel:+18005551234" class="btn-ghost">Call Us Now</a>
      </div>
    </div>
  </section>

  <!-- ═══ WHAT IS IT ═══ -->
  <section class="what-section">
    <div class="what-inner">
      <div class="what-content fade-up">
        <span class="section-label">What Is Life Insurance</span>
        <h2>A Promise to the People You Love Most</h2>
        <p>Life insurance is a contract between you and an insurance company — you pay regular premiums, and in return, your family receives a tax-free payout when you pass away. That money can replace lost income, eliminate debts, cover final expenses, or fund your children's education.</p>
        <p>At Engel Financial Group, we help families across America find coverage that genuinely fits their needs and budget. We work with multiple A-rated carriers so you're never locked into one option.</p>
        <div class="fact-chips">
          <span class="fact-chip">Tax-Free Death Benefit</span>
          <span class="fact-chip">Multiple Coverage Types</span>
          <span class="fact-chip">No-Obligation Consultation</span>
          <span class="fact-chip">Flexible Premiums</span>
        </div>
      </div>
      <div class="what-image fade-up">
        <img src="https://placehold.co/600x420/111d2b/bd9468?text=Life+Insurance" alt="Family protected by life insurance" />
      </div>
    </div>
  </section>

  <!-- ═══ WHO IT'S FOR ═══ -->
  <section class="who-section">
    <div class="who-inner">
      <div class="section-header fade-up">
        <span class="section-label">Who It's For</span>
        <h2>Coverage for Every Stage of Life</h2>
      </div>
      <div class="who-cards">
        <div class="who-card fade-up">
          <div class="who-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3>Young Families</h3>
          <p>Parents with young children who want to ensure their family maintains their lifestyle and meets financial obligations if the unexpected happens.</p>
        </div>
        <div class="who-card fade-up">
          <div class="who-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h3>Homeowners</h3>
          <p>Homeowners who want to protect their mortgage and keep their family in their home regardless of what life brings.</p>
        </div>
        <div class="who-card fade-up">
          <div class="who-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <h3>Business Owners</h3>
          <p>Entrepreneurs who need key person coverage, buy-sell agreement funding, or executive benefit plans to protect what they've built.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ HOW IT WORKS ═══ -->
  <section class="how-section">
    <div class="how-inner">
      <div class="section-header fade-up">
        <span class="section-label" style="color:var(--gold)">How It Works</span>
        <h2 style="color:#fff">Simple. Fast. <em style="font-style:italic;color:var(--gold-light)">No Pressure.</em></h2>
      </div>
      <div class="steps-grid">
        <div class="step-item fade-up">
          <div class="step-num">1</div>
          <h3>Tell Us About Yourself</h3>
          <p>Fill out our quick form with basic information. No medical exam required to get started — just a few questions.</p>
        </div>
        <div class="step-item fade-up">
          <div class="step-num">2</div>
          <h3>We Compare Options</h3>
          <p>Our licensed agents search across multiple top-rated carriers to find coverage that matches your needs and fits your budget.</p>
        </div>
        <div class="step-item fade-up">
          <div class="step-num">3</div>
          <h3>You Choose &amp; Get Covered</h3>
          <p>Review your options with zero pressure, choose the plan that works for you, and get covered — often the same day.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ BENEFITS ═══ -->
  <section class="benefits-section">
    <div class="benefits-inner">
      <div class="section-header fade-up">
        <span class="section-label">Why Choose Us</span>
        <h2>Every Advantage You <em>Deserve</em></h2>
      </div>
      <div class="benefits-grid">
        <div class="benefit-item fade-up">
          <div class="benefit-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="benefit-text"><strong>Tax-Free Payout</strong><span>Your beneficiaries receive the full death benefit completely free of income tax.</span></div>
        </div>
        <div class="benefit-item fade-up">
          <div class="benefit-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="benefit-text"><strong>Multiple Plan Types</strong><span>Term, whole life, IUL, and annuities — we match you with the right product for your goals.</span></div>
        </div>
        <div class="benefit-item fade-up">
          <div class="benefit-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="benefit-text"><strong>Top-Rated Carriers</strong><span>We work with A-rated insurance companies so your coverage will be there when needed.</span></div>
        </div>
        <div class="benefit-item fade-up">
          <div class="benefit-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="benefit-text"><strong>No Obligation</strong><span>Our consultations are 100% free with zero pressure or commitment required.</span></div>
        </div>
        <div class="benefit-item fade-up">
          <div class="benefit-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="benefit-text"><strong>Fast Approval</strong><span>Many clients receive coverage within 24–48 hours of applying, often with no medical exam.</span></div>
        </div>
        <div class="benefit-item fade-up">
          <div class="benefit-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="benefit-text"><strong>Licensed Agents</strong><span>Every client works with a state-licensed, fully trained insurance professional.</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ LEAD FORM ═══ -->
  <section class="form-section" id="get-quote">
    <div class="form-section-inner">
      <div class="form-section-header fade-up">
        <span class="section-label" style="color:var(--gold)">Get Started</span>
        <h2>See Which Plan Fits You</h2>
      </div>
      <div class="form-card fade-up">
        <div class="form-card-title">See If You Qualify</div>
        <div class="form-card-sub">Takes under 60 seconds. No commitment required.</div>
        <div class="form-group">
          <label for="coverage-type">Coverage Interest</label>
          <select id="coverage-type">
            <option value="life" selected>Life Insurance</option>
            <option value="whole-life">Whole Life Insurance</option>
            <option value="iul">IUL (Indexed Universal Life)</option>
            <option value="annuity">Annuities</option>
            <option value="mortgage">Mortgage Protection</option>
            <option value="retirement">Retirement Planning</option>
            <option value="advanced">Advanced Markets / Business</option>
          </select>
        </div>
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
          <label for="zip">Zip Code</label>
          <input type="text" id="zip" placeholder="90210" maxlength="5" />
        </div>
        <button class="btn-primary" onclick="handleSubmit()">Get My Free Quote</button>
        <p class="form-disclaimer">By submitting, you agree to be contacted by a licensed agent. Your information is 100% private and never sold to third parties.</p>
      </div>
    </div>
  </section>

  <!-- ═══ FAQ ═══ -->
  <section class="faq-section">
    <div class="faq-inner">
      <div class="section-header fade-up">
        <span class="section-label">Common Questions</span>
        <h2>Answers You <em>Actually Need</em></h2>
      </div>
      <div class="faq-list">
        <div class="faq-item">
          <button class="faq-trigger">
            <span>How much life insurance do I need?</span>
            <svg class="faq-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-answer"><div class="faq-answer-inner">A common starting point is 10–12× your annual income, but the right amount depends on your debts, income, dependents, and long-term goals. Our agents will help you calculate exactly what makes sense — at no cost.</div></div>
        </div>
        <div class="faq-item">
          <button class="faq-trigger">
            <span>What's the difference between term and whole life insurance?</span>
            <svg class="faq-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-answer"><div class="faq-answer-inner">Term life covers you for a set period (10, 20, or 30 years) at a lower premium. Whole life is permanent coverage that never expires and builds cash value over time. The best choice depends on your budget and goals.</div></div>
        </div>
        <div class="faq-item">
          <button class="faq-trigger">
            <span>Do I need a medical exam to qualify?</span>
            <svg class="faq-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-answer"><div class="faq-answer-inner">Not always. Many of our carriers offer no-exam policies for qualifying applicants. A short health questionnaire is typically all that's required to get started.</div></div>
        </div>
        <div class="faq-item">
          <button class="faq-trigger">
            <span>Can I get coverage if I have pre-existing health conditions?</span>
            <svg class="faq-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-answer"><div class="faq-answer-inner">Very likely yes. We work with multiple carriers, including those that specialize in higher-risk applicants. Our agents will find the best available option for your specific health situation.</div></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ BOTTOM CTA ═══ -->
  <section class="bottom-cta">
    <div class="bottom-cta-inner">
      <h2>Ready to Protect <em>What Matters Most?</em></h2>
      <p>A 10-minute conversation with a licensed agent is all it takes to understand your options and find coverage that fits your life and your budget.</p>
      <a href="#get-quote" class="btn-dark">Get My Free Quote Now</a>
    </div>
  </section>

  <!-- FOOTER — identical on every page -->
  <!-- paste Canonical FOOTER HTML here -->

  <script>
    /* paste Shared JS here */
  </script>
</body>
</html>
```

**Important:** Replace the nav comment with the Canonical NAV HTML, the footer comment with the Canonical FOOTER HTML, and the script comment with the Shared JS — all from the top of this plan.

- [ ] **Step 2: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/life-insurance.html life-insurance
```

Read the screenshot. Confirm: hero visible, all 9 sections present, form shows Life Insurance pre-selected in dropdown, footer shows 7 links, burger icon visible on mobile view.

- [ ] **Step 3: Commit**

```bash
git add life-insurance.html
git commit -m "feat: add life-insurance.html coverage page"
```

---

## Task 5: Build whole-life-insurance.html

**Files:**
- Create: `whole-life-insurance.html`

- [ ] **Step 1: Copy `life-insurance.html` to `whole-life-insurance.html` and apply these substitutions:**

**`<title>`:** `Whole Life Insurance — Engel Financial Group`

**`<meta name="description">`:** `Whole life insurance offers permanent protection and builds real cash value. No expiration, no renewals — coverage and growth for life.`

**Hero `section-label`:** `Whole Life Insurance`

**Hero `h1`:** `Permanent Protection.<br /><em>Lifelong Peace of Mind.</em>`

**Hero `p`:** `Whole life insurance is the only coverage that never expires. It protects your family forever while building guaranteed cash value you can access during your lifetime.`

**What Is It `h2`:** `Coverage That Lasts as Long as You Do`

**What Is It paragraphs:**
- Para 1: `Whole life insurance is permanent coverage — unlike term policies, it never expires as long as you pay premiums. Your beneficiaries are guaranteed a death benefit no matter when you pass away.`
- Para 2: `Beyond the death benefit, whole life builds cash value over time at a guaranteed rate. That cash value grows tax-deferred and can be borrowed against for any purpose — retirement income, emergencies, or major expenses.`

**Fact chips:** `Guaranteed Cash Value` · `Permanent Coverage` · `Tax-Deferred Growth` · `Borrow Against Your Policy`

**Who It's For cards:**
- Card 1 (use person-icon SVG): **"Estate Planners"** — `Individuals who want to leave a guaranteed inheritance, cover estate taxes, or create a legacy for the next generation.`
- Card 2 (use home-icon SVG): **"Conservative Savers"** — `People who want guaranteed, predictable growth without market risk — a safe alternative to volatile investments.`
- Card 3 (use briefcase-icon SVG): **"Business Owners"** — `Entrepreneurs using whole life for buy-sell agreements, key person insurance, or executive bonus plans that attract top talent.`

**How It Works steps:**
- Step 1: **"Apply for Coverage"** — `We gather basic health and lifestyle information, then match you with carriers that offer the best whole life rates for your profile.`
- Step 2: **"Lock In Your Rate"** — `Your premium is fixed for life — it never increases. Your cash value grows on a guaranteed schedule from day one.`
- Step 3: **"Grow &amp; Protect"** — `Your policy builds cash value every year while keeping your family fully protected. Access funds anytime through a policy loan.`

**Benefits (6):**
1. **"Guaranteed Death Benefit"** — `Your family receives the full face amount — guaranteed, regardless of when you pass.`
2. **"Cash Value Growth"** — `Policies build guaranteed cash value that grows tax-deferred, year after year.`
3. **"Fixed Premiums for Life"** — `Your premium never increases, no matter your age or health changes.`
4. **"Tax-Advantaged Access"** — `Borrow against your cash value tax-free with no repayment schedule required.`
5. **"No Expiration"** — `Coverage never lapses or needs renewal — it stays in force for your entire life.`
6. **"Dividend Potential"** — `Many whole life policies pay annual dividends that can grow your cash value even faster.`

**FAQ (4):**
- Q1: `How is whole life different from term life?` — A: `Term life covers you for a set period and pays out only if you die during that term. Whole life is permanent — it covers you for life, builds cash value, and guarantees a death benefit regardless of when you pass.`
- Q2: `When does the cash value start building?` — A: `Cash value begins accumulating from the first year of your policy. The growth is guaranteed and follows a schedule set out in your policy document — no market risk involved.`
- Q3: `Can I access my cash value while I'm alive?` — A: `Yes. You can borrow against your cash value at any time for any reason — retirement income, emergencies, college funding. Policy loans have no repayment schedule and don't affect your death benefit if managed properly.`
- Q4: `Is whole life insurance expensive?` — A: `Whole life premiums are higher than term premiums, but you're getting permanent coverage plus a savings component. Many clients find the combination of protection and guaranteed growth fits their financial plan well.`

**Bottom CTA h2:** `Build Wealth While Protecting <em>Your Family</em>`

**Bottom CTA p:** `Whole life insurance is the only financial product that guarantees a death benefit and guaranteed growth. Speak with a licensed agent today — no cost, no commitment.`

**Form `<option selected>`:** `<option value="whole-life" selected>Whole Life Insurance</option>` (remove `selected` from the Life Insurance option)

- [ ] **Step 2: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/whole-life-insurance.html whole-life
```

Confirm: Whole Life Insurance pre-selected in form dropdown, all sections present, consistent styling.

- [ ] **Step 3: Commit**

```bash
git add whole-life-insurance.html
git commit -m "feat: add whole-life-insurance.html coverage page"
```

---

## Task 6: Build iuls.html

**Files:**
- Create: `iuls.html`

- [ ] **Step 1: Copy `life-insurance.html` to `iuls.html` and apply these substitutions:**

**`<title>`:** `IULs — Indexed Universal Life Insurance — Engel Financial Group`

**`<meta name="description">`:** `Indexed Universal Life Insurance lets you grow wealth tied to market performance — with a floor that protects you from losses. Tax-free retirement income potential.`

**Hero `section-label`:** `Indexed Universal Life`

**Hero `h1`:** `Grow Wealth. Protect Your Family.<br /><em>Pay Zero Taxes in Retirement.</em>`

**Hero `p`:** `An IUL combines permanent life insurance protection with market-linked growth — and a floor that means you never lose money when markets drop. It's one of the most powerful tax-advantaged tools available.`

**What Is It `h2`:** `Upside Potential. Downside Protection.`

**What Is It paragraphs:**
- Para 1: `An Indexed Universal Life (IUL) policy ties your cash value growth to a stock market index — like the S&P 500 — without directly investing in the market. When the index goes up, you earn interest. When it goes down, your floor protects you from losses.`
- Para 2: `Because growth accumulates tax-deferred and distributions can be taken as tax-free policy loans, IULs are increasingly used as a tax-free retirement income strategy — especially for high earners who have maxed out traditional accounts.`

**Fact chips:** `Market-Linked Growth` · `0% Floor on Losses` · `Tax-Free Income Potential` · `Permanent Coverage`

**Who It's For cards:**
- Card 1: **"High Earners"** — `Professionals and executives who have maxed out 401(k)s and IRAs and want another tax-advantaged vehicle for retirement savings.`
- Card 2: **"Risk-Conscious Investors"** — `People who want market-linked growth potential but can't stomach the idea of losing principal in a down market.`
- Card 3: **"Long-Term Planners"** — `Individuals building a 20–30 year plan for tax-free retirement income alongside a guaranteed death benefit for their family.`

**How It Works steps:**
- Step 1: **"Design Your Policy"** — `We help you structure the policy to maximize cash value accumulation while maintaining the life insurance component required for tax advantages.`
- Step 2: **"Fund &amp; Grow"** — `Your premiums fund both the death benefit and a cash value account linked to an index. A cap sets your upside; a floor (typically 0%) eliminates downside.`
- Step 3: **"Access Tax-Free Income"** — `In retirement, draw from your cash value as tax-free policy loans with no required minimum distributions — ever.`

**Benefits (6):**
1. **"Market-Linked Growth"** — `Earn interest tied to major market indexes without directly bearing investment risk.`
2. **"Protected Floor"** — `A 0% floor means your cash value never decreases due to a down market year.`
3. **"Tax-Free Distributions"** — `Access your cash value in retirement as policy loans — income-tax-free.`
4. **"No RMDs"** — `Unlike 401(k)s and IRAs, IUL policies have no required minimum distributions at any age.`
5. **"Permanent Protection"** — `Your family is covered for life while you build wealth — both objectives in one policy.`
6. **"Flexible Premiums"** — `Adjust your premium payments within limits based on your financial situation each year.`

**FAQ (4):**
- Q1: `How is an IUL different from a 401(k)?` — A: `Both grow tax-deferred, but IUL distributions are taken as tax-free loans (not taxable income like 401k withdrawals). IULs also have no contribution limits, no required minimum distributions, and include a permanent death benefit.`
- Q2: `What is the "floor" in an IUL?` — A: `The floor is the minimum interest rate your cash value can earn — typically 0%. Even if the linked index drops 30%, your cash value doesn't decrease due to market performance. You simply earn 0% for that period.`
- Q3: `Is there a cap on how much I can earn?` — A: `Yes. IUL policies have a cap rate that limits how much of the index gain you receive. Caps vary by carrier and policy design, typically ranging from 10–14%. You trade some upside for the protection of the floor.`
- Q4: `How long does it take for an IUL to be effective as a retirement tool?` — A: `IULs are long-term vehicles — most clients start seeing meaningful cash value accumulation after 7–10 years. The earlier you start, the more powerful the compounding becomes by retirement.`

**Bottom CTA h2:** `The Most Powerful Tax-Advantaged Tool<br /><em>Most People Don't Know About</em>`

**Bottom CTA p:** `An IUL properly structured by a licensed agent can provide market-linked growth, a guaranteed floor, and tax-free income in retirement. Let's see if it's right for you.`

**Form selected option:** `<option value="iul" selected>IUL (Indexed Universal Life)</option>`

- [ ] **Step 2: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/iuls.html iuls
```

- [ ] **Step 3: Commit**

```bash
git add iuls.html
git commit -m "feat: add iuls.html coverage page"
```

---

## Task 7: Build annuities.html

**Files:**
- Create: `annuities.html`

- [ ] **Step 1: Copy `life-insurance.html` to `annuities.html` and apply these substitutions:**

**`<title>`:** `Annuities — Guaranteed Retirement Income — Engel Financial Group`

**`<meta name="description">`:** `Annuities provide guaranteed income you can't outlive. Protect your retirement savings from market risk and ensure a predictable paycheck for life.`

**Hero `section-label`:** `Annuities`

**Hero `h1`:** `Guaranteed Income You<br /><em>Cannot Outlive.</em>`

**Hero `p`:** `An annuity turns a lump sum into a guaranteed stream of income — for a set period or for the rest of your life. It's one of the only financial products that can guarantee you'll never run out of money in retirement.`

**What Is It `h2`:** `Your Personal Pension, Built for the Modern Era`

**What Is It paragraphs:**
- Para 1: `An annuity is a contract with an insurance company — you make a lump sum payment (or series of payments), and the insurer guarantees regular income payments back to you, starting immediately or at a future date.`
- Para 2: `Annuities come in several types: fixed annuities offer guaranteed interest rates, indexed annuities link growth to a market index with downside protection, and income annuities convert a lump sum into a lifetime paycheck. Our agents help you find the right structure for your retirement goals.`

**Fact chips:** `Guaranteed Income for Life` · `Principal Protection` · `Tax-Deferred Growth` · `No Market Risk Options`

**Who It's For cards:**
- Card 1: **"Pre-Retirees"** — `Individuals 5–15 years from retirement looking to lock in guaranteed income and protect savings from market volatility before they need it.`
- Card 2: **"Recent Retirees"** — `People who have retired and want to convert a portion of their savings into a guaranteed paycheck that covers essential living expenses.`
- Card 3: **"Conservative Savers"** — `Investors who prioritize protecting their principal over chasing market returns and want predictable, guaranteed growth.`

**How It Works steps:**
- Step 1: **"Choose Your Structure"** — `We help you select the right annuity type — fixed, indexed, or income — based on your timeline, income needs, and risk tolerance.`
- Step 2: **"Fund Your Annuity"** — `Transfer a lump sum or roll over funds from a 401(k), IRA, or other account. The insurance company guarantees your principal and starts growing your balance.`
- Step 3: **"Receive Guaranteed Income"** — `When your income phase begins, you receive regular payments — monthly, quarterly, or annually — for the period or lifetime you selected.`

**Benefits (6):**
1. **"Guaranteed Income"** — `Receive predictable income payments you can plan around, for life or a defined period.`
2. **"Principal Protection"** — `Fixed and indexed annuities protect your initial investment from market downturns.`
3. **"Tax-Deferred Growth"** — `Your account grows tax-deferred — you only pay taxes when you take distributions.`
4. **"No Contribution Limits"** — `Unlike IRAs and 401(k)s, annuities have no annual contribution limits.`
5. **"Survivor Benefits"** — `Many annuity options include joint-life riders ensuring your spouse continues receiving income after you pass.`
6. **"Inflation Options"** — `Select riders that increase your payments annually to help your income keep pace with inflation.`

**FAQ (4):**
- Q1: `What's the difference between a fixed and indexed annuity?` — A: `A fixed annuity pays a guaranteed interest rate regardless of market conditions. An indexed annuity links growth to a market index but protects your principal from losses. Fixed annuities prioritize certainty; indexed annuities offer more upside potential while still protecting downside.`
- Q2: `Can I access my money before income payments start?` — A: `Yes, most annuities allow withdrawals during the accumulation phase, though early withdrawals may incur surrender charges or tax penalties depending on the contract terms and your age.`
- Q3: `Are annuity payments guaranteed even if the insurance company fails?` — A: `Annuities are backed by state insurance guarantee funds that protect your benefits up to specified limits (typically $250,000–$500,000 depending on your state). We work only with highly rated, financially stable carriers.`
- Q4: `Should I put all my retirement savings in an annuity?` — A: `Most financial plans suggest using annuities for a portion of retirement savings — enough to cover essential expenses — while keeping other assets for growth and liquidity. Our agents help you find the right balance.`

**Bottom CTA h2:** `The Retirement Paycheck<br /><em>You Can't Outlive</em>`

**Bottom CTA p:** `An annuity can be the foundation of a retirement income plan that gives you certainty — no matter what markets do. Let a licensed agent show you what's possible.`

**Form selected option:** `<option value="annuity" selected>Annuities</option>`

- [ ] **Step 2: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/annuities.html annuities
```

- [ ] **Step 3: Commit**

```bash
git add annuities.html
git commit -m "feat: add annuities.html coverage page"
```

---

## Task 8: Build mortgage-protection.html

**Files:**
- Create: `mortgage-protection.html`

- [ ] **Step 1: Copy `life-insurance.html` to `mortgage-protection.html` and apply these substitutions:**

**`<title>`:** `Mortgage Protection Insurance — Engel Financial Group`

**`<meta name="description">`:** `Mortgage protection insurance pays off your home loan if you pass away — keeping your family in their home no matter what happens to you.`

**Hero `section-label`:** `Mortgage Protection`

**Hero `h1`:** `Keep Your Family in Their Home,<br /><em>No Matter What.</em>`

**Hero `p`:** `Mortgage protection insurance ensures your home loan is paid off if you pass away unexpectedly — so your family never faces the impossible choice between grieving and paying the mortgage.`

**What Is It `h2`:** `Your Mortgage Disappears. Your Family Stays Home.`

**What Is It paragraphs:**
- Para 1: `Mortgage protection insurance is a life insurance policy designed specifically to pay off your outstanding mortgage balance if you die. Your family receives the home, free and clear, without the burden of monthly payments during one of the hardest times of their lives.`
- Para 2: `Unlike traditional life insurance where the benefit goes to your beneficiary to use as they choose, mortgage protection is structured to cover the exact amount of your outstanding loan — ensuring the most important financial obligation your family has is completely handled.`

**Fact chips:** `No Medical Exam Required` · `Coverage Matches Loan Balance` · `Quick Approval` · `Affordable Premiums`

**Who It's For cards:**
- Card 1: **"New Homeowners"** — `Families who just purchased a home and want to make sure their largest financial commitment is protected from day one.`
- Card 2: **"Sole Breadwinners"** — `Households where one income covers the mortgage payment — protecting that income means protecting the home.`
- Card 3: **"Parents of Young Children"** — `Parents who want to ensure their children grow up in a stable home environment regardless of what happens to mom or dad.`

**How It Works steps:**
- Step 1: **"Share Your Mortgage Details"** — `Tell us your loan amount, remaining term, and basic health information. No exam is often required for qualifying applicants.`
- Step 2: **"Get Matched to a Policy"** — `We match you with a policy that aligns with your mortgage balance and term — coverage that decreases in line with your remaining loan balance.`
- Step 3: **"Your Family is Protected"** — `If you pass away, the policy pays off the mortgage. Your family keeps the home, free and clear, with no monthly payments owed.`

**Benefits (6):**
1. **"No Medical Exam"** — `Most mortgage protection policies issue with just a health questionnaire — no blood draws or physical exams.`
2. **"Fast Approval"** — `Many clients receive coverage in 24–48 hours of applying, with same-day approvals available for qualifying applicants.`
3. **"Affordable Premiums"** — `Coverage is often surprisingly affordable — a small monthly premium ensures your family's biggest asset is fully protected.`
4. **"Return of Premium Option"** — `Some policies return all premiums paid if you outlive the policy term — you get your money back if you never make a claim.`
5. **"Flexible Terms"** — `Match your coverage term to your remaining mortgage length — 10, 15, 20, or 30 years.`
6. **"Living Benefits"** — `Many policies include riders for critical illness or disability — helping cover your mortgage if you can't work, not just if you pass away.`

**FAQ (4):**
- Q1: `Is mortgage protection the same as PMI?` — A: `No. PMI (Private Mortgage Insurance) protects the lender if you default on your loan. Mortgage protection insurance protects your family — it pays off the loan on their behalf if you pass away. They serve completely different purposes.`
- Q2: `Do I need mortgage protection if I already have life insurance?` — A: `Possibly not — if your existing life insurance is large enough to cover your mortgage balance and still support your family's other needs. Our agents will review your current coverage and help you determine if a gap exists.`
- Q3: `Does coverage decrease as I pay down the mortgage?` — A: `Many mortgage protection policies are "decreasing term" — the benefit decreases over time in line with your loan balance, keeping premiums low. Level term options are also available if you prefer consistent coverage.`
- Q4: `What if I refinance or sell my home?` — A: `Most mortgage protection policies are portable and don't expire if you refinance. If you sell, the policy can often be converted to standard life insurance or cancelled — our agents walk you through the options.`

**Bottom CTA h2:** `Your Family Deserves to Stay<br /><em>in Their Home</em>`

**Bottom CTA p:** `Mortgage protection takes one of your family's biggest financial stresses completely off the table. Get covered in as little as 24 hours — no exam, no pressure.`

**Form selected option:** `<option value="mortgage" selected>Mortgage Protection</option>`

- [ ] **Step 2: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/mortgage-protection.html mortgage-protection
```

- [ ] **Step 3: Commit**

```bash
git add mortgage-protection.html
git commit -m "feat: add mortgage-protection.html coverage page"
```

---

## Task 9: Build retirement-planning.html

**Files:**
- Create: `retirement-planning.html`

- [ ] **Step 1: Copy `life-insurance.html` to `retirement-planning.html` and apply these substitutions:**

**`<title>`:** `Retirement Planning — Tax-Free Income Strategy — Engel Financial Group`

**`<meta name="description">`:** `Build a tax-efficient retirement income strategy using life insurance. Combine IULs, annuities, and whole life to create income streams you'll never outlive.`

**Hero `section-label`:** `Retirement Planning`

**Hero `h1`:** `A Retirement That Pays You<br /><em>For the Rest of Your Life.</em>`

**Hero `p`:** `Most retirement plans rely entirely on accounts that are taxed on the way out. We help you build a diversified income strategy using life insurance tools that can generate tax-free income — and never run dry.`

**What Is It `h2`:** `Beyond the 401(k) — A Complete Retirement Income Plan`

**What Is It paragraphs:**
- Para 1: `A well-structured retirement plan doesn't rely on a single account type. We help clients layer multiple income sources — Social Security, qualified accounts (401k/IRA), and tax-free life insurance vehicles — to minimize taxes and maximize lifetime income.`
- Para 2: `Using IULs for tax-free growth, annuities for guaranteed income, and whole life for estate preservation, we build a plan that covers every phase of your retirement — from your first day without a paycheck to the legacy you leave behind.`

**Fact chips:** `Tax-Free Income Streams` · `Guaranteed Income Options` · `Market-Linked Growth` · `No Contribution Limits`

**Who It's For cards:**
- Card 1: **"Ages 40–55"** — `Professionals in peak earning years who want to maximize savings in tax-advantaged vehicles beyond what their 401(k) allows.`
- Card 2: **"Pre-Retirees"** — `Individuals 5–10 years from retirement looking to convert accumulated savings into a structured income plan that minimizes tax drag.`
- Card 3: **"Business Owners"** — `Entrepreneurs without an employer-sponsored retirement plan who need to build retirement income independently with maximum flexibility.`

**How It Works steps:**
- Step 1: **"Map Your Income Needs"** — `We analyze your expected Social Security, existing accounts, and retirement lifestyle goals to identify exactly how much income you need — and where it will come from.`
- Step 2: **"Design Your Strategy"** — `We recommend the right combination of IUL, annuity, and whole life products to fill income gaps, minimize taxes, and protect your principal.`
- Step 3: **"Execute &amp; Optimize"** — `You get a clear, implementable plan. We stay with you over time, adjusting as your life and tax situation evolves.`

**Benefits (6):**
1. **"Tax-Free Retirement Income"** — `Life insurance tools can provide income that's completely free of federal income tax — unlike 401(k) withdrawals.`
2. **"No RMDs"** — `IUL and whole life cash value are not subject to required minimum distributions — you access funds on your schedule.`
3. **"No Contribution Caps"** — `Unlike qualified plans, life insurance vehicles have no IRS-imposed annual contribution limits.`
4. **"Guaranteed Income Option"** — `Annuities within the plan guarantee a minimum income regardless of how long you live or what markets do.`
5. **"Market-Linked Growth"** — `IUL components participate in market index gains with a 0% floor — growth without catastrophic risk.`
6. **"Legacy Protection"** — `The life insurance component ensures any unused funds pass to heirs tax-free as a death benefit.`

**FAQ (4):**
- Q1: `Can I use life insurance as part of my retirement plan if I already have a 401(k)?` — A: `Absolutely — and this is exactly the approach many high-income earners take. Life insurance retirement vehicles complement 401(k)s by providing tax-free income in retirement, which can reduce your overall tax burden when combined with taxable 401(k) withdrawals.`
- Q2: `How much should I put toward life insurance vs. my 401(k)?` — A: `The right mix depends on your income, tax bracket, employer match, and retirement goals. As a general principle, always capture the full employer 401(k) match first, then explore supplemental tax-free vehicles. Our agents run the numbers for your specific situation.`
- Q3: `What if I need to access the money before retirement?` — A: `Cash value in IUL and whole life policies can be accessed at any time through policy loans, without tax penalties — a significant advantage over 401(k)s and IRAs which impose penalties for early withdrawals.`
- Q4: `Is this strategy only for wealthy clients?` — A: `Not at all. Many clients start with modest premiums and scale up over time. The key is starting early — the longer the compounding period, the more powerful the outcome. Our agents design plans that fit all budget levels.`

**Bottom CTA h2:** `Your Best Retirement Years Are<br /><em>Still Ahead of You</em>`

**Bottom CTA p:** `A well-structured retirement income plan doesn't happen by accident. Let a licensed agent show you what a tax-efficient strategy could look like for your specific situation.`

**Form selected option:** `<option value="retirement" selected>Retirement Planning</option>`

- [ ] **Step 2: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/retirement-planning.html retirement
```

- [ ] **Step 3: Commit**

```bash
git add retirement-planning.html
git commit -m "feat: add retirement-planning.html coverage page"
```

---

## Task 10: Build advanced-markets.html

**Files:**
- Create: `advanced-markets.html`

- [ ] **Step 1: Copy `life-insurance.html` to `advanced-markets.html` and apply these substitutions:**

**`<title>`:** `Advanced Markets — Business Insurance Solutions — Engel Financial Group`

**`<meta name="description">`:** `Sophisticated life insurance strategies for business owners — key person coverage, buy-sell agreements, executive benefits, and deferred compensation plans.`

**Hero `section-label`:** `Advanced Markets`

**Hero `h1`:** `Sophisticated Coverage for the<br /><em>Business You've Built.</em>`

**Hero `p`:** `Advanced market strategies use life insurance to solve complex business problems — protecting key employees, funding ownership transitions, retaining top talent, and creating tax-efficient executive compensation packages.`

**What Is It `h2`:** `Life Insurance as a Business Strategy`

**What Is It paragraphs:**
- Para 1: `Advanced market solutions apply life insurance in business contexts where the stakes are highest. Whether you're a small business owner who is the single most important person in the company, a partnership that needs a transition plan, or a corporation looking to retain C-suite talent — there's a life insurance structure designed for your situation.`
- Para 2: `These strategies go well beyond simple coverage — they create tax-advantaged assets on the company balance sheet, fund legally binding buy-sell agreements, and attract executives with benefit packages that public-market competitors can offer. Our agents specialize in identifying which structure delivers the most value for your specific business.`

**Fact chips:** `Key Person Protection` · `Buy-Sell Funding` · `Executive Benefits` · `Balance Sheet Assets`

**Who It's For cards:**
- Card 1: **"Small Business Owners"** — `Owners whose business depends heavily on one or two key people, and who need a financial safety net if that person is suddenly gone.`
- Card 2: **"Business Partners"** — `Partners in a business who need a funded buy-sell agreement to ensure a smooth, financially sound ownership transition if one partner dies.`
- Card 3: **"Corporations"** — `Companies looking to attract and retain senior executives using non-qualified deferred compensation or executive bonus plans funded by life insurance.`

**How It Works steps:**
- Step 1: **"Understand Your Exposure"** — `We identify your key business risks — key person dependency, ownership transition gaps, or executive retention challenges — and quantify the financial exposure.`
- Step 2: **"Design the Structure"** — `We design a life insurance strategy matched to your specific situation — whether that's key person coverage, a cross-purchase buy-sell, or a Section 162 executive bonus plan.`
- Step 3: **"Implement &amp; Document"** — `We coordinate with your attorney and accountant to ensure the insurance structure integrates properly with your legal agreements and tax strategy.`

**Benefits (6):**
1. **"Key Person Protection"** — `Receive a lump-sum payment if a critical employee or owner dies — covering lost revenue and recruitment costs.`
2. **"Buy-Sell Funding"** — `Pre-fund the purchase of a deceased partner's ownership stake, preventing disputes and ensuring business continuity.`
3. **"Executive Retention"** — `Create exclusive benefit packages that reward and retain your best people in ways standard benefits can't match.`
4. **"Balance Sheet Strength"** — `Permanent life insurance cash value appears as an asset on the company balance sheet, improving financial position.`
5. **"Tax Efficiency"** — `Many advanced market structures provide tax deductions on premiums or tax-free access to policy benefits.`
6. **"Succession Planning"** — `Ensure the business you've built transfers smoothly to the right people — on your terms, not circumstance's.`

**FAQ (4):**
- Q1: `What is key person insurance and do I need it?` — A: `Key person insurance is a life insurance policy owned by the business on a critical employee or owner. If that person dies, the business receives the death benefit — funds used to cover revenue disruption, recruit a replacement, or satisfy lenders. If your business would be seriously harmed by the loss of one person, you likely need it.`
- Q2: `How does a buy-sell agreement work with life insurance?` — A: `A buy-sell agreement is a legal contract that dictates what happens to a partner's ownership stake when they die. Life insurance funds the agreement — each partner is insured for their ownership value, and the death benefit gives the surviving partners the cash to purchase the deceased partner's share. Without funding, buy-sell agreements are just paper.`
- Q3: `What is a Section 162 executive bonus plan?` — A: `A Section 162 plan allows a business to pay life insurance premiums on behalf of a key employee as a bonus. The premium is deductible to the business and taxable income to the employee — but the employee owns a permanent policy with growing cash value. It's a powerful retention tool for executives.`
- Q4: `Do I need a large company to benefit from advanced market strategies?` — A: `No. Some of the most impactful advanced market strategies — like key person coverage and simple buy-sell agreements — are designed specifically for small and mid-sized businesses. The strategies scale to your company size and budget.`

**Bottom CTA h2:** `Protect the Business You've<br /><em>Worked Your Life to Build</em>`

**Bottom CTA p:** `Advanced market solutions require a licensed agent who understands both life insurance and business. Let's have a conversation about what your business specifically needs.`

**Form selected option:** `<option value="advanced" selected>Advanced Markets / Business</option>`

- [ ] **Step 2: Screenshot and verify**

```bash
node screenshot.mjs http://localhost:3000/advanced-markets.html advanced-markets
```

- [ ] **Step 3: Commit**

```bash
git add advanced-markets.html
git commit -m "feat: add advanced-markets.html coverage page"
```

---

## Task 11: Cross-Page QA & Final Commit

**Files:** all HTML files

- [ ] **Step 1: Screenshot every page**

```bash
node screenshot.mjs http://localhost:3000 homepage
node screenshot.mjs http://localhost:3000/life-insurance.html li
node screenshot.mjs http://localhost:3000/whole-life-insurance.html wl
node screenshot.mjs http://localhost:3000/iuls.html iuls
node screenshot.mjs http://localhost:3000/annuities.html ann
node screenshot.mjs http://localhost:3000/mortgage-protection.html mp
node screenshot.mjs http://localhost:3000/retirement-planning.html ret
node screenshot.mjs http://localhost:3000/advanced-markets.html am
node screenshot.mjs http://localhost:3000/thank-you.html ty
```

- [ ] **Step 2: Read each screenshot** and verify the following on every page:
  - Nav shows "Coverage" text — hovering reveals 7-link dropdown
  - Burger icon visible (right side of nav)
  - Footer shows 7 coverage links under "Coverage" column
  - Footer brand, Company, and Legal columns present
  - All internal links resolve (no `#` placeholders except company/legal pages which are Phase 1 Section 2)
  - Form shows correct pre-selected coverage type for the page
  - Colors match brand: navy `#111d2b`, gold `#b87333`, warm white `#fbf3da`

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Phase 1 coverage pages — 7 pages, shared nav/footer, styles.css"
```
