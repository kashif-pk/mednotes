
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-black">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
};

export default Index;
