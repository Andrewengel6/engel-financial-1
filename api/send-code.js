const { sendVerification } = require('./utils/twilio');
const { normalizePhone } = require('./utils/phone');

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
