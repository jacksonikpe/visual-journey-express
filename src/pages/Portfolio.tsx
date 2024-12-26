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
      description: "A journey through the majestic peaks of the Himalayas",
      image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed",
    },
    {
      id: 2,
      title: "Ocean Stories",
      category: "Short Film",
      description: "Exploring the depths of marine life and conservation",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    },
    {
      id: 3,
      title: "Urban Rhythms",
      category: "Photography",
      description: "Capturing the pulse of city life through a lens",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    },
    {
      id: 4,
      title: "Wedding Stories",
      category: "Event",
      description: "Documenting love stories with cinematic excellence",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">Our Work</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Dialog key={project.id}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="group relative aspect-video overflow-hidden rounded-lg cursor-pointer"
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-muted-foreground">{project.category}</p>
                      </div>
                    </div>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[725px]">
                  <DialogHeader>
                    <DialogTitle>{project.title}</DialogTitle>
                    <DialogDescription>{project.category}</DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full rounded-lg"
                    />
                    <p className="mt-4 text-muted-foreground">{project.description}</p>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Portfolio;