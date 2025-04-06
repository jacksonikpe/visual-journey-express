
import { supabase } from "@/integrations/supabase/client";

// Check if Supabase is available
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('projects').select('count', { count: 'exact', head: true });
    return !error;
  } catch (e) {
    console.error('Supabase connection error:', e);
    return false;
  }
};

export { supabase };
