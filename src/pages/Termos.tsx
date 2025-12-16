import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

export default function Termos() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Termos de Uso | Contabilidade Zen</title>
        <meta
          name="description"
          content="Termos de Uso da Contabilidade Zen. Conheça os termos e condições de uso dos nossos serviços contábeis."
        />
      </Helmet>
      
      <Header />
      
      <main className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
              Termos de Uso
            </h1>
            
            <div className="prose prose-slate max-w-none space-y-8">
              <p className="text-muted-foreground text-lg">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">1. Aceitação dos Termos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ao acessar e utilizar o site e os serviços da Contabilidade Zen, você concorda 
                  em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com 
                  qualquer parte destes termos, não deverá utilizar nosso site ou serviços.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">2. Descrição dos Serviços</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Contabilidade Zen oferece serviços contábeis especializados para profissionais 
                  da saúde, incluindo mas não se limitando a:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Abertura e constituição de empresas</li>
                  <li>Contabilidade mensal e escrituração</li>
                  <li>Planejamento tributário</li>
                  <li>Consultoria fiscal</li>
                  <li>Declarações de impostos</li>
                  <li>Migração de contabilidade</li>
                </ul>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">3. Uso do Site</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ao utilizar nosso site, você concorda em:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Fornecer informações verdadeiras, precisas e completas nos formulários</li>
                  <li>Não utilizar o site para fins ilegais ou não autorizados</li>
                  <li>Não tentar acessar áreas restritas do site sem autorização</li>
                  <li>Não interferir ou interromper o funcionamento do site</li>
                  <li>Não transmitir vírus, malware ou qualquer código malicioso</li>
                </ul>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">4. Simulações e Calculadoras</h2>
                <p className="text-muted-foreground leading-relaxed">
                  As simulações de economia tributária e calculadoras disponíveis em nosso site 
                  são fornecidas apenas para fins informativos e educacionais. Os resultados 
                  apresentados são <strong>estimativas</strong> baseadas em alíquotas médias e 
                  podem variar significativamente de acordo com:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Atividade específica e CNAE da empresa</li>
                  <li>Localização e legislação estadual/municipal</li>
                  <li>Estrutura de custos e despesas</li>
                  <li>Regime tributário escolhido</li>
                  <li>Outros fatores específicos do seu negócio</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>As simulações não constituem aconselhamento tributário ou fiscal.</strong> 
                  Para uma análise precisa da sua situação, consulte nossos especialistas.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">5. Propriedade Intelectual</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Todo o conteúdo presente neste site, incluindo textos, imagens, logotipos, 
                  ícones, gráficos, vídeos, downloads e softwares, é de propriedade da 
                  Contabilidade Zen ou de seus fornecedores de conteúdo e está protegido pelas 
                  leis brasileiras de propriedade intelectual.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  É proibida a reprodução, distribuição, modificação ou uso comercial do conteúdo 
                  sem autorização prévia por escrito.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">6. Limitação de Responsabilidade</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Contabilidade Zen não será responsável por:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Danos indiretos, incidentais ou consequenciais decorrentes do uso do site</li>
                  <li>Interrupções ou erros no funcionamento do site</li>
                  <li>Decisões tomadas com base nas simulações ou conteúdo informativo do site</li>
                  <li>Vírus ou outros componentes prejudiciais que possam infectar seu dispositivo</li>
                  <li>Conteúdo de sites de terceiros acessados através de links em nosso site</li>
                </ul>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">7. Contratação de Serviços</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A contratação de serviços contábeis está sujeita a condições específicas que 
                  serão apresentadas em contrato próprio. Os valores, prazos e escopo dos serviços 
                  serão definidos individualmente para cada cliente.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  O preenchimento de formulários de contato ou simuladores não constitui 
                  contratação de serviços nem gera obrigação de contratação para nenhuma das partes.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">8. Comunicações</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ao fornecer seus dados de contato através de nossos formulários, você concorda 
                  em receber comunicações da Contabilidade Zen relacionadas aos serviços 
                  solicitados. Você pode optar por não receber comunicações de marketing a 
                  qualquer momento entrando em contato conosco.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">9. Privacidade</h2>
                <p className="text-muted-foreground leading-relaxed">
                  O uso de informações pessoais coletadas através deste site é regido pela nossa{" "}
                  <a href="/politica-de-privacidade" className="text-secondary hover:underline">
                    Política de Privacidade
                  </a>
                  , que faz parte integrante destes Termos de Uso.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">10. Modificações</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Contabilidade Zen reserva-se o direito de modificar estes Termos de Uso a 
                  qualquer momento, sem aviso prévio. As alterações entrarão em vigor 
                  imediatamente após sua publicação no site. O uso continuado do site após 
                  modificações constitui aceitação dos novos termos.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">11. Lei Aplicável e Foro</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
                  Qualquer disputa decorrente destes termos será submetida ao foro da comarca 
                  de São Paulo, SP, com exclusão de qualquer outro, por mais privilegiado que seja.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">12. Contato</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
                </p>
                <div className="bg-muted/30 rounded-lg p-6 space-y-2">
                  <p className="text-foreground font-medium">Contabilidade Zen</p>
                  <p className="text-muted-foreground">São Paulo, SP</p>
                  <p className="text-muted-foreground">
                    E-mail: <a href="mailto:contato@contabilidadezen.com.br" className="text-secondary hover:underline">
                      contato@contabilidadezen.com.br
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    Telefone: <a href="tel:+5511999999999" className="text-secondary hover:underline">
                      (11) 99999-9999
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
