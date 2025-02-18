
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotesUpload } from "@/components/NotesUpload";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export const Header = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          StudyNotes
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
