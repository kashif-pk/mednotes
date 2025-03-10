
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] w-full flex items-center justify-center bg-gradient-to-b from-background to-black/50 pt-20">
      <div className="max-w-5xl mx-auto text-center space-y-6 md:space-y-8 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text bg-300% animate-gradient">
            Share Your Nursing Knowledge
          </span>
          <span className="block mt-2 text-4xl sm:text-5xl md:text-6xl bg-gradient-to-br from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            With the Community
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-300 max-w-2xl mx-auto leading-relaxed">
          A free platform for nursing students to share and access study notes, 
          <span className="text-cyan-400 font-medium"> created by students, for students.</span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 md:pt-8">
          <Button 
            size="lg" 
            onClick={() => navigate("/notes")}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 text-white text-base sm:text-lg w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg hover:shadow-xl"
          >
            Browse Notes
          </Button>
        </div>
      </div>
    </div>
  );
};
