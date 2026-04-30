const { formatSms } = require('../../api/utils/format-sms');

const base = {
  first_name: 'John', last_name: 'Smith',
  phone: '+15015551234', email: 'john@example.com',
  state: 'Texas', coverage_type: 'Life Insurance',
  contact_urgency: 'immediately', source_page: '/life-insurance.html',
};

test('formats a basic lead with no optional fields', () => {
  expect(formatSms(base)).toBe(
    'New lead: John Smith | Texas | +15015551234 | john@example.com | Life Insurance | Urgency: Immediately | /life-insurance.html'
  );
});

test('includes age when present', () => {
  expect(formatSms({ ...base, age: '35–44' })).toContain('Age: 35–44');
});

test('capitalises health value', () => {
  expect(formatSms({ ...base, health: 'great' })).toContain('Health: Great');
});

test('includes mortgage_balance when present', () => {
  expect(formatSms({ ...base, mortgage_balance: '$150k–$300k' })).toContain('Mortgage: $150k–$300k');
});

test('includes retirement_savings when present', () => {
  expect(formatSms({ ...base, retirement_savings: '$200k–$500k' })).toContain('Savings: $200k–$500k');
});

test('includes annual_income when present', () => {
  expect(formatSms({ ...base, annual_income: '$100k–$200k' })).toContain('Income: $100k–$200k');
});

test('includes primary_goal when present', () => {
  expect(formatSms({ ...base, primary_goal: 'Tax-free retirement income' }))
    .toContain('Goal: Tax-free retirement income');
});

test('includes tobacco when present', () => {
  expect(formatSms({ ...base, tobacco: 'yes' })).toContain('Tobacco: yes');
});

test('omits optional fields when absent', () => {
  const msg = formatSms(base);
  expect(msg).not.toContain('Age:');
  expect(msg).not.toContain('Health:');
  expect(msg).not.toContain('Mortgage:');
});

test('handles within_a_week urgency label', () => {
  expect(formatSms({ ...base, contact_urgency: 'within_a_week' })).toContain('Urgency: Within a week');
});
