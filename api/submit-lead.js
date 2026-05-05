const { checkVerification } = require('./utils/twilio');
const { getSupabase } = require('./utils/supabase');
const { formatSms } = require('./utils/format-sms');
const { normalizePhone } = require('./utils/phone');
const { sendTelegram } = require('./utils/telegram');
const crypto = require('crypto');

function _sha256(val) {
  return crypto.createHash('sha256').update((val || '').trim().toLowerCase()).digest('hex');
}

async function sendCapi({ email, phone, sourceUrl, eventId }) {
  const pixelId     = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return; // silently skip if not configured

  const eventData = {
    event_name:       'CompleteRegistration',
    event_time:       Math.floor(Date.now() / 1000),
    action_source:    'website',
    event_source_url: sourceUrl || 'https://engelfinancialgroup.com/lp/life-insurance',
    user_data: {
      em: [_sha256(email)],
      ph: [_sha256(phone.replace(/\D/g, ''))],
    },
  };
  if (eventId) eventData.event_id = eventId;

  const body = JSON.stringify({ data: [eventData] });

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CAPI responded ${res.status}: ${text}`);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.error('[submit-lead] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured');
    return res.status(500).json({ error: 'server_misconfigured' });
  }

  const { code, event_id: eventId, ...leadData } = req.body || {};
  const phone = normalizePhone(leadData.phone);

  if (!phone || !code) {
    return res.status(400).json({ error: 'missing_fields' });
  }

  const ALLOWED_FIELDS = [
    // existing fields
    'first_name', 'last_name', 'email', 'state', 'coverage_type', 'contact_urgency',
    'source_page', 'message', 'age', 'gender', 'tobacco', 'health', 'beneficiary',
    'coverage_amount', 'coverage_subtype', 'primary_goal', 'annual_income',
    'income_start', 'retirement_savings', 'employment_status', 'mortgage_status',
    'mortgage_balance', 'mortgage_co_borrower', 'retirement_timeline', 'describes_you',
    // new campaign fields
    'coverage_for', 'product_interest', 'main_reason', 'contact_timing',
    // UTM / attribution fields
    'landing_page_url', 'query_string',
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_adset', 'utm_content', 'utm_term',
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

    // Fire server-side CAPI event — fire-and-forget, never fail the request
    sendCapi({
      email:     safeData.email || '',
      phone,
      sourceUrl: safeData.landing_page_url || '',
      eventId:   eventId || '',
    }).catch(err => console.error('[submit-lead] CAPI failed:', err.message));

    await sendTelegram(formatSms({ ...safeData, phone }))
      .catch(err => console.error('[submit-lead] Telegram notify failed:', err.message));

    return res.json({ ok: true });
  } catch (err) {
    console.error('[submit-lead]', err.message);
    return res.status(500).json({ error: 'submit_failed' });
  }
};
