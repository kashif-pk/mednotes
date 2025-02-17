
import { Button } from "@/components/ui/button";
import { Upload, Download, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <span 
            onClick={() => navigate("/")}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary cursor-pointer"
          >
            MedNotes
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" className="flex items-center space-x-2">
            <Upload size={18} />
            <span>Upload</span>
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <Download size={18} />
            <span>Download</span>
          </Button>
          <Button variant="ghost" className="flex items-center space-x-2">
            <Search size={18} />
            <span>Search</span>
          </Button>
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2"
              >
                <User size={18} />
                <span>Profile</span>
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  navigate("/auth");
                }}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
