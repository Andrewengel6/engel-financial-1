// js/lp-wizard.js
const lpWizard = (() => {
  let _steps = [];
  let _current = 0;
  let _answers = {};
  let _config = {};
  let _phone = '';
  let _resendInterval = null;
  let _multiAnswers = {};

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

  // Simple Lucide-style icons (24×24 viewBox, stroke-width 2)
  const _SVG = (p) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

  // Illustrated narrative icons (48×48 viewBox, stroke-width 2.5)
  // These match the reference style: people, relationships, decorative details
  const _I = (p) =>
    `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

  const ICONS = {
    // ── Illustrated icons (48×48) ──

    // Two adults side-by-side, small heart floating above — Spouse / partner
    couple: _I(
      `<circle cx="14" cy="27" r="5"/>` +
      `<path d="M5 44v-4a9 9 0 0 1 9-9h1"/>` +
      `<circle cx="34" cy="27" r="5"/>` +
      `<path d="M43 44v-4a9 9 0 0 0-9-9h-4a9 9 0 0 0-9 9v4"/>` +
      `<path d="M24 9C22 4 17 4 17 7C17 10 24 14 24 14C24 14 31 10 31 7C31 4 26 4 24 9Z"/>`
    ),

    // Adult with two small children on each side + sparkles — Children
    child: _I(
      `<circle cx="24" cy="13" r="5.5"/>` +
      `<path d="M14 43v-5a10 10 0 0 1 10-10 10 10 0 0 1 10 10v5"/>` +
      `<circle cx="7.5" cy="25" r="3.5"/>` +
      `<path d="M3 43v-3a6 6 0 0 1 4.5-5.5"/>` +
      `<circle cx="40.5" cy="25" r="3.5"/>` +
      `<path d="M45 43v-3a6 6 0 0 0-4.5-5.5"/>` +
      `<line x1="4" y1="12" x2="4" y2="16"/><line x1="2" y1="14" x2="6" y2="14"/>` +
      `<line x1="44" y1="12" x2="44" y2="16"/><line x1="42" y1="14" x2="46" y2="14"/>`
    ),

    // Standing adult guiding elderly person with cane — Parent
    parent: _I(
      `<circle cx="13" cy="13" r="5"/>` +
      `<path d="M4 43v-5a9 9 0 0 1 9-9h2"/>` +
      `<circle cx="34" cy="14" r="4.5"/>` +
      `<path d="M38 19L44 43"/>` +
      `<path d="M34 18.5V24"/><path d="M30 24h8"/>` +
      `<path d="M22 29C26 26 30 25 34 24"/>`
    ),

    // Heart with decorative ribbon bow — Other / legacy / love
    heart: _I(
      `<path d="M24 41C19 37 8 31 8 20A9 9 0 0 1 16 11C18.5 11 21 12 24 15C27 12 29.5 11 32 11A9 9 0 0 1 40 20C40 31 29 37 24 41Z"/>` +
      `<path d="M20 14C18 11 14 11 14 11M28 14C30 11 34 11 34 11"/>` +
      `<path d="M20 14C22 12.5 24 12 24 12C24 12 26 12.5 28 14"/>`
    ),

    // Shield outline with smaller heart inside — Protect / funeral / protection
    shield: _I(
      `<path d="M24 4L8 11V22C8 33.5 15 42 24 44C33 42 40 33.5 40 22V11Z"/>` +
      `<path d="M24 33C21 30 15 27 15 22.5A6 6 0 0 1 21 16.5C22.5 16.5 23.5 17 24 18C24.5 17 25.5 16.5 27 16.5A6 6 0 0 1 33 22.5C33 27 27 30 24 33Z"/>`
    ),

    // Drawstring money bag with dollar sign — Leave inheritance / guaranteed savings
    coins: _I(
      `<ellipse cx="24" cy="31" rx="13" ry="12"/>` +
      `<path d="M19.5 19.5C19.5 15.5 24 13 24 13C24 13 28.5 15.5 28.5 19.5"/>` +
      `<path d="M19 19.5C20.5 21 23 21.5 24 21.5C25 21.5 27.5 21 29 19.5"/>` +
      `<circle cx="24" cy="18" r="2.5"/>` +
      `<line x1="24" y1="25" x2="24" y2="37"/>` +
      `<path d="M21 27.5a3 3 0 0 1 3-2h1a2.5 2.5 0 0 1 0 5h-2a2.5 2.5 0 0 0 0 5h2a3 3 0 0 0 2.5-1.5"/>` +
      `<line x1="14" y1="12" x2="17" y2="15"/><line x1="34" y1="12" x2="31" y2="15"/>`
    ),

    // Person bust with lightbulb above head — Not sure / question
    question: _I(
      `<circle cx="24" cy="27" r="7"/>` +
      `<path d="M13 43v-3a11 11 0 0 1 11-11 11 11 0 0 1 11 11v3"/>` +
      `<path d="M20 13A4 4 0 0 1 28 13C28 15.5 25.5 17 25.5 19.5H22.5C22.5 17 20 15.5 20 13Z"/>` +
      `<line x1="22.5" y1="21" x2="25.5" y2="21"/>` +
      `<line x1="23" y1="23" x2="25" y2="23"/>`
    ),

    // ── Simple Lucide icons (24×24) ──
    income:       _SVG(`<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>`),
    growth:       _SVG(`<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>`),
    handshake:    _SVG(`<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 0-3 3l2 2"/><path d="m21 15-3-3h-4.34"/><path d="M19 11V7.5l-2.534-2.534A1 1 0 0 0 15.757 4H14"/><path d="m3 15 3-3h4.34"/><path d="M5 11V7.5l2.534-2.534A1 1 0 0 1 8.243 4H10"/>`),
    clock:        _SVG(`<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`),
    document:     _SVG(`<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/>`),
    house:        _SVG(`<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`),
    supplement:   _SVG(`<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>`),
    family:       _SVG(`<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`),
    person_arrow: _SVG(`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>`),
    briefcase:    _SVG(`<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`),
    transfer:     _SVG(`<path d="m17 11 4-4-4-4"/><path d="M3 12v-1a4 4 0 0 1 4-4h14"/><path d="m7 13-4 4 4 4"/><path d="M21 12v1a4 4 0 0 1-4 4H3"/>`),
    trophy:       _SVG(`<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>`),
    estate:       _SVG(`<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>`),
  };

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
    _steps = [...config.steps, ...(config.closingSteps ?? CLOSING_STEPS)];
    _current = 0;
    _answers = {};
    Object.assign(_answers, _captureUtm());
    _multiAnswers = {};
    _phone = '';                     // reset phone state
    clearInterval(_resendInterval);  // cancel any running timer
    _resendInterval = null;          // reset interval handle
    _render(0);
    // Fire ViewContent — prospect entered the funnel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent');
    }
  }

  function back() {
    if (_current > 0) _render(_current - 1);
  }

  function select(field, value) {
    _answers[field] = value;
    _render(_current + 1);
  }

  function continueFromNumber(field, inputId, min, max) {
    const el = document.getElementById(inputId);
    const val = el ? el.value.trim() : '';
    const num = parseInt(val, 10);
    if (!val || isNaN(num) || num < min || num > max) { _shake(el); return; }
    _answers[field] = String(num);
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

  function submitNameEmail() {
    const first = document.getElementById('lp-first-name').value.trim();
    const last  = document.getElementById('lp-last-name').value.trim();
    const email = document.getElementById('lp-email').value.trim();
    if (!first) { _shake(document.getElementById('lp-first-name')); return; }
    if (!last)  { _shake(document.getElementById('lp-last-name'));  return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { _shake(document.getElementById('lp-email')); return; }
    _answers.first_name = first;
    _answers.last_name  = last;
    _answers.email      = email;
    _render(_current + 1);
  }

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

  async function sendCode() {
    const rawPhone = document.getElementById('lp-phone-input').value.trim();
    if (!rawPhone) { _shake(document.getElementById('lp-phone-input')); return; }
    const digits = rawPhone.replace(/\D/g, '');
    if (digits.length !== 10 && !(digits.length === 11 && digits[0] === '1')) {
      _shake(document.getElementById('lp-phone-input')); return;
    }
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
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        btn.disabled = false;
        btn.textContent = 'Send My Code';
        errEl.textContent = errJson.error === 'too_many_attempts'
          ? 'Too many attempts. Please wait a few minutes and try again.'
          : 'Something went wrong sending your code. Please try again.';
        errEl.style.display = '';
        return;
      }
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

    const eventId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const payload = {
      code,
      ..._answers,
      coverage_type: _config.coverage_type,
      source_page: _config.source_page,
      event_id: eventId,
    };

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok && res.status !== 400) throw new Error();
      const json = await res.json();

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
        fbq('track', 'CompleteRegistration', {}, { eventID: eventId });
      }
      _render(_current + 1);
    } catch {
      btn.disabled = false;
      btn.textContent = 'Verify & Submit';
      errEl.textContent = 'Something went wrong submitting your information. Please call us at (501) 691-5508 or try again.';
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
      link.style.opacity = '1';
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
    if (n >= _steps.length) return;
    clearInterval(_resendInterval);
    _current = n;
    const step = _steps[n];
    const total = _steps.length - 1;
    const pct = Math.round((n / total) * 100);
    const numberedTotal = _steps.filter(s => s.type !== 'done' && s.type !== 'redirect' && s.type !== 'otp').length;

    document.getElementById('lp-progress-fill').style.width = pct + '%';
    document.getElementById('lp-step-label').textContent =
      step.type === 'done'     ? 'Complete!'               :
      step.type === 'redirect' ? ''                        :
      step.type === 'otp'      ? ''                        :
      `Step ${n + 1} of ${numberedTotal}`;

    const backBtn = document.getElementById('lp-back-btn');
    backBtn.style.visibility = n === 0 ? 'hidden' : 'visible';

    const container = document.getElementById('lp-step');
    container.innerHTML = _buildStepHtml(step);

    // Bind choice buttons
    if (step.type !== 'choiceWithNote') {
      container.querySelectorAll('.lp-choice').forEach(btn => {
        btn.addEventListener('click', () => select(btn.dataset.field, btn.dataset.value));
      });
    }
    // Bind multi-choice grid cards
    if (step.type === 'multiChoice') {
      container.querySelectorAll('.lp-grid-card').forEach(card => {
        card.addEventListener('click', () => {
          const field = card.dataset.field;
          const value = card.dataset.value;
          if (!_multiAnswers[field]) _multiAnswers[field] = new Set();
          if (_multiAnswers[field].has(value)) {
            _multiAnswers[field].delete(value);
            card.classList.remove('lp-grid-card--selected');
            card.setAttribute('aria-pressed', 'false');
          } else {
            _multiAnswers[field].add(value);
            card.classList.add('lp-grid-card--selected');
            card.setAttribute('aria-pressed', 'true');
          }
          const nextBtn = document.getElementById('lp-multi-next');
          if (nextBtn) nextBtn.disabled = _multiAnswers[field].size === 0;
        });
      });
    }
    // Restore multi-select state on back navigation
    if (step.type === 'multiChoice' && _multiAnswers[step.field] && _multiAnswers[step.field].size > 0) {
      _multiAnswers[step.field].forEach(val => {
        const card = container.querySelector(`.lp-grid-card[data-value="${CSS.escape(val)}"]`);
        if (card) { card.classList.add('lp-grid-card--selected'); card.setAttribute('aria-pressed', 'true'); }
      });
      const nextBtn = document.getElementById('lp-multi-next');
      if (nextBtn) nextBtn.disabled = false;
    }
    // Bind multi-next button
    const multiNext = container.querySelector('#lp-multi-next');
    if (multiNext && step.type === 'multiChoice') {
      const f = step.field;
      multiNext.addEventListener('click', () => {
        if (!_multiAnswers[f] || _multiAnswers[f].size === 0) return;
        _answers[f] = [..._multiAnswers[f]].join(',');
        _render(_current + 1);
      });
    }
    // Bind interstitial continue
    const interstitialNext = container.querySelector('#lp-interstitial-next');
    if (interstitialNext) {
      interstitialNext.addEventListener('click', () => _render(_current + 1));
    }
    // Bind redirect grid cards — single click fires window.location.href
    if (step.type === 'redirect') {
      const grid = container.querySelector('#lp-redirect-grid');
      container.querySelectorAll('.lp-grid-card[data-href]').forEach(card => {
        card.addEventListener('click', () => {
          const href = card.dataset.href;
          if (!href || grid.style.pointerEvents === 'none') return;
          grid.style.pointerEvents = 'none';
          card.classList.add('lp-grid-card--loading');
          window.location.href = href;
        });
      });
    }
    // Bind choiceWithNote — highlights selection, enables Continue, saves both answers
    if (step.type === 'choiceWithNote') {
      const continueBtn = container.querySelector('#lp-cwn-continue');
      container.querySelectorAll('.lp-choice-pick').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.lp-choice-pick').forEach(b => b.classList.remove('lp-choice--selected'));
          btn.classList.add('lp-choice--selected');
          if (continueBtn) continueBtn.disabled = false;
        });
      });
      // Restore state on back navigation
      if (_answers[step.field]) {
        const prev = container.querySelector(`.lp-choice-pick[data-value="${CSS.escape(_answers[step.field])}"]`);
        if (prev) { prev.classList.add('lp-choice--selected'); if (continueBtn) continueBtn.disabled = false; }
        const noteEl = container.querySelector('#lp-note-input');
        if (noteEl && _answers[step.noteField]) noteEl.value = _answers[step.noteField];
      }
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          const selected = container.querySelector('.lp-choice-pick.lp-choice--selected');
          if (!selected) return;
          _answers[step.field] = selected.dataset.value;
          const noteEl = container.querySelector('#lp-note-input');
          if (step.noteField) _answers[step.noteField] = noteEl ? noteEl.value.trim() : '';
          _render(_current + 1);
        });
      }
    }

    // Bind dropdown continue buttons
    const dropdownContinue = container.querySelector('.lp-dropdown-continue');
    if (dropdownContinue) {
      dropdownContinue.addEventListener('click', () =>
        continueFromInput(dropdownContinue.dataset.field, dropdownContinue.dataset.inputId)
      );
    }
    // Bind number input continue buttons
    const numberContinue = container.querySelector('.lp-number-continue');
    if (numberContinue) {
      const nField = numberContinue.dataset.field;
      const nInputId = numberContinue.dataset.inputId;
      const nMin = parseInt(numberContinue.dataset.min, 10);
      const nMax = parseInt(numberContinue.dataset.max, 10);
      numberContinue.addEventListener('click', () => continueFromNumber(nField, nInputId, nMin, nMax));
      // Also allow Enter key to advance
      const nInput = container.querySelector('#' + nInputId);
      if (nInput) nInput.addEventListener('keydown', e => { if (e.key === 'Enter') continueFromNumber(nField, nInputId, nMin, nMax); });
    }

    if ((step.type === 'dropdown' || step.type === 'number') && _answers[step.field]) {
      const el = container.querySelector('#lp-input-' + step.field);
      if (el) el.value = _answers[step.field];
    }

    const nameBtn = container.querySelector('#lp-name-btn');
    if (nameBtn) nameBtn.addEventListener('click', submitName);

    const emailBtn = container.querySelector('#lp-email-btn');
    if (emailBtn) emailBtn.addEventListener('click', submitEmail);

    const nameEmailBtn = container.querySelector('#lp-name-email-btn');
    if (nameEmailBtn) nameEmailBtn.addEventListener('click', submitNameEmail);

    const contactCaptureBtn = container.querySelector('#lp-contact-capture-btn');
    if (contactCaptureBtn) contactCaptureBtn.addEventListener('click', submitContactCapture);

    const sendBtnEl = container.querySelector('#lp-send-btn');
    if (sendBtnEl) sendBtnEl.addEventListener('click', sendCode);

    const verifyBtn = container.querySelector('#lp-verify-btn');
    if (verifyBtn) verifyBtn.addEventListener('click', verifyOtp);

    const resendLinkEl = container.querySelector('#lp-resend-link');
    if (resendLinkEl) resendLinkEl.addEventListener('click', resendCode);

    if (step.type === 'otp') {
      _bindOtpInputs();
      _startResendTimer();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function _buildStepHtml(step) {
    switch (step.type) {
      case 'choice':   return _choiceHtml(step);
      case 'dropdown': return _dropdownHtml(step);
      case 'number':   return _numberHtml(step);
      case 'name':     return _nameHtml(step);
      case 'email':    return _emailHtml(step);
      case 'phone':    return _phoneHtml(step);
      case 'otp':          return _otpHtml();
      case 'done':         return _doneHtml();
      case 'multiChoice':  return _multiChoiceHtml(step);
      case 'interstitial': return _interstitialHtml(step);
      case 'redirect':        return _redirectHtml(step);
      case 'choiceWithNote':  return _choiceWithNoteHtml(step);
      case 'nameEmail':       return _nameEmailHtml(step);
      case 'contactCapture':  return _contactCaptureHtml(step); // ← add this line
      default:                return '';
    }
  }

  function _h(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function _choiceHtml(step) {
    const choices = step.choices.map(c =>
      `<button class="lp-choice" data-field="${_h(step.field)}" data-value="${_h(c.value)}">${_h(c.label)}</button>`
    ).join('\n');
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${_h(step.question)}</h2>
      <div class="lp-choices">${choices}</div>
    </div>`;
  }

  function _multiChoiceHtml(step) {
    const cards = step.choices.map(c =>
      `<button type="button" class="lp-grid-card" data-field="${_h(step.field)}" data-value="${_h(c.value)}" aria-pressed="false">
        <div class="lp-grid-card-icon">${c.icon || ''}</div>
        <span class="lp-grid-card-label">${_h(c.label)}</span>
        <div class="lp-grid-card-check"></div>
      </button>`
    ).join('');
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${_h(step.question)}</h2>
      ${step.subtext ? `<p class="lp-step-sub">${_h(step.subtext)}</p>` : ''}
      <div class="lp-grid-choices">${cards}</div>
      <button class="lp-btn-primary lp-multi-next" id="lp-multi-next" disabled>Next &rarr;</button>
    </div>`;
  }

  function _interstitialHtml(step) {
    const stepsHtml = step.steps.map((s, i) => {
      const cls = i === 0 ? 'lp-how-step--active' : 'lp-how-step--upcoming';
      const connector = i < step.steps.length - 1 ? '<div class="lp-how-connector"></div>' : '';
      return `<div class="lp-how-step ${cls}">
        <div class="lp-how-num">${i + 1}</div>
        <span class="lp-how-step-label">${_h(s)}</span>
      </div>${connector}`;
    }).join('');
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${_h(step.headline)}</h2>
      <p class="lp-step-sub">${_h(step.subtext)}</p>
      <div class="lp-how-it-works">
        <span class="lp-how-label-tag">HOW IT WORKS</span>
        <div class="lp-how-steps">${stepsHtml}</div>
      </div>
      <button class="lp-btn-primary" id="lp-interstitial-next">${_h(step.cta || 'Continue')}</button>
    </div>`;
  }

  function _redirectHtml(step) {
    const cards = step.choices.map(c =>
      `<button type="button" class="lp-grid-card" data-href="${_h(_safeHref(c.href))}" aria-label="${_h(c.label)}">
        <div class="lp-grid-card-icon">${c.icon || ''}</div>
        <span class="lp-grid-card-label">${_h(c.label)}</span>
      </button>`
    ).join('');
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${_h(step.question)}</h2>
      <div class="lp-grid-choices" id="lp-redirect-grid">${cards}</div>
    </div>`;
  }

  function _choiceWithNoteHtml(step) {
    const buttons = step.choices.map(c =>
      `<button type="button" class="lp-choice lp-choice-pick" data-field="${_h(step.field)}" data-value="${_h(c.value)}">${_h(c.label)}</button>`
    ).join('\n');
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${_h(step.question)}</h2>
      <div class="lp-choices" id="lp-cwn-choices">${buttons}</div>
      <div class="lp-note-wrap">
        <label class="lp-note-label" for="lp-note-input">${_h(step.notePlaceholder || 'Anything else we should know? (optional)')}</label>
        <textarea class="lp-textarea" id="lp-note-input" rows="3"></textarea>
      </div>
      <button class="lp-btn-primary" id="lp-cwn-continue" disabled>Continue &rarr;</button>
    </div>`;
  }

  function _dropdownHtml(step) {
    const opts = step.options.map(o =>
      `<option value="${_h(o.value)}">${_h(o.label)}</option>`
    ).join('\n');
    const headingId = `lp-q-${_h(step.field)}`;
    return `<div class="lp-step-inner">
      <h2 class="lp-question" id="${headingId}">${_h(step.question)}</h2>
      <div class="lp-input-wrap">
        <select class="lp-select" id="lp-input-${_h(step.field)}" aria-labelledby="${headingId}">
          <option value="">Select&hellip;</option>
          ${opts}
        </select>
        <button class="lp-btn-primary lp-dropdown-continue" data-field="${_h(step.field)}" data-input-id="lp-input-${_h(step.field)}">Continue &rarr;</button>
      </div>
    </div>`;
  }

  function _numberHtml(step) {
    const min = step.min !== undefined ? step.min : 18;
    const max = step.max !== undefined ? step.max : 99;
    const headingId = `lp-q-${_h(step.field)}`;
    return `<div class="lp-step-inner">
      <h2 class="lp-question" id="${headingId}">${_h(step.question)}</h2>
      <div class="lp-input-wrap">
        <input type="number" inputmode="numeric" class="lp-input" id="lp-input-${_h(step.field)}" min="${min}" max="${max}" placeholder="${_h(step.placeholder || '')}" aria-labelledby="${headingId}">
        <button class="lp-btn-primary lp-number-continue" data-field="${_h(step.field)}" data-input-id="lp-input-${_h(step.field)}" data-min="${min}" data-max="${max}">Continue &rarr;</button>
      </div>
    </div>`;
  }

  function _nameHtml(step) {
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${_h(step.question)}</h2>
      <div class="lp-input-wrap">
        <input type="text" class="lp-input" id="lp-first-name" placeholder="First name" autocomplete="given-name" aria-label="First name">
        <input type="text" class="lp-input" id="lp-last-name" placeholder="Last name" autocomplete="family-name" aria-label="Last name">
        <button class="lp-btn-primary" id="lp-name-btn">Continue &rarr;</button>
      </div>
    </div>`;
  }

  function _emailHtml(step) {
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${_h(step.question)}</h2>
      <div class="lp-input-wrap">
        <input type="email" class="lp-input" id="lp-email" placeholder="your@email.com" autocomplete="email" aria-label="Email address">
        <button class="lp-btn-primary" id="lp-email-btn">Continue &rarr;</button>
      </div>
    </div>`;
  }

  function _nameEmailHtml(step) {
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${_h(step.question || "Where should the licensed agent contact you?")}</h2>
      <div class="lp-input-wrap">
        <input type="text" class="lp-input" id="lp-first-name" placeholder="First name" autocomplete="given-name" aria-label="First name">
        <input type="text" class="lp-input" id="lp-last-name" placeholder="Last name" autocomplete="family-name" aria-label="Last name">
        <input type="email" class="lp-input" id="lp-email" placeholder="your@email.com" autocomplete="email" aria-label="Email address">
        <button class="lp-btn-primary" id="lp-name-email-btn">Continue &rarr;</button>
      </div>
    </div>`;
  }

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

  function _phoneHtml(step) {
    return `<div class="lp-step-inner">
      <h2 class="lp-question">${_h(step.question)}</h2>
      <p class="lp-step-sub">We'll text you a 6-digit code to confirm your number.</p>
      <div class="lp-input-wrap">
        <input type="tel" inputmode="tel" class="lp-input" id="lp-phone-input" placeholder="(555) 000-0000" autocomplete="tel" aria-label="Phone number">
        <p class="lp-err" id="lp-phone-err" style="display:none"></p>
        <button class="lp-btn-primary lp-btn-gold" id="lp-send-btn">Send My Code</button>
      </div>
      <p class="lp-disclaimer">By providing your number you consent to receive SMS texts from Engel Financial Group. Msg &amp; data rates may apply. Reply STOP to opt out.</p>
    </div>`;
  }

  function _otpHtml() {
    const phoneDisplay = _phone ? `Sent to ${_h(_phone)}.` : '';
    return `<div class="lp-step-inner lp-otp-step">
      <div class="lp-otp-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.82 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      </div>
      <h2 class="lp-question lp-question--center">Enter your 6-digit code</h2>
      <p class="lp-step-sub lp-step-sub--center">${phoneDisplay} Check your texts — the code expires in 10 minutes.</p>
      <div class="lp-otp-row">
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" autocomplete="one-time-code" aria-label="Digit 1">
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" aria-label="Digit 2">
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" aria-label="Digit 3">
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" aria-label="Digit 4">
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" aria-label="Digit 5">
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" aria-label="Digit 6">
      </div>
      <p class="lp-err" id="lp-otp-err" style="display:none"></p>
      <button class="lp-btn-primary" id="lp-verify-btn">Verify &amp; Submit</button>
      <p class="lp-resend-row">Didn't get it? <a href="#" class="lp-resend-link" id="lp-resend-link" data-disabled="true" style="opacity:.4">Resend code</a> <span id="lp-resend-timer"></span></p>
    </div>`;
  }

  function _doneHtml() {
    return `<div class="lp-step-inner lp-done-screen">
      <div class="lp-done-check">&#10003;</div>
      <h2 class="lp-question">You're all set, ${_h(_answers.first_name || '')}!</h2>
      <p class="lp-step-sub">A licensed agent from Engel Financial Group will reach out to you within 24 hours. We look forward to helping you.</p>
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

  function _safeHref(href) {
    try {
      const u = new URL(href, window.location.href);
      return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : '#';
    } catch { return '#'; }
  }

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

  return { init, back, select, continueFromInput, continueFromNumber, submitName, submitEmail, submitNameEmail, submitContactCapture, sendCode, verifyOtp, resendCode, AGE_OPTIONS, STATE_OPTIONS, ICONS };
})();
