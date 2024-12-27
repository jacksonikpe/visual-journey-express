import { Mail, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div>
            <Link to="/" className="text-2xl font-bold text-primary">LENS</Link>
            <p className="text-muted-foreground mt-2">Capturing life's beautiful moments</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="mailto:hello@lens.com" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail size={24} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter size={24} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;