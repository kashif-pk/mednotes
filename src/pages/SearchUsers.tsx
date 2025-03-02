
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Loader2, Search, User, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

const SearchUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Search for users when debounced search term changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!debouncedSearchTerm.trim()) {
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .ilike('full_name', `%${debouncedSearchTerm}%`)
          .not('full_name', 'is', null)
          .limit(20);

        if (error) throw error;
        setUsers(data || []);
      } catch (error: any) {
        console.error('Error searching users:', error);
        toast({
          title: "Error",
          description: "Failed to search for users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [debouncedSearchTerm, toast]);

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

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            Search Community Members
          </h1>
          
          <div className="relative mb-6">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {!loading && debouncedSearchTerm && users.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No users found matching "{debouncedSearchTerm}"
            </p>
          )}

          {!loading && !debouncedSearchTerm && (
            <p className="text-center text-muted-foreground py-4">
              Type a name to search for community members
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {users.map((user) => (
              <Link key={user.id} to={`/profile/${user.id}`} className="block">
                <Card className="hover:bg-card/80 transition-colors cursor-pointer h-full">
                  <CardContent className="flex items-center p-4 gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={user.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.full_name?.[0] || <User className="h-6 w-6" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-sm">{user.full_name || "Anonymous User"}</h3>
                      <p className="text-xs text-muted-foreground">View profile</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;
