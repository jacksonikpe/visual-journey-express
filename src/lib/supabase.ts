
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with public keys
// These are safe to expose in the client-side code
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a conditional Supabase client - will be null if URL is not provided
let supabase = null;

try {
  if (supabaseUrl) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.info('Supabase client initialized successfully');
  } else {
    console.warn('Supabase URL not provided, using localStorage fallback');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
}

export { supabase };
