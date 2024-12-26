import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: "Mountain Documentary",
      category: "Documentary",
      description: "A journey through the majestic peaks of the Himalayas, capturing the raw beauty and challenging conditions that define mountaineering. This documentary series explores the human spirit and its connection with nature's most formidable landscapes.",
      image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed",
      span: "col-span-2 row-span-2",
    },
    {
      id: 2,
      title: "Ocean Stories",
      category: "Short Film",
      description: "Diving deep into marine conservation through the lens of local communities. This short film series highlights the delicate balance between human activity and ocean preservation.",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
      span: "col-span-1 row-span-1",
    },
    {
      id: 3,
      title: "Urban Rhythms",
      category: "Photography",
      description: "A visual exploration of city life, capturing the endless motion and energy that defines urban spaces. Through strategic composition and timing, each image reveals a unique story within the concrete jungle.",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
      span: "col-span-1 row-span-2",
    },
    {
      id: 4,
      title: "Wedding Stories",
      category: "Event",
      description: "Celebrating love through cinematic storytelling. Each wedding film is carefully crafted to capture not just moments, but emotions, creating timeless memories for couples to cherish.",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      span: "col-span-2 row-span-1",
    },
    {
      id: 5,
      title: "Cultural Heritage",
      category: "Documentary",
      description: "Preserving traditions through visual storytelling, this series documents the rich cultural heritage of communities around the world.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      span: "col-span-1 row-span-1",
    },
    {
      id: 6,
      title: "Tech Innovation",
      category: "Commercial",
      description: "Showcasing the future of technology through compelling visual narratives that highlight innovation and human progress.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      span: "col-span-2 row-span-1",
    },
  ];

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
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-12"
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
            Explore our collection of visual stories, each crafted with passion and precision to capture moments that matter.
          </motion.p>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]"
          >
            {projects.map((project) => (
              <Dialog key={project.id}>
                <DialogTrigger asChild>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className={`group relative overflow-hidden rounded-lg cursor-pointer ${project.span}`}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-xl font-semibold mb-2 text-white">{project.title}</h3>
                        <p className="text-primary font-medium">{project.category}</p>
                      </div>
                    </div>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[725px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary">{project.title}</DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                      {project.category}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full rounded-lg"
                    />
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Portfolio;