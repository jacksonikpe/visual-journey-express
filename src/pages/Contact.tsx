import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
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
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#364354]">
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
                  <Mail className="text-[#364354]" />
                  <span className="text-muted-foreground">
                    info@s2visualproduction.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-[#364354]" />
                  <span className="text-muted-foreground">
                    +61 (433) 998 274
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-[#364354]" />
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
                    className="text-muted-foreground hover:text-[#364354] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href="https://www.facebook.com/share/15TN46X83N/?mibextid=wwXIfr"
                    className="text-muted-foreground hover:text-[#364354] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="https://youtube.com/@s2visualproduction?si=GxOu1ExFTWvtVahn"
                    className="text-muted-foreground hover:text-[#364354] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Youtube size={24} />
                  </a>
                  <a
                    href="https://www.tiktok.com/@s2.visual.productions?_t=8sgqAd0Xyle&_r=1"
                    className="text-muted-foreground hover:text-[#364354] transition-colors font-medium"
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 bg-secondary border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-[#364354]"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 bg-secondary border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-[#364354]"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 bg-secondary border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-[#364354]"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#364354] text-white rounded-md hover:bg-[#364354]/90 transition-colors"
                >
                  Send Message
                </button>
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