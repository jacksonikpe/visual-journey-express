
// Content management system with Supabase integration
import { supabase } from './supabase';

// Define content structure
export type PageContent = {
  [key: string]: string | { [key: string]: string };
};

export type WebsiteContent = {
  home: PageContent;
  about: PageContent;
  services: PageContent;
  contact: PageContent;
};

// Custom event for content updates
export const CONTENT_UPDATED_EVENT = 'content-updated';

// Initialize with default content from the website
const defaultContent: WebsiteContent = {
  home: {
    heroTitle: "Turning Heartfelt Moments into Timeless Visuals",
    heroDescription: "At S2 Visual Productions, we specialize in capturing the essence of every moment with authenticity and creativity. From corporate events and personal photoshoots to short films, podcasts, and documentaries, we bring your vision to life with passion and precision.",
    ctaSection: {
      title: "Are You Ready to Tell an Untold Story?",
      description: "Sound, Lights, Camera, Action.\nLet us transform your imagination into an unforgettable reality."
    }
  },
  about: {
    mainTitle: "Our Story",
    introduction: "With over a decade of experience in visual storytelling, we've dedicated ourselves to capturing life's most precious moments and transforming them into timeless pieces of art.",
    missionTitle: "Our Mission",
    missionDescription: "We believe in the power of visual storytelling to move, inspire, and connect people. Our mission is to create compelling visual narratives that resonate with audiences and leave lasting impressions.",
    vision: "To be the leading creative force in visual storytelling, pushing boundaries and setting new standards in videography and photography.",
    values: "Creativity, authenticity, and excellence guide everything we do, ensuring each project receives our undivided attention and expertise."
  },
  services: {
    mainTitle: "Our Services",
    servicesList: {
      documentary: "Compelling storytelling through feature-length documentaries that capture real-life stories with depth and authenticity.",
      commercial: "High-quality video production services for businesses, including promotional content and corporate communications.",
      photography: "Professional photography services for events, portraits, and commercial projects with attention to detail and artistic vision.",
      shortFilms: "Creative short film production that brings your stories to life with cinematic excellence and emotional impact.",
      freelancing: "Professional freelance services for various visual production needs, tailored to your specific project requirements."
    }
  },
  contact: {
    mainTitle: "Get in Touch",
    contactInfo: {
      email: "info@s2visualproduction.com",
      phone: "0449530305",
      location: "Sydney, Australia"
    }
  }
};

// Content state 
let websiteContent: WebsiteContent = defaultContent;
let isLoaded = false;

// Initialize the content from Supabase once at startup
export const initializeContent = async () => {
  try {
    // Check if Supabase connection is available
    if (!supabase) {
      console.warn("Supabase client not initialized, using localStorage as fallback");
      const stored = localStorage.getItem('websiteContent');
      if (stored) {
        try {
          websiteContent = JSON.parse(stored);
        } catch (e) {
          console.error("Error parsing stored content:", e);
        }
      }
      return;
    }
    
    const { data, error } = await supabase
      .from('website_content')
      .select('content')
      .single();

    if (error) {
      console.error("Error fetching content from Supabase:", error);
      // If there's an error (like table doesn't exist yet), load from localStorage as fallback
      const stored = localStorage.getItem('websiteContent');
      if (stored) {
        try {
          websiteContent = JSON.parse(stored);
          return;
        } catch (e) {
          console.error("Error parsing stored content:", e);
        }
      }
      // Insert default content into Supabase for first-time setup
      const { error: insertError } = await supabase
        .from('website_content')
        .insert({ id: 1, content: defaultContent });
      
      if (insertError) console.error("Error inserting default content:", insertError);
    } else if (data) {
      websiteContent = data.content;
    }
  } catch (err) {
    console.error("Error in content initialization:", err);
    // Try to load from localStorage as fallback
    const stored = localStorage.getItem('websiteContent');
    if (stored) {
      try {
        websiteContent = JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing stored content:", e);
      }
    }
  } finally {
    isLoaded = true;
    // Dispatch event for initial load
    window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT, { detail: websiteContent }));
  }
};

// Ensure content is initialized
if (!isLoaded) {
  initializeContent();
}

// Content management methods
export const getContent = () => websiteContent;

export const getPageContent = (page: keyof WebsiteContent) => websiteContent[page];

export const updateContent = async (newContent: WebsiteContent) => {
  websiteContent = newContent;
  
  try {
    // Update Supabase if available
    if (supabase) {
      const { error } = await supabase
        .from('website_content')
        .update({ content: newContent })
        .eq('id', 1);

      if (error) {
        console.error("Error updating content in Supabase:", error);
        // Store in localStorage as fallback
        localStorage.setItem('websiteContent', JSON.stringify(newContent));
      }
    } else {
      // If Supabase is not available, use localStorage
      localStorage.setItem('websiteContent', JSON.stringify(newContent));
    }
  } catch (err) {
    console.error("Error in content update:", err);
    // Store in localStorage as fallback
    localStorage.setItem('websiteContent', JSON.stringify(newContent));
  }
  
  // Dispatch a custom event to notify all components of content change
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT, { detail: newContent }));
  
  return newContent;
};

export const resetContent = async () => {
  websiteContent = defaultContent;
  
  try {
    // Update Supabase if available
    if (supabase) {
      const { error } = await supabase
        .from('website_content')
        .update({ content: defaultContent })
        .eq('id', 1);
      
      if (error) {
        console.error("Error resetting content in Supabase:", error);
        // Store in localStorage as fallback
        localStorage.setItem('websiteContent', JSON.stringify(defaultContent));
      }
    } else {
      // If Supabase is not available, use localStorage
      localStorage.setItem('websiteContent', JSON.stringify(defaultContent));
    }
  } catch (err) {
    console.error("Error in content reset:", err);
    // Store in localStorage as fallback
    localStorage.setItem('websiteContent', JSON.stringify(defaultContent));
  }
  
  // Dispatch event for content reset too
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT, { detail: defaultContent }));
  
  return defaultContent;
};
