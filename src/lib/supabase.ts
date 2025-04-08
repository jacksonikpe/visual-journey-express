
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://pspkhjqnrnnkmqrtxgaq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcGtoanFucm5ua21xcnR4Z2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDkyOTEsImV4cCI6MjA1OTM4NTI5MX0.8i3wdFw9IG4Nx_O_oPVBae3ThgPwwmouWBRBB1yTDmw";

// Create the Supabase client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
  }
});

// Check if Supabase is available
export const checkSupabaseConnection = async () => {
  try {
    // Check if we can access the projects table which we know exists
    const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase connection error:', e);
    return false;
  }
};

// Check if storage bucket exists
export const checkBucketExists = async (bucketName: string) => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    if (error) {
      console.error('Bucket check error:', error);
      return false;
    }
    return !!data;
  } catch (e) {
    console.error('Bucket check error:', e);
    return false;
  }
};

// Initialize storage - create the bucket if it doesn't exist
export const initializeStorage = async () => {
  try {
    const bucketExists = await checkBucketExists('project-images');
    
    if (!bucketExists) {
      console.log('Creating storage bucket for project images...');
      const { error: createError } = await supabase.storage.createBucket('project-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB limit
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      
      console.log('Storage bucket created successfully');
    } else {
      console.log('Storage bucket already exists');
    }
    
    return true;
  } catch (e) {
    console.error('Error initializing storage:', e);
    return false;
  }
};

// Helper function to upload an image to storage
export const uploadImage = async (file: Blob, fileName: string): Promise<string | null> => {
  try {
    console.log(`Uploading image: ${fileName} to bucket: project-images`);
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Image upload error:', error);
      return null;
    }

    console.log('Upload successful:', data);
    
    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('project-images')
      .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      console.error('Failed to get public URL');
      return null;
    }

    console.log('Public URL obtained:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (e) {
    console.error('Error in uploadImage function:', e);
    return null;
  }
};

export { supabase };
