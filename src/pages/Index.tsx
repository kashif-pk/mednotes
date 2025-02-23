
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { FeaturedNotes } from "@/components/FeaturedNotes";
import { Contact } from "@/components/Contact";
import { NotesUpload } from "@/components/NotesUpload";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { FilePlus2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black">
      <Header />
      <main>
        <Hero />
        <Features />
        <div className="container py-8 flex justify-center">
          {isAuthenticated ? (
            <NotesUpload />
          ) : (
            <Button onClick={() => navigate("/auth")}>
              <FilePlus2 className="mr-2 h-4 w-4" />
              Sign in to Upload Notes
            </Button>
          )}
        </div>
        <FeaturedNotes />
        <section className="py-16 bg-black/50">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">About Us</h2>
            <div className="glass rounded-lg p-8 space-y-6 animate-fade-in">
              <p className="text-lg text-gray-300 leading-relaxed">
                Welcome to our innovative note-sharing platform! We're passionate about creating a collaborative space where knowledge flows freely and learning knows no bounds. Our mission is to connect students and professionals, making quality study materials accessible to everyone.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Founded by a team of education enthusiasts, we understand the power of shared knowledge and the impact it can have on academic success. Our platform is built on the principles of community, accessibility, and excellence in education.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-purple-400">Our Vision</h3>
                  <p className="text-gray-400">To democratize education through collaborative learning and knowledge sharing.</p>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-purple-400">Our Mission</h3>
                  <p className="text-gray-400">To provide a secure and efficient platform for sharing high-quality educational resources.</p>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-purple-400">Our Values</h3>
                  <p className="text-gray-400">Community, Innovation, Quality, and Accessibility drive everything we do.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <HowItWorks />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
