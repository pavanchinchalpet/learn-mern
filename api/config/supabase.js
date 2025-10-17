const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // DO NOT expose to client

console.log('🔵 [SUPABASE] Configuration loaded:');
console.log('🔵 [SUPABASE] URL:', supabaseUrl);
console.log('🔵 [SUPABASE] Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET');
console.log('🔵 [SUPABASE] Service Key:', supabaseServiceKey ? `${supabaseServiceKey.substring(0, 20)}...` : 'NOT SET');

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl !== 'https://placeholder.supabase.co' && 
                           supabaseAnonKey !== 'placeholder-key' &&
                           supabaseUrl.includes('supabase.co');

let supabase = null;

if (hasValidCredentials) {
  try {
    // Public client (anon)
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ [SUPABASE] Client created successfully');
  } catch (error) {
    console.error('❌ [SUPABASE] Failed to create client:', error.message);
    supabase = null;
  }
} else {
  console.log('⚠️ [SUPABASE] Using placeholder credentials - Supabase features disabled');
  console.log('📝 [SUPABASE] To enable Supabase features:');
  console.log('   1. Create a .env file in the api/ directory');
  console.log('   2. Add your Supabase URL and keys');
  console.log('   3. Restart the server');
}

// Helper to get a privileged server-side client
function getServiceClient() {
  if (!supabaseServiceKey) {
    console.log('🔴 [SUPABASE] Service key not provided');
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Attach helper for consumers that import the default
if (supabase) {
  supabase.getServiceClient = getServiceClient;
}

module.exports = supabase;
