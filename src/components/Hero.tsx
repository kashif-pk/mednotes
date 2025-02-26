
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] w-full overflow-hidden">
      <LampContainer className="h-full px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative z-10 max-w-5xl mx-auto text-center space-y-6 md:space-y-8 translate-y-[-20%]"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight px-4">
            <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text bg-300% animate-gradient">
              Share Your Nursing Knowledge
            </span>
            <span className="block mt-2 text-4xl sm:text-5xl md:text-6xl bg-gradient-to-br from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              With the Community
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-slate-300 max-w-2xl mx-auto leading-relaxed px-4">
            A free platform for nursing students to share and access study notes, 
            <span className="text-cyan-400 font-medium"> created by students, for students.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 md:pt-8 px-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/notes")}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 text-white text-base sm:text-lg w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 rounded-xl shadow-lg hover:shadow-xl"
            >
              Browse Notes
            </Button>
          </div>
        </motion.div>
      </LampContainer>
    </div>
  );
};
