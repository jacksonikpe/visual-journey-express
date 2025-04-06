
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://pspkhjqnrnnkmqrtxgaq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcGtoanFucm5ua21xcnR4Z2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDkyOTEsImV4cCI6MjA1OTM4NTI5MX0.8i3wdFw9IG4Nx_O_oPVBae3ThgPwwmouWBRBB1yTDmw";

// Create the Supabase client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Check if Supabase is available
export const checkSupabaseConnection = async () => {
  try {
    // Check if we can access the projects table which we know exists
    const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
    return !error;
  } catch (e) {
    console.error('Supabase connection error:', e);
    return false;
  }
};

// Create and initialize bucket if it doesn't exist
export const initializeStorage = async () => {
  try {
    // First check if the bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'project-images');
    
    if (!bucketExists) {
      // Bucket doesn't exist, create it
      const { error: createError } = await supabase
        .storage
        .createBucket('project-images', { 
          public: true, 
          fileSizeLimit: 10 * 1024 * 1024 // 10MB limit
        });
        
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
    }
    
    return true;
  } catch (e) {
    console.error('Error initializing storage:', e);
    return false;
  }
};

export { supabase };
