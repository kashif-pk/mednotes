
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
        <HowItWorks />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
