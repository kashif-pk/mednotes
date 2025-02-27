import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Eye, Search, User, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

const categories = [
  "All",
  "Anatomy",
  "Physiology",
  "Pathology",
  "Pharmacology",
  "Clinical Medicine",
  "Surgery",
  "Other",
];

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

const ITEMS_PER_PAGE = 9;

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, [selectedCategory, currentPage]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("notes")
        .select(`
          *,
          profiles!notes_user_id_fkey (
            full_name
          )
        `, { count: 'exact' })
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      console.log("Fetched notes with profiles:", data); // For debugging
      setNotes(data as Note[]);
      if (count) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }
    } catch (error: any) {
      console.error("Error fetching notes:", error); // For debugging
      toast({
        title: "Error fetching notes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black pt-20 px-4">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Study Notes</h1>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading notes...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-2">
                      <span className="line-clamp-2">{note.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(note.category)} whitespace-nowrap font-medium`}>
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
              {filteredNotes.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No notes found. Try adjusting your search or filter.
                </div>
              )}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center pb-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {generatePaginationItems()}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notes;
