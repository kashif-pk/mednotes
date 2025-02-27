
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

type Note = {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  };
};

// Map of categories to colors
const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    "Anatomy": "bg-purple-600/20 text-purple-400 border-purple-600/30",
    "Physiology": "bg-pink-600/20 text-pink-400 border-pink-600/30",
    "Pathology": "bg-orange-600/20 text-orange-400 border-orange-600/30",
    "Pharmacology": "bg-blue-600/20 text-blue-400 border-blue-600/30",
    "Clinical Medicine": "bg-emerald-600/20 text-emerald-400 border-emerald-600/30",
    "Surgery": "bg-red-600/20 text-red-400 border-red-600/30",
    "Other": "bg-gray-600/20 text-gray-400 border-gray-600/30"
  };
  
  return colorMap[category] || "bg-primary/10 text-primary border-primary/30";
};

export const FeaturedNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase
          .from("notes")
          .select(`
            *,
            profiles!notes_user_id_fkey (
              full_name
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Filter to get only the latest note from each category
        const latestByCategory = (data as Note[]).reduce((acc: Note[], current) => {
          const categoryExists = acc.find(note => note.category === current.category);
          if (!categoryExists) {
            acc.push(current);
          }
          return acc;
        }, []);

        // Take only the first 6 categories
        setNotes(latestByCategory.slice(0, 6));
      } catch (error: any) {
        toast({
          title: "Error fetching notes",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [toast]);

  const handleNoteAction = async (note: Note, action: 'view' | 'download') => {
    try {
      if (action === 'download') {
        const response = await fetch(note.file_url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${note.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        window.open(note.file_url, '_blank', 'noopener,noreferrer');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process the file",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-8 sm:py-12">
        <div className="text-center">Loading notes...</div>
      </div>
    );
  }

  return (
    <section className="container py-8 sm:py-12 px-4 sm:px-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Notes</h2>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Latest study materials shared by our community
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {notes.map((note) => (
          <Card key={note.id} className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-start justify-between gap-2">
                <span className="line-clamp-2 text-base sm:text-lg">{note.title}</span>
                <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(note.category)} whitespace-nowrap font-medium`}>
                  {note.category}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {note.description}
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>{note.profiles.full_name || "Anonymous"}</span>
                </div>
                <div className="flex flex-col xs:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                    onClick={() => handleNoteAction(note, 'view')}
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8 sm:h-9 text-xs sm:text-sm"
                    onClick={() => handleNoteAction(note, 'download')}
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <Button 
          size="lg" 
          onClick={() => navigate("/notes")}
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto text-sm sm:text-base py-2 px-4 sm:py-3 sm:px-6"
        >
          Browse All Notes
        </Button>
      </div>
    </section>
  );
};
