
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Skeleton } from "@/components/ui/skeleton";
import { getPageContent, getContent, CONTENT_UPDATED_EVENT } from "@/lib/contentStore";

const Index = () => {
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
  const [content, setContent] = useState(getPageContent("home"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the latest content from Supabase/localStorage
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const allContent = await getContent();
        setContent(allContent.home);
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
    
    // Listen for content updates
    const handleContentUpdate = () => {
      setContent(getPageContent("home"));
    };
    
    window.addEventListener(CONTENT_UPDATED_EVENT, handleContentUpdate);
    
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
    
    return () => {
      window.removeEventListener(CONTENT_UPDATED_EVENT, handleContentUpdate);
      observer.disconnect();
    };
  }, []);

  const handleImageLoad = (title: string) => {
    setLoadedImages((prev) => ({ ...prev, [title]: true }));
  };

  const ctaSection = content.ctaSection as Record<string, string>;

  // Function to apply text-primary class to the last two words
  const formatHeroTitle = (title: string) => {
    if (!title) return "";
    const words = title.split(" ");
    
    if (words.length <= 2) {
      return <span className="text-primary">{title}</span>;
    }
    
    const regularWords = words.slice(0, -2).join(" ");
    const highlightedWords = words.slice(-2).join(" ");
    
    return (
      <>
        {regularWords}{" "}
        <span className="text-primary">{highlightedWords}</span>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24">
        <section className="min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden">
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

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="hero-title animate-fade-down">
                {formatHeroTitle(content.heroTitle as string)}
              </h1>
              <p className="mt-6 text-lg md:text-xl animate-fade-up text-[#364354]">
                {content.heroDescription as string}
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

        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Recent Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentWork.map((work) => (
                <div
                  key={work.title}
                  className="group relative overflow-hidden rounded-lg aspect-video"
                >
                  {!loadedImages[work.title] && (
                    <Skeleton className="w-full h-full absolute inset-0" />
                  )}
                  <img
                    src={work.image}
                    alt={work.title}
                    onLoad={() => handleImageLoad(work.title)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-xl font-bold mb-2">{work.title}</h3>
                      <p className="text-muted-foreground mb-4">
                        {work.description}
                      </p>
                      <Link
                        to="/portfolio"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        SEE ALBUM →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20">
          <div className="absolute inset-0 z-0">
            <LazyLoadImage
              src="https://res.cloudinary.com/didwhe7rc/image/upload/f_auto,q_auto/mountiains-photo-min_wtva76.jpg"
              alt="Mountain landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              {ctaSection.title}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {ctaSection.description.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < ctaSection.description.split('\n').length - 1 && <br />}
                </span>
              ))}
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
      </div>

      <Footer />
    </div>
  );
};

const recentWork = [
  {
    title: "Events",
    description: "Capturing the vibrancy and emotions of every gathering.",
    image:
      "https://res.cloudinary.com/didwhe7rc/image/upload/f_auto,q_auto/Weddingphoto_onge7u.jpg",
  },
  {
    title: "Togetherness",
    description: "Highlighting the warmth and connection in shared moments.",
    image:
      "https://res.cloudinary.com/didwhe7rc/image/upload/f_auto,q_auto/swimming-capture-moment-min_asv5ii.jpg",
  },
  {
    title: "Freelance Projects",
    description:
      "Creative collaborations brought to life through stunning visuals.",
    image:
      "https://res.cloudinary.com/didwhe7rc/image/upload/f_auto,q_auto/Moment-Capture-Photo_axcdxl.jpg",
  },
];

export default Index;
