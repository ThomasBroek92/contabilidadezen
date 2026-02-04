import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  MapPin, 
  Globe, 
  MessageCircle, 
  CheckCircle2, 
  Laptop, 
  Users, 
  Building2,
  Phone,
  TrendingDown,
  Heart
} from "lucide-react";
import { citiesData, rmcCities, sulSudesteCities, outrasCities } from "@/components/sections/CitiesSection/citiesData";
import { getWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

const faqData = [
  {
    question: "Vocês atendem minha cidade?",
    answer: "Sim! Atendemos clientes em todo o Brasil de forma 100% digital. Nosso foco principal são as regiões Sul e Sudeste, especialmente a Região Metropolitana de Campinas, mas temos clientes satisfeitos em todas as regiões do país."
  },
  {
    question: "Preciso ir ao escritório presencialmente?",
    answer: "Não! Todo o atendimento é feito de forma digital, por WhatsApp, e-mail e videoconferência. Você não precisa sair de casa ou do seu consultório para resolver questões contábeis."
  },
  {
    question: "Como funciona o atendimento digital?",
    answer: "Você envia seus documentos pelo WhatsApp ou e-mail, e nossa equipe cuida de tudo. Temos um portal online onde você acompanha suas obrigações, impostos e documentos. O suporte é humano e personalizado."
  },
  {
    question: "Qual a diferença entre atendimento presencial e online?",
    answer: "Nenhuma diferença na qualidade! Na verdade, o atendimento digital é mais ágil e prático. Você resolve tudo pelo celular, sem trânsito, sem espera. E o melhor: com o mesmo cuidado e atenção de um contador dedicado."
  },
  {
    question: "Posso migrar minha contabilidade de outro escritório?",
    answer: "Sim! Cuidamos de todo o processo de migração sem custo adicional. Entramos em contato com seu contador atual, solicitamos os documentos necessários e fazemos toda a transição de forma tranquila."
  }
];

// Agrupar cidades por estado
const citiesByState = {
  "São Paulo": citiesData.filter(c => 
    c.region === "sudeste" && 
    ["São Paulo", "Guarulhos", "Santos", "São José dos Campos", "Sorocaba", "Ribeirão Preto", 
     "São Bernardo do Campo", "Santo André", "Osasco", "Mauá", "Diadema", "Barueri",
     "Piracicaba", "Limeira", "Jundiaí", "Bauru", "São Caetano do Sul", "Jacareí",
     "Atibaia", "Cotia", "Embu das Artes", "Marília", "Mogi das Cruzes", "São Carlos",
     "Ibitinga", "Santana de Parnaíba", "Taboão da Serra", "São José do Rio Preto"].includes(c.name)
  ),
  "Rio de Janeiro": citiesData.filter(c => 
    ["Rio de Janeiro", "Duque de Caxias", "Niterói", "Nova Iguaçu"].includes(c.name)
  ),
  "Minas Gerais": citiesData.filter(c => 
    ["Belo Horizonte", "Contagem", "Uberlândia"].includes(c.name)
  ),
  "Espírito Santo": citiesData.filter(c => c.name === "Vitória"),
  "Paraná": citiesData.filter(c => 
    ["Curitiba", "Londrina", "Maringá", "Pinhais"].includes(c.name)
  ),
  "Santa Catarina": citiesData.filter(c => 
    ["Blumenau", "Florianópolis"].includes(c.name)
  ),
  "Rio Grande do Sul": citiesData.filter(c => c.name === "Porto Alegre")
};

const benefits = [
  { icon: Laptop, title: "100% Digital", description: "Tudo online, sem papelada" },
  { icon: Globe, title: "Atendimento Nacional", description: "Clientes em todo Brasil" },
  { icon: TrendingDown, title: "Economia de Impostos", description: "Planejamento tributário" },
  { icon: Users, title: "Suporte Humano", description: "Contador dedicado" },
  { icon: Building2, title: "Sem Deslocamento", description: "Resolva pelo celular" }
];

const whatsappLink = getWhatsAppLink(WHATSAPP_MESSAGES.cidadesAtendidas);

export default function CidadesAtendidas() {
  return (
    <>
      <SEOHead
        title="Cidades Atendidas | Contabilidade Digital em Todo Brasil"
        description="A Contabilidade Zen atende empresas e profissionais em todo o Brasil. Veja a lista completa de cidades atendidas, com foco na região de Campinas, Sul e Sudeste."
        keywords="contabilidade Campinas, contabilidade Americana, contador digital, contabilidade online Brasil, contabilidade Indaiatuba, contabilidade São Paulo"
        canonical="/cidades-atendidas"
        pageType="service"
        includeLocalBusiness
        faqs={faqData}
      />
      
      <Header />
      
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6">
                <Globe className="w-4 h-4 mr-2" />
                Atendimento Nacional
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Cidades Atendidas pela{" "}
                <span className="text-primary">Contabilidade Zen</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Atendemos em todo o Brasil, com especialização nas regiões Sul e Sudeste, 
                especialmente na Região Metropolitana de Campinas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Falar com Especialista
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/servicos">Ver Serviços</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* RMC Section - Destaque */}
        <section className="py-16 lg:py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Região de Campinas — Nossa Sede
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Atendimento especializado e personalizado para as {rmcCities.length} cidades da RMC
              </p>
            </div>
            
            <div className="bg-card rounded-2xl p-8 lg:p-12 shadow-lg border">
              <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
                {rmcCities.map((city, index) => (
                  index === 0 ? (
                    <Link
                      key={city.name}
                      to="/contabilidade-em-campinas"
                      className="px-4 py-2 rounded-full transition-all bg-primary text-primary-foreground text-lg lg:text-xl font-bold shadow-md hover:bg-primary/90 hover:scale-105"
                    >
                      {city.name}
                    </Link>
                  ) : (
                    <span
                      key={city.name}
                      className="px-4 py-2 rounded-full transition-all bg-secondary/20 text-foreground hover:bg-secondary/40 text-sm lg:text-base"
                    >
                      {city.name}
                    </span>
                  )
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sul e Sudeste Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Regiões Sul e Sudeste
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Atendemos as principais cidades das regiões Sul e Sudeste do Brasil
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(citiesByState).map(([state, cities]) => (
                cities.length > 0 && (
                  <Card key={state} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span>{state}</span>
                        <Badge variant="secondary">{cities.length} {cities.length === 1 ? 'cidade' : 'cidades'}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {cities.map(city => (
                          <span
                            key={city.name}
                            className="text-sm px-3 py-1 bg-muted rounded-full text-muted-foreground"
                          >
                            {city.name}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          </div>
        </section>

        {/* Outras Regiões Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Atendimento Nacional
                </h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Também atendemos clientes em outras regiões do Brasil
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nordeste</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {outrasCities
                      .filter(c => ["Salvador", "Fortaleza", "Recife", "Natal", "João Pessoa", "Maceió", "Aracaju", "São Luís", "Teresina"].includes(c.name))
                      .map(city => (
                        <span key={city.name} className="text-sm px-3 py-1 bg-muted rounded-full text-muted-foreground">
                          {city.name}
                        </span>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Centro-Oeste</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {outrasCities
                      .filter(c => ["Brasília", "Goiânia", "Campo Grande", "Cuiabá"].includes(c.name))
                      .map(city => (
                        <span key={city.name} className="text-sm px-3 py-1 bg-muted rounded-full text-muted-foreground">
                          {city.name}
                        </span>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Norte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {outrasCities
                      .filter(c => ["Manaus", "Belém"].includes(c.name))
                      .map(city => (
                        <span key={city.name} className="text-sm px-3 py-1 bg-muted rounded-full text-muted-foreground">
                          {city.name}
                        </span>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Por que Contabilidade Digital?
              </h2>
              <p className="text-muted-foreground text-lg">
                Vantagens de ter um contador 100% online
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Perguntas Frequentes
                </h2>
                <p className="text-muted-foreground text-lg">
                  Tire suas dúvidas sobre nosso atendimento
                </p>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-primary to-primary/80">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Pronto para ter uma contabilidade digital de verdade?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Atendimento personalizado para sua cidade, sem compromisso.
              </p>
              
              <Button size="lg" variant="secondary" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar com Especialista
                </a>
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 text-primary-foreground/70 text-sm">
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Atendimento personalizado
                </span>
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Sem compromisso
                </span>
                <span className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Resposta em até 2h
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
