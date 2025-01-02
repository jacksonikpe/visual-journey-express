import { Instagram, Facebook, Youtube, Tiktok } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div>
            <Link to="/" className="block hover:opacity-90 transition-opacity">
              <img 
                src="/lovable-uploads/86030fa8-6840-48b2-936a-a81ff4e1b108.png" 
                alt="S2 Visual Production Logo" 
                className="h-12 w-auto mb-4"
              />
            </Link>
            <p className="text-muted-foreground">
              Your Story, Our Lens, Infinite Possibilities
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com/s2visualproductions/profilecard/?igsh=MXBvZnoyeHR3N3hkbw=="
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://www.facebook.com/share/15TN46X83N/?mibextid=wwXIfr"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://youtube.com/@s2visualproduction?si=GxOu1ExFTWvtVahn"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Subscribe to our YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube size={24} />
              </a>
              <a
                href="https://www.tiktok.com/@s2.visual.productions?_t=8sgqAd0Xyle&_r=1"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on TikTok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Tiktok size={24} />
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