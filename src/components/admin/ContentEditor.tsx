
import { useState, useEffect } from "react";
import { 
  WebsiteContent, 
  getContent, 
  updateContent, 
  resetContent,
  initializeContent
} from "@/lib/contentStore";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { RotateCcw, Save, Database, Loader2 } from "lucide-react";

export const ContentEditor = () => {
  const [content, setContent] = useState<WebsiteContent>(getContent());
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    // Check Supabase connection and initialize content
    const checkSupabaseAndInit = async () => {
      try {
        setIsLoading(true);
        // Test Supabase connection
        const { data, error } = await supabase.from('website_content').select('count').limit(1);
        
        if (error) {
          console.error("Supabase connection error:", error);
          setSupabaseStatus('error');
        } else {
          setSupabaseStatus('connected');
          // Initialize content from Supabase
          await initializeContent();
          // Update local state with the latest content
          setContent(getContent());
        }
      } catch (err) {
        console.error("Error checking Supabase status:", err);
        setSupabaseStatus('error');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSupabaseAndInit();
    
    // Set up listener for content updates
    const handleContentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<WebsiteContent>;
      setContent(customEvent.detail);
      setIsDirty(false);
    };
    
    window.addEventListener(CONTENT_UPDATED_EVENT, handleContentUpdate);
    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, handleContentUpdate);
    };
  }, []);

  // Handle content updates
  const handleTextChange = (
    page: keyof WebsiteContent, 
    key: string, 
    value: string,
    nestedKey?: string
  ) => {
    setIsDirty(true);
    setContent(prev => {
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
    setIsLoading(true);
    try {
      await updateContent(content);
      setIsDirty(false);
      toast({
        title: "Success",
        description: "Website content updated successfully in Supabase",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Could not update content. Changes saved locally as fallback.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all content to default?")) {
      setIsLoading(true);
      try {
        const defaultContent = await resetContent();
        setContent(defaultContent);
        setIsDirty(false);
        toast({
          title: "Reset Complete",
          description: "Website content has been reset to default"
        });
      } catch (error) {
        console.error("Error resetting content:", error);
        toast({
          title: "Error",
          description: "Could not reset content to defaults",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Content Editor</CardTitle>
            <CardDescription>
              Edit the text content on your website pages
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Database size={16} className={supabaseStatus === 'connected' ? 'text-green-500' : 'text-red-500'} />
            <span className={`text-sm ${supabaseStatus === 'connected' ? 'text-green-500' : 'text-red-500'}`}>
              {supabaseStatus === 'connected' 
                ? 'Connected to Supabase' 
                : supabaseStatus === 'connecting' 
                  ? 'Connecting...' 
                  : 'Using local storage (Supabase error)'}
            </span>
          </div>
        </div>
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
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
          Reset to Default
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!isDirty || isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};
