
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with public keys
// These are safe to expose in the client-side code
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
