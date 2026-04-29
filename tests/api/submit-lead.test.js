jest.mock('../../api/utils/twilio', () => ({
  checkVerification: jest.fn(),
  sendSms: jest.fn(),
}));

const mockInsert = jest.fn().mockResolvedValue({ error: null });
jest.mock('../../api/utils/supabase', () => ({
  getSupabase: jest.fn(() => ({
    from: jest.fn(() => ({ insert: mockInsert })),
  })),
}));

const handler = require('../../api/submit-lead');
const { checkVerification, sendSms } = require('../../api/utils/twilio');

process.env.ANDREW_PHONE = '+15010000000';
process.env.TWILIO_FROM_NUMBER = '+15019999999';

function makeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
}

const validBody = {
  code: '123456',
  phone: '(501) 555-1234',
  first_name: 'Jane', last_name: 'Doe',
  email: 'jane@example.com', state: 'Texas',
  coverage_type: 'Life Insurance',
  contact_urgency: 'immediately',
  source_page: '/life-insurance.html',
};

beforeEach(() => jest.clearAllMocks());

test('returns 405 for GET', async () => {
  const res = makeRes();
  await handler({ method: 'GET', body: {} }, res);
  expect(res.status).toHaveBeenCalledWith(405);
});

test('returns 400 when phone missing', async () => {
  const res = makeRes();
  await handler({ method: 'POST', body: { code: '123456' } }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'missing_fields' });
});

test('returns 400 when code missing', async () => {
  const res = makeRes();
  await handler({ method: 'POST', body: { phone: '5015551234' } }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'missing_fields' });
});

test('returns 400 with invalid_code when OTP rejected', async () => {
  checkVerification.mockResolvedValueOnce(false);
  const res = makeRes();
  await handler({ method: 'POST', body: validBody }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ ok: false, error: 'invalid_code' });
});

test('inserts lead and SMSes Andrew on valid code', async () => {
  checkVerification.mockResolvedValueOnce(true);
  sendSms.mockResolvedValueOnce({});
  const res = makeRes();
  await handler({ method: 'POST', body: validBody }, res);
  expect(mockInsert).toHaveBeenCalledWith(
    expect.objectContaining({ phone: '+15015551234', first_name: 'Jane' })
  );
  expect(sendSms).toHaveBeenCalledWith('+15010000000', expect.stringContaining('Jane Doe'));
  expect(res.json).toHaveBeenCalledWith({ ok: true });
});

test('passes normalised E.164 phone to checkVerification', async () => {
  checkVerification.mockResolvedValueOnce(true);
  sendSms.mockResolvedValueOnce({});
  const res = makeRes();
  await handler({ method: 'POST', body: { ...validBody, phone: '(501) 555-1234' } }, res);
  expect(checkVerification).toHaveBeenCalledWith('+15015551234', '123456');
});
