
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

export const NotesUpload = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
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
    if (!file || !title || !category) {
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

      // Upload file to storage with optimized settings
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      console.log("Uploading file:", {
        fileName,
        fileType: file.type,
        fileSize: file.size
      });

      // Upload file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("notes")
        .upload(fileName, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      console.log("Upload successful:", uploadData);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("notes")
        .getPublicUrl(fileName);

      console.log("Public URL generated:", publicUrl);

      // Save note metadata with explicit typing
      const { data: noteData, error: dbError } = await supabase
        .from("notes")
        .insert([{
          title,
          description,
          category,
          file_url: publicUrl,
          user_id: user.id,
          created_at: new Date().toISOString(),
        }])
        .select();

      if (dbError) {
        console.error("Database error:", dbError);
        // Try to delete the uploaded file if database insert fails
        await supabase.storage.from("notes").remove([fileName]);
        throw new Error(`Failed to save note information: ${dbError.message}`);
      }

      console.log("Note metadata saved:", noteData);

      toast({
        title: "Success!",
        description: "Your notes have been uploaded successfully.",
      });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error uploading notes",
        description: error.message || "An unexpected error occurred. Please try again.",
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
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload Notes</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Your Notes</DialogTitle>
          <DialogDescription>
            Share your study materials with the community. Supported formats: PDF, DOC, DOCX.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter note description"
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">File</label>
            <Input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              required
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Upload Notes
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
