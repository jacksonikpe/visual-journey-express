import { motion } from "framer-motion";
import { Camera, Film, Video, Clapperboard } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Services = () => {
  const services = [
    {
      icon: Film,
      title: "Documentary Production",
      description: "Compelling storytelling through feature-length documentaries that capture real-life stories with depth and authenticity.",
    },
    {
      icon: Video,
      title: "Commercial Videography",
      description: "High-quality video production services for businesses, including promotional content and corporate communications.",
    },
    {
      icon: Camera,
      title: "Photography",
      description: "Professional photography services for events, portraits, and commercial projects with attention to detail and artistic vision.",
    },
    {
      icon: Clapperboard,
      title: "Short Films",
      description: "Creative short film production that brings your stories to life with cinematic excellence and emotional impact.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 -mx-4 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-30"
            >
              <source
                src="https://player.vimeo.com/external/459389137.sd.mp4?s=2b3f1c2e57d2d3f20949b0e7dd0eafb042e9cc5c&profile_id=164&oauth2_token_id=57447761"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">Our Services</h1>
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