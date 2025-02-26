
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <LampContainer>
      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="text-center space-y-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-transparent">
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
      </motion.div>
    </LampContainer>
  );
};
