# Legal Pages Design — Engel Financial Group
**Date:** 2026-04-28
**Phase:** 1.3
**Status:** Approved

---

## Overview

Build four legal/compliance pages for Engel Financial Group. These pages are required before running Meta (Facebook/Instagram) ads — Meta's automated systems crawl landing pages for financial services advertisers and reject campaigns that lack substantive privacy, TCPA, and licensing disclosures.

All pages use the full site design system: shared nav + footer, styles.css, brand colors/fonts, fade-up animations, mobile-first. Footer links updated from `#` to real URLs on all 14 existing pages.

---

## Pages

### 1. Privacy Policy — `privacy-policy.html`

**Why it matters:** Meta requires advertisers to disclose Pixel data collection practices. GLBA requires financial institutions to maintain a privacy notice. CCPA (and analogous state laws) require opt-out mechanisms.

**Sections:**

1. **Hero** — "Privacy Policy" heading, effective date: April 28, 2026
2. **Introduction** — Who Engel Financial Group is; this policy covers the website and lead forms; subject to GLBA as a financial services entity
3. **Information We Collect**
   - Form data: first name, last name, phone, email, coverage type, message
   - Technical data: IP address, browser type, pages visited, referral source, timestamps
   - Cookies and tracking technologies
4. **Meta Pixel & Tracking Technologies** *(dedicated section)*
   - What the Meta Pixel is and why we use it (ad performance, retargeting, conversion tracking)
   - Data collected by the Pixel: page views, button clicks, form interactions, IP address, browser fingerprint
   - Data is transmitted to Meta Platforms, Inc. (1 Hacker Way, Menlo Park, CA 94025)
   - Link to Meta's Data Policy: https://www.facebook.com/privacy/policy/
   - How to opt out: Meta Ad Preferences (https://www.facebook.com/ads/preferences), browser opt-out via Your Online Choices
5. **How We Use Your Information**
   - Respond to insurance inquiries and provide quotes
   - Connect you with licensed carriers
   - Improve site experience
   - Run and optimize Meta ad campaigns
   - Legal compliance
6. **How We Share Your Information**
   - We do NOT sell personal information
   - Licensed insurance carriers (only to fulfill quote requests)
   - Meta Platforms, Inc. (via Pixel — see Section 4)
   - Service providers under confidentiality agreements
   - Legal requirements (court orders, regulatory requests)
7. **Your Privacy Rights**
   - Right to know what data we hold
   - Right to request deletion
   - Right to opt out of data sharing
   - CCPA rights for California residents (even though Andrew is not licensed in CA, visitors may be CA residents)
   - Submit requests to: privacy@engelfinancialgroup.com
8. **Do Not Sell / Do Not Share**
   - Explicit statement: We do not sell or rent personal information to third parties
   - To opt out of Meta Pixel data sharing, use Meta Ad Preferences
9. **Data Retention**
   - Form submissions: retained for 3 years for compliance and follow-up purposes
   - Consent records (TCPA): retained for minimum 2 years with timestamp, IP, source URL
   - You may request deletion at any time
10. **Security**
    - Industry-standard technical and organizational safeguards
    - HTTPS encryption; limited staff access
11. **Changes to This Policy**
    - We may update this policy; continued use of the site constitutes acceptance
    - Material changes communicated via updated effective date
12. **Contact**
    - Email: privacy@engelfinancialgroup.com

---

### 2. Terms of Service — `terms-of-service.html`

**Sections:**

1. **Hero** — "Terms of Service" heading, effective date
2. **Acceptance of Terms** — Using this site constitutes agreement; if you disagree, do not use the site; must be 18 or older
3. **Use of This Website**
   - Permitted: browse, submit inquiries, obtain insurance information
   - Prohibited: scraping, automated access, reverse engineering, misrepresentation
4. **Not Financial or Legal Advice**
   - All content is for informational purposes only
   - Nothing on this site constitutes a binding insurance offer or contract
   - Insurance products, eligibility, and pricing vary by state and individual circumstances
   - Consult a licensed professional for advice specific to your situation
5. **Intellectual Property**
   - All content, logos, copy, and design owned by Engel Financial Group
   - No reproduction without written permission
6. **Third-Party Links**
   - Links to carrier websites and external resources provided for convenience
   - Engel Financial Group is not responsible for third-party content or privacy practices
7. **Limitation of Liability**
   - Site provided "as is"; no warranties on accuracy or completeness
   - Engel Financial Group not liable for decisions made based on site content
   - Maximum liability limited to $100
8. **Governing Law**
   - State of Florida; disputes resolved in courts of competent jurisdiction in Florida
9. **Changes to These Terms**
   - We may revise at any time; continued use = acceptance of revised terms
10. **Contact**
    - privacy@engelfinancialgroup.com

---

### 3. Licensing — `licensing.html`

**Sections:**

1. **Hero** — "Licensing & Credentials" heading, subtitle: "Andrew Engel is a licensed insurance professional authorized to operate in 15 states."
2. **NPN Panel** — Featured call-out box:
   - National Producer Number (NPN): **21546368**
   - Verify at NIPR: https://nipr.com/licensing-center/look-up-a-national-producer-number
3. **15-State License Table**

| State | License Number | License Type |
|-------|---------------|--------------|
| Arkansas | 21546368 | Life & Health |
| Florida | G229352 | Life & Health |
| Iowa | 21546368 | Life & Health |
| Kansas | 21546368 | Life & Health |
| Michigan | 21546368 | Life & Health |
| Minnesota | 41026954 | Life & Health |
| Missouri | 3003634043 | Life & Health |
| Montana | 3003925879 | Life & Health |
| North Carolina | 21546368 | Life & Health |
| Ohio | 1674575 | Life & Health |
| Oklahoma | 3003832512 | Life & Health |
| South Carolina | 21546368 | Life & Health |
| Tennessee | 3003632860 | Life & Health |
| Texas | 3339248 | Life & Health |
| Virginia | 1524630 | Life & Health |

4. **Verification Note** — "You can verify any license by visiting your state's Department of Insurance or searching by NPN at NIPR.com."
5. **Regulatory Disclosure** — Engel Financial Group operates as an independent insurance agent. Not all products are available in all states. Coverage eligibility and pricing vary by state and individual circumstances.

---

### 4. TCPA Compliance — `tcpa-compliance.html`

**Sections:**

1. **Hero** — "TCPA Compliance & Communication Consent" heading
2. **What is the TCPA**
   - Plain-English explanation: the Telephone Consumer Protection Act (47 U.S.C. § 227) governs how businesses may contact consumers by phone, text, and fax
   - Requires prior express written consent before contacting via autodialer or prerecorded message
3. **Our Consent Standard**
   - Exact consent language mirroring contact.html form disclosure (above the submit button):
     > "By submitting this form, you consent to be contacted by Engel Financial Group and its licensed representatives by phone call, SMS/text message, and email regarding insurance products and services. Message and data rates may apply. Consent is not a condition of purchase."
   - Consent is recorded with: timestamp, IP address, source URL, and form content
4. **How We Contact You**
   - Phone calls (live agent only; no prerecorded messages without separate consent)
   - SMS/text (opt-in only via form submission; service messages related to your inquiry)
   - Email (inquiry follow-up and quote delivery)
   - Purpose: insurance quote delivery and follow-up only; we do not use your contact for unrelated marketing
5. **Your Right to Opt Out**
   - SMS: reply STOP at any time
   - Email: click Unsubscribe in any email
   - Phone: verbally request removal or email privacy@engelfinancialgroup.com
   - All opt-out requests processed within 10 business days (per FCC 2025 rules)
6. **Record Keeping**
   - We retain consent records for a minimum of 2 years
   - Each record includes: disclosure language shown, timestamp (to the second), IP address, source URL
7. **Contact for TCPA Concerns**
   - privacy@engelfinancialgroup.com
8. **Effective Date** — April 28, 2026

---

## Technical Implementation

### Files to create
- `privacy-policy.html`
- `terms-of-service.html`
- `licensing.html`
- `tcpa-compliance.html`

### Files to update
- All 14 existing HTML files — update footer legal links from `#` to real URLs:
  - Privacy Policy → `/privacy-policy.html`
  - Terms of Service → `/terms-of-service.html`
  - Licensing → `/licensing.html`
  - TCPA Compliance → `/tcpa-compliance.html`

### Design system
- Nav: copy from `about.html` — company pages variant (CTA → `/contact.html`)
- Footer: copy from `about.html` — identical across all pages
- Animations: `.fade-up` + IntersectionObserver block (standard pattern)
- Brand colors: `--navy`, `--gold`, `--warm-white`, `--off-white` from styles.css
- Fonts: Cormorant Garamond (headings) + Jost (body)
- No inline styles for nav dropdown spacing — CSS only via `.nav-dropdown + .nav-dropdown`

### Page-specific styles
- Licensing table: styled inline in `<style>` block in head (not in styles.css)
- NPN featured panel: gold-bordered callout box
- Legal body text: generous line-height (1.8), max-width ~720px for readability

### Nav CTA
- All 4 pages are company-type pages → Nav CTA href="/contact.html"

### TCPA consent language sync
- The consent language on `tcpa-compliance.html` must exactly match the disclaimer on the contact.html form. Verify both during build.

---

## Compliance Summary

| Requirement | Covered By |
|-------------|-----------|
| Meta Pixel disclosure | Privacy Policy §4 |
| Meta landing page content match | All pages reference insurance services |
| GLBA privacy notice | Privacy Policy §2, §6 |
| CCPA opt-out | Privacy Policy §7, §8 |
| TCPA consent language | TCPA page §3 + contact.html form |
| TCPA opt-out (10-day rule) | TCPA page §5 |
| State license disclosure | Licensing page §2–§3 |
| NPN disclosure | Licensing page §2 |
| Not-financial-advice disclaimer | Terms §4 |
| Governing law | Terms §8 (Florida) |

---

## Notes for Lawyer Review Before Launch

- Verify "Life & Health" is the correct license type label for all 15 states
- Confirm consent language on contact.html form matches TCPA page verbatim
- Review CCPA section — Andrew is not licensed in California but may receive CA visitor traffic
- Confirm data retention periods (3 years forms, 2 years TCPA) align with any carrier requirements
- Review limitation of liability cap ($100) — adjust if needed
- Consider adding E&O insurance disclosure if applicable
