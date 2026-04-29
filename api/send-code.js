const { sendVerification } = require('./utils/twilio');

function normalizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits[0] === '1') return `+${digits}`;
  return null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const phone = normalizePhone(req.body?.phone);
  if (!phone) {
    return res.status(400).json({ error: 'invalid_phone' });
  }

  try {
    await sendVerification(phone);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[send-code]', err.message);
    if (err.code === 60203) {
      return res.status(429).json({ error: 'too_many_attempts' });
    }
    return res.status(500).json({ error: 'send_failed' });
  }
};
