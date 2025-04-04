
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Camera, Film, Video, Clapperboard, Briefcase } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { getPageContent, CONTENT_UPDATED_EVENT, initializeContent } from "@/lib/contentStore";

const Services = () => {
  const [content, setContent] = useState(getPageContent("services"));
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Initialize content from Supabase
    const loadContent = async () => {
      try {
        setIsLoading(true);
        await initializeContent();
        setContent(getPageContent("services"));
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
    
    // Listen for content updates
    const handleContentUpdate = () => {
      setContent(getPageContent("services"));
    };
    
    window.addEventListener(CONTENT_UPDATED_EVENT, handleContentUpdate);
    
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, handleContentUpdate);
    };
  }, []);
  
  // Show loading skeleton while content is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 pt-36 pb-16">
          <div className="relative">
            <div className="relative z-10">
              <Skeleton className="h-12 w-60 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-40 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const servicesList = content.servicesList as Record<string, string>;
  
  const services = [
    {
      icon: Film,
      title: "Documentary Production",
      description: servicesList.documentary,
    },
    {
      icon: Video,
      title: "Commercial Videography",
      description: servicesList.commercial,
    },
    {
      icon: Camera,
      title: "Photography",
      description: servicesList.photography,
    },
    {
      icon: Clapperboard,
      title: "Short Films",
      description: servicesList.shortFilms,
    },
    {
      icon: Briefcase,
      title: "Freelancing Services",
      description: servicesList.freelancing,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 pt-36 pb-16">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className=" w-full h-full object-cover"
          >
            <source
              src="https://res.cloudinary.com/didwhe7rc/video/upload/q_auto,f_auto/Sunset_t7cwo7.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
              {content.mainTitle as string}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-secondary/80 backdrop-blur-sm p-6 rounded-lg hover:bg-secondary/60 transition-colors"
                >
                  <service.icon className="w-12 h-12 text-primary mb-4" />
                  <h2 className="text-xl font-bold mb-3">{service.title}</h2>
                  <p className="text-muted-foreground">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
