
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPageContent, CONTENT_UPDATED_EVENT } from "@/lib/contentStore";

const About = () => {
  const [content, setContent] = useState(getPageContent("about"));
  
  useEffect(() => {
    // Listen for content updates
    const handleContentUpdate = () => {
      setContent(getPageContent("about"));
    };
    
    window.addEventListener(CONTENT_UPDATED_EVENT, handleContentUpdate);
    
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, handleContentUpdate);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 pt-36 pb-16 relative">
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
          className="max-w-4xl mx-auto relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            {content.mainTitle as string}
          </h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-white/90 mb-6">
              {content.introduction as string}
            </p>

            <h2 className="text-2xl font-bold mb-4 text-white">
              {content.missionTitle as string}
            </h2>
            <p className="text-lg text-white/90 mb-8">
              {content.missionDescription as string}
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-12">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
                <h3 className="text-xl font-bold mb-3 text-primary">Vision</h3>
                <p className="text-white/90">
                  {content.vision as string}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
                <h3 className="text-xl font-bold mb-3 text-primary">Values</h3>
                <p className="text-white/90">
                  {content.values as string}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
