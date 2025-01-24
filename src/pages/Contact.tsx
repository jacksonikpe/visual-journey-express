import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { useToast } from "../hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { toast } = useToast();
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        data,
        "YOUR_USER_ID"
      );
      toast({
        title: "Message sent!",
        description: "We will get back to you soon.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className=" w-full h-full object-cover"
          >
            <source
              src="https://res.cloudinary.com/didwhe7rc/video/upload/q_auto,f_auto/Sunset_t7cwo7.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Get in Touch
          </h1>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    {...form.register("name")}
                    className="mt-1 block w-full border border-muted-foreground rounded-md p-2"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    {...form.register("email")}
                    className="mt-1 block w-full border border-muted-foreground rounded-md p-2"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Message</label>
                  <textarea
                    {...form.register("message")}
                    className="mt-1 block w-full border border-muted-foreground rounded-md p-2"
                    rows={4}
                  />
                  {form.formState.errors.message && (
                    <p className="text-red-500">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground rounded-md p-2"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="text-primary" />
                    <span>info@s2visualproduction.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="text-primary" />
                    <span>0449530305</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-primary" />
                    <span>Sydney, Australia</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/s2visualproductions"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href="https://www.facebook.com/s2visualproductions"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="https://youtube.com/@s2visualproduction"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Youtube size={24} />
                  </a>
                  <a
                    href="https://www.tiktok.com/@s2.visual.productions"
                    className="text-muted-foreground hover:text-primary transition-colors font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TikTok
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
