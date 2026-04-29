# Legal Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build four branded, Meta-compliant legal pages (Privacy Policy, Terms of Service, Licensing, TCPA Compliance), update the TCPA consent language on contact.html, and wire up footer links on all 14 existing pages.

**Architecture:** Each legal page is a standalone HTML file using the shared site design system (styles.css, Cormorant Garamond + Jost, navy/gold palette). Page-specific styles go in an inline `<style>` block in `<head>`. Nav and footer are copied verbatim from `about.html`. No new CSS classes are added to styles.css.

**Tech Stack:** Vanilla HTML/CSS, Tailwind CDN not used (site uses custom styles.css), Google Fonts (Cormorant Garamond + Jost), Node.js serve.mjs for local preview, Puppeteer screenshot.mjs for verification.

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `privacy-policy.html` | Privacy + Meta Pixel + GLBA + CCPA disclosures |
| Create | `terms-of-service.html` | Site use terms, not-advice disclaimer, governing law |
| Create | `licensing.html` | NPN + 15-state license table |
| Create | `tcpa-compliance.html` | TCPA consent standards + opt-out rights |
| Modify | `contact.html` | Replace non-compliant form disclaimer |
| Modify | `index.html`, `thank-you.html`, `life-insurance.html`, `whole-life-insurance.html`, `iuls.html`, `annuities.html`, `mortgage-protection.html`, `retirement-planning.html`, `advanced-markets.html`, `about.html`, `about-andrew.html`, `how-it-works.html`, `carriers.html`, `contact.html` | Update footer legal links from `#` to real URLs |

---

## Shared HTML Fragments (reference throughout tasks)

### Nav block
Copy the complete `<nav>...</nav>` block from `about.html` lines 34–119 verbatim. All legal pages are company-type pages — nav CTA must be `href="/contact.html"` (not `#get-quote`).

### Footer block
Copy the complete `<footer>...</footer>` block from `about.html` lines 238–287 verbatim, **but with updated legal links:**
```html
<li><a href="/privacy-policy.html">Privacy Policy</a></li>
<li><a href="/terms-of-service.html">Terms of Service</a></li>
<li><a href="/licensing.html">Licensing</a></li>
<li><a href="/tcpa-compliance.html">TCPA Compliance</a></li>
```

### Script block
Copy the complete `<script>...</script>` block from `about.html` lines 289–308 verbatim (toggleMobileMenu, toggleMobileCoverage, toggleMobileCompany, IntersectionObserver for `.fade-up`).

### Shared page-specific styles (all 4 legal pages)
```html
<style>
  .legal-content { background: var(--warm-white); padding: 80px 32px 100px; }
  .legal-inner { max-width: 720px; margin: 0 auto; }
  .legal-meta { font-family: 'Jost', sans-serif; font-size: 13px; color: var(--text-soft); margin-bottom: 48px; }
  .legal-section { margin-bottom: 56px; }
  .legal-section h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(22px, 3vw, 30px); font-weight: 600; color: var(--text-dark); margin-bottom: 16px; letter-spacing: -0.02em; }
  .legal-section h3 { font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 600; color: var(--text-dark); text-transform: uppercase; letter-spacing: 0.08em; margin: 28px 0 10px; }
  .legal-section p { font-family: 'Jost', sans-serif; font-size: 15px; color: var(--text-mid); line-height: 1.8; margin-bottom: 14px; }
  .legal-section ul { list-style: none; padding: 0; margin: 0 0 16px; }
  .legal-section ul li { font-family: 'Jost', sans-serif; font-size: 15px; color: var(--text-mid); line-height: 1.8; padding-left: 20px; position: relative; margin-bottom: 8px; }
  .legal-section ul li::before { content: '—'; position: absolute; left: 0; color: var(--gold); }
  .legal-section a { color: var(--gold); text-decoration: underline; text-underline-offset: 3px; }
  .legal-section a:hover { color: var(--gold-light); }
  .legal-divider { border: none; border-top: 1px solid rgba(17,29,43,.1); margin: 0 0 56px; }
</style>
```

---

## Task 1: Update contact.html TCPA Disclaimer

**Files:**
- Modify: `contact.html`

- [ ] **Step 1: Open contact.html and locate the form disclaimer**

  Read `contact.html`. Find the line:
  ```html
  <p class="form-disclaimer">By submitting, you agree to be contacted by a licensed agent. Your information is 100% private and never sold to third parties.</p>
  ```

- [ ] **Step 2: Replace with TCPA-compliant language**

  Replace the line found in Step 1 with:
  ```html
  <p class="form-disclaimer">By submitting this form, you consent to be contacted by Engel Financial Group and its licensed representatives by phone call, SMS/text message, and email regarding insurance products and services. Message and data rates may apply. Consent is not a condition of purchase.</p>
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add contact.html
  git commit -m "fix: update contact form TCPA disclaimer to compliant language"
  ```

---

## Task 2: Create privacy-policy.html

**Files:**
- Create: `privacy-policy.html`

- [ ] **Step 1: Create the file with complete HTML**

  Create `privacy-policy.html` in the project root with the following complete content.
  The `<nav>`, `<footer>`, and `<script>` blocks come from `about.html` (see "Shared HTML Fragments" above).

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Privacy Policy — Engel Financial Group</title>
    <meta name="description" content="Engel Financial Group's privacy policy — how we collect, use, and protect your personal information, including Meta Pixel disclosures and your rights." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
    <style>
      .legal-content { background: var(--warm-white); padding: 80px 32px 100px; }
      .legal-inner { max-width: 720px; margin: 0 auto; }
      .legal-meta { font-family: 'Jost', sans-serif; font-size: 13px; color: var(--text-soft); margin-bottom: 48px; }
      .legal-section { margin-bottom: 56px; }
      .legal-section h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(22px, 3vw, 30px); font-weight: 600; color: var(--text-dark); margin-bottom: 16px; letter-spacing: -0.02em; }
      .legal-section h3 { font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 600; color: var(--text-dark); text-transform: uppercase; letter-spacing: 0.08em; margin: 28px 0 10px; }
      .legal-section p { font-family: 'Jost', sans-serif; font-size: 15px; color: var(--text-mid); line-height: 1.8; margin-bottom: 14px; }
      .legal-section ul { list-style: none; padding: 0; margin: 0 0 16px; }
      .legal-section ul li { font-family: 'Jost', sans-serif; font-size: 15px; color: var(--text-mid); line-height: 1.8; padding-left: 20px; position: relative; margin-bottom: 8px; }
      .legal-section ul li::before { content: '—'; position: absolute; left: 0; color: var(--gold); }
      .legal-section a { color: var(--gold); text-decoration: underline; text-underline-offset: 3px; }
      .legal-section a:hover { color: var(--gold-light); }
      .legal-divider { border: none; border-top: 1px solid rgba(17,29,43,.1); margin: 0 0 56px; }
      .pixel-callout { background: var(--navy-mid); border-left: 3px solid var(--gold); border-radius: 0 4px 4px 0; padding: 24px 28px; margin: 20px 0 28px; }
      .pixel-callout p { font-family: 'Jost', sans-serif; color: rgba(255,255,255,.8); font-size: 14px; line-height: 1.7; margin: 0; }
      .pixel-callout a { color: var(--gold); }
    </style>
  </head>
  <body>

  <!-- COPY <nav>...</nav> FROM about.html VERBATIM -->

  <section class="page-hero">
    <div class="page-hero-inner">
      <span class="section-label">Legal</span>
      <h1>Privacy Policy</h1>
      <p>How we collect, use, and protect your personal information.</p>
    </div>
  </section>

  <section class="legal-content">
    <div class="legal-inner">
      <p class="legal-meta">Effective Date: April 28, 2026 &nbsp;·&nbsp; Last Updated: April 28, 2026</p>

      <div class="legal-section fade-up">
        <h2>1. Introduction</h2>
        <p>Engel Financial Group ("we," "our," or "us") is an independent life insurance brokerage subject to applicable state and federal financial services regulations, including the Gramm-Leach-Bliley Act (GLBA). This Privacy Policy explains how we collect, use, share, and protect personal information when you visit engelfinancialgroup.com or submit an inquiry through our contact forms.</p>
        <p>By using this website, you agree to the practices described in this policy. If you do not agree, please do not use this site.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>2. Information We Collect</h2>
        <h3>Information You Provide</h3>
        <ul>
          <li>First and last name</li>
          <li>Phone number</li>
          <li>Email address</li>
          <li>Coverage type of interest</li>
          <li>Any message or notes you submit via our contact form</li>
        </ul>
        <h3>Information Collected Automatically</h3>
        <ul>
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Pages visited and time spent on each page</li>
          <li>Referring URL (how you arrived at our site)</li>
          <li>Timestamps of form submissions and site interactions</li>
          <li>Device type (desktop, mobile, tablet)</li>
        </ul>
        <h3>Cookies & Tracking Technologies</h3>
        <p>We use cookies and similar technologies to improve site functionality and measure advertising performance. This includes first-party session cookies and the Meta Pixel (see Section 4).</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To respond to your insurance inquiries and deliver quote information</li>
          <li>To connect you with licensed insurance carriers appropriate to your coverage needs</li>
          <li>To improve the performance and usability of our website</li>
          <li>To run and optimize advertising campaigns on Meta (Facebook/Instagram) and other platforms</li>
          <li>To comply with legal and regulatory obligations under GLBA, TCPA, and applicable state law</li>
          <li>To maintain consent records as required by the Telephone Consumer Protection Act</li>
        </ul>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>4. Meta Pixel &amp; Tracking Technologies</h2>
        <p>This website uses the <strong>Meta Pixel</strong> (also known as the Facebook Pixel), a tracking tool provided by Meta Platforms, Inc. The Pixel allows us to measure the effectiveness of our advertising, build custom audiences for retargeting, and track conversions from our Meta ad campaigns on Facebook and Instagram.</p>
        <div class="pixel-callout">
          <p><strong style="color:#fff;">Data the Meta Pixel may collect:</strong> page views, button clicks, form interactions, IP address, browser fingerprint, and behavioral data about your visit to this site. This data is transmitted to Meta Platforms, Inc., 1 Hacker Way, Menlo Park, CA 94025, USA.</p>
        </div>
        <h3>Your Opt-Out Options</h3>
        <ul>
          <li>Manage your Meta ad preferences: <a href="https://www.facebook.com/ads/preferences" target="_blank" rel="noopener">facebook.com/ads/preferences</a></li>
          <li>Review Meta's data policy: <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener">facebook.com/privacy/policy</a></li>
          <li>Use your browser's privacy settings or an extension such as uBlock Origin to block tracking pixels</li>
          <li>Opt out of interest-based advertising at <a href="https://optout.aboutads.info" target="_blank" rel="noopener">optout.aboutads.info</a></li>
        </ul>
        <p>Meta's use of data collected via the Pixel is governed by <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener">Meta's Data Policy</a>, which is independent of this Privacy Policy.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>5. How We Share Your Information</h2>
        <p><strong>We do not sell, rent, or trade your personal information to third parties.</strong></p>
        <p>We may share your information in the following limited circumstances:</p>
        <ul>
          <li><strong>Licensed insurance carriers</strong> — solely to fulfill your request for a quote or policy information</li>
          <li><strong>Meta Platforms, Inc.</strong> — via the Meta Pixel as described in Section 4</li>
          <li><strong>Service providers</strong> — vendors who assist with website operations, under confidentiality agreements prohibiting secondary use of your data</li>
          <li><strong>Legal requirements</strong> — if required by law, court order, or regulatory request from a government authority</li>
        </ul>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>6. GLBA Privacy Notice</h2>
        <p>As a financial services entity subject to the Gramm-Leach-Bliley Act, we are required to notify you about our information-sharing practices. We collect nonpublic personal information as described in Section 2. We do not share your nonpublic personal information with unaffiliated third parties for their own marketing purposes. For questions about our GLBA compliance, contact us at <a href="mailto:privacy@engelfinancialgroup.com">privacy@engelfinancialgroup.com</a>.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>7. Your Privacy Rights</h2>
        <p>Depending on your state of residence, you may have the following rights:</p>
        <ul>
          <li><strong>Right to know</strong> — request a summary of the personal information we hold about you</li>
          <li><strong>Right to deletion</strong> — request that we delete your information (subject to legal retention requirements)</li>
          <li><strong>Right to correction</strong> — request correction of inaccurate data we hold about you</li>
          <li><strong>Right to opt out</strong> — opt out of certain data sharing or targeted advertising practices</li>
        </ul>
        <p><strong>California residents</strong> have additional rights under the California Consumer Privacy Act (CCPA/CPRA), including the right to know about personal information disclosed for business purposes. Although Engel Financial Group is not licensed to sell insurance in California, California residents may visit this site and are entitled to these protections.</p>
        <p>To exercise any of these rights, email <a href="mailto:privacy@engelfinancialgroup.com">privacy@engelfinancialgroup.com</a>. We will respond within 45 days of receiving your request.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>8. Do Not Sell / Do Not Share</h2>
        <p>We do not sell or rent your personal information to any third party for their marketing purposes. This applies to all visitors regardless of state of residence.</p>
        <p>To limit data transmission to Meta via the Pixel, use Meta Ad Preferences at <a href="https://www.facebook.com/ads/preferences" target="_blank" rel="noopener">facebook.com/ads/preferences</a> or adjust your browser privacy settings.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>9. Data Retention</h2>
        <ul>
          <li><strong>Form submissions</strong> — retained for 3 years for follow-up and compliance purposes</li>
          <li><strong>TCPA consent records</strong> — retained for a minimum of 2 years; each record includes the disclosure language shown, timestamp (to the second), IP address, and source URL</li>
          <li><strong>Deletion requests</strong> — submitted to <a href="mailto:privacy@engelfinancialgroup.com">privacy@engelfinancialgroup.com</a>; processed within 45 days, subject to any legal retention obligations</li>
        </ul>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>10. Security</h2>
        <p>We implement industry-standard technical and organizational safeguards to protect your personal information, including HTTPS encryption for all data transmitted to and from this site, and access controls limiting staff access to personal data. No method of internet transmission is 100% secure; we cannot guarantee absolute security but commit to reasonable protective measures.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>11. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Material changes will be reflected in an updated effective date at the top of this page. Continued use of this website following any changes constitutes your acceptance of the revised policy. We encourage you to review this page periodically.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>12. Contact</h2>
        <p>For privacy inquiries, data access or deletion requests, or GLBA-related questions:</p>
        <ul>
          <li>Email: <a href="mailto:privacy@engelfinancialgroup.com">privacy@engelfinancialgroup.com</a></li>
          <li>Engel Financial Group — Independent Life Insurance Broker</li>
        </ul>
      </div>

    </div>
  </section>

  <!-- COPY <footer>...</footer> FROM about.html, WITH UPDATED LEGAL LINKS -->
  <!-- COPY <script>...</script> FROM about.html VERBATIM -->

  </body>
  </html>
  ```

- [ ] **Step 2: Verify the file was created**

  ```bash
  ls privacy-policy.html
  ```
  Expected: file listed with a non-zero size.

- [ ] **Step 3: Commit**

  ```bash
  git add privacy-policy.html
  git commit -m "feat: add privacy-policy.html — Meta Pixel, GLBA, CCPA disclosures"
  ```

---

## Task 3: Create terms-of-service.html

**Files:**
- Create: `terms-of-service.html`

- [ ] **Step 1: Create the file with complete HTML**

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Terms of Service — Engel Financial Group</title>
    <meta name="description" content="Terms of service for engelfinancialgroup.com — permitted use, not-financial-advice disclaimer, intellectual property, and governing law." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
    <style>
      .legal-content { background: var(--warm-white); padding: 80px 32px 100px; }
      .legal-inner { max-width: 720px; margin: 0 auto; }
      .legal-meta { font-family: 'Jost', sans-serif; font-size: 13px; color: var(--text-soft); margin-bottom: 48px; }
      .legal-section { margin-bottom: 56px; }
      .legal-section h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(22px, 3vw, 30px); font-weight: 600; color: var(--text-dark); margin-bottom: 16px; letter-spacing: -0.02em; }
      .legal-section h3 { font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 600; color: var(--text-dark); text-transform: uppercase; letter-spacing: 0.08em; margin: 28px 0 10px; }
      .legal-section p { font-family: 'Jost', sans-serif; font-size: 15px; color: var(--text-mid); line-height: 1.8; margin-bottom: 14px; }
      .legal-section ul { list-style: none; padding: 0; margin: 0 0 16px; }
      .legal-section ul li { font-family: 'Jost', sans-serif; font-size: 15px; color: var(--text-mid); line-height: 1.8; padding-left: 20px; position: relative; margin-bottom: 8px; }
      .legal-section ul li::before { content: '—'; position: absolute; left: 0; color: var(--gold); }
      .legal-section a { color: var(--gold); text-decoration: underline; text-underline-offset: 3px; }
      .legal-section a:hover { color: var(--gold-light); }
      .legal-divider { border: none; border-top: 1px solid rgba(17,29,43,.1); margin: 0 0 56px; }
      .disclaimer-box { background: var(--off-white); border: 1px solid rgba(184,115,51,.3); border-radius: 4px; padding: 24px 28px; margin: 8px 0 24px; }
      .disclaimer-box p { font-family: 'Jost', sans-serif; font-size: 14px; color: var(--text-dark); line-height: 1.75; margin: 0; }
    </style>
  </head>
  <body>

  <!-- COPY <nav>...</nav> FROM about.html VERBATIM -->

  <section class="page-hero">
    <div class="page-hero-inner">
      <span class="section-label">Legal</span>
      <h1>Terms of Service</h1>
      <p>Please read these terms carefully before using this website.</p>
    </div>
  </section>

  <section class="legal-content">
    <div class="legal-inner">
      <p class="legal-meta">Effective Date: April 28, 2026 &nbsp;·&nbsp; Last Updated: April 28, 2026</p>

      <div class="legal-section fade-up">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using engelfinancialgroup.com (the "Site"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use this Site. You must be at least 18 years of age to use this Site.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>2. Use of This Website</h2>
        <h3>Permitted Use</h3>
        <ul>
          <li>Browse and read informational content about insurance products and services</li>
          <li>Submit inquiries through our contact form to request a quote or consultation</li>
          <li>Access resources and educational content provided on the Site</li>
        </ul>
        <h3>Prohibited Use</h3>
        <ul>
          <li>Scraping, harvesting, or automated data collection from the Site</li>
          <li>Reverse engineering or attempting to extract source code</li>
          <li>Using the Site for any unlawful purpose or in violation of any applicable law</li>
          <li>Misrepresenting your identity or affiliation when submitting inquiries</li>
          <li>Interfering with or disrupting the Site's functionality or servers</li>
        </ul>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>3. Not Financial or Legal Advice</h2>
        <div class="disclaimer-box">
          <p>All content on this Site is provided for <strong>informational purposes only</strong> and does not constitute financial advice, legal advice, or a binding insurance offer or contract. Insurance products, eligibility, coverage terms, and pricing vary by state, carrier, and individual circumstances. Nothing on this Site should be relied upon as a substitute for advice from a licensed insurance professional regarding your specific situation.</p>
        </div>
        <p>Engel Financial Group is a licensed independent insurance broker. Submitting an inquiry through this Site does not create an insurance policy, guarantee coverage, or establish an agent-client relationship until a formal agreement is signed.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>4. Intellectual Property</h2>
        <p>All content on this Site — including text, graphics, logos, images, page design, and code — is the property of Engel Financial Group and is protected by applicable copyright and intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any Site content without prior written permission from Engel Financial Group.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>5. Third-Party Links</h2>
        <p>This Site may contain links to insurance carrier websites, industry resources, and other external sites provided for your convenience. Engel Financial Group does not control and is not responsible for the content, privacy practices, or accuracy of any third-party website. The inclusion of a link does not constitute an endorsement of the linked site or its content.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>6. Limitation of Liability</h2>
        <p>This Site is provided "as is" without warranties of any kind, express or implied. Engel Financial Group does not warrant that the information on this Site is accurate, complete, or current. To the fullest extent permitted by applicable law, Engel Financial Group shall not be liable for any decisions made or actions taken in reliance on information found on this Site.</p>
        <p>In no event shall Engel Financial Group's total liability to you for any claim arising from your use of this Site exceed one hundred dollars ($100).</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>7. Governing Law</h2>
        <p>These Terms of Service shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law principles. Any disputes arising from or relating to these Terms or your use of this Site shall be resolved in a court of competent jurisdiction located in the State of Florida.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>8. Changes to These Terms</h2>
        <p>Engel Financial Group reserves the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the Site with an updated effective date. Your continued use of the Site after any changes constitutes your acceptance of the revised Terms.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>9. Contact</h2>
        <p>For questions about these Terms of Service:</p>
        <ul>
          <li>Email: <a href="mailto:privacy@engelfinancialgroup.com">privacy@engelfinancialgroup.com</a></li>
          <li>Engel Financial Group — Independent Life Insurance Broker</li>
        </ul>
      </div>

    </div>
  </section>

  <!-- COPY <footer>...</footer> FROM about.html, WITH UPDATED LEGAL LINKS -->
  <!-- COPY <script>...</script> FROM about.html VERBATIM -->

  </body>
  </html>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add terms-of-service.html
  git commit -m "feat: add terms-of-service.html — use terms, not-advice disclaimer, FL governing law"
  ```

---

## Task 4: Create licensing.html

**Files:**
- Create: `licensing.html`

- [ ] **Step 1: Create the file with complete HTML**

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Licensing &amp; Credentials — Engel Financial Group</title>
    <meta name="description" content="Andrew Engel's insurance licensing credentials — NPN 21546368, licensed in 15 states for life and health insurance." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
    <style>
      .legal-content { background: var(--warm-white); padding: 80px 32px 100px; }
      .legal-inner { max-width: 720px; margin: 0 auto; }
      .legal-section { margin-bottom: 56px; }
      .legal-section h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(22px, 3vw, 30px); font-weight: 600; color: var(--text-dark); margin-bottom: 16px; letter-spacing: -0.02em; }
      .legal-section p { font-family: 'Jost', sans-serif; font-size: 15px; color: var(--text-mid); line-height: 1.8; margin-bottom: 14px; }
      .legal-section a { color: var(--gold); text-decoration: underline; text-underline-offset: 3px; }
      .legal-section a:hover { color: var(--gold-light); }
      .legal-divider { border: none; border-top: 1px solid rgba(17,29,43,.1); margin: 0 0 56px; }
      /* NPN callout */
      .npn-callout { background: var(--navy); border: 1px solid rgba(184,115,51,.5); border-radius: 4px; padding: 36px 40px; margin-bottom: 56px; display: flex; align-items: center; justify-content: space-between; gap: 32px; }
      .npn-callout-left {}
      .npn-callout-label { font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .12em; color: var(--gold); margin-bottom: 8px; }
      .npn-callout-number { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 6vw, 56px); font-weight: 700; color: #fff; letter-spacing: -0.02em; line-height: 1; }
      .npn-callout-sub { font-family: 'Jost', sans-serif; font-size: 13px; color: rgba(255,255,255,.5); margin-top: 8px; }
      .npn-callout-verify { font-family: 'Jost', sans-serif; font-size: 13px; }
      .npn-callout-verify a { color: var(--gold); text-decoration: underline; text-underline-offset: 3px; white-space: nowrap; }
      @media(max-width:560px) { .npn-callout { flex-direction: column; align-items: flex-start; padding: 28px 24px; gap: 20px; } }
      /* License table */
      .license-table-wrap { overflow-x: auto; margin-bottom: 16px; border-radius: 4px; border: 1px solid rgba(17,29,43,.1); }
      .license-table { width: 100%; border-collapse: collapse; font-family: 'Jost', sans-serif; font-size: 14px; }
      .license-table thead th { background: var(--navy); color: rgba(255,255,255,.85); font-weight: 500; letter-spacing: .06em; text-transform: uppercase; font-size: 11px; padding: 14px 20px; text-align: left; }
      .license-table tbody tr { border-bottom: 1px solid rgba(17,29,43,.07); transition: background 0.15s ease; }
      .license-table tbody tr:last-child { border-bottom: none; }
      .license-table tbody tr:hover { background: rgba(184,115,51,.05); }
      .license-table tbody td { padding: 13px 20px; color: var(--text-mid); }
      .license-table tbody td:first-child { font-weight: 500; color: var(--text-dark); }
      .license-table tbody td:nth-child(2) { font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: 0.02em; }
      .license-table tbody td:last-child { font-size: 13px; color: var(--text-soft); }
      .verify-note { font-family: 'Jost', sans-serif; font-size: 13px; color: var(--text-soft); line-height: 1.7; margin-top: 16px; }
      .verify-note a { color: var(--gold); text-decoration: underline; }
      /* Regulatory disclosure */
      .reg-disclosure { background: var(--off-white); border-radius: 4px; padding: 24px 28px; margin-top: 40px; }
      .reg-disclosure p { font-family: 'Jost', sans-serif; font-size: 13px; color: var(--text-soft); line-height: 1.75; margin: 0; }
    </style>
  </head>
  <body>

  <!-- COPY <nav>...</nav> FROM about.html VERBATIM -->

  <section class="page-hero">
    <div class="page-hero-inner">
      <span class="section-label">Legal</span>
      <h1>Licensing &amp;<br /><em>Credentials</em></h1>
      <p>Andrew Engel is a licensed insurance professional authorized to operate in 15 states.</p>
    </div>
  </section>

  <section class="legal-content">
    <div class="legal-inner">

      <!-- NPN CALLOUT -->
      <div class="npn-callout fade-up">
        <div class="npn-callout-left">
          <div class="npn-callout-label">National Producer Number</div>
          <div class="npn-callout-number">21546368</div>
          <div class="npn-callout-sub">Andrew Engel — Engel Financial Group</div>
        </div>
        <div class="npn-callout-verify">
          <a href="https://nipr.com/licensing-center/look-up-a-national-producer-number" target="_blank" rel="noopener">Verify on NIPR.com →</a>
        </div>
      </div>

      <div class="legal-section fade-up">
        <h2>State Licenses</h2>
        <div class="license-table-wrap">
          <table class="license-table">
            <thead>
              <tr>
                <th>State</th>
                <th>License Number</th>
                <th>License Type</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Arkansas</td><td>21546368</td><td>Life &amp; Health</td></tr>
              <tr><td>Florida</td><td>G229352</td><td>Life &amp; Health</td></tr>
              <tr><td>Iowa</td><td>21546368</td><td>Life &amp; Health</td></tr>
              <tr><td>Kansas</td><td>21546368</td><td>Life &amp; Health</td></tr>
              <tr><td>Michigan</td><td>21546368</td><td>Life &amp; Health</td></tr>
              <tr><td>Minnesota</td><td>41026954</td><td>Life &amp; Health</td></tr>
              <tr><td>Missouri</td><td>3003634043</td><td>Life &amp; Health</td></tr>
              <tr><td>Montana</td><td>3003925879</td><td>Life &amp; Health</td></tr>
              <tr><td>North Carolina</td><td>21546368</td><td>Life &amp; Health</td></tr>
              <tr><td>Ohio</td><td>1674575</td><td>Life &amp; Health</td></tr>
              <tr><td>Oklahoma</td><td>3003832512</td><td>Life &amp; Health</td></tr>
              <tr><td>South Carolina</td><td>21546368</td><td>Life &amp; Health</td></tr>
              <tr><td>Tennessee</td><td>3003632860</td><td>Life &amp; Health</td></tr>
              <tr><td>Texas</td><td>3339248</td><td>Life &amp; Health</td></tr>
              <tr><td>Virginia</td><td>1524630</td><td>Life &amp; Health</td></tr>
            </tbody>
          </table>
        </div>
        <p class="verify-note">You can verify any license by visiting your state's Department of Insurance website or by searching by NPN at <a href="https://nipr.com/licensing-center/look-up-a-national-producer-number" target="_blank" rel="noopener">NIPR.com</a>.</p>
      </div>

      <div class="reg-disclosure fade-up">
        <p>Engel Financial Group operates as an independent insurance agent and is not affiliated with or employed by any insurance carrier. Products and coverage options vary by state and individual circumstances. Not all products are available in all states. Insurance products are subject to underwriting approval and the terms and conditions of the issuing carrier.</p>
      </div>

    </div>
  </section>

  <!-- COPY <footer>...</footer> FROM about.html, WITH UPDATED LEGAL LINKS -->
  <!-- COPY <script>...</script> FROM about.html VERBATIM -->

  </body>
  </html>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add licensing.html
  git commit -m "feat: add licensing.html — NPN 21546368, 15-state license table"
  ```

---

## Task 5: Create tcpa-compliance.html

**Files:**
- Create: `tcpa-compliance.html`

- [ ] **Step 1: Create the file with complete HTML**

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TCPA Compliance — Engel Financial Group</title>
    <meta name="description" content="Engel Financial Group's TCPA compliance policy — consent standards, how we contact you, and your right to opt out at any time." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
    <style>
      .legal-content { background: var(--warm-white); padding: 80px 32px 100px; }
      .legal-inner { max-width: 720px; margin: 0 auto; }
      .legal-meta { font-family: 'Jost', sans-serif; font-size: 13px; color: var(--text-soft); margin-bottom: 48px; }
      .legal-section { margin-bottom: 56px; }
      .legal-section h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(22px, 3vw, 30px); font-weight: 600; color: var(--text-dark); margin-bottom: 16px; letter-spacing: -0.02em; }
      .legal-section h3 { font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 600; color: var(--text-dark); text-transform: uppercase; letter-spacing: 0.08em; margin: 28px 0 10px; }
      .legal-section p { font-family: 'Jost', sans-serif; font-size: 15px; color: var(--text-mid); line-height: 1.8; margin-bottom: 14px; }
      .legal-section ul { list-style: none; padding: 0; margin: 0 0 16px; }
      .legal-section ul li { font-family: 'Jost', sans-serif; font-size: 15px; color: var(--text-mid); line-height: 1.8; padding-left: 20px; position: relative; margin-bottom: 8px; }
      .legal-section ul li::before { content: '—'; position: absolute; left: 0; color: var(--gold); }
      .legal-section a { color: var(--gold); text-decoration: underline; text-underline-offset: 3px; }
      .legal-section a:hover { color: var(--gold-light); }
      .legal-divider { border: none; border-top: 1px solid rgba(17,29,43,.1); margin: 0 0 56px; }
      .consent-box { background: var(--navy-mid); border-left: 3px solid var(--gold); border-radius: 0 4px 4px 0; padding: 24px 28px; margin: 20px 0 28px; }
      .consent-box p { font-family: 'Jost', sans-serif; font-size: 15px; color: rgba(255,255,255,.85); line-height: 1.75; margin: 0; font-style: italic; }
      .opt-out-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
      .opt-out-card { background: var(--off-white); border-radius: 4px; padding: 20px 22px; }
      .opt-out-card-label { font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; color: var(--gold); margin-bottom: 6px; }
      .opt-out-card-text { font-family: 'Jost', sans-serif; font-size: 14px; color: var(--text-mid); line-height: 1.65; }
      @media(max-width:520px) { .opt-out-grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>

  <!-- COPY <nav>...</nav> FROM about.html VERBATIM -->

  <section class="page-hero">
    <div class="page-hero-inner">
      <span class="section-label">Legal</span>
      <h1>TCPA Compliance &amp;<br /><em>Communication Consent</em></h1>
      <p>Our standards for contacting you and your rights under the Telephone Consumer Protection Act.</p>
    </div>
  </section>

  <section class="legal-content">
    <div class="legal-inner">
      <p class="legal-meta">Effective Date: April 28, 2026 &nbsp;·&nbsp; Last Updated: April 28, 2026</p>

      <div class="legal-section fade-up">
        <h2>1. What Is the TCPA?</h2>
        <p>The Telephone Consumer Protection Act (47 U.S.C. § 227) is a federal law that governs how businesses may contact consumers by phone call, SMS/text message, and fax. The TCPA requires businesses to obtain prior express written consent before contacting consumers using an automatic telephone dialing system (autodialer) or a prerecorded voice message.</p>
        <p>Engel Financial Group is committed to full compliance with the TCPA and all applicable FCC regulations, including the 2025 consent revocation rules that took effect on April 11, 2025.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>2. Our Consent Standard</h2>
        <p>When you submit a form on this website, you will see the following disclosure directly above the submit button:</p>
        <div class="consent-box">
          <p>"By submitting this form, you consent to be contacted by Engel Financial Group and its licensed representatives by phone call, SMS/text message, and email regarding insurance products and services. Message and data rates may apply. Consent is not a condition of purchase."</p>
        </div>
        <p>Submitting the form constitutes your prior express written consent under the TCPA. Each consent record is logged with the following data:</p>
        <ul>
          <li>The exact disclosure language presented to you at the time of submission</li>
          <li>Timestamp of submission (recorded to the second)</li>
          <li>IP address of the submitting device</li>
          <li>Source URL (the specific page where the form was submitted)</li>
        </ul>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>3. How We Contact You</h2>
        <ul>
          <li><strong>Phone calls</strong> — made by a live licensed agent only; we do not use prerecorded or artificial voice messages without your separate prior consent</li>
          <li><strong>SMS/text messages</strong> — sent only to numbers provided via form submission; limited to messages related to your insurance inquiry</li>
          <li><strong>Email</strong> — used to deliver quote information and follow-up on your inquiry</li>
        </ul>
        <p>We contact you solely regarding insurance products and services relevant to your inquiry. We do not use your contact information for unrelated third-party marketing.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>4. Your Right to Opt Out</h2>
        <p>You may revoke consent and opt out of any or all communication methods at any time:</p>
        <div class="opt-out-grid">
          <div class="opt-out-card">
            <div class="opt-out-card-label">SMS / Text</div>
            <div class="opt-out-card-text">Reply <strong>STOP</strong> to any text message from us</div>
          </div>
          <div class="opt-out-card">
            <div class="opt-out-card-label">Email</div>
            <div class="opt-out-card-text">Click <strong>Unsubscribe</strong> in any email we send</div>
          </div>
          <div class="opt-out-card">
            <div class="opt-out-card-label">Phone</div>
            <div class="opt-out-card-text">Request removal verbally during any call</div>
          </div>
          <div class="opt-out-card">
            <div class="opt-out-card-label">All Methods</div>
            <div class="opt-out-card-text">Email <a href="mailto:privacy@engelfinancialgroup.com">privacy@engelfinancialgroup.com</a></div>
          </div>
        </div>
        <p>All opt-out requests are processed within <strong>10 business days</strong>, in accordance with FCC rules effective April 2025. Once your request is processed, you will not receive further communications through the requested channel(s).</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>5. Record Keeping</h2>
        <p>Engel Financial Group retains consent records for a minimum of 2 years from the date of collection. Each record includes the disclosure language shown, a precise timestamp, the IP address of the submitting device, and the source URL. These records are maintained to demonstrate compliance in the event of a regulatory inquiry or legal proceeding.</p>
      </div>
      <hr class="legal-divider" />

      <div class="legal-section fade-up">
        <h2>6. Contact for TCPA Concerns</h2>
        <p>If you have questions about our TCPA practices, believe you have received a communication in error, or wish to submit an opt-out request, please contact us:</p>
        <ul>
          <li>Email: <a href="mailto:privacy@engelfinancialgroup.com">privacy@engelfinancialgroup.com</a></li>
          <li>Engel Financial Group — Independent Life Insurance Broker</li>
        </ul>
        <p>We take TCPA compliance seriously and will address all concerns promptly.</p>
      </div>

    </div>
  </section>

  <!-- COPY <footer>...</footer> FROM about.html, WITH UPDATED LEGAL LINKS -->
  <!-- COPY <script>...</script> FROM about.html VERBATIM -->

  </body>
  </html>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add tcpa-compliance.html
  git commit -m "feat: add tcpa-compliance.html — consent standards, opt-out rights, record keeping"
  ```

---

## Task 6: Update Footer Legal Links on All 14 Existing Pages

**Files:**
- Modify: `index.html`, `thank-you.html`, `life-insurance.html`, `whole-life-insurance.html`, `iuls.html`, `annuities.html`, `mortgage-protection.html`, `retirement-planning.html`, `advanced-markets.html`, `about.html`, `about-andrew.html`, `how-it-works.html`, `carriers.html`, `contact.html`

- [ ] **Step 1: Run PowerShell to update all 14 files in one pass**

  Run this from the project root (`C:\Users\Gaming PC\Desktop\project_andrew`):

  ```powershell
  $files = @(
    "index.html","thank-you.html","life-insurance.html","whole-life-insurance.html",
    "iuls.html","annuities.html","mortgage-protection.html","retirement-planning.html",
    "advanced-markets.html","about.html","about-andrew.html","how-it-works.html",
    "carriers.html","contact.html"
  )
  foreach ($f in $files) {
    $c = Get-Content $f -Raw -Encoding UTF8
    $c = $c -replace 'href="#">Privacy Policy',   'href="/privacy-policy.html">Privacy Policy'
    $c = $c -replace 'href="#">Terms of Service', 'href="/terms-of-service.html">Terms of Service'
    $c = $c -replace 'href="#">Licensing',        'href="/licensing.html">Licensing'
    $c = $c -replace 'href="#">TCPA Compliance',  'href="/tcpa-compliance.html">TCPA Compliance'
    Set-Content $f $c -Encoding UTF8
  }
  ```

- [ ] **Step 2: Verify the replacement worked on a sample file**

  ```bash
  grep "privacy-policy.html" about.html
  ```
  Expected output: `<li><a href="/privacy-policy.html">Privacy Policy</a></li>`

- [ ] **Step 3: Verify all 4 links were updated (should show 14 matches per link)**

  ```bash
  grep -c "privacy-policy.html" index.html thank-you.html life-insurance.html whole-life-insurance.html iuls.html annuities.html mortgage-protection.html retirement-planning.html advanced-markets.html about.html about-andrew.html how-it-works.html carriers.html contact.html
  ```
  Expected: each file shows `1`.

- [ ] **Step 4: Commit**

  ```bash
  git add index.html thank-you.html life-insurance.html whole-life-insurance.html iuls.html annuities.html mortgage-protection.html retirement-planning.html advanced-markets.html about.html about-andrew.html how-it-works.html carriers.html contact.html
  git commit -m "fix: wire up footer legal links on all 14 existing pages"
  ```

---

## Task 7: Visual Verification

**Files:** Read-only (screenshot review)

- [ ] **Step 1: Start the dev server (if not already running)**

  ```bash
  node serve.mjs &
  ```
  Expected: `Server running at http://localhost:3000`
  If port already in use, skip — server is already running.

- [ ] **Step 2: Screenshot all 4 new pages**

  ```bash
  node screenshot.mjs http://localhost:3000/privacy-policy.html privacy-policy
  node screenshot.mjs http://localhost:3000/terms-of-service.html terms-of-service
  node screenshot.mjs http://localhost:3000/licensing.html licensing
  node screenshot.mjs http://localhost:3000/tcpa-compliance.html tcpa-compliance
  ```

- [ ] **Step 3: Read and review each screenshot**

  Read each PNG from `temporary screenshots/` using the Read tool. Check for:
  - Nav renders correctly with Coverage and Company dropdowns
  - Page hero displays with correct heading and section label "Legal"
  - Legal content sections render with correct font pairing (serif headings, sans body)
  - Gold dashes appear before list items
  - NPN callout on licensing.html has gold border, large number
  - License table on licensing.html is readable with alternating hover states
  - Opt-out grid on tcpa-compliance.html shows 4 cards in 2×2 layout
  - Footer shows all 4 legal links as real URLs (not `#`)
  - No horizontal scroll on mobile-width viewports (check both desktop and mobile crops)

- [ ] **Step 4: Fix any visual issues found in Step 3**

  Common issues to watch for:
  - Hero h1 font size too large or too small — adjust `clamp()` values in page-hero styles
  - NPN number overflows on mobile — ensure `@media(max-width:560px)` rule is applied
  - Table overflows on narrow screens — ensure `overflow-x: auto` on `.license-table-wrap`
  - Pixel callout background color not rendering — ensure `var(--navy-mid)` is set in styles.css

- [ ] **Step 5: Screenshot updated contact.html to verify TCPA disclaimer updated**

  ```bash
  node screenshot.mjs http://localhost:3000/contact.html contact-disclaimer
  ```
  Read the screenshot and confirm the form disclaimer now reads:
  > "By submitting this form, you consent to be contacted by Engel Financial Group and its licensed representatives by phone call, SMS/text message, and email regarding insurance products and services. Message and data rates may apply. Consent is not a condition of purchase."

- [ ] **Step 6: Take a second screenshot pass and confirm no remaining issues**

  ```bash
  node screenshot.mjs http://localhost:3000/licensing.html licensing-final
  node screenshot.mjs http://localhost:3000/privacy-policy.html privacy-final
  ```

---

## Task 8: Final Commit

- [ ] **Step 1: Confirm clean working tree**

  ```bash
  git status
  ```
  Expected: `nothing to commit, working tree clean`
  If any files are uncommitted, stage and commit them now.

- [ ] **Step 2: Review commit log**

  ```bash
  git log --oneline -8
  ```
  Expected commits (in any order):
  - `fix: update contact form TCPA disclaimer to compliant language`
  - `feat: add privacy-policy.html — Meta Pixel, GLBA, CCPA disclosures`
  - `feat: add terms-of-service.html — use terms, not-advice disclaimer, FL governing law`
  - `feat: add licensing.html — NPN 21546368, 15-state license table`
  - `feat: add tcpa-compliance.html — consent standards, opt-out rights, record keeping`
  - `fix: wire up footer legal links on all 14 existing pages`

---

## Self-Review Checklist

| Spec Requirement | Task |
|-----------------|------|
| privacy-policy.html with 12 sections | Task 2 |
| Meta Pixel dedicated section in privacy policy | Task 2 — Section 4 |
| GLBA notice in privacy policy | Task 2 — Section 6 |
| CCPA rights in privacy policy | Task 2 — Section 7 |
| Do Not Sell section | Task 2 — Section 8 |
| terms-of-service.html with 9 sections | Task 3 |
| Not-financial-advice disclaimer box | Task 3 — Section 3 |
| Florida governing law | Task 3 — Section 7 |
| licensing.html with NPN callout | Task 4 |
| 15-state license table with real numbers | Task 4 |
| tcpa-compliance.html with consent language | Task 5 |
| Opt-out grid (4 methods) | Task 5 — Section 4 |
| 10-business-day opt-out processing | Task 5 — Section 4 |
| contact.html TCPA disclaimer updated | Task 1 |
| Footer links updated on 14 existing pages | Task 6 |
| Visual verification + 2 screenshot rounds | Task 7 |
| privacy@engelfinancialgroup.com on all pages | Tasks 2, 3, 5 |
| Effective date April 28, 2026 | Tasks 2, 5 |
