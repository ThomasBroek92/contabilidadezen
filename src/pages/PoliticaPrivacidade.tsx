import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Política de Privacidade"
        description="Política de Privacidade da Contabilidade Zen. Saiba como coletamos, usamos e protegemos seus dados pessoais."
        canonical="/politica-de-privacidade"
        pageType="legal"
      />
      
      <Header />
      
      <main className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
              Política de Privacidade
            </h1>
            
            <div className="prose prose-slate max-w-none space-y-8">
              <p className="text-muted-foreground text-lg">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">1. Introdução</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Contabilidade Zen ("nós", "nosso" ou "empresa") está comprometida com a proteção 
                  da sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, 
                  armazenamos e protegemos suas informações pessoais em conformidade com a Lei Geral 
                  de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">2. Dados que Coletamos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Coletamos as seguintes categorias de dados pessoais:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Dados de identificação:</strong> Nome completo</li>
                  <li><strong>Dados de contato:</strong> E-mail e número de WhatsApp/telefone</li>
                  <li><strong>Dados profissionais:</strong> Profissão, tipo de atividade, modelo de tributação</li>
                  <li><strong>Dados financeiros:</strong> Faixa de faturamento mensal estimado</li>
                  <li><strong>Dados de localização:</strong> Cidade e estado</li>
                </ul>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">3. Finalidades do Tratamento</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos seus dados pessoais para as seguintes finalidades:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Entrar em contato para apresentar nossos serviços contábeis</li>
                  <li>Realizar simulações de economia tributária</li>
                  <li>Enviar informações relevantes sobre contabilidade para profissionais da saúde</li>
                  <li>Agendar consultorias e reuniões</li>
                  <li>Melhorar nossos serviços e comunicação</li>
                </ul>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">4. Base Legal</h2>
                <p className="text-muted-foreground leading-relaxed">
                  O tratamento dos seus dados pessoais é realizado com base no seu <strong>consentimento</strong>, 
                  fornecido ao preencher nossos formulários e aceitar esta política. Você pode revogar 
                  este consentimento a qualquer momento.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">5. Compartilhamento de Dados</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Seus dados pessoais podem ser compartilhados com:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Equipe interna:</strong> Profissionais da Contabilidade Zen envolvidos no atendimento</li>
                  <li><strong>Prestadores de serviço:</strong> Plataformas de hospedagem e comunicação (Supabase, WhatsApp)</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">6. Retenção de Dados</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Seus dados pessoais serão mantidos pelo período necessário para o cumprimento das 
                  finalidades descritas nesta política, ou conforme exigido por lei. Dados de leads 
                  que não se converteram em clientes são mantidos por até 2 (dois) anos, após o qual 
                  são automaticamente excluídos.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">7. Seus Direitos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  De acordo com a LGPD, você tem os seguintes direitos:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Acesso:</strong> Solicitar uma cópia dos seus dados pessoais</li>
                  <li><strong>Correção:</strong> Solicitar a correção de dados incompletos ou incorretos</li>
                  <li><strong>Exclusão:</strong> Solicitar a exclusão dos seus dados pessoais</li>
                  <li><strong>Portabilidade:</strong> Solicitar a transferência dos seus dados para outro fornecedor</li>
                  <li><strong>Revogação:</strong> Revogar o consentimento a qualquer momento</li>
                  <li><strong>Oposição:</strong> Opor-se ao tratamento dos seus dados</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Para exercer qualquer desses direitos, entre em contato conosco através do e-mail: {" "}
                  <a href="mailto:privacidade@contabilidadezen.com.br" className="text-secondary hover:underline">
                    privacidade@contabilidadezen.com.br
                  </a>
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">8. Segurança</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Implementamos medidas técnicas e organizacionais apropriadas para proteger seus 
                  dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. 
                  Isso inclui criptografia de dados em trânsito (HTTPS), controles de acesso baseados 
                  em funções e monitoramento contínuo de segurança.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">9. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nosso site utiliza cookies essenciais para funcionamento (como preferências de 
                  interface) e autenticação. Não utilizamos cookies de rastreamento para publicidade. 
                  Os dados de autenticação são armazenados localmente no seu navegador (localStorage).
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">10. Controlador de Dados</h2>
                <p className="text-muted-foreground leading-relaxed">
                  O controlador dos seus dados pessoais é:
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
                    Telefone: <a href="tel:+5519974158342" className="text-secondary hover:underline">
                      (19) 97415-8342
                    </a>
                  </p>
                </div>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">11. Alterações nesta Política</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Podemos atualizar esta Política de Privacidade periodicamente. Quaisquer alterações 
                  serão publicadas nesta página com a data de atualização. Recomendamos que você 
                  revise esta política regularmente.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">12. Contato</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos 
                  seus dados pessoais, entre em contato conosco:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    E-mail: <a href="mailto:privacidade@contabilidadezen.com.br" className="text-secondary hover:underline">
                      privacidade@contabilidadezen.com.br
                    </a>
                  </li>
                  <li>
                    WhatsApp: <a href="https://wa.me/5519974158342" className="text-secondary hover:underline">
                      (19) 97415-8342
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
