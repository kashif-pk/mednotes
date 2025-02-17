
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const CTA = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (user) {
    return null; // Don't show CTA section for logged in users
  }

  return (
    <section className="py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">
          <h2 className="text-4xl font-bold tracking-tight">
            Ready to Transform Your Medical Studies?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join MedNotes today and become part of a growing community of medical students sharing knowledge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/auth")}
            >
              Get Started Now
              <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
