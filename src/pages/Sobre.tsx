import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Target, 
  Heart, 
  Shield, 
  Users,
  Award,
  CheckCircle,
  MessageCircle
} from "lucide-react";
import { getWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

const values = [
  {
    icon: Target,
    title: "Especialização",
    description: "Foco 100% em profissionais da saúde. Conhecemos suas dores, necessidades e particularidades.",
  },
  {
    icon: Heart,
    title: "Humanização",
    description: "Atendimento acolhedor por especialistas. Você não é mais um número, é nosso parceiro.",
  },
  {
    icon: Shield,
    title: "Segurança",
    description: "Compliance total com a legislação. Tranquilidade fiscal para você focar no que importa.",
  },
  {
    icon: Users,
    title: "Parceria",
    description: "Construímos relacionamentos de longo prazo. Seu sucesso é o nosso sucesso.",
  },
];

const stats = [
  { number: "500+", label: "Profissionais atendidos" },
  { number: "10+", label: "Anos de experiência" },
  { number: "R$ 10M+", label: "Economia gerada para clientes" },
  { number: "98%", label: "Satisfação dos clientes" },
];

const team = [
  {
    name: "Equipe Contábil",
    role: "Especialistas em tributação para saúde",
    description: "Contadores especializados em regimes tributários para profissionais da saúde.",
  },
  {
    name: "Equipe Fiscal",
    role: "Gestão de obrigações acessórias",
    description: "Responsáveis por manter todas as declarações e obrigações em dia.",
  },
  {
    name: "Equipe de Suporte",
    role: "Atendimento humanizado",
    description: "Time dedicado a resolver suas dúvidas com rapidez e eficiência.",
  },
];

export default function Sobre() {
  return (
    <>
      <SEOHead
        title="Sobre Nós | Quem Somos"
        description="Conheça a Contabilidade Zen: contabilidade digital especializada em profissionais da saúde. Mais de 500 clientes atendidos, 10+ anos de experiência e 98% de satisfação."
        keywords="contabilidade zen, sobre nós, quem somos, contabilidade saúde, contabilidade digital"
        canonical="/sobre"
        pageType="service"
        includeOrganization
      />
      <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="bg-gradient-hero py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
                Quem{" "}
                <span className="text-gradient">Somos</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Somos uma contabilidade digital especializada em profissionais da saúde. 
                Nossa missão é oferecer paz de espírito e prosperidade financeira através 
                de uma contabilidade inteligente e humanizada.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
                  Nossa Missão
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-foreground">
                  Paz de espírito e prosperidade financeira para quem cuida da saúde
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Entendemos que você dedicou anos à sua formação e trabalha duro para 
                  cuidar da saúde das pessoas. Não é justo que você perca tempo e dinheiro 
                  com uma contabilidade genérica que não entende suas necessidades.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Por isso, criamos uma contabilidade 100% focada em profissionais da saúde, 
                  com tecnologia para facilitar sua vida e especialistas que falam a sua língua.
                </p>
                
                <ul className="space-y-3">
                  {[
                    "Especialização em médicos, dentistas, psicólogos e mais",
                    "Tecnologia para simplificar a burocracia",
                    "Atendimento humanizado por especialistas",
                    "Foco em redução legal de impostos",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl p-6 border border-border text-center"
                  >
                    <span className="text-4xl font-bold text-secondary">{stat.number}</span>
                    <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nossos Valores
              </h2>
              <p className="text-lg text-muted-foreground">
                Os princípios que guiam nosso trabalho e relacionamento com clientes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 border border-border hover:border-secondary/50 hover:shadow-card transition-all text-center"
                >
                  <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nossa Equipe
              </h2>
              <p className="text-lg text-muted-foreground">
                Profissionais dedicados e especializados em contabilidade para a área da saúde.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 border border-border text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-zen-teal to-zen-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-10 w-10 text-secondary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-secondary text-sm mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para fazer parte da nossa história?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Junte-se aos mais de 500 profissionais da saúde que já confiam na Contabilidade Zen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="xl" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                asChild
              >
                <Link to="/contato">
                  Agendar Consulta Gratuita
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="whatsapp" size="xl" asChild>
                <a
                  href={getWhatsAppLink(WHATSAPP_MESSAGES.sobre)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
    </>
  );
}
