
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
import { FilePlus2, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

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
        <HowItWorks />
        <Testimonials />
        <Contact />
        <section className="py-16 bg-black/50">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">About Us</h2>
            <div className="glass rounded-lg p-8 space-y-6 animate-fade-in">
              <p className="text-lg text-gray-300 leading-relaxed text-center">
                We're passionate about making education accessible to everyone. Our platform connects students and professionals, creating a space where knowledge sharing becomes effortless and impactful.
              </p>
              <div className="flex justify-center space-x-6 mt-8">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 bg-black/80">
        <div className="container text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} MedNotes. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
