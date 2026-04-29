const twilio = require('twilio');

let _client = null;

function getClient() {
  if (!_client) {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('Missing Twilio credentials in environment');
    }
    _client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return _client;
}

async function sendVerification(phone) {
  return getClient()
    .verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verifications.create({ to: phone, channel: 'sms' });
}

async function checkVerification(phone, code) {
  const check = await getClient()
    .verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verificationChecks.create({ to: phone, code });
  return check.status === 'approved';
}

async function sendSms(to, body) {
  return getClient().messages.create({
    body,
    from: process.env.TWILIO_FROM_NUMBER,
    to,
  });
}

module.exports = { sendVerification, checkVerification, sendSms };
