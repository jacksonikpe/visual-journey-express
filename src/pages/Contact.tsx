import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";
import emailjs from '@emailjs/browser';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();
  const { toast } = useToast();

  const onSubmit = async (data: ContactFormData) => {
    try {
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        message: data.message,
        to_email: 'info@s2visualproduction.com'
      };

      await emailjs.send(
        'YOUR_SERVICE_ID', // You'll need to replace this
        'YOUR_TEMPLATE_ID', // You'll need to replace this
        templateParams,
        'YOUR_PUBLIC_KEY' // You'll need to replace this
      );

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });

      reset();
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-primary">
            Get in Touch
          </h1>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="text-primary" />
                  <span className="text-muted-foreground">
                    info@s2visualproduction.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-primary" />
                  <span className="text-muted-foreground">
                    +61 (433) 998 274
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-primary" />
                  <span className="text-muted-foreground">
                    Sydney, Australia
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/s2visualproductions/profilecard/?igsh=MXBvZnoyeHR3N3hkbw=="
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href="https://www.facebook.com/share/15TN46X83N/?mibextid=wwXIfr"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="https://youtube.com/@s2visualproduction?si=GxOu1ExFTWvtVahn"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Youtube size={24} />
                  </a>
                  <a
                    href="https://www.tiktok.com/@s2.visual.productions?_t=8sgqAd0Xyle&_r=1"
                    className="text-muted-foreground hover:text-primary transition-colors font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TikTok
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Input
                    placeholder="Your Name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    {...register("message", { required: "Message is required" })}
                    rows={4}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;