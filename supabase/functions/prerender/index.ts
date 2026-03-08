import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://www.contabilidadezen.com.br";
const LOGO_URL = `${SITE_URL}/lovable-uploads/b2fc5c22-7b5f-4b53-88e1-973d0983e249.png`;
const OG_IMAGE = `${SITE_URL}/og-image.png`;

// ─── Static page metadata ───────────────────────────────────────────
const STATIC_PAGES: Record<string, { title: string; description: string; h1: string; content: string; ogType?: string }> = {
  "/": {
    title: "Contabilidade Zen - Contabilidade Digital Especializada | Médicos, Dentistas, Psicólogos",
    description: "Contabilidade especializada para médicos, dentistas, psicólogos e profissionais da saúde. Reduza seus impostos em até 50%. Planejamento tributário e contabilidade 100% digital.",
    h1: "Contabilidade Zen – Contabilidade Digital Especializada",
    content: `<p>Economize até 50% em impostos com contabilidade digital especializada. Atendemos médicos, dentistas, psicólogos, advogados, profissionais de TI, produtores digitais, representantes comerciais e empresas de diversos segmentos. 100% online, atendimento humanizado e 0% burocracia.</p>
    <h2>Nossos Serviços</h2>
    <ul>
      <li><a href="/servicos">Serviços de Contabilidade Digital</a></li>
      <li><a href="/abrir-empresa">Abrir Empresa (CNPJ em até 7 dias)</a></li>
      <li><a href="/cidades-atendidas">Cidades Atendidas em Todo o Brasil</a></li>
      <li><a href="/indique-e-ganhe">Programa Indique e Ganhe</a></li>
    </ul>
    <h2>Segmentos Especializados</h2>
    <ul>
      <li><a href="/segmentos/contabilidade-para-medicos">Contabilidade para Médicos</a> – Planejamento tributário especializado</li>
      <li><a href="/segmentos/contabilidade-para-dentistas">Contabilidade para Dentistas</a> – Redução de impostos para clínicas</li>
      <li><a href="/segmentos/contabilidade-para-psicologos">Contabilidade para Psicólogos</a> – Gestão fiscal otimizada</li>
      <li><a href="/segmentos/contabilidade-para-representantes-comerciais">Contabilidade para Representantes Comerciais</a></li>
    </ul>
    <h2>Ferramentas Gratuitas</h2>
    <ul>
      <li><a href="/conteudo/calculadora-pj-clt">Calculadora PJ vs CLT</a></li>
      <li><a href="/conteudo/comparativo-tributario">Comparativo Tributário</a></li>
      <li><a href="/conteudo/tabela-simples-nacional">Tabela Simples Nacional 2025</a></li>
      <li><a href="/conteudo/gerador-invoice">Gerador de Invoice</a></li>
      <li><a href="/conteudo/gerador-rpa">Gerador de RPA</a></li>
      <li><a href="/conteudo/modelo-contrato-pj">Modelo de Contrato PJ</a></li>
    </ul>
    <h2>Perguntas Frequentes</h2>
    <p><strong>O que é contabilidade digital?</strong> Contabilidade digital é um modelo 100% online onde você gerencia toda a contabilidade pela internet, sem ir ao escritório.</p>
    <p><strong>Quanto tempo leva para abrir uma empresa?</strong> O processo completo leva de 5 a 10 dias úteis. Cuidamos de tudo: CNPJ, inscrições, alvarás e licenças.</p>
    <p><strong>Como vocês ajudam a reduzir impostos?</strong> Fazemos planejamento tributário estratégico, identificando o melhor regime e aplicando benefícios fiscais. A economia pode chegar a 50%.</p>
    <p><strong>Atendem empresas de todo o Brasil?</strong> Sim! Trabalhamos 100% online e atendemos em todo o território nacional.</p>
    <h2>Contato</h2>
    <p>WhatsApp: <a href="https://wa.me/5519971872235">(19) 97187-2235</a> | Atendimento: Seg-Sex, 9h às 18h</p>`,
  },
  "/servicos": {
    title: "Serviços de Contabilidade Digital | Contabilidade Zen",
    description: "Contabilidade digital completa: abertura de empresa, planejamento tributário, BPO financeiro, gestão fiscal e muito mais. Atendimento 100% online.",
    h1: "Serviços de Contabilidade Digital",
    content: `<p>Oferecemos serviços contábeis completos para empresas e profissionais. Planejamento tributário, abertura de empresa, escrituração contábil, BPO financeiro, gestão fiscal e suporte dedicado via WhatsApp.</p>
    <ul><li><a href="/abrir-empresa">Abertura de Empresa Grátis</a></li><li><a href="/contato">Fale Conosco</a></li></ul>`,
  },
  "/sobre": {
    title: "Sobre a Contabilidade Zen | Quem Somos",
    description: "Conheça a Contabilidade Zen: contabilidade digital especializada com mais de 500 clientes atendidos em todo o Brasil.",
    h1: "Sobre a Contabilidade Zen",
    content: `<p>A Contabilidade Zen é um escritório de contabilidade digital fundado em 2015, especializado em profissionais da saúde e prestadores de serviço. Mais de 500 clientes atendidos em todo o Brasil com atendimento humanizado e 100% online.</p>`,
  },
  "/contato": {
    title: "Contato | Fale com a Contabilidade Zen",
    description: "Entre em contato com a Contabilidade Zen. Atendimento via WhatsApp, e-mail e reuniões online. Resposta em até 2 horas.",
    h1: "Fale com a Contabilidade Zen",
    content: `<p>WhatsApp: <a href="https://wa.me/5519971872235">(19) 97187-2235</a></p><p>E-mail: contato@contabilidadezen.com.br</p><p>Atendimento: Segunda a Sexta, 9h às 18h</p>`,
  },
  "/abrir-empresa": {
    title: "Abrir Empresa Grátis | CNPJ em até 7 dias | Contabilidade Zen",
    description: "Abra sua empresa gratuitamente com a Contabilidade Zen. CNPJ em até 7 dias úteis, sede virtual gratuita e planejamento tributário incluso.",
    h1: "Abrir Empresa Grátis – CNPJ em até 7 Dias",
    content: `<p>Abertura de empresa 100% gratuita com suporte completo. Registro na Junta Comercial, CNPJ, inscrições e alvarás. Sede virtual gratuita disponível.</p>
    <p><a href="https://wa.me/5519971872235?text=Olá!%20Quero%20abrir%20minha%20empresa.">Falar no WhatsApp</a></p>`,
  },
  "/blog": {
    title: "Blog Contábil | Artigos sobre Contabilidade e Impostos | Contabilidade Zen",
    description: "Artigos sobre contabilidade, impostos, gestão financeira e dicas para profissionais da saúde e prestadores de serviço.",
    h1: "Blog Contábil – Contabilidade Zen",
    content: `<p>Conteúdo especializado sobre contabilidade, tributação, gestão financeira e dicas para profissionais e empresas.</p>`,
  },
  "/cidades-atendidas": {
    title: "Cidades Atendidas | Contabilidade Digital em Todo o Brasil",
    description: "Atendemos empresas e profissionais em todas as cidades do Brasil. Contabilidade 100% digital sem fronteiras.",
    h1: "Cidades Atendidas pela Contabilidade Zen",
    content: `<p>Atendimento 100% digital em todo o Brasil. São Paulo, Campinas, Belo Horizonte, Rio de Janeiro, Curitiba, Porto Alegre, Brasília e centenas de outras cidades.</p>`,
  },
  // Cities are handled dynamically below — removed static /contabilidade-em-campinas
  "/indique-e-ganhe": {
    title: "Indique e Ganhe | Programa de Indicação | Contabilidade Zen",
    description: "Indique amigos e ganhe comissões! Programa de indicação da Contabilidade Zen com comissões recorrentes.",
    h1: "Programa Indique e Ganhe",
    content: `<p>Indique profissionais e empresas para a Contabilidade Zen e ganhe comissões. Programa simples e transparente.</p>`,
  },
  "/segmentos/contabilidade-para-medicos": {
    title: "Contabilidade para Médicos | Planejamento Tributário Médico",
    description: "Contabilidade especializada para médicos. Reduza impostos, abra seu CNPJ e organize suas finanças com quem entende do segmento.",
    h1: "Contabilidade para Médicos",
    content: `<p>Serviço de contabilidade especializado para médicos e clínicas. Planejamento tributário, abertura de empresa médica, gestão fiscal e redução legal de impostos.</p>`,
  },
  "/segmentos/contabilidade-para-dentistas": {
    title: "Contabilidade para Dentistas | Redução de Impostos",
    description: "Contabilidade para dentistas e clínicas odontológicas. Economize com o melhor enquadramento tributário.",
    h1: "Contabilidade para Dentistas",
    content: `<p>Contabilidade especializada para dentistas e clínicas odontológicas. Foco em redução de impostos e gestão financeira eficiente.</p>`,
  },
  "/segmentos/contabilidade-para-psicologos": {
    title: "Contabilidade para Psicólogos | Gestão Fiscal Otimizada",
    description: "Contabilidade para psicólogos com foco em economia tributária. Atendimento digital e especializado.",
    h1: "Contabilidade para Psicólogos",
    content: `<p>Contabilidade digital especializada para psicólogos. Otimização fiscal, abertura de empresa e suporte contínuo.</p>`,
  },
  "/segmentos/contabilidade-para-representantes-comerciais": {
    title: "Contabilidade para Representantes Comerciais | Fator R",
    description: "Contabilidade para representantes comerciais com aplicação do Fator R e enquadramento tributário ideal.",
    h1: "Contabilidade para Representantes Comerciais",
    content: `<p>Contabilidade especializada para representantes comerciais. Aplicação do Fator R, Simples Nacional otimizado e gestão fiscal.</p>`,
  },
  "/segmentos/contabilidade-para-produtores-digitais": {
    title: "Contabilidade para Produtores Digitais | Infoprodutores e Afiliados",
    description: "Contabilidade especializada para produtores digitais, infoprodutores e afiliados. Tributação otimizada para vendas online.",
    h1: "Contabilidade para Produtores Digitais",
    content: `<p>Contabilidade digital para infoprodutores, afiliados e criadores de conteúdo. Planejamento tributário para vendas em plataformas como Hotmart, Eduzz e Monetizze.</p>`,
  },
  "/segmentos/contabilidade-para-profissionais-de-ti": {
    title: "Contabilidade para Profissionais de TI | Desenvolvedores e Consultores",
    description: "Contabilidade para profissionais de TI, desenvolvedores e consultores. Planejamento fiscal para contratos CLT, PJ e internacionais.",
    h1: "Contabilidade para Profissionais de TI",
    content: `<p>Contabilidade especializada para desenvolvedores, consultores de TI e empresas de tecnologia. Foco em redução de impostos e contratos internacionais.</p>`,
  },
  "/segmentos/contabilidade-para-exportacao-de-servicos": {
    title: "Contabilidade para Exportação de Serviços | Isenção de ISS",
    description: "Contabilidade para exportação de serviços com isenção de ISS e planejamento cambial. Especialistas em receita do exterior.",
    h1: "Contabilidade para Exportação de Serviços",
    content: `<p>Contabilidade especializada para profissionais que exportam serviços. Isenção de ISS, planejamento cambial e tributação otimizada para receitas do exterior.</p>`,
  },
  "/segmentos/contabilidade-para-prestadores-de-servico": {
    title: "Contabilidade para Prestadores de Serviço | Enquadramento Tributário",
    description: "Contabilidade para prestadores de serviço com enquadramento tributário otimizado e gestão fiscal completa.",
    h1: "Contabilidade para Prestadores de Serviço",
    content: `<p>Contabilidade digital para prestadores de serviço. Enquadramento tributário ideal, emissão de notas e gestão fiscal completa.</p>`,
  },
  "/segmentos/contabilidade-para-profissionais-pj": {
    title: "Contabilidade para Profissionais PJ | CLT para PJ",
    description: "Contabilidade para profissionais PJ. Gestão contábil completa para quem migrou de CLT para PJ.",
    h1: "Contabilidade para Profissionais PJ",
    content: `<p>Contabilidade especializada para profissionais que atuam como PJ. Planejamento tributário, pró-labore otimizado e gestão fiscal.</p>`,
  },
  "/segmentos/contabilidade-para-ecommerce": {
    title: "Contabilidade para E-commerce | Lojas Virtuais e Marketplaces",
    description: "Contabilidade para e-commerce e lojas virtuais. CMV, gestão de estoque e tributação para vendas online.",
    h1: "Contabilidade para E-commerce",
    content: `<p>Contabilidade digital para e-commerce, lojas virtuais e vendedores em marketplaces. Gestão de estoque, CMV e tributação otimizada.</p>`,
  },
  "/segmentos/contabilidade-para-clinicas-e-consultorios": {
    title: "Contabilidade para Clínicas e Consultórios | Equiparação Hospitalar",
    description: "Contabilidade para clínicas e consultórios médicos. Equiparação hospitalar, gestão fiscal e redução de impostos.",
    h1: "Contabilidade para Clínicas e Consultórios",
    content: `<p>Contabilidade especializada para clínicas e consultórios. Equiparação hospitalar, planejamento tributário e gestão financeira completa.</p>`,
  },
  "/segmentos/contabilidade-para-youtubers-e-creators": {
    title: "Contabilidade para YouTubers e Creators | AdSense e Patrocínios",
    description: "Contabilidade para YouTubers e criadores de conteúdo. Tributação de AdSense, patrocínios e receitas de plataformas digitais.",
    h1: "Contabilidade para YouTubers e Creators",
    content: `<p>Contabilidade digital para YouTubers, streamers e criadores de conteúdo. Tributação otimizada para AdSense, patrocínios e plataformas digitais.</p>`,
  },
  "/segmentos/contabilidade-para-outros-segmentos": {
    title: "Contabilidade para Outros Segmentos | Arquitetos, Designers, Coaches",
    description: "Contabilidade para arquitetos, designers, coaches e outros profissionais. Atendimento personalizado e tributação otimizada.",
    h1: "Contabilidade para Outros Segmentos",
    content: `<p>Contabilidade digital para arquitetos, designers, coaches, consultores e outros profissionais. Cada segmento com atendimento especializado.</p>`,
  },
  "/conteudo/calculadora-pj-clt": {
    title: "Calculadora PJ vs CLT | Compare Seus Ganhos | Contabilidade Zen",
    description: "Calcule quanto você ganha como PJ comparado com CLT. Simulação gratuita com impostos, benefícios e salário líquido.",
    h1: "Calculadora PJ vs CLT",
    content: `<p>Ferramenta gratuita para comparar ganhos como PJ e CLT. Simule impostos, benefícios e descubra a melhor opção para você.</p>`,
  },
  "/conteudo/comparativo-tributario": {
    title: "Comparativo Tributário | Simples vs Lucro Presumido vs Lucro Real",
    description: "Compare regimes tributários: Simples Nacional, Lucro Presumido e Lucro Real. Descubra qual é mais vantajoso.",
    h1: "Comparativo Tributário",
    content: `<p>Compare os regimes tributários brasileiros e descubra qual é o mais econômico para o seu negócio.</p>`,
  },
  "/conteudo/tabela-simples-nacional": {
    title: "Tabela Simples Nacional 2025 | Alíquotas e Anexos Atualizados",
    description: "Consulte a tabela do Simples Nacional 2025 com alíquotas, faixas e anexos atualizados.",
    h1: "Tabela Simples Nacional 2025",
    content: `<p>Tabela completa do Simples Nacional 2025 com todos os anexos, faixas de faturamento e alíquotas atualizadas.</p>`,
  },
  "/conteudo/gerador-invoice": {
    title: "Gerador de Invoice Gratuito | Crie Invoices Profissionais",
    description: "Crie invoices profissionais gratuitamente. Gerador online com templates prontos para freelancers e PJs.",
    h1: "Gerador de Invoice Gratuito",
    content: `<p>Ferramenta gratuita para criar invoices profissionais. Ideal para freelancers e profissionais PJ que prestam serviços internacionais.</p>`,
  },
  "/conteudo/gerador-rpa": {
    title: "Gerador de RPA Online | Recibo de Pagamento Autônomo",
    description: "Gere RPA (Recibo de Pagamento Autônomo) gratuitamente com cálculo automático de impostos.",
    h1: "Gerador de RPA – Recibo de Pagamento Autônomo",
    content: `<p>Ferramenta gratuita para gerar RPA com cálculo automático de INSS, IRRF e ISS.</p>`,
  },
  "/conteudo/modelo-contrato-pj": {
    title: "Modelo de Contrato PJ | Contrato de Prestação de Serviços",
    description: "Modelo de contrato PJ gratuito e pronto para uso. Contrato de prestação de serviços personalizado.",
    h1: "Modelo de Contrato PJ",
    content: `<p>Modelo gratuito de contrato de prestação de serviços para profissionais PJ. Personalize e use imediatamente.</p>`,
  },
  "/politica-de-privacidade": {
    title: "Política de Privacidade | Contabilidade Zen",
    description: "Política de privacidade da Contabilidade Zen. Saiba como protegemos seus dados pessoais.",
    h1: "Política de Privacidade",
    content: `<p>A Contabilidade Zen valoriza a privacidade dos seus dados. Conheça como coletamos, usamos e protegemos suas informações pessoais em conformidade com a LGPD.</p>`,
  },
  "/termos": {
    title: "Termos de Uso | Contabilidade Zen",
    description: "Termos de uso da Contabilidade Zen. Condições gerais de utilização do site e serviços.",
    h1: "Termos de Uso",
    content: `<p>Termos e condições gerais de uso do site e serviços da Contabilidade Zen.</p>`,
  },
};

// ─── Dynamic city prerender data (88 cities) ────────────────────────
interface CityPrerender { name: string; st: string; title: string; desc: string; wa: string; faqs: { q: string; a: string }[] }

function rmcPR(name: string, slug: string): [string, CityPrerender] {
  return [slug, {
    name, st: "SP",
    title: `Contabilidade em ${name} | Contador Digital Especializado`,
    desc: `Contabilidade digital em ${name} para profissionais e empresas. Economize até 50% em impostos. 100% online, atendimento humanizado na RMC.`,
    wa: `Olá! Vim pela página de Contabilidade em ${name} e gostaria de saber mais sobre os serviços.`,
    faqs: [
      { q: `Vocês atendem presencialmente em ${name}?`, a: `Nosso atendimento é 100% digital, via WhatsApp, e-mail e videoconferência. Você não precisa se deslocar. Foco em agilidade para profissionais e empresas de ${name} e região.` },
      { q: `Como funciona a abertura de empresa em ${name}?`, a: `Cuidamos de todo o processo: análise de viabilidade na prefeitura de ${name}, registro na Junta Comercial de SP, CNPJ, Inscrição Municipal e alvarás. Prazo de 5 a 10 dias úteis.` },
      { q: `A sede virtual é em ${name}?`, a: `Nossa sede virtual gratuita fica em Holambra (RMC). Para endereço em ${name}, temos opções com parceiros locais. Consulte-nos.` },
      { q: `Qual o custo da contabilidade em ${name}?`, a: `Planos a partir de R$ 297,90/mês com contabilidade completa, planejamento tributário e suporte dedicado.` },
      { q: `Posso migrar minha contabilidade em ${name}?`, a: `Sim! Migração gratuita. Cuidamos da comunicação com seu contador atual. Prazo médio de 15 dias.` },
      { q: `Atendem Simples Nacional em ${name}?`, a: `Sim, atendemos Simples Nacional, Lucro Presumido e Lucro Real. Análise personalizada para sua empresa em ${name}.` },
    ],
  }];
}

function regPR(name: string, slug: string, st: string, junta: string): [string, CityPrerender] {
  return [slug, {
    name, st,
    title: `Contabilidade em ${name} | Contador Digital 100% Online`,
    desc: `Contabilidade digital em ${name} – ${st}. Abertura de empresa, planejamento tributário e suporte dedicado. 100% online.`,
    wa: `Olá! Vim pela página de Contabilidade em ${name} e gostaria de saber mais sobre os serviços.`,
    faqs: [
      { q: `Como funciona a contabilidade digital em ${name}?`, a: `Atendemos ${name} 100% digital. Envie documentos por WhatsApp ou e-mail; cuidamos de impostos, folha, obrigações e planejamento tributário.` },
      { q: `Vocês abrem empresa em ${name}?`, a: `Sim! Registro na ${junta}, CNPJ, Inscrição Municipal em ${name}, alvarás e certificado digital. Prazo de 7 a 15 dias úteis.` },
      { q: `Qual o custo da contabilidade em ${name}?`, a: `Planos a partir de R$ 297,90/mês. O valor depende do porte e regime tributário da empresa.` },
      { q: `Posso trocar de contador em ${name}?`, a: `Sim, migração 100% gratuita e digital. Prazo médio de 15 dias sem interrupção.` },
      { q: `Quais regimes tributários atendem em ${name}?`, a: `Simples Nacional, Lucro Presumido e Lucro Real. Análise personalizada para identificar o melhor regime.` },
      { q: `Por que escolher contabilidade digital em ${name}?`, a: `Mesma qualidade com mais agilidade: WhatsApp em até 2h, portal online, sem filas, preços competitivos.` },
    ],
  }];
}

function natPR(name: string, slug: string, st: string): [string, CityPrerender] {
  return [slug, {
    name, st,
    title: `Contabilidade em ${name} | Contador Digital 100% Online`,
    desc: `Contabilidade digital para empresas e profissionais em ${name} – ${st}. Abertura de empresa, impostos e suporte dedicado. 100% online.`,
    wa: `Olá! Vim pela página de Contabilidade em ${name} e gostaria de saber mais sobre os serviços.`,
    faqs: [
      { q: `Como funciona a contabilidade digital em ${name}?`, a: `Atendemos ${name} 100% digital. Envie documentos por WhatsApp ou e-mail; nossa equipe cuida de impostos, folha e planejamento tributário.` },
      { q: `Vocês abrem empresa em ${name}?`, a: `Sim! Abrimos empresas em ${name} e em todo o Brasil. Junta Comercial, CNPJ, Inscrição Municipal e registros. Prazo de 7 a 20 dias úteis.` },
      { q: `Qual o custo da contabilidade online?`, a: `Planos a partir de R$ 297,90/mês. Solicite uma proposta personalizada.` },
      { q: `Posso migrar minha contabilidade em ${name}?`, a: `Sim! Migração gratuita e digital. Prazo médio de 15 dias sem interrupção.` },
      { q: `Por que escolher um contador digital?`, a: `Portal online, suporte via WhatsApp em até 2h, custos competitivos e qualidade superior a escritórios tradicionais.` },
      { q: `Quais tipos de empresa atendem em ${name}?`, a: `MEI, ME e EPP nos regimes Simples Nacional, Lucro Presumido e Lucro Real. Especialistas em saúde, TI, digitais e e-commerce.` },
    ],
  }];
}

const CITIES_PRERENDER: Record<string, CityPrerender> = Object.fromEntries([
  // RMC (20)
  rmcPR("Campinas","campinas"), rmcPR("Americana","americana"), rmcPR("Indaiatuba","indaiatuba"),
  rmcPR("Sumaré","sumare"), rmcPR("Hortolândia","hortolandia"), rmcPR("Valinhos","valinhos"),
  rmcPR("Vinhedo","vinhedo"), rmcPR("Santa Bárbara d'Oeste","santa-barbara-doeste"),
  rmcPR("Paulínia","paulinia"), rmcPR("Jaguariúna","jaguariuna"), rmcPR("Itatiba","itatiba"),
  rmcPR("Pedreira","pedreira"), rmcPR("Monte Mor","monte-mor"), rmcPR("Nova Odessa","nova-odessa"),
  rmcPR("Artur Nogueira","artur-nogueira"), rmcPR("Cosmópolis","cosmopolis"),
  rmcPR("Engenheiro Coelho","engenheiro-coelho"), rmcPR("Holambra","holambra"),
  rmcPR("Morungaba","morungaba"), rmcPR("Santo Antônio de Posse","santo-antonio-de-posse"),
  // SP interior + capital (28)
  regPR("São Paulo","sao-paulo","SP","JUCESP"), regPR("Guarulhos","guarulhos","SP","JUCESP"),
  regPR("Santos","santos","SP","JUCESP"), regPR("São José dos Campos","sao-jose-dos-campos","SP","JUCESP"),
  regPR("Sorocaba","sorocaba","SP","JUCESP"), regPR("Ribeirão Preto","ribeirao-preto","SP","JUCESP"),
  regPR("São Bernardo do Campo","sao-bernardo-do-campo","SP","JUCESP"), regPR("Santo André","santo-andre","SP","JUCESP"),
  regPR("Osasco","osasco","SP","JUCESP"), regPR("Mauá","maua","SP","JUCESP"),
  regPR("Diadema","diadema","SP","JUCESP"), regPR("Barueri","barueri","SP","JUCESP"),
  regPR("Piracicaba","piracicaba","SP","JUCESP"), regPR("Limeira","limeira","SP","JUCESP"),
  regPR("Jundiaí","jundiai","SP","JUCESP"), regPR("Bauru","bauru","SP","JUCESP"),
  regPR("São Caetano do Sul","sao-caetano-do-sul","SP","JUCESP"), regPR("Jacareí","jacarei","SP","JUCESP"),
  regPR("Atibaia","atibaia","SP","JUCESP"), regPR("Cotia","cotia","SP","JUCESP"),
  regPR("Embu das Artes","embu-das-artes","SP","JUCESP"), regPR("Marília","marilia","SP","JUCESP"),
  regPR("Mogi das Cruzes","mogi-das-cruzes","SP","JUCESP"), regPR("São Carlos","sao-carlos","SP","JUCESP"),
  regPR("Ibitinga","ibitinga","SP","JUCESP"), regPR("Santana de Parnaíba","santana-de-parnaiba","SP","JUCESP"),
  regPR("Taboão da Serra","taboao-da-serra","SP","JUCESP"), regPR("São José do Rio Preto","sao-jose-do-rio-preto","SP","JUCESP"),
  // RJ (4)
  regPR("Rio de Janeiro","rio-de-janeiro","RJ","JUCERJA"), regPR("Duque de Caxias","duque-de-caxias","RJ","JUCERJA"),
  regPR("Niterói","niteroi","RJ","JUCERJA"), regPR("Nova Iguaçu","nova-iguacu","RJ","JUCERJA"),
  // MG (3)
  regPR("Belo Horizonte","belo-horizonte","MG","JUCEMG"), regPR("Contagem","contagem","MG","JUCEMG"),
  regPR("Uberlândia","uberlandia","MG","JUCEMG"),
  // ES (1)
  regPR("Vitória","vitoria","ES","JUCEES"),
  // PR (4)
  regPR("Curitiba","curitiba","PR","JUCEPAR"), regPR("Londrina","londrina","PR","JUCEPAR"),
  regPR("Maringá","maringa","PR","JUCEPAR"), regPR("Pinhais","pinhais","PR","JUCEPAR"),
  // SC (2)
  regPR("Blumenau","blumenau","SC","JUCESC"), regPR("Florianópolis","florianopolis","SC","JUCESC"),
  // RS (1)
  regPR("Porto Alegre","porto-alegre","RS","JUCERGS"),
  // Nordeste (9)
  natPR("Salvador","salvador","BA"), natPR("Fortaleza","fortaleza","CE"),
  natPR("Recife","recife","PE"), natPR("Natal","natal","RN"),
  natPR("João Pessoa","joao-pessoa","PB"), natPR("Maceió","maceio","AL"),
  natPR("Aracaju","aracaju","SE"), natPR("São Luís","sao-luis","MA"),
  natPR("Teresina","teresina","PI"),
  // Centro-Oeste (4)
  natPR("Brasília","brasilia","DF"), natPR("Goiânia","goiania","GO"),
  natPR("Campo Grande","campo-grande","MS"), natPR("Cuiabá","cuiaba","MT"),
  // Norte (2)
  natPR("Manaus","manaus","AM"), natPR("Belém","belem","PA"),
]);


function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Contabilidade Zen",
    url: SITE_URL,
    logo: LOGO_URL,
    telephone: "+55-19-97415-8342",
    email: "contato@contabilidadezen.com.br",
    sameAs: [
      "https://www.instagram.com/thomasbroek.contador/",
      "https://www.linkedin.com/company/contabilidade-zen",
    ],
  };
}

function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    name: "Contabilidade Zen",
    url: SITE_URL,
    telephone: "+55-19-97415-8342",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    areaServed: { "@type": "Country", name: "Brasil" },
  };
}

// ─── HTML builder ───────────────────────────────────────────────────
function buildHTML(
  title: string,
  description: string,
  canonical: string,
  h1: string,
  content: string,
  schemas: object[],
  extra?: { ogType?: string; publishedTime?: string; modifiedTime?: string; ogImage?: string }
): string {
  const ogType = extra?.ogType || "website";
  const ogImage = extra?.ogImage || OG_IMAGE;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:site_name" content="Contabilidade Zen">
  <meta property="og:locale" content="pt_BR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${ogImage}">
  ${extra?.publishedTime ? `<meta property="article:published_time" content="${extra.publishedTime}">` : ""}
  ${extra?.modifiedTime ? `<meta property="article:modified_time" content="${extra.modifiedTime}">` : ""}
  <link rel="icon" href="${SITE_URL}/favicon.ico">
  ${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n  ")}
  <style>
    body{font-family:Inter,system-ui,sans-serif;color:#1a202c;margin:0;padding:0;background:#fff}
    header{padding:16px 24px;border-bottom:1px solid #e2e8f0}
    header a{color:#2d3748;text-decoration:none;font-weight:700;font-size:22px}
    nav a{color:#4a5568;margin-right:16px;text-decoration:none;font-size:15px}
    main{max-width:800px;margin:0 auto;padding:32px 24px;line-height:1.7}
    h1{font-size:28px;margin-bottom:16px}
    h2{font-size:22px;margin-top:32px}
    a{color:#0d9488}
    footer{text-align:center;padding:24px;border-top:1px solid #e2e8f0;font-size:14px;color:#718096}
    footer a{color:#4a5568;margin:0 8px}
  </style>
</head>
<body>
  <header>
    <a href="${SITE_URL}">Contabilidade Zen</a>
    <nav style="margin-top:8px">
      <a href="${SITE_URL}/servicos">Serviços</a>
      <a href="${SITE_URL}/abrir-empresa">Abrir Empresa</a>
      <a href="${SITE_URL}/blog">Blog</a>
      <a href="${SITE_URL}/sobre">Sobre</a>
      <a href="${SITE_URL}/contato">Contato</a>
    </nav>
  </header>
  <main>
    <h1>${escapeHtml(h1)}</h1>
    ${content}
  </main>
  <footer>
    <p>&copy; 2025 Contabilidade Zen. Todos os direitos reservados.</p>
    <p>
      <a href="${SITE_URL}/politica-de-privacidade">Política de Privacidade</a>
      <a href="${SITE_URL}/termos">Termos de Uso</a>
      <a href="https://www.instagram.com/thomasbroek.contador/">Instagram</a>
      <a href="https://www.linkedin.com/company/contabilidade-zen">LinkedIn</a>
    </p>
  </footer>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Simple markdown to HTML (headings, bold, links, lists, paragraphs)
function markdownToHtml(md: string): string {
  let html = md
    // headings
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    // bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // line breaks to paragraphs
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("<h") || block.startsWith("<li>") || block.startsWith("<ul>")) {
        // Wrap consecutive <li> in <ul>
        if (block.includes("<li>")) {
          return `<ul>${block}</ul>`;
        }
        return block;
      }
      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");

  return html;
}

// ─── Main handler ───────────────────────────────────────────────────
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "/";
    const normalizedPath = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;

    // 1) Check if it's a blog post
    if (normalizedPath.startsWith("/blog/") && normalizedPath.length > 6) {
      const slug = normalizedPath.replace("/blog/", "");
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: post, error } = await supabase
        .from("blog_posts")
        .select("title, slug, content, excerpt, meta_title, meta_description, featured_image_url, published_at, updated_at, category, faq_schema, meta_keywords")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error || !post) {
        return new Response(build404HTML(), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
        });
      }

      const postTitle = post.meta_title || post.title;
      const postDesc = post.meta_description || post.excerpt || post.title;
      const canonical = `${SITE_URL}/blog/${post.slug}`;
      const schemas: object[] = [
        buildOrganizationSchema(),
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: postDesc,
          image: post.featured_image_url || OG_IMAGE,
          author: { "@type": "Organization", name: "Contabilidade Zen", url: SITE_URL },
          publisher: {
            "@type": "Organization",
            name: "Contabilidade Zen",
            logo: { "@type": "ImageObject", url: LOGO_URL },
          },
          datePublished: post.published_at,
          dateModified: post.updated_at || post.published_at,
          mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
          ...(post.category && { articleSection: post.category }),
          ...(post.meta_keywords && { keywords: post.meta_keywords.join(", ") }),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: canonical },
          ],
        },
      ];

      // Add FAQ schema if available
      if (post.faq_schema) {
        // Handle both array format [{question, answer}] and object format {mainEntity: [{name, acceptedAnswer: {text}}]}
        let faqItems: Array<{ question?: string; answer?: string; name?: string; acceptedAnswer?: { text?: string } }> = [];
        if (Array.isArray(post.faq_schema)) {
          faqItems = post.faq_schema;
        } else if ((post.faq_schema as any).mainEntity && Array.isArray((post.faq_schema as any).mainEntity)) {
          faqItems = (post.faq_schema as any).mainEntity;
        }
        if (faqItems.length > 0) {
          schemas.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((f: any) => ({
              "@type": "Question",
              name: f.name || f.question,
              acceptedAnswer: { "@type": "Answer", text: f.acceptedAnswer?.text || f.answer },
            })),
          });
        }
      }

      const contentHtml = markdownToHtml(post.content || "");

      const html = buildHTML(
        postTitle,
        postDesc,
        canonical,
        post.title,
        contentHtml,
        schemas,
        {
          ogType: "article",
          publishedTime: post.published_at || undefined,
          modifiedTime: post.updated_at || undefined,
          ogImage: post.featured_image_url || undefined,
        }
      );

      return new Response(html, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }

    // 2) Check dynamic city pages
    if (normalizedPath.startsWith("/contabilidade-em-")) {
      const citySlug = normalizedPath.replace("/contabilidade-em-", "");
      const cityData = CITIES_PRERENDER[citySlug];
      if (cityData) {
        const canonical = `${SITE_URL}${normalizedPath}`;
        const faqHtml = cityData.faqs.map(f => 
          `<details><summary><strong>${escapeHtml(f.q)}</strong></summary><p>${escapeHtml(f.a)}</p></details>`
        ).join("\n");
        const cityContent = `<p>${escapeHtml(cityData.desc)}</p>
          <h2>Por que escolher a Contabilidade Zen em ${escapeHtml(cityData.name)}?</h2>
          <ul>
            <li>Contabilidade 100% digital — sem deslocamento</li>
            <li>Planejamento tributário para reduzir até 50% em impostos</li>
            <li>Abertura de empresa com suporte completo</li>
            <li>Atendimento humanizado via WhatsApp</li>
            <li>Especialistas em profissionais da saúde, TI e serviços</li>
          </ul>
          <h2>Perguntas Frequentes — Contabilidade em ${escapeHtml(cityData.name)}</h2>
          ${faqHtml}
          <h2>Fale Conosco</h2>
          <p><a href="https://wa.me/5519971872235?text=${encodeURIComponent(cityData.wa)}">Falar no WhatsApp sobre Contabilidade em ${escapeHtml(cityData.name)}</a></p>`;
        
        const schemas: object[] = [
          buildOrganizationSchema(),
          buildLocalBusinessSchema(),
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Cidades Atendidas", item: `${SITE_URL}/cidades-atendidas` },
              { "@type": "ListItem", position: 3, name: `Contabilidade em ${cityData.name}`, item: canonical },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: cityData.faqs.map(f => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ];

        const html = buildHTML(cityData.title, cityData.desc, canonical, `Contabilidade em ${cityData.name} – ${cityData.st}`, cityContent, schemas);
        return new Response(html, {
          headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
        });
      }
    }

    // 3) Check static pages
    const pageData = STATIC_PAGES[normalizedPath];
    if (!pageData) {
      return new Response(build404HTML(), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const canonical = `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
    const schemas: object[] = [buildOrganizationSchema()];

    // Add LocalBusiness for home and service pages
    if (normalizedPath === "/" || normalizedPath === "/servicos" || normalizedPath.startsWith("/segmentos/") || normalizedPath.startsWith("/contabilidade-em-")) {
      schemas.push(buildLocalBusinessSchema());
    }

    // Add breadcrumbs for non-home pages
    if (normalizedPath !== "/") {
      const parts = normalizedPath.split("/").filter(Boolean);
      const breadcrumbs = [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }];
      let accPath = "";
      parts.forEach((part, i) => {
        accPath += `/${part}`;
        breadcrumbs.push({
          "@type": "ListItem",
          position: i + 2,
          name: pageData.h1 || part,
          item: `${SITE_URL}${accPath}`,
        });
      });
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs,
      });
    }

    // Blog listing: fetch recent posts
    if (normalizedPath === "/blog") {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("title, slug, excerpt")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(50);

      if (posts && posts.length > 0) {
        const listContent = posts
          .map((p: any) => `<li><a href="${SITE_URL}/blog/${p.slug}">${escapeHtml(p.title)}</a>${p.excerpt ? ` – ${escapeHtml(p.excerpt.substring(0, 120))}` : ""}</li>`)
          .join("\n");
        pageData.content += `<h2>Últimos Artigos</h2><ul>${listContent}</ul>`;

        schemas.push({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Blog Contabilidade Zen",
          url: `${SITE_URL}/blog`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: posts.map((p: any, i: number) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/blog/${p.slug}`,
              name: p.title,
            })),
          },
        });
      }
    }

    const html = buildHTML(pageData.title, pageData.description, canonical, pageData.h1, pageData.content, schemas);

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Pre-render error:", error);
    return new Response(
      JSON.stringify({ error: "Pre-render failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function build404HTML(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <title>Página Não Encontrada | Contabilidade Zen</title>
  <style>body{font-family:Inter,sans-serif;text-align:center;padding:80px 24px}h1{font-size:48px;color:#718096}a{color:#0d9488}</style>
</head>
<body>
  <h1>404</h1>
  <p>Página não encontrada.</p>
  <p><a href="${SITE_URL}">Voltar para o início</a> | <a href="${SITE_URL}/blog">Acessar o Blog</a></p>
</body>
</html>`;
}
