const URGENCY_LABELS = {
  immediately: 'Immediately',
  within_a_week: 'Within a week',
  within_a_month: 'Within a month',
  just_looking: 'Just looking',
};

function formatSms(lead) {
  const parts = [
    `New lead: ${lead.first_name} ${lead.last_name}`,
    lead.state,
    lead.phone,
    lead.email,
    lead.coverage_type,
    `Urgency: ${URGENCY_LABELS[lead.contact_urgency] || lead.contact_urgency}`,
  ];
  if (lead.age)                parts.push(`Age: ${lead.age}`);
  if (lead.health)             parts.push(`Health: ${lead.health.charAt(0).toUpperCase() + lead.health.slice(1)}`);
  if (lead.tobacco)            parts.push(`Tobacco: ${lead.tobacco}`);
  if (lead.mortgage_balance)   parts.push(`Mortgage: ${lead.mortgage_balance}`);
  if (lead.retirement_savings) parts.push(`Savings: ${lead.retirement_savings}`);
  if (lead.annual_income)      parts.push(`Income: ${lead.annual_income}`);
  if (lead.primary_goal)       parts.push(`Goal: ${lead.primary_goal}`);
  parts.push(lead.source_page);
  return parts.join(' | ');
}

module.exports = { formatSms, URGENCY_LABELS };
