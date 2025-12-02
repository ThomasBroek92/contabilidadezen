import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Ricardo Mendes",
    role: "Cardiologista",
    location: "São Paulo, SP",
    content: "Economizei mais de R$ 30.000 por ano com o planejamento tributário da Contabilidade Zen. Além disso, não preciso mais me preocupar com a burocracia dos plantões.",
    rating: 5,
    savings: "R$ 30.000/ano",
  },
  {
    name: "Dra. Carolina Silva",
    role: "Dentista",
    location: "Rio de Janeiro, RJ",
    content: "Finalmente encontrei uma contabilidade que entende as particularidades do meu consultório odontológico. O suporte é excepcional e sempre respondem rápido.",
    rating: 5,
    savings: "R$ 18.000/ano",
  },
  {
    name: "Dr. Fernando Costa",
    role: "Psicólogo",
    location: "Belo Horizonte, MG",
    content: "Tinha medo de abrir empresa, mas a equipe me explicou tudo de forma simples. Hoje pago 6% de imposto ao invés dos 27,5% que pagava como autônomo.",
    rating: 5,
    savings: "R$ 22.000/ano",
  },
  {
    name: "Dra. Ana Beatriz",
    role: "Dermatologista",
    location: "Curitiba, PR",
    content: "A migração da minha contabilidade foi super tranquila. Eles cuidaram de todo o processo e eu não precisei fazer nada. Muito profissionais!",
    rating: 5,
    savings: "R$ 25.000/ano",
  },
  {
    name: "Dr. Marcos Oliveira",
    role: "Fisioterapeuta",
    location: "Porto Alegre, RS",
    content: "O aplicativo facilita muito minha vida. Consigo ver todas as guias de pagamento e relatórios direto no celular. Recomendo demais!",
    rating: 5,
    savings: "R$ 15.000/ano",
  },
  {
    name: "Dra. Juliana Rocha",
    role: "Nutricionista",
    location: "Brasília, DF",
    content: "Atendimento humanizado de verdade. Sempre que tenho dúvidas, eles explicam com paciência e clareza. Vale cada centavo investido.",
    rating: 5,
    savings: "R$ 12.000/ano",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-foreground">
            O que nossos clientes{" "}
            <span className="text-gradient">dizem</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Mais de 500 profissionais da saúde já confiam na Contabilidade Zen. 
            Veja o que eles têm a dizer sobre nossa parceria.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 lg:p-8 border border-border hover:border-secondary/50 hover:shadow-card transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-secondary/30 mb-4" />

              {/* Content */}
              <p className="text-foreground/80 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Economia</p>
                  <p className="font-bold text-secondary">{testimonial.savings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
