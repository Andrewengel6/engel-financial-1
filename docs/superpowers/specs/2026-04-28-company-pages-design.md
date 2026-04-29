# Design Spec: Company Pages — Phase 1.2
**Date:** 2026-04-28
**Project:** Engel Financial Group
**Phase:** 1.2 — Company Pages

---

## Scope

Build 4 new company pages and update the shared nav to add a "Company" dropdown. A 5th page (Carriers We Work With) will be added later once the real carrier list is provided.

Pages in this spec:
1. `about.html` — Engel Financial Group as a company entity
2. `about-andrew.html` — Andrew Engel, founder & broker (personal story)
3. `how-it-works.html` — Independent broker advantage + client process
4. `contact.html` — Primary conversion destination

---

## Client Confirmation Required Before Launch

The following are placeholder values that must be confirmed/updated by Andrew before the site goes live:
- **Phone number & email** on `contact.html` — use `(800) 555-1234` and `hello@engelfinancialgroup.com` as placeholders
- **Stat numbers** on `about.html` (20+ carriers, 50 states, 1,000+ families, years in business) — use as placeholders, Andrew to confirm real figures
- **Carrier count** referenced throughout ("20+ carriers") — confirm real number with Andrew

---

## Hard Rules

- Nav and footer are **identical across every page** — same rules as Phase 1.1.
- All shared styles in `styles.css`. Page-specific styles inline.
- Brand colors, fonts, grain overlay: unchanged from Phase 1.1 spec.
- Mobile-first. Responsive at all breakpoints.
- **Approach C — Smart CTAs:** About, About Andrew, and How It Works each end with a CTA *banner* (not a form) linking to `contact.html`. The Contact page is the sole conversion destination with the full lead form.
- Andrew's real photo (`brand_assets/andrew business guy 7 figures..png`) is used on `about-andrew.html` — no placeholder.
- Andrew's bio text sourced from `brand_assets/About me - Andrew.txt`.

---

## Nav Update

Add a **"Company"** nav item alongside "Coverage" on both desktop and mobile.

### Desktop
- Second dropdown trigger: "Company" with chevron
- Dropdown items:
  - About → `/about.html`
  - About Andrew → `/about-andrew.html`
  - How It Works → `/how-it-works.html`
  - Contact → `/contact.html`
- Carriers We Work With will be added to this dropdown in a later phase

### Mobile
- Second accordion item in mobile menu: "Company"
- Expands to show the same 4 links

### Files to update
- `styles.css` — no new styles needed (dropdown styles are generic)
- Every existing HTML page — nav block updated to include Company dropdown
  - `index.html`, `thank-you.html`, `life-insurance.html`, `whole-life-insurance.html`, `iuls.html`, `annuities.html`, `mortgage-protection.html`, `retirement-planning.html`, `advanced-markets.html`

---

## Page 1: about.html — Engel Financial Group

### Section 1: Hero
- Full-width, navy background (`#111d2b`), grain overlay, layered radial gradients
- Section label: "About Us"
- Headline (Cormorant Garamond, ~64px desktop): *"Protecting Families Across America."*
- Subheadline (Jost, ~18px, muted): "We're an independent life insurance brokerage built on one belief — every family deserves real protection."
- Two CTAs: "Get a Free Quote" (gold, → `/contact.html`) + "Meet Our Founder" (ghost, → `/about-andrew.html`)

### Section 2: Mission & Values
- Off-white background
- Section label: "Our Values"
- Serif headline: "Built on Integrity. Driven by Purpose."
- 3 cards in a row (stack to 1 col mobile):
  - **Integrity** — We never push a product that isn't right for you. Our only agenda is your protection.
  - **Independence** — As independent brokers, we shop every major carrier to find your best fit — not ours.
  - **Advocacy** — We work for you, not an insurance company. Your family's security is our only goal.
- Card hover: lift + gold top border reveal (same as coverage pages)

### Section 3: Why Independent Broker
- 2-column layout (text left, image right; stacks on mobile)
- Left:
  - Section label: "Why It Matters"
  - Serif headline: "We Work for You — Not an Insurance Company."
  - 2 paragraphs: explain that captive agents are tied to one carrier; Andrew shops all major carriers to find the genuinely best policy for each client's situation and budget
  - 3 fact chips: "Access to 20+ carriers" · "No carrier bias" · "Advocate, not salesperson"
- Right: placeholder image (`https://placehold.co/600x480`) with gold gradient overlay

### Section 4: By the Numbers
- Dark navy background (`#1a2d3f`)
- 4 stats in a row (2x2 on mobile):
  - 20+ Carriers — "Access to the nation's top life insurance providers"
  - 50 States — "Licensed to serve families across America"
  - 1,000+ Families — "Protected and counting"
  - 100% Independent — "No quotas, no pressure, no bias"
- Numbers in gold (Cormorant Garamond, large), labels in Jost

### Section 5: Meet the Founder
- Off-white background
- 2-column layout: placeholder image left (`https://placehold.co/480x560`, representing Andrew/brand — client may swap in real photo later), text right
- Section label: "Our Founder"
- Serif headline: "Meet Andrew Engel"
- 2-sentence intro: "Andrew built Engel Financial Group from a deeply personal mission — to make sure no family goes through what his did. As an independent broker and senior underwriter, he brings the same care and urgency to every client he serves."
- Gold "Read Andrew's Story →" button → `/about-andrew.html`

### Section 6: CTA Banner
- Dark navy (`#0a1219`)
- Serif headline: "Ready to Protect What Matters Most?"
- Supporting line: "One conversation is all it takes. No pressure, no obligation."
- Gold button: "Get in Touch" → `/contact.html`

### Section 7: Footer
- Shared footer (identical to all other pages)

---

## Page 2: about-andrew.html — Andrew Engel

### Section 1: Hero
- Full-width, navy background, grain overlay
- Section label: "Our Founder"
- Headline (large serif, ~64px): *"This Isn't Just Business."*
- Subheadline: "It's personal. And that's exactly why Andrew does it."
- Andrew's real photo below or alongside headline — `brand_assets/andrew business guy 7 figures..png` — displayed with gold gradient overlay + color treatment layer (`mix-blend-multiply`)

### Section 2: His Story (Editorial)
- Off-white background, max-width ~760px, centered — long-form editorial layout
- Section label: "Andrew's Story"
- Serif headline: "Where It All Began."
- Body text drawn directly from `brand_assets/About me - Andrew.txt`:
  - Para 1: Growing up — broken home, welfare, no financial safety net, loss without protection
  - Para 2: "Those experiences are what shaped me."
  - Para 3: The realization — real security is about what you protect, not what you earn
  - Para 4: The career pivot — sales is about connecting, not convincing
  - Para 5: Today — independent broker, senior underwriter, sees it as a responsibility
- Use generous line-height (1.8), larger body font (~18px), strong serif pull-quote treatment for the most powerful lines

### Section 3: Pull Quote
- Full-width dark navy band
- Large centered Cormorant Garamond italic quote:
  *"Insurance isn't a selfish act. It's one of the most selfless decisions a person can make."*
- Gold rule above and below the quote

### Section 4: His Mission
- Off-white, centered, max-width ~760px
- Serif headline: "Why He Does This."
- Body text from the file:
  - "I've built my business around helping families create protection, stability, and peace of mind — especially those who, like me, didn't grow up with those things."
  - "My mission is simple: to help as many people as possible avoid the same hardships I witnessed growing up."
- Ends with: *"This isn't just business for me. This is personal."* — styled as a standalone italic close

### Section 5: His Approach (3 Principles)
- Section label: "How Andrew Works"
- Serif headline: "What You Can Expect."
- 3 cards:
  - **Honesty First** — "If a policy isn't right for you, Andrew will tell you. No pressure, no upsells."
  - **Your Family, Your Plan** — "Every situation is different. Andrew listens before he recommends."
  - **Long-Term Relationship** — "Andrew doesn't disappear after the sale. He's your advocate for the life of your policy."

### Section 6: CTA Banner
- Dark navy (`#0a1219`)
- Serif headline: "Let's Protect Your Family Together."
- Supporting line: "Start with a free, no-obligation conversation."
- Gold button: "Get in Touch" → `/contact.html`

### Section 7: Footer
- Shared footer

---

## Page 3: how-it-works.html

### Section 1: Hero
- Full-width navy, grain, radial gradients
- Section label: "How It Works"
- Headline: *"Simple. Transparent. On Your Side."*
- Subheadline: "As an independent broker, Andrew shops every major carrier to find you the best policy — not the most profitable one."
- CTAs: "Get a Free Quote" (gold, → `/contact.html`) + "Call Us" (ghost)

### Section 2: The Independent Advantage
- Off-white, 2-column (text left, image right)
- Section label: "Why Independent Matters"
- Serif headline: "We're Not Tied to Anyone — Except You."
- 3 paragraphs: explain that captive agents only sell their company's products; independent brokers like Andrew can shop 20+ carriers, compare rates, and genuinely advocate for what's best for the client
- 3 chips: "20+ Carriers" · "Unbiased Recommendations" · "100% On Your Side"
- Right: placeholder image with gold overlay

### Section 3: The Process (5 Steps)
- Off-white or light navy background
- Section label: "The Process"
- Serif headline: "From First Call to Full Coverage."
- 5-step vertical or horizontal track (vertical on mobile):
  1. **We Talk** — A free, no-pressure conversation about your situation, your family, and your goals. No forms, no commitment.
  2. **We Assess** — Andrew reviews your needs, health profile, and budget to understand what kind of coverage makes sense.
  3. **We Shop** — Using access to 20+ top carriers, Andrew compares policies side-by-side to find your best option.
  4. **We Present** — Andrew walks you through the top options in plain language — no jargon, no confusion.
  5. **You're Covered** — Once you choose, Andrew handles the application and follows it through to approval.
- Steps numbered in gold circles (Cormorant Garamond)

### Section 4: Independent vs. Captive Comparison
- Dark navy background
- Section label: "Know the Difference"
- Serif headline: "Independent Broker vs. Captive Agent."
- Side-by-side comparison table:

| | Independent Broker (Andrew) | Captive Agent |
|---|---|---|
| Carrier access | 20+ carriers | 1 carrier only |
| Works for | You | Their employer |
| Recommendation bias | None | Company-first |
| Price comparison | Yes — across all carriers | No |
| Your advocate | Always | Rarely |

- Table styled with gold accents, navy rows

### Section 5: FAQ
- Off-white
- 4 accordion questions:
  1. "Do I have to commit to anything on the first call?" — No. The first conversation is completely free and obligation-free.
  2. "How long does it take to get covered?" — Most clients are approved within days. Some policies offer same-day coverage.
  3. "What if I have a pre-existing condition?" — Many carriers still offer excellent options. Andrew's job is to find the right one for your situation.
  4. "Does it cost more to use an independent broker?" — No. Andrew is compensated by the carrier, not you. You get better options at no extra cost.

### Section 6: CTA Banner
- Dark navy (`#0a1219`)
- Serif headline: "Ready to See What You Qualify For?"
- Supporting line: "Free consultation. No obligation. No pressure."
- Gold button: "Get in Touch" → `/contact.html`

### Section 7: Footer
- Shared footer

---

## Page 4: contact.html

### Section 1: Hero
- Full-width navy, shorter than other heroes (~40vh)
- Section label: "Contact"
- Headline: *"Let's Find the Right Coverage for You."*
- Subheadline: "Reach out any way that works for you. We respond fast."

### Section 2: Contact Split (main section)
- 2-column layout (stacks on mobile): **Left — contact info | Right — form**
- **Left column:**
  - Section label: "Get in Touch"
  - Serif headline: "We're Here When You're Ready."
  - Phone number (large, clickable `tel:` link): gold color, prominent
  - Email address (clickable `mailto:` link)
  - Response promise badge: "We respond within 24 hours" with a clock icon
  - License badge: "Licensed Independent Broker" with shield icon
  - Short reassurance line: "No pressure. No obligation. Just honest answers."
  - *Note: Use placeholder phone/email — client will update*
- **Right column — Contact Form:**
  - Form card (same `.form-card` class from coverage pages)
  - Form headline: "Send Us a Message"
  - Fields:
    - First Name
    - Last Name
    - Phone
    - Email
    - Coverage Interest (dropdown: Life Insurance / Whole Life / IUL / Annuities / Mortgage Protection / Retirement Planning / Advanced Markets / General Question)
    - Message (textarea, optional)
  - Submit button: "Send My Message" (gold, full-width)
  - Disclaimer below button (same as coverage pages)
  - On submit: validate required fields → redirect to `/thank-you.html`

### Section 3: Trust Strip
- Off-white background
- 4 trust icons in a row (stack to 2x2 on mobile):
  - Shield: "Licensed & Compliant"
  - Lock: "Your Info is Private"
  - Clock: "24-Hour Response"
  - Phone: "Real Person, Every Time"

### Section 4: Footer
- Shared footer

---

## Shared CTA Banner Spec (used on pages 1, 2, 3)

Reusable pattern — not a component, just a consistent inline section on each page:
- Background: `#0a1219` (darkest navy)
- Padding: 80px vertical
- Centered content
- Serif headline (~40px): page-specific wording
- Supporting line (Jost, muted white, ~16px)
- Gold button → `/contact.html`
- No form embedded

---

## Animation & Interaction

Same as Phase 1.1:
- `fade-up` class on sections, driven by IntersectionObserver
- `js-animations` class on `<body>` for progressive enhancement
- Accordion FAQ: same pattern as coverage pages
- Mobile menu: same `toggleMobileMenu()` / `toggleMobileCoverage()` pattern, plus new `toggleMobileCompany()` for Company accordion

---

## SEO — Contact Page Specifics

- `<title>`: "Contact Us — Engel Financial Group | Free Life Insurance Consultation"
- `<meta name="description">`: "Talk to Andrew Engel, independent life insurance broker. Free consultation, no obligation. We help families across America find the right coverage."
- Page includes NAP (Name, Address/Service Area, Phone) for local SEO signals
- Structured data (`application/ld+json`, `LocalBusiness` schema) inline in `<head>`

---

## File Checklist

| File | Action |
|------|--------|
| `about.html` | NEW |
| `about-andrew.html` | NEW |
| `how-it-works.html` | NEW |
| `contact.html` | NEW |
| `styles.css` | UPDATE — Company dropdown toggle JS styles if needed |
| `index.html` | UPDATE — nav Company dropdown |
| `thank-you.html` | UPDATE — nav Company dropdown |
| `life-insurance.html` | UPDATE — nav |
| `whole-life-insurance.html` | UPDATE — nav |
| `iuls.html` | UPDATE — nav |
| `annuities.html` | UPDATE — nav |
| `mortgage-protection.html` | UPDATE — nav |
| `retirement-planning.html` | UPDATE — nav |
| `advanced-markets.html` | UPDATE — nav |
