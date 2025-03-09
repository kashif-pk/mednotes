
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { FileUp, Loader2 } from "lucide-react";

const categories = [
  "Anatomy",
  "Physiology",
  "Pathology",
  "Pharmacology",
  "Clinical Medicine",
  "Surgery",
  "Other",
];

const years = [
  "1st Year",
  "2nd Year",
  "3rd Year", 
  "4th Year",
  "5th Year",
  "6th Year",
];

export const NotesUpload = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      console.log("Selected file:", selectedFile.name, selectedFile.type);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !category || !year) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Auth error:", userError);
        throw new Error("Authentication error. Please sign in again.");
      }
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Create a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      console.log("Preparing file upload:", {
        fileName,
        fileType: file.type,
        fileSize: file.size,
      });

      // Upload file to Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('notes')
        .upload(fileName, file);

      if (storageError) {
        console.error("Storage error:", storageError);
        throw new Error(`Storage error: ${storageError.message}`);
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('notes')
        .getPublicUrl(fileName);
      
      const publicUrl = data.publicUrl;
      console.log("Got public URL:", publicUrl);

      // Save metadata
      const { data: noteData, error: dbError } = await supabase
        .from("notes")
        .insert([{
          title,
          description,
          category,
          year,
          file_url: publicUrl,
          user_id: user.id,
          created_at: new Date().toISOString(),
        }])
        .select();

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log("Note saved successfully:", noteData);

      toast({
        title: "Success!",
        description: "Your notes have been uploaded successfully.",
      });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setYear("");
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload Notes</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto p-3">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-sm">Upload Your Notes</DialogTitle>
          <DialogDescription className="text-xs">
            Share your study materials with the community. Supported formats: PDF, DOC, DOCX.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-1.5">
          <div className="space-y-1">
            <label className="text-xs font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              required
              className="h-7 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Category</label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Year</label>
              <Select value={year} onValueChange={setYear} required>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((yr) => (
                    <SelectItem key={yr} value={yr} className="text-xs">
                      {yr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter note description"
              className="resize-none h-10 min-h-0 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">File</label>
            <Input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              required
              className="h-7 text-xs"
            />
            {file && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Selected: {file.name}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loading}
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-3 w-3" />
                Upload Notes
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
