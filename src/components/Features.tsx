
import { Upload, Download, Search, Users } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Share your notes with just a few clicks",
    },
    {
      icon: Download,
      title: "Quick Download",
      description: "Access study materials instantly",
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find exactly what you need",
    },
    {
      icon: Users,
      title: "Community",
      description: "Learn from fellow nursing students",
    },
  ];

  return (
    <section className="py-20 bg-black/40">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
