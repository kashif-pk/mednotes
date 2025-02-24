
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotesUpload } from "@/components/NotesUpload";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "./ui/use-toast";

export const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Set up the subscription for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      
      if (_event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          MedNotes
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/notes">
            <Button variant="ghost">Browse Notes</Button>
          </Link>
          {user ? (
            <>
              <NotesUpload />
              <Link to="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
            </>
          ) : (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
