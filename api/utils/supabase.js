const { createClient } = require('@supabase/supabase-js');

let _client = null;

function getSupabase() {
  if (!_client) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error('Missing Supabase credentials in environment');
    }
    _client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return _client;
}

module.exports = { getSupabase };
