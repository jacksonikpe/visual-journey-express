import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ProjectCard } from "../components/portfolio/ProjectCard";
import { projects } from "../components/portfolio/projectsData";
import VideoBackground from "../components/VideoBackground";

const Portfolio = () => {
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
      <div className="flex-grow container mx-auto px-4 pt-24 pb-16 relative">
        <VideoBackground />
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
            className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12"
          >
            Each project in our portfolio represents a unique story, carefully crafted to capture the essence of our clients' visions. From majestic mountain documentaries to intimate wedding celebrations, our work spans diverse genres and emotions.
          </motion.p>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Portfolio;