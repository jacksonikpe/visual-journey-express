import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/AnimatedBackground";

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
      
      <div className="pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden">
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
                Turning Heartfelt Moments into{" "}
                <span className="text-primary">Timeless Visuals</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground animate-fade-up">
                At S2 Visual Productions, we specialize in capturing the essence of every moment with authenticity and creativity. From corporate events and personal photoshoots to short films, podcasts, and documentaries, we bring your vision to life with passion and precision.
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
                  Let's Create Together
                </Link>
              </div>
            </div>
          </div>
        </section>

      {/* Recent Work Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Recent Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentWork.map((work, index) => (
                <div key={work.title} className="group relative overflow-hidden rounded-lg aspect-video">
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-xl font-bold mb-2">{work.title}</h3>
                      <p className="text-muted-foreground mb-4">{work.description}</p>
                      <Link to="/portfolio" className="text-primary hover:text-primary/80 transition-colors">
                        SEE ALBUM →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Call to Action Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="/lovable-uploads/94ceb6c1-e80a-4546-a589-67faa27e5d72.png"
            alt="Mountain landscape"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Are You Ready to Tell an Untold Story?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Sound, Lights, Camera, Action.<br />
            Let us transform your imagination into an unforgettable reality.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            REACH OUT
            <ArrowRight />
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

const recentWork = [
  {
    title: "Events",
    description: "Capturing the vibrancy and emotions of every gathering.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
  },
  {
    title: "Togetherness",
    description: "Highlighting the warmth and connection in shared moments.",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
  },
  {
    title: "Freelance Projects",
    description: "Creative collaborations brought to life through stunning visuals.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
  },
];

export default Index;
