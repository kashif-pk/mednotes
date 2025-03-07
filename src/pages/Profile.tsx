import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";
import { 
  ArrowLeft, 
  Camera, 
  Mail, 
  User as UserIcon, 
  Download, 
  Loader2, 
  Trash2, 
  Eye,
  Upload,
  Users,
  LogOut
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{
    full_name?: string;
    avatar_url?: string;
    id?: string;
  }>({});
  const [userNotes, setUserNotes] = useState<any[]>([]);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true);
        console.log("Initializing profile with userId:", userId);
        
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session:", session);
        
        if (!session?.user && !userId) {
          navigate("/auth");
          return;
        }
        
        const profileId = userId || session?.user.id;
        console.log("Profile ID to fetch:", profileId);
        
        if (!profileId) {
          navigate("/");
          return;
        }
        
        const currentUserViewing = !userId || (session?.user.id === userId);
        setIsCurrentUser(currentUserViewing);
        console.log("Is current user:", currentUserViewing);
        
        if (currentUserViewing && session?.user) {
          setUser(session.user);
          console.log("Set current user:", session.user);
        }
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast({
            title: "Error fetching profile",
            description: profileError.message,
            variant: "destructive",
          });
          
          if (profileError.code === "PGRST116" && !currentUserViewing) {
            navigate("/not-found");
            return;
          }
        } else if (profileData) {
          console.log("Fetched profile data:", profileData);
          setProfile(profileData);
        }
        
        await fetchUserNotes(profileId);
      } catch (error: any) {
        console.error('Error in initializeProfile:', error);
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [navigate, toast, userId]);

  const fetchUserNotes = async (userId: string) => {
    try {
      setNotesLoading(true);
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Fetched user notes:", data);
      setUserNotes(data || []);
    } catch (error: any) {
      console.error("Error fetching user notes:", error);
      toast({
        title: "Error loading notes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setNotesLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log("Updating profile with data:", profile);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      setDeletingNoteId(noteId);
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      setUserNotes(userNotes.filter(note => note.id !== noteId));
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting note",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingNoteId(null);
    }
  };

  const handleNoteAction = async (note: any, action: 'view' | 'download') => {
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !user) return;

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image should be less than 2MB",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const updatedProfile = { ...profile, avatar_url: publicUrl };
      setProfile(updatedProfile);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      });
      
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error logging out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-black flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
          <span className="text-sm sm:text-base">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black pt-20 px-4">
      <div className="container max-w-4xl mx-auto py-6 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 sm:mb-6 hover:bg-white/10 px-2 sm:px-4 h-8 sm:h-10 text-sm"
        >
          <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Back to Home
        </Button>

        {!isCurrentUser && (
          <div className="mb-4 bg-purple-500/10 border border-purple-500/20 rounded-md p-3 text-purple-300 text-sm flex items-center">
            <Users className="h-4 w-4 mr-2" />
            You are viewing {profile.full_name || "another user"}'s profile
          </div>
        )}

        <div className="grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-[280px_1fr]">
          <Card className="h-fit bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6 group">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-primary/20">
                  <AvatarImage src={profile.avatar_url || ""} />
                  <AvatarFallback className="text-2xl sm:text-4xl">
                    {profile.full_name?.[0] || (profile.id?.[0]?.toUpperCase() || "U")}
                  </AvatarFallback>
                </Avatar>
                {isCurrentUser && (
                  <div 
                    className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={handleUploadClick}
                  >
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" />
                  </div>
                )}
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <h3 className="text-base sm:text-xl font-semibold mb-2">
                {profile.full_name || "No name set"}
              </h3>
              {user?.email && isCurrentUser && (
                <p className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  {user.email}
                </p>
              )}
              {isCurrentUser && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 text-red-400 border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
                  onClick={handleLogout}
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Logout
                </Button>
              )}
              {uploading && (
                <div className="mt-2 flex items-center justify-center gap-2 text-xs text-primary">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Uploading...
                </div>
              )}
            </CardContent>
          </Card>

          {isCurrentUser ? (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                    <UserIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    Full Name
                  </label>
                  <Input
                    value={profile.full_name || ""}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Enter your full name"
                    className="bg-background/50 h-8 sm:h-10 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={profile.avatar_url || ""}
                      onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                      placeholder="Enter image URL"
                      className="bg-background/50 h-8 sm:h-10 text-sm flex-1"
                    />
                    <Button 
                      onClick={handleUploadClick}
                      className="h-8 sm:h-10"
                      variant="outline"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click on your avatar or the upload button to choose a profile picture
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                    Email
                  </label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-background/50 text-muted-foreground h-8 sm:h-10 text-sm"
                  />
                </div>

                <Button 
                  onClick={updateProfile} 
                  disabled={loading || uploading}
                  className="w-full h-8 sm:h-10 text-sm bg-primary/90 hover:bg-primary"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>{profile.full_name || "User"}'s Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  This user has shared {userNotes.length} {userNotes.length === 1 ? 'note' : 'notes'} with the community
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-6 sm:mt-8">
          <h2 className="text-lg sm:text-2xl font-bold mb-4">
            {isCurrentUser ? "Your Notes" : `${profile.full_name || "User"}'s Notes`}
          </h2>
          {notesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 sm:h-6 sm:w-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userNotes.map((note) => (
                <Card key={note.id} className="bg-card/50 backdrop-blur-sm hover:bg-card/60 transition-colors">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-start justify-between gap-2 text-base sm:text-lg">
                      <span className="line-clamp-2">{note.title}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                        {note.category}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2">
                      {note.description}
                    </p>
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
                      {isCurrentUser && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteNote(note.id)}
                          disabled={deletingNoteId === note.id}
                          className="h-8 sm:h-9"
                        >
                          {deletingNoteId === note.id ? (
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {userNotes.length === 0 && (
                <p className="text-muted-foreground col-span-2 text-center py-8 text-sm sm:text-base">
                  {isCurrentUser ? "You haven't uploaded any notes yet." : "This user hasn't uploaded any notes yet."}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
