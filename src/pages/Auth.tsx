
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        console.log("Attempting signup...");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        console.log("Signup response:", { data, error });
        
        if (error) {
          if (error.message === "User already registered") {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
            setIsSignUp(false); // Switch to sign in mode
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully.",
          });
          navigate("/");
        }
      } else {
        console.log("Attempting signin with:", { email, password });
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        console.log("Signin response:", { data, error });

        if (error) {
          if (error.message === "Invalid login credentials") {
            toast({
              title: "Invalid credentials",
              description: "Please check your email and password and try again. If you haven't registered yet, please sign up first.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else if (data.user) {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {isSignUp
              ? "Sign up to start sharing your nursing knowledge"
              : "Sign in to your account"}
          </p>
        </div>
        <form onSubmit={handleAuth} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </Button>
        </form>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline"
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
