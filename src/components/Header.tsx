
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotesUpload } from "@/components/NotesUpload";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "./ui/use-toast";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  isAuth?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Browse Notes",
    href: "/notes",
  },
  {
    title: "Upload Notes",
    href: "/notes/upload",
    isAuth: true,
  },
];

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
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="font-bold text-xl">
            MedNotes
          </Link>
        </div>
        <div className="flex md:hidden">
          <MobileNav isAuthenticated={!!user} />
        </div>
        <div className="flex md:hidden ml-2">
          <Link to="/" className="font-bold text-xl">
            MedNotes
          </Link>
        </div>
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:flex">
          {navItems.map((item) => {
            if (item.isAuth && !user) return null;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary"
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <div className="hidden md:block">
                <NotesUpload />
              </div>
              <Link to="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
            </>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
