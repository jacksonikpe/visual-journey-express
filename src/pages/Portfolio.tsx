
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ProjectCard } from "../components/portfolio/ProjectCard";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

const Portfolio = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to load portfolio projects",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

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
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-12 relative z-10"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-8 text-primary text-center"
          >
            Our Creative Portfolio
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg text-[#364354] text-center max-w-2xl mx-auto mb-12"
          >
            Each project in our portfolio represents a unique story, carefully
            crafted to capture the essence of our clients' visions. From
            majestic mountain documentaries to intimate wedding celebrations,
            our work spans diverse genres and emotions.
          </motion.p>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : projects.length === 0 ? (
            <motion.div 
              variants={itemVariants}
              className="text-center py-20"
            >
              <h3 className="text-xl font-medium text-muted-foreground">No portfolio projects found</h3>
              <p className="text-muted-foreground mt-2">Check back soon for updates to our creative portfolio.</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[200px] sm:auto-rows-[250px] md:auto-rows-[300px]"
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className={`${project.span} relative overflow-hidden transition-transform hover:scale-[1.02]`}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Portfolio;
