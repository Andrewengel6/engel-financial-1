const { checkVerification } = require('./utils/twilio');
const { getSupabase } = require('./utils/supabase');
const { formatSms } = require('./utils/format-sms');
const { normalizePhone } = require('./utils/phone');
const { sendTelegram } = require('./utils/telegram');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.error('[submit-lead] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured');
    return res.status(500).json({ error: 'server_misconfigured' });
  }

  const { code, ...leadData } = req.body || {};
  const phone = normalizePhone(leadData.phone);

  if (!phone || !code) {
    return res.status(400).json({ error: 'missing_fields' });
  }

  const ALLOWED_FIELDS = [
    'first_name','last_name','email','state','coverage_type','contact_urgency',
    'source_page','message','age','gender','tobacco','health','beneficiary',
    'coverage_amount','coverage_subtype','primary_goal','annual_income',
    'income_start','retirement_savings','employment_status','mortgage_status',
    'mortgage_balance','mortgage_co_borrower','retirement_timeline','describes_you',
  ];

  const safeData = {};
  for (const key of ALLOWED_FIELDS) {
    if (leadData[key] !== undefined) safeData[key] = leadData[key];
  }

  try {
    const approved = await checkVerification(phone, code);
    if (!approved) {
      return res.status(400).json({ ok: false, error: 'invalid_code' });
    }

    const supabase = getSupabase();
    const { error: dbError } = await supabase
      .from('leads')
      .insert({ ...safeData, phone });
    if (dbError) throw dbError;

    await sendTelegram(formatSms({ ...safeData, phone }))
      .catch(err => console.error('[submit-lead] Telegram notify failed:', err.message));

    return res.json({ ok: true });
  } catch (err) {
    console.error('[submit-lead]', err.message);
    return res.status(500).json({ error: 'submit_failed' });
  }
};
