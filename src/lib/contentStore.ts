
// Website content management using Supabase as primary storage with localStorage fallback
import { supabase } from '@/integrations/supabase/client';

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
    introduction: "With over a decade of experience in visual storytelling, we have dedicated ourselves to capturing life most precious moments and transforming them into timeless pieces of art.",
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
      freelancing: ""
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

// Get content from Supabase or localStorage or use default
export const getContent = async (): Promise<WebsiteContent> => {
  try {
    // Try to get from Supabase first
    const { data, error } = await supabase
      .from('website_content')
      .select('content')
      .single();
    
    if (!error && data && data.content) {
      return data.content as WebsiteContent;
    }
    
    // If Supabase fails, try localStorage
    const stored = localStorage.getItem('websiteContent');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing stored content:", e);
      }
    }
  } catch (e) {
    console.error("Error fetching content:", e);
  }
  
  // Fallback to default content
  return defaultContent;
};

// Get content from localStorage (sync version - for immediate rendering)
export const getContentSync = (): WebsiteContent => {
  const stored = localStorage.getItem('websiteContent');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored content:", e);
    }
  }
  return defaultContent;
};

// Get specific page content
export const getPageContent = (page: keyof WebsiteContent): PageContent => {
  const content = getContentSync();
  return content[page];
};

// Update content in both Supabase and localStorage
export const updateContent = async (newContent: WebsiteContent): Promise<WebsiteContent> => {
  // Update localStorage for immediate access
  localStorage.setItem('websiteContent', JSON.stringify(newContent));
  
  // Update Supabase in background
  try {
    const { data, error } = await supabase
      .from('website_content')
      .select('id')
      .single();
    
    if (error && error.code === 'PGRST116') {
      // Record doesn't exist, insert it
      await supabase
        .from('website_content')
        .insert({ content: newContent });
    } else if (data) {
      // Record exists, update it
      await supabase
        .from('website_content')
        .update({ content: newContent })
        .eq('id', data.id);
    }
  } catch (e) {
    console.error("Error saving to Supabase:", e);
  }
  
  // Dispatch a custom event to notify all components of content change
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT, { detail: newContent }));
  
  return newContent;
};

// Reset content to default
export const resetContent = async (): Promise<WebsiteContent> => {
  // Reset both localStorage and Supabase
  localStorage.setItem('websiteContent', JSON.stringify(defaultContent));
  
  try {
    const { data } = await supabase
      .from('website_content')
      .select('id')
      .single();
    
    if (data?.id) {
      await supabase
        .from('website_content')
        .update({ content: defaultContent })
        .eq('id', data.id);
    }
  } catch (e) {
    console.error("Error resetting Supabase content:", e);
  }
  
  // Dispatch event for content reset too
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT, { detail: defaultContent }));
  
  return defaultContent;
};
