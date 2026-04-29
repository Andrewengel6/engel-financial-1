jest.mock('../../api/utils/twilio', () => ({
  sendVerification: jest.fn(),
}));

const handler = require('../../api/send-code');
const { sendVerification } = require('../../api/utils/twilio');

function makeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

test('returns 405 for GET', async () => {
  const res = makeRes();
  await handler({ method: 'GET', body: {} }, res);
  expect(res.status).toHaveBeenCalledWith(405);
});

test('returns 400 for missing phone', async () => {
  const res = makeRes();
  await handler({ method: 'POST', body: {} }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'invalid_phone' });
});

test('returns 400 for invalid phone (too short)', async () => {
  const res = makeRes();
  await handler({ method: 'POST', body: { phone: '123' } }, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: 'invalid_phone' });
});

test('normalises formatted phone and calls sendVerification', async () => {
  sendVerification.mockResolvedValueOnce({});
  const res = makeRes();
  await handler({ method: 'POST', body: { phone: '(501) 555-1234' } }, res);
  expect(sendVerification).toHaveBeenCalledWith('+15015551234');
  expect(res.json).toHaveBeenCalledWith({ ok: true });
});

test('normalises 10-digit plain phone', async () => {
  sendVerification.mockResolvedValueOnce({});
  const res = makeRes();
  await handler({ method: 'POST', body: { phone: '5015551234' } }, res);
  expect(sendVerification).toHaveBeenCalledWith('+15015551234');
  expect(res.json).toHaveBeenCalledWith({ ok: true });
});

test('returns 429 on Twilio rate-limit error (code 60203)', async () => {
  const err = Object.assign(new Error('max attempts'), { code: 60203 });
  sendVerification.mockRejectedValueOnce(err);
  const res = makeRes();
  await handler({ method: 'POST', body: { phone: '5015551234' } }, res);
  expect(res.status).toHaveBeenCalledWith(429);
  expect(res.json).toHaveBeenCalledWith({ error: 'too_many_attempts' });
});

test('returns 500 on unexpected Twilio error', async () => {
  sendVerification.mockRejectedValueOnce(new Error('network error'));
  const res = makeRes();
  await handler({ method: 'POST', body: { phone: '5015551234' } }, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'send_failed' });
});
