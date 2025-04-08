
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://pspkhjqnrnnkmqrtxgaq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcGtoanFucm5ua21xcnR4Z2FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDkyOTEsImV4cCI6MjA1OTM4NTI5MX0.8i3wdFw9IG4Nx_O_oPVBae3ThgPwwmouWBRBB1yTDmw";

// Create the Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
  },
  // Add global error handling
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
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
    console.log(`Checking if bucket '${bucketName}' exists...`);
    
    // First try listing buckets to see if our bucket is in the list
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    console.log('Available buckets:', buckets);
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      console.log(`Bucket '${bucketName}' found in list`);
      return true;
    }
    
    console.log(`Bucket '${bucketName}' not found in list`);
    return false;
  } catch (e) {
    console.error('Bucket check error:', e);
    return false;
  }
};

// Initialize storage - create the bucket if it doesn't exist
export const initializeStorage = async () => {
  try {
    // First check if bucket exists using the improved check function
    const bucketExists = await checkBucketExists('project-images');
    
    console.log(`Bucket exists check result: ${bucketExists}`);
    
    // If bucket doesn't exist, we'll try to use it anyway (the RLS policies should allow it)
    // We won't try to create it from the client as it likely requires admin privileges
    
    // Check if we can at least access the bucket
    if (!bucketExists) {
      try {
        const { data: testData, error: testError } = await supabase.storage
          .from('project-images')
          .list('', { limit: 1 });
          
        if (testError) {
          console.error('Cannot access bucket:', testError);
          return false;
        }
        
        console.log('Bucket access test successful');
      } catch (accessError) {
        console.error('Bucket access test error:', accessError);
        return false;
      }
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
    // Ensure storage is initialized before uploading
    const storageReady = await initializeStorage();
    if (!storageReady) {
      console.error('Storage not initialized, cannot upload image');
      return null;
    }
    
    console.log(`Uploading image: ${fileName} to bucket: project-images`);
    
    // Upload with additional debugging
    console.log('Upload starting with file size:', file.size);
    console.log('File type:', file.type);
    
    // Important fix: Do not set Content-Type header for file upload
    // Let the browser set the correct multipart/form-data content type
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true, // Allow overwriting files
        contentType: file.type // Explicitly set the correct content type from the file
      });

    if (error) {
      console.error('Image upload error:', error);
      
      // Additional error inspection
      if (error.message.includes("bucket") || error.message.includes("policy")) {
        console.error('Storage permission issue detected. Please ensure proper RLS policies are in place.');
      }
      
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

