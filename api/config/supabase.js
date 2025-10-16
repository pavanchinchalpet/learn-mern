const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // DO NOT expose to client

console.log('🔵 [SUPABASE] Configuration loaded:');
console.log('🔵 [SUPABASE] URL:', supabaseUrl);
console.log('🔵 [SUPABASE] Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET');
console.log('🔵 [SUPABASE] Service Key:', supabaseServiceKey ? `${supabaseServiceKey.substring(0, 20)}...` : 'NOT SET');

// Public client (anon)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to get a privileged server-side client
function getServiceClient() {
  if (!supabaseServiceKey) {
    console.log('🔴 [SUPABASE] Service key not provided');
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Attach helper for consumers that import the default
supabase.getServiceClient = getServiceClient;

module.exports = supabase;
