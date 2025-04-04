
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pspkhjqnrnnkmqrtxgaq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcGtoanFucm5ua21xcnR4Z2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3OTU0OTMsImV4cCI6MjAzMTM3MTQ5M30.zKADCJ8lyc3_PzE8Yi4KeLCzymLP7d5r6xvNuZ7gqKs';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is available
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('website_content').select('count', { count: 'exact', head: true });
    return !error;
  } catch (e) {
    console.error('Supabase connection error:', e);
    return false;
  }
};
