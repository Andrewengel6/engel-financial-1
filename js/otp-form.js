// Shared OTP verification flow for all site forms.
// Usage on each page:
//   otpForm.init({ getFormData, formCardId })
//   Button onclick: otpForm.sendCode()
const otpForm = (() => {
  let _getFormData = null;
  let _formCardId = null;
  let _collected = null;
  let _resendInterval = null;

  function init({ getFormData, formCardId }) {
    _getFormData = getFormData;
    _formCardId = formCardId;

    document.querySelectorAll('.otp-digit').forEach((el, i, all) => {
      el.addEventListener('input', () => {
        el.value = el.value.replace(/\D/g, '').slice(0, 1);
        if (el.value && i < all.length - 1) all[i + 1].focus();
      });
      el.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !el.value && i > 0) all[i - 1].focus();
      });
      el.addEventListener('paste', e => {
        e.preventDefault();
        const digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
        [...all].forEach((d, idx) => { d.value = digits[idx] || ''; });
        const last = Math.min(digits.length, all.length - 1);
        all[last].focus();
      });
    });
  }

  async function sendCode() {
    const data = _getFormData();
    if (!data) return;
    _collected = data;

    const btn = document.getElementById('send-btn');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: data.phone }),
      });
      if (!res.ok) throw new Error('send_failed');

      document.getElementById(_formCardId).style.display = 'none';
      document.getElementById('otp-screen').style.display = '';
      document.getElementById('otp-phone-display').textContent = data.phone;
      document.querySelector('.otp-digit').focus();
      _startResendTimer();
    } catch {
      btn.disabled = false;
      btn.textContent = 'Send Verification Code';
      alert('Something went wrong sending your code. Please try again.');
    }
  }

  async function verify() {
    const code = [...document.querySelectorAll('.otp-digit')].map(d => d.value).join('');
    if (code.length < 6) { alert('Please enter all 6 digits.'); return; }

    const verifyBtn = document.getElementById('verify-btn');
    verifyBtn.disabled = true;
    verifyBtn.textContent = 'Verifying…';
    document.querySelector('.otp-error-msg').style.display = 'none';

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ..._collected, code }),
      });
      const json = await res.json();

      if (json.error === 'invalid_code') {
        document.querySelector('.otp-error-msg').style.display = '';
        document.querySelectorAll('.otp-digit').forEach(d => { d.value = ''; });
        document.querySelector('.otp-digit').focus();
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify & Submit';
        return;
      }
      if (!res.ok || !json.ok) throw new Error('submit_failed');

      clearInterval(_resendInterval);
      document.getElementById('otp-screen').style.display = 'none';
      document.getElementById('success-screen').style.display = '';
    } catch {
      verifyBtn.disabled = false;
      verifyBtn.textContent = 'Verify & Submit';
      alert('Something went wrong. Please try again.');
    }
  }

  async function resend(e) {
    e.preventDefault();
    const link = document.getElementById('resend-link');
    if (link.dataset.disabled === 'true') return;
    link.dataset.disabled = 'true';
    try {
      await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: _collected.phone }),
      });
      _startResendTimer();
    } catch {
      link.dataset.disabled = 'false';
      alert('Could not resend. Please try again.');
    }
  }

  function _startResendTimer() {
    let secs = 30;
    const timerEl = document.getElementById('resend-timer');
    const linkEl = document.getElementById('resend-link');
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

  return { init, sendCode, verify, resend };
})();
