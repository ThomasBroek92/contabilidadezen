import { Button } from "@/components/ui/button";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Carlos Mendes",
    role: "Cardiologista",
    location: "São Paulo, SP",
    content: "Desde que contratei a Contabilidade Zen, consegui reduzir mais de 30% dos meus impostos. Finalmente tenho tranquilidade para focar nos meus pacientes.",
    rating: 5,
  },
  {
    name: "Dra. Ana Paula Silva",
    role: "Proprietária de Clínica",
    location: "Rio de Janeiro, RJ",
    content: "A equipe é extremamente atenciosa e entende perfeitamente as necessidades da área médica. Recomendo para todos os colegas de profissão!",
    rating: 5,
  },
  {
    name: "Dr. Roberto Almeida",
    role: "Cirurgião Plástico",
    location: "Belo Horizonte, MG",
    content: "Migrei de Pessoa Física para PJ com a orientação deles e a economia foi impressionante. Atendimento impecável do início ao fim.",
    rating: 5,
  },
];

export function MedicosTestimonials() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Depoimentos
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
            Eles podem dizer melhor sobre nossos serviços do que nós!
          </h2>
          <p className="text-muted-foreground text-lg">
            Confira os resultados que nossos clientes médicos estão tendo com nosso apoio
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-6 bg-card rounded-xl border border-border relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-secondary/20" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                ))}
              </div>
              
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-secondary">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" onClick={scrollToForm}>
            Fale com um especialista
          </Button>
        </div>
      </div>
    </section>
  );
}
