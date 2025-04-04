
import { useState, useEffect } from "react";
import { 
  WebsiteContent, 
  getContent, 
  updateContent, 
  resetContent 
} from "@/lib/contentStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { RotateCcw, Save, RefreshCw } from "lucide-react";
import { checkSupabaseConnection } from "@/lib/supabase";

export const ContentEditor = () => {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      const connected = await checkSupabaseConnection();
      setIsSupabaseConnected(connected);
      
      try {
        const loadedContent = await getContent();
        setContent(loadedContent);
      } catch (error) {
        console.error("Failed to load content:", error);
        toast({
          title: "Error",
          description: "Failed to load content data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, []);

  // Handle content updates
  const handleTextChange = (
    page: keyof WebsiteContent, 
    key: string, 
    value: string,
    nestedKey?: string
  ) => {
    if (!content) return;
    
    setIsDirty(true);
    setContent(prev => {
      if (!prev) return null;
      const newContent = { ...prev };
      
      if (nestedKey) {
        newContent[page] = {
          ...newContent[page],
          [key]: {
            ...(newContent[page][key] as Record<string, string>),
            [nestedKey]: value
          }
        };
      } else {
        newContent[page] = {
          ...newContent[page],
          [key]: value
        };
      }
      
      return newContent;
    });
  };

  // Save changes
  const handleSave = async () => {
    if (!content) return;
    
    setIsSaving(true);
    try {
      await updateContent(content);
      setIsDirty(false);
      toast({
        title: "Success",
        description: `Website content updated${isSupabaseConnected ? " and saved to database" : ""}`,
      });
    } catch (error) {
      console.error("Failed to save content:", error);
      toast({
        title: "Error",
        description: "Failed to save content changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all content to default?")) {
      setIsSaving(true);
      try {
        const defaultContent = await resetContent();
        setContent(defaultContent);
        setIsDirty(false);
        toast({
          title: "Reset Complete",
          description: "Website content has been reset to default"
        });
      } catch (error) {
        console.error("Failed to reset content:", error);
        toast({
          title: "Error",
          description: "Failed to reset content",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Render a simple text input
  const renderTextInput = (
    page: keyof WebsiteContent,
    key: string,
    label: string,
    isTextarea = false
  ) => {
    if (!content) return null;
    const value = content[page][key] as string;
    
    return (
      <div className="space-y-2 mb-4">
        <Label htmlFor={`${page}-${key}`}>{label}</Label>
        {isTextarea ? (
          <Textarea
            id={`${page}-${key}`}
            value={value}
            onChange={e => handleTextChange(page, key, e.target.value)}
            rows={4}
          />
        ) : (
          <Input
            id={`${page}-${key}`}
            value={value}
            onChange={e => handleTextChange(page, key, e.target.value)}
          />
        )}
      </div>
    );
  };

  // Render nested inputs (for objects)
  const renderNestedInputs = (
    page: keyof WebsiteContent,
    key: string,
    label: string
  ) => {
    if (!content) return null;
    const nestedObj = content[page][key] as Record<string, string>;
    
    return (
      <div className="space-y-2 mb-6">
        <h3 className="text-lg font-medium">{label}</h3>
        <div className="grid gap-4 p-4 border rounded-md">
          {Object.entries(nestedObj).map(([nestedKey, value]) => (
            <div key={nestedKey} className="space-y-2">
              <Label htmlFor={`${page}-${key}-${nestedKey}`}>
                {nestedKey.charAt(0).toUpperCase() + nestedKey.slice(1)}
              </Label>
              <Input
                id={`${page}-${key}-${nestedKey}`}
                value={value}
                onChange={e => handleTextChange(page, key, e.target.value, nestedKey)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center h-40">
          <RefreshCw className="animate-spin h-8 w-8 text-primary" />
          <span className="ml-2">Loading content...</span>
        </CardContent>
      </Card>
    );
  }

  if (!content) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            Failed to load content data. Please refresh the page.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Editor</CardTitle>
        <CardDescription>
          {isSupabaseConnected 
            ? "Edit the website content - changes will be saved to database" 
            : "Edit the website content - changes will be saved locally"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="home">
          <TabsList className="mb-4">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="space-y-4">
            {renderTextInput("home", "heroTitle", "Hero Title")}
            {renderTextInput("home", "heroDescription", "Hero Description", true)}
            {renderNestedInputs("home", "ctaSection", "Call to Action Section")}
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4">
            {renderTextInput("about", "mainTitle", "Main Title")}
            {renderTextInput("about", "introduction", "Introduction", true)}
            {renderTextInput("about", "missionTitle", "Mission Title")}
            {renderTextInput("about", "missionDescription", "Mission Description", true)}
            {renderTextInput("about", "vision", "Vision", true)}
            {renderTextInput("about", "values", "Values", true)}
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            {renderTextInput("services", "mainTitle", "Main Title")}
            {renderNestedInputs("services", "servicesList", "Services List")}
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            {renderTextInput("contact", "mainTitle", "Main Title")}
            {renderNestedInputs("contact", "contactInfo", "Contact Information")}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="flex items-center gap-2"
          disabled={isSaving}
        >
          <RotateCcw size={16} className={isSaving ? "animate-spin" : ""} />
          Reset to Default
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!isDirty || isSaving}
          className="flex items-center gap-2"
        >
          <Save size={16} className={isSaving ? "animate-spin" : ""} />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};
