import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-healthcare.jpg";

const benefits = [
  "Economia de até 50% em impostos de forma legal",
  "Atendimento especializado para profissionais da saúde",
  "100% digital: sem burocracia e sem filas",
  "Consultoria tributária personalizada",
  "Suporte humanizado por especialistas",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
              Especialistas em Contabilidade para Saúde
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Você cuida da{" "}
              <span className="text-gradient">saúde</span>,{" "}
              nós cuidamos dos{" "}
              <span className="text-gradient">números</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Contabilidade especializada para médicos, dentistas, psicólogos e profissionais da saúde. 
              Reduza seus impostos legalmente e tenha paz de espírito fiscal.
            </p>

            {/* Benefits List */}
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-foreground/80">
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contato">
                  Agendar Consulta Gratuita
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="whatsapp" size="xl" asChild>
                <a
                  href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre contabilidade para profissionais da saúde."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  Fale pelo WhatsApp
                </a>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-secondary">500+</span>
                <span className="text-sm text-muted-foreground">Clientes<br />atendidos</span>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-secondary">10+</span>
                <span className="text-sm text-muted-foreground">Anos de<br />experiência</span>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-secondary">98%</span>
                <span className="text-sm text-muted-foreground">Satisfação<br />dos clientes</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:pl-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={heroImage}
                alt="Profissionais da saúde"
                className="w-full h-auto object-cover"
              />
              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-card/95 backdrop-blur rounded-xl p-4 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Economia garantida</p>
                    <p className="text-sm text-muted-foreground">Reduza seus impostos de forma legal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
