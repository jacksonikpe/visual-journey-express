
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface ProjectDetails {
  location: string;
  year: string;
}

interface ProjectProps {
  id: number;
  title: string;
  category: string;
  description: string;
  details: ProjectDetails;
  image: string;
  span: string;
}

export const ProjectCard = ({ project }: { project: ProjectProps }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`group relative overflow-hidden rounded-lg cursor-pointer ${project.span}`}
        >
          {!imageLoaded && (
            <Skeleton className="w-full h-full absolute inset-0" />
          )}
          <LazyLoadImage
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
            afterLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-xl font-semibold mb-2 text-primary">
                {project.title}
              </h3>
              <p className="text-primary font-medium">{project.category}</p>
            </div>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary mb-2">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            {project.category}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          {!imageLoaded && (
            <Skeleton className="w-full h-[400px] rounded-lg" />
          )}
          <img
            src={project.image}
            alt={project.title}
            className="w-full rounded-lg"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <h5 className="text-sm font-semibold text-primary mb-1">
                  Location
                </h5>
                <p className="text-muted-foreground">
                  {project.details.location}
                </p>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-primary mb-1">
                  Year
                </h5>
                <p className="text-muted-foreground">{project.details.year}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
