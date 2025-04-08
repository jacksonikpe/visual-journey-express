import { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const ProjectList = ({
  projects,
  onEdit,
  onDelete,
  onRefresh,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projects: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit: (project: any) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (selectedId !== null) {
      setIsDeleting(true);
      try {
        // Find the project to get image info
        const projectToDelete = projects.find((p) => p.id === selectedId);

        // If project has an image, delete it from storage
        if (projectToDelete && projectToDelete.image) {
          try {
            // Extract the filename from the image URL
            const imageUrl = new URL(projectToDelete.image);
            const pathParts = imageUrl.pathname.split("/");
            // The last segment should be the filename
            const fileName = pathParts[pathParts.length - 1];

            if (fileName) {
              console.log("Deleting image from storage:", fileName);

              // Delete the image from storage
              const { error: storageError } = await supabase.storage
                .from("project-images")
                .remove([fileName]);

              if (storageError) {
                console.error(
                  "Error deleting image from storage:",
                  storageError
                );
              } else {
                console.log("Image deleted successfully from storage");
              }
            }
          } catch (imageError) {
            console.error("Error processing image URL:", imageError);
            // Continue with project deletion even if image URL parsing fails
          }
        }

        // Delete the project from the database
        const { error } = await supabase
          .from("projects")
          .delete()
          .eq("id", selectedId);

        if (error) throw error;

        onDelete(selectedId);
        toast({
          title: "Success",
          description: "Project and associated image deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting project:", error);
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
        setSelectedId(null);
      }
    }
  };

  // Group projects by layout size for better organization
  const groupedProjects = {
    large: projects.filter((p) => p.span === "sm:col-span-2 sm:row-span-2"),
    wide: projects.filter((p) => p.span === "sm:col-span-2 row-span-1"),
    tall: projects.filter((p) => p.span === "sm:row-span-2"),
    small: projects.filter(
      (p) => p.span === "col-span-1 row-span-1" || !p.span
    ),
  };

  return (
    <div className="space-y-8 mt-4">
      {Object.entries(groupedProjects).map(([size, sizeProjects]) => {
        if (sizeProjects.length === 0) return null;

        return (
          <div key={size} className="space-y-4">
            <div className="flex items-center">
              <h3 className="text-lg font-medium">
                {size} Projects ({sizeProjects.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sizeProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  {project.image && (
                    <div className="relative h-40 w-full">
                      <img
                        src={project.image}
                        alt={project.title || "Project"}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle>{project.title || "Untitled Project"}</CardTitle>
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
                        <Pen className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setSelectedId(project.id)}
                            disabled={isDeleting}
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the project and remove its
                              image from storage.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              disabled={isDeleting}
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
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
