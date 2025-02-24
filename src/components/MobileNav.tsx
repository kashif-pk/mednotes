
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  isAuth?: boolean;
}

interface MobileNavProps {
  isAuthenticated: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Browse Notes",
    href: "/notes",
  },
  {
    title: "Upload Notes",
    href: "/notes/upload",
    isAuth: true,
  },
  {
    title: "Profile",
    href: "/profile",
    isAuth: true,
  },
];

export function MobileNav({ isAuthenticated }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => {
            if (item.isAuth && !isAuthenticated) return null;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                )}
              >
                <div className="text-sm font-medium leading-none">{item.title}</div>
              </Link>
            );
          })}
          {!isAuthenticated && (
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              Sign In
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
