const { checkVerification, sendSms } = require('./utils/twilio');
const { getSupabase } = require('./utils/supabase');
const { formatSms } = require('./utils/format-sms');

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

  const { code, ...leadData } = req.body || {};
  const phone = normalizePhone(leadData.phone);

  if (!phone || !code) {
    return res.status(400).json({ error: 'missing_fields' });
  }

  try {
    const approved = await checkVerification(phone, code);
    if (!approved) {
      return res.status(400).json({ ok: false, error: 'invalid_code' });
    }

    const supabase = getSupabase();
    const { error: dbError } = await supabase
      .from('leads')
      .insert({ ...leadData, phone });
    if (dbError) throw dbError;

    await sendSms(process.env.ANDREW_PHONE, formatSms({ ...leadData, phone }));

    return res.json({ ok: true });
  } catch (err) {
    console.error('[submit-lead]', err.message);
    return res.status(500).json({ error: 'submit_failed' });
  }
};
