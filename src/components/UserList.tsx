
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User } from "lucide-react";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

export const UserList = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .not('full_name', 'is', null)
          .limit(6);

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">No users found.</p>
    );
  }

  return (
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
  );
};
