import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Image as LucideImage, Upload, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase, initializeStorage } from "@/lib/supabase";

// Form validation schema
const formSchema = z.object({
  title: z.string(),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string(),
  span: z.string().default("col-span-1 row-span-1"),
  "details.location": z.string(),
  "details.year": z.string(),
});

export const ProjectForm = ({
  project,
  onSave,
  onCancel,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (project: any) => void;
  onCancel: () => void;
}) => {
  const [image, setImage] = useState<string>(project?.image || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize storage when component mounts
  useEffect(() => {
    initializeStorage().catch(err => {
      console.error("Failed to initialize storage:", err);
      toast({
        title: "Storage Error",
        description: "Failed to initialize storage. Please try again.",
        variant: "destructive",
      });
    });
  }, []);

  const defaultValues = project
    ? {
        ...project,
        "details.location": project.details.location,
        "details.year": project.details.year,
      }
    : {
        title: "",
        category: "",
        description: "",
        span: "col-span-1 row-span-1",
        "details.location": "",
        "details.year": "",
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const compressImage = async (file: File, maxWidth = 1920, quality = 0.9): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = maxWidth / img.width;
          const newWidth = Math.min(maxWidth, img.width);
          const newHeight = scale * img.height;
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas to Blob conversion failed'));
              }
            },
            'image/jpeg',
            quality // Higher quality for Supabase storage
          );
        };
        img.onerror = () => reject(new Error('Image loading error'));
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);

    try {
      console.log("Starting upload process...");
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      const compressedImage = await compressImage(file);
      
      // Generate a unique filename with timestamp and original extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log("Uploading to Supabase Storage...");
      console.log("Bucket: project-images, File path:", filePath);

      // Upload to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('project-images')
        .upload(filePath, compressedImage, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) {
        console.error("Upload error:", error);
        throw error;
      }
      
      console.log("Upload successful, getting public URL");
      
      // Get the public URL
      const { data: publicUrlData } = supabase
        .storage
        .from('project-images')
        .getPublicUrl(filePath);
        
      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to get public URL");
      }
      
      console.log("Public URL obtained:", publicUrlData.publicUrl);
      setImage(publicUrlData.publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!image) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive",
      });
      return;
    }

    const projectData = {
      id: project?.id || undefined,
      title: values.title,
      category: values.category, 
      description: values.description,
      span: values.span,
      image,
      story: "",
      details: {
        location: values["details.location"],
        year: values["details.year"],
      },
    };

    delete (projectData as any)["details.location"];
    delete (projectData as any)["details.year"];

    try {
      if (project?.id) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert(projectData);
          
        if (error) throw error;
      }
      
      onSave(projectData);
      
    } catch (error) {
      console.error("Supabase error:", error);
      toast({
        title: "Error",
        description: "Failed to save project to database",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{project ? "Edit Project" : "Add New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <FormLabel>Project Image</FormLabel>
                <div className="flex items-center gap-4">
                  <div
                    className="relative w-32 h-32 border-2 border-dashed border-input rounded-md flex items-center justify-center overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <Skeleton className="w-full h-full" />
                    ) : image ? (
                      <img
                        src={image}
                        alt="Project preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <LucideImage className="text-muted-foreground" size={32} />
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Project title" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Project category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="span"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grid Layout</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                        {...field}
                      >
                        <option value="col-span-1 row-span-1">
                          Small (1x1)
                        </option>
                        <option value="sm:col-span-2 row-span-1">
                          Wide (2x1)
                        </option>
                        <option value="sm:row-span-2">Tall (1x2)</option>
                        <option value="sm:col-span-2 sm:row-span-2">
                          Large (2x2)
                        </option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                        placeholder="Project description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="details.location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. New York, USA" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details.year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2023" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
