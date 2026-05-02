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

  const ICONS = {
    shield: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 5L8 12.5V23c0 10.2 7.4 19.5 16 21.5 8.6-2 16-11.3 16-21.5V12.5z"/><polyline points="17,23 21.5,27.5 31,18"/></svg>`,
    growth: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,38 17,22 25,29 40,12"/><polyline points="33,12 40,12 40,19"/><line x1="6" y1="38" x2="42" y2="38"/></svg>`,
    handshake: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 26l9-9h9l7 7h5l9-9"/><path d="M4 26l11 11 4-4"/><path d="M44 17L33 28l-4-4"/></svg>`,
    question: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="18"/><path d="M20 19.5a4.5 4.5 0 0 1 8.6 1.5c0 3-4.6 4.5-4.6 7.5"/><circle cx="23.5" cy="34" r="1" fill="currentColor" stroke="none"/></svg>`,
    heart: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 41C24 41 7 31.5 7 19a9 9 0 0 1 17-4.1A9 9 0 0 1 41 19c0 12.5-17 22-17 22z"/></svg>`,
    coins: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="24" cy="15" rx="13" ry="4.5"/><path d="M11 15v6c0 2.5 5.8 4.5 13 4.5S37 23.5 37 21v-6"/><path d="M11 21v6c0 2.5 5.8 4.5 13 4.5S37 29.5 37 27v-6"/><path d="M11 27v6c0 2.5 5.8 4.5 13 4.5S37 35.5 37 33v-6"/></svg>`,
    clock: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="18"/><polyline points="24,14 24,24 31,29"/></svg>`,
    document: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M30 6H14a2 2 0 0 0-2 2v32a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V14z"/><polyline points="30,6 30,14 38,14"/><line x1="18" y1="22" x2="30" y2="22"/><line x1="18" y1="28" x2="30" y2="28"/><line x1="18" y1="34" x2="24" y2="34"/></svg>`,
    house: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 24L24 9l18 15"/><path d="M12 19v23h24V19"/><rect x="19" y="31" width="10" height="11" rx="1"/></svg>`,
    income: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="18"/><line x1="24" y1="12" x2="24" y2="36"/><path d="M30 17h-9a5 5 0 0 0 0 10h6a5 5 0 0 1 0 10H17"/></svg>`,
    supplement: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,36 16,22 24,28 34,14"/><line x1="40" y1="8" x2="40" y2="20"/><line x1="34" y1="14" x2="44" y2="14"/><line x1="6" y1="36" x2="34" y2="36"/></svg>`,
    family: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="13" r="5"/><path d="M5 40v-5a10 10 0 0 1 10-10h0a10 10 0 0 1 10 10v5"/><circle cx="35" cy="16" r="4"/><path d="M43 40v-4a7 7 0 0 0-14 0v4"/></svg>`,
    person_arrow: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="12" r="6"/><path d="M8 42v-8a12 12 0 0 1 12-12"/><polyline points="26,22 34,22 34,30"/><line x1="22" y1="30" x2="34" y2="22"/></svg>`,
    couple: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="13" r="5"/><path d="M6 38v-4a9 9 0 0 1 9-9h2"/><circle cx="32" cy="13" r="5"/><path d="M42 38v-4a9 9 0 0 0-9-9h-4a9 9 0 0 0-9 9v4"/></svg>`,
    briefcase: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="18" width="32" height="24" rx="3"/><path d="M30 18v-4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v4"/><line x1="8" y1="30" x2="40" y2="30"/></svg>`,
    transfer: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M40 14A18 18 0 0 0 9 28"/><polyline points="40,8 40,14 34,14"/><path d="M8 34A18 18 0 0 0 39 20"/><polyline points="8,40 8,34 14,34"/></svg>`,
    trophy: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 8h18v16a9 9 0 0 1-18 0z"/><path d="M15 14H8a7 7 0 0 0 7 7"/><path d="M33 14h7a7 7 0 0 1-7 7"/><line x1="19" y1="33" x2="19" y2="41"/><line x1="29" y1="33" x2="29" y2="41"/><line x1="14" y1="41" x2="34" y2="41"/></svg>`,
    estate: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="42" x2="44" y2="42"/><line x1="4" y1="18" x2="44" y2="18"/><polygon points="24,6 4,18 44,18"/><rect x="10" y="18" width="6" height="24"/><rect x="21" y="18" width="6" height="24"/><rect x="32" y="18" width="6" height="24"/></svg>`,
    child: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="13" r="6"/><path d="M14 42v-7a10 10 0 0 1 20 0v7"/><line x1="19" y1="30" x2="17" y2="42"/><line x1="29" y1="30" x2="31" y2="42"/></svg>`,
    parent: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="11" r="6"/><path d="M10 42l4-14 8 8 4-14"/><path d="M32 40l4-10"/><line x1="36" y1="40" x2="36" y2="44"/></svg>`,
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
    _steps = [...config.steps, ...CLOSING_STEPS];
    _current = 0;
    _answers = {};
    _multiAnswers = {};
    _phone = '';                     // reset phone state
    clearInterval(_resendInterval);  // cancel any running timer
    _resendInterval = null;          // reset interval handle
    _render(0);
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

    const payload = {
      code,
      ..._answers,
      coverage_type: _config.coverage_type,
      source_page: _config.source_page,
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

    document.getElementById('lp-progress-fill').style.width = pct + '%';
    document.getElementById('lp-step-label').textContent =
      step.type === 'done' ? 'Complete!' : `Step ${n + 1} of ${total}`;

    const backBtn = document.getElementById('lp-back-btn');
    backBtn.style.visibility = n === 0 ? 'hidden' : 'visible';

    const container = document.getElementById('lp-step');
    container.innerHTML = _buildStepHtml(step);

    // Bind choice buttons
    container.querySelectorAll('.lp-choice').forEach(btn => {
      btn.addEventListener('click', () => select(btn.dataset.field, btn.dataset.value));
    });
    // Bind multi-choice grid cards
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

    document.getElementById('lp-main').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      default:             return '';
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
    const display = _phone ? ` to ${_h(_phone)}` : '';
    return `<div class="lp-step-inner">
      <h2 class="lp-question">Enter the 6-digit code we sent${display}</h2>
      <p class="lp-step-sub">Check your text messages. The code expires in 10 minutes.</p>
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

  return { init, back, select, continueFromInput, continueFromNumber, submitName, submitEmail, sendCode, verifyOtp, resendCode, AGE_OPTIONS, STATE_OPTIONS, ICONS };
})();
