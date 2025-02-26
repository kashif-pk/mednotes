
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[90vh] w-full">
      <LampContainer className="h-full">
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center space-y-8"
        >
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
            <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text bg-300% animate-gradient">
              Share Your Nursing Knowledge
            </span>
            <span className="block mt-2 text-5xl md:text-6xl bg-gradient-to-br from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              With the Community
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A free platform for nursing students to share and access study notes, 
            <span className="text-cyan-400 font-medium"> created by students, for students.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button 
              size="lg" 
              onClick={() => navigate("/notes")}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl"
            >
              Browse Notes
            </Button>
          </div>
        </motion.div>
      </LampContainer>
    </div>
  );
};
