
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ProjectForm } from "../components/admin/ProjectForm";
import { ProjectList } from "../components/admin/ProjectList";
import { projects } from "../components/portfolio/projectsData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Admin = () => {
  const [adminProjects, setAdminProjects] = useState(projects);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
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
    try {
      if (isAddingNew) {
        // Add new project
        setAdminProjects([...adminProjects, { ...project, id: Date.now() }]);
        toast({
          title: "Success",
          description: "New project added successfully",
        });
      } else {
        // Update existing project
        setAdminProjects(
          adminProjects.map((p) => (p.id === project.id ? project : p))
        );
        toast({
          title: "Success",
          description: "Project updated successfully",
        });
      }
      setIsAddingNew(false);
      setEditingProject(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: number) => {
    try {
      setAdminProjects(adminProjects.filter((p) => p.id !== id));
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Portfolio Admin
            </h1>
            {!isAddingNew && !editingProject && (
              <Button onClick={handleAddNew} className="flex items-center gap-2">
                <Plus size={16} />
                Add New Project
              </Button>
            )}
          </div>

          {(isAddingNew || editingProject) ? (
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
            />
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
