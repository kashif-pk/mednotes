
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black">
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
};

export default Index;
