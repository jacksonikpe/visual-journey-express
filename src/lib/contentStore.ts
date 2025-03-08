// Simple client-side CMS to store editable content
// In a production app, this would be backed by a database

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

// Get content from localStorage or use default
const getStoredContent = (): WebsiteContent => {
  const stored = localStorage.getItem('websiteContent');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored content:", e);
      return defaultContent;
    }
  }
  return defaultContent;
};

// Initial state
let websiteContent = getStoredContent();

// Content management methods
export const getContent = () => websiteContent;

export const getPageContent = (page: keyof WebsiteContent) => websiteContent[page];

export const updateContent = (newContent: WebsiteContent) => {
  websiteContent = newContent;
  localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
  
  // Dispatch a custom event to notify all components of content change
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT, { detail: websiteContent }));
  
  return websiteContent;
};

export const resetContent = () => {
  websiteContent = defaultContent;
  localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
  
  // Dispatch event for content reset too
  window.dispatchEvent(new CustomEvent(CONTENT_UPDATED_EVENT, { detail: websiteContent }));
  
  return websiteContent;
};
