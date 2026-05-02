// js/lp-wizard.js
const lpWizard = (() => {
  let _steps = [];
  let _current = 0;
  let _answers = {};
  let _config = {};
  let _phone = '';
  let _resendInterval = null;

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
      if (!res.ok) throw new Error();
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
      errEl.textContent = 'Something went wrong. Please try again.';
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
    // Bind dropdown continue buttons
    const dropdownContinue = container.querySelector('.lp-dropdown-continue');
    if (dropdownContinue) {
      dropdownContinue.addEventListener('click', () =>
        continueFromInput(dropdownContinue.dataset.field, dropdownContinue.dataset.inputId)
      );
    }

    if (step.type === 'dropdown' && _answers[step.field]) {
      const sel = container.querySelector('#lp-input-' + step.field);
      if (sel) sel.value = _answers[step.field];
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
      case 'name':     return _nameHtml(step);
      case 'email':    return _emailHtml(step);
      case 'phone':    return _phoneHtml(step);
      case 'otp':      return _otpHtml();
      case 'done':     return _doneHtml();
      default:         return '';
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
        <input type="text" inputmode="numeric" maxlength="1" class="lp-otp-digit" aria-label="Digit 1">
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

  return { init, back, select, continueFromInput, submitName, submitEmail, sendCode, verifyOtp, resendCode, AGE_OPTIONS, STATE_OPTIONS };
})();
