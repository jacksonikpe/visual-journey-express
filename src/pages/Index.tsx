import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Index = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title animate-fade-down">
              Capturing Life's
              <span className="text-primary"> Beautiful</span> Moments
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground animate-fade-up">
              Professional videography and photography services that tell your story
              with cinematic excellence
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
              <Link
                to="/portfolio"
                className="group px-6 py-3 bg-primary text-primary-foreground rounded-full flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                View Our Work
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 border border-primary/30 text-primary rounded-full hover:bg-primary/10 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-secondary animate-pulse">
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)
                `
              }}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="section-title text-center animate-on-scroll">
            Our <span className="text-primary">Services</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="group p-6 bg-card/80 backdrop-blur-sm rounded-lg card-hover animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center animate-on-scroll">
            Featured <span className="text-primary">Work</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredWork.map((work, index) => (
              <div
                key={work.title}
                className="group relative aspect-video overflow-hidden rounded-lg animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                    <p className="text-muted-foreground">{work.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

const services = [
  {
    title: "Videography",
    description: "Professional video production for events, commercials, and documentaries.",
    icon: Play,
  },
  {
    title: "Photography",
    description: "Capturing moments with artistic vision and technical excellence.",
    icon: Play,
  },
  {
    title: "Post-Production",
    description: "Expert editing and color grading to perfect your visual story.",
    icon: Play,
  },
];

const featuredWork = [
  {
    title: "Mountain Documentary",
    description: "A journey through the majestic peaks of the Himalayas",
    image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed",
  },
  {
    title: "Ocean Stories",
    description: "Exploring the depths of marine life and conservation",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
  },
];

export default Index;