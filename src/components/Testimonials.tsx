
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Nursing Student",
      image: "/placeholder.svg",
      content: "MedNotes has transformed how I study. The quality of shared notes is exceptional!",
    },
    {
      name: "Michael Chen",
      role: "Medical Student",
      image: "/placeholder.svg",
      content: "The collaborative features help me stay on top of my studies. Highly recommended!",
    },
    {
      name: "Emily Rodriguez",
      role: "Nursing Graduate",
      image: "/placeholder.svg",
      content: "I wish I had MedNotes when I first started my nursing journey. It's a game-changer!",
    },
  ];

  return (
    <section className="py-20 bg-black/40">
      <div className="container">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied students who are already using MedNotes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="bg-card/50 border-border/50 backdrop-blur-sm animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
