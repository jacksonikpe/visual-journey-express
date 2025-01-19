import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div 
        className="flex-grow container mx-auto px-4 pt-24 pb-16 relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">Our Story</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-white/90 mb-6">
              With over a decade of experience in visual storytelling, we've dedicated ourselves to capturing life's most precious moments and transforming them into timeless pieces of art.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
            <p className="text-lg text-white/90 mb-8">
              We believe in the power of visual storytelling to move, inspire, and connect people. Our mission is to create compelling visual narratives that resonate with audiences and leave lasting impressions.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-12">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
                <h3 className="text-xl font-bold mb-3 text-primary">Vision</h3>
                <p className="text-white/90">
                  To be the leading creative force in visual storytelling, pushing boundaries and setting new standards in videography and photography.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
                <h3 className="text-xl font-bold mb-3 text-primary">Values</h3>
                <p className="text-white/90">
                  Creativity, authenticity, and excellence guide everything we do, ensuring each project receives our undivided attention and expertise.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default About;