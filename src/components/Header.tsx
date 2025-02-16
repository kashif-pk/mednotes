
import { Button } from "@/components/ui/button";
import { Upload, Download, Search } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            NurseNotes
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
          <Button variant="ghost" className="text-sm">
            Sign In
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};
