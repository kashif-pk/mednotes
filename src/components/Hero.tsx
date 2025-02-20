
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container max-w-6xl">
        <div className="text-center space-y-8 animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Share Your Nursing Knowledge
            <span className="block text-primary">With the Community</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A free platform for nursing students to share and access study notes, created by students, for students.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/notes")}
              className="bg-primary hover:bg-primary/90"
            >
              Browse Notes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
