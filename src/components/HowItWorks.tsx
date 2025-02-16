
import { FileText, Share2, UserCheck, Download } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      title: "Create Notes",
      description: "Upload your medical study notes and materials",
    },
    {
      icon: Share2,
      title: "Share Knowledge",
      description: "Share your notes with the nursing community",
    },
    {
      icon: UserCheck,
      title: "Peer Review",
      description: "Get feedback from fellow nursing students",
    },
    {
      icon: Download,
      title: "Access Anywhere",
      description: "Download and study from any device",
    },
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl font-bold mb-4">How MedNotes Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of nursing students who are already sharing and learning together
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 animate-fade-up">
                <step.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-primary/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
