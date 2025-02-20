
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

export const FeaturedNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // First, get all notes ordered by creation date
        const { data, error } = await supabase
          .from("notes")
          .select(`
            *,
            profiles (
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
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${note.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        window.open(note.file_url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the file",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="text-center">Loading notes...</div>
      </div>
    );
  }

  return (
    <section className="container py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Featured Notes</h2>
        <p className="text-muted-foreground mt-2">
          Latest study materials shared by our community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <Card key={note.id} className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-start justify-between gap-2">
                <span className="line-clamp-2">{note.title}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                  {note.category}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {note.description}
              </p>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="w-4 h-4 mr-1" />
                  <span>{note.profiles.full_name || "Anonymous"}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleNoteAction(note, 'view')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleNoteAction(note, 'download')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button 
          size="lg" 
          onClick={() => navigate("/notes")}
          className="bg-primary hover:bg-primary/90"
        >
          Browse All Notes
        </Button>
      </div>
    </section>
  );
};
