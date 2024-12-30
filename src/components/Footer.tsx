import { Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div>
            <Link to="/" className="text-2xl font-bold text-primary">
              S2 Visual Productions
            </Link>
            <p className="text-muted-foreground mt-2">
              Your Story, Our Lens, Infinite Possibilities
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-6">
              <a
                href="mailto:hello@s2visualproductions.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email us"
              >
                <Mail size={24} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Subscribe to our YouTube"
              >
                <Youtube size={24} />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 by S2 Visual Productions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;