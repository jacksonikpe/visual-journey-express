
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ProjectForm } from "../components/admin/ProjectForm";
import { ProjectList } from "../components/admin/ProjectList";
import { ContentEditor } from "../components/admin/ContentEditor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Admin = () => {
  const [adminProjects, setAdminProjects] = useState<any[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simple verification check to ensure users don't access this page directly
  useEffect(() => {
    // We could check sessionStorage here for a token set by the AccessCode page
    // but for simplicity we'll just see if they came from the access code page
    const referrer = document.referrer;
    const isFromAccessCode = referrer.includes("/access-code");
    
    if (!isFromAccessCode && !localStorage.getItem("admin_authorized")) {
      toast({
        title: "Unauthorized Access",
        description: "Please enter the access code to view this page",
        variant: "destructive",
      });
      navigate("/access-code");
    } else {
      // Set a flag to allow refreshing the admin page
      localStorage.setItem("admin_authorized", "true");
    }
  }, [navigate]);

  // Fetch projects from Supabase
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setAdminProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddNew = () => {
    setEditingProject(null);
    setIsAddingNew(true);
  };

  const handleEdit = (project: any) => {
    setIsAddingNew(false);
    setEditingProject(project);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingProject(null);
  };

  const handleSave = (project: any) => {
    fetchProjects(); // Refresh the list from the database
    setIsAddingNew(false);
    setEditingProject(null);
    
    toast({
      title: "Success",
      description: project.id ? "Project updated successfully" : "New project added successfully",
    });
  };

  const handleDelete = (id: string) => {
    setAdminProjects(adminProjects.filter((p) => p.id !== id));
    // The actual deletion is handled in ProjectList component
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 pt-36 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 relative z-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Admin Dashboard
          </h1>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="content">Website Content</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio Projects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <ContentEditor />
            </TabsContent>
            
            <TabsContent value="portfolio">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Portfolio Management</h2>
                {!isAddingNew && !editingProject && (
                  <Button onClick={handleAddNew} className="flex items-center gap-2">
                    <Plus size={16} />
                    Add New Project
                  </Button>
                )}
              </div>

              {isLoading ? (
                <div className="text-center py-10">
                  <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading projects...</p>
                </div>
              ) : (isAddingNew || editingProject) ? (
                <ProjectForm
                  project={editingProject}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <ProjectList
                  projects={adminProjects}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onRefresh={fetchProjects}
                />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
