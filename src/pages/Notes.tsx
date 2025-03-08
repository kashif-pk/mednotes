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
import { Download, Eye, Search, User, Filter, Clock } from "lucide-react";
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
  year: string;
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

const years = [
  "All",
  "1st Year",
  "2nd Year",
  "3rd Year", 
  "4th Year",
  "5th Year",
  "6th Year",
];

const getCategoryColor = () => {
  return "bg-purple-500/25 text-purple-300 border-purple-500/40 font-semibold";
};

const ITEMS_PER_PAGE = 9;

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, [selectedCategory, selectedYear, currentPage]);

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
      
      if (selectedYear !== "All") {
        query = query.eq("year", selectedYear);
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
  
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setCurrentPage(1); // Reset to first page when changing year
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
            <div className="flex gap-2 flex-1 md:flex-none">
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full md:w-40">
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
              
              <Select
                value={selectedYear}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-full md:w-32">
                  <Clock className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading notes...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 pb-12">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-2">
                      <span className="line-clamp-2 text-base sm:text-lg">{note.title}</span>
                      <div className="flex flex-col gap-1 items-end">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor()} whitespace-nowrap`}>
                          {note.category}
                        </span>
                        {note.year && (
                          <span className="text-xs px-2 py-1 rounded-full border border-blue-500/40 bg-blue-500/25 text-blue-300 font-semibold whitespace-nowrap">
                            {note.year}
                          </span>
                        )}
                      </div>
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
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full h-8 sm:h-9 text-xs sm:text-sm px-1 sm:px-2"
                          onClick={() => handleNoteAction(note, 'view')}
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="whitespace-nowrap">View</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full h-8 sm:h-9 text-xs sm:text-sm px-1 sm:px-2"
                          onClick={() => handleNoteAction(note, 'download')}
                        >
                          <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="whitespace-nowrap">Download</span>
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
