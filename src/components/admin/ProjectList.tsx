
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export const ProjectList = ({ 
  projects, 
  onEdit, 
  onDelete 
}: { 
  projects: any[],
  onEdit: (project: any) => void,
  onDelete: (id: number) => void
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDelete = () => {
    if (selectedId !== null) {
      onDelete(selectedId);
      setSelectedId(null);
    }
  };

  // Group projects by layout size for better organization
  const groupedProjects = {
    large: projects.filter(p => p.span === "sm:col-span-2 sm:row-span-2"),
    wide: projects.filter(p => p.span === "sm:col-span-2 row-span-1"),
    tall: projects.filter(p => p.span === "sm:row-span-2"),
    small: projects.filter(p => p.span === "col-span-1 row-span-1" || (!p.span))
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedProjects).map(([size, sizeProjects]) => {
        if (sizeProjects.length === 0) return null;
        
        return (
          <div key={size} className="space-y-4">
            <h2 className="text-xl font-semibold text-primary capitalize">
              {size} Projects ({sizeProjects.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sizeProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title || "Project image"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {project.title || "Untitled Project"}
                    </CardTitle>
                    <CardDescription>
                      {project.category || "No category"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onEdit(project)}
                      >
                        <Pen className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => setSelectedId(project.id)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete
                              the project and remove the data from the server.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
