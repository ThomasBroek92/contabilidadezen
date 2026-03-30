/**
 * Configuração centralizada de todas as cidades atendidas.
 * Cada cidade possui dados de SEO, FAQs, highlights e configurações de lead/WhatsApp.
 */

export interface CityFAQ {
  question: string;
  answer: string;
}

export interface CityHealthMarket {
  heading: string;
  paragraph: string;
  faqs: CityFAQ[];
}

export interface CityConfig {
  name: string;
  slug: string;
  state: string;
  stateAbbr: string;
  region: "rmc" | "sudeste" | "sul" | "outras";
  ddd: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  heroSubtitle: string;
  benefitsSubtitle: string;
  aberturaItems: string[];
  sedeVirtual: string;
  sedeVirtualDetail: string;
  whatsappMessage: string;
  leadSource: string;
  calculatorSource: string;
  statsClientes: string;
  statsLabel: string;
  faqs: CityFAQ[];
  healthMarket?: CityHealthMarket;
}

// ────────────────────────────────────────────────────────
// Helper factories to avoid repetition across tiers
// ────────────────────────────────────────────────────────

function rmcCity(
  name: string,
  slug: string,
  ddd: string,
  extras?: Partial<CityConfig>
): CityConfig {
  return {
    name,
    slug,
    state: "São Paulo",
    stateAbbr: "SP",
    region: "rmc",
    ddd,
    seoTitle: `Contabilidade em ${name} | Contador Digital Especializado`,
    seoDescription: `Contabilidade digital em ${name} para profissionais e empresas. Economize até 50% em impostos. 100% online, atendimento humanizado na RMC.`,
    seoKeywords: `contabilidade ${name.toLowerCase()}, contador ${name.toLowerCase()}, abertura empresa ${name.toLowerCase()}, contabilidade digital ${name.toLowerCase()}`,
    heroSubtitle: `Mais de <strong class="text-foreground">${extras?.statsClientes || "50"} clientes</strong> na região de ${name} já reduziram sua carga tributária com nossa contabilidade digital nichada. <span class="text-secondary font-medium">100% online, 0% burocracia.</span>`,
    benefitsSubtitle: `Especialistas na região metropolitana de Campinas, oferecemos atendimento digital completo com foco em economia tributária para empresas de ${name}.`,
    aberturaItems: [
      `Análise de viabilidade na Prefeitura de ${name}`,
      "Registro na Junta Comercial de SP",
      "Obtenção do CNPJ",
      `Inscrição Municipal em ${name}`,
      "Alvará de funcionamento",
      "Certificado Digital e-CNPJ",
      "Enquadramento no Simples Nacional",
      "Sede virtual gratuita em Holambra (RMC)",
    ],
    sedeVirtual: "Sede Virtual em Holambra",
    sedeVirtualDetail: "Endereço comercial gratuito na RMC incluído para clientes.",
    whatsappMessage: `Olá! Vim pela página de Contabilidade em ${name} e gostaria de saber mais sobre os serviços.`,
    leadSource: `landing_${slug}`,
    calculatorSource: `abertura-${slug}`,
    statsClientes: "50+",
    statsLabel: "Clientes RMC",
    faqs: [
      {
        question: `Vocês atendem presencialmente em ${name}?`,
        answer: `Nosso atendimento é 100% digital, via WhatsApp, e-mail e videoconferência. Você não precisa se deslocar para nenhum escritório. Nosso foco é agilidade e praticidade para profissionais e empresas de ${name} e região.`,
      },
      {
        question: `Como funciona a abertura de empresa em ${name}?`,
        answer: `Cuidamos de todo o processo: análise de viabilidade na prefeitura de ${name}, registro na Junta Comercial de São Paulo, CNPJ, Inscrição Municipal e alvarás necessários. Prazo médio de 5 a 10 dias úteis, dependendo do tipo de atividade.`,
      },
      {
        question: `A sede virtual é em ${name}?`,
        answer: `Nossa sede virtual gratuita está localizada em Holambra (RMC). Para endereço comercial em ${name}, temos opções com parceiros locais (custo adicional). Consulte-nos para mais detalhes.`,
      },
      {
        question: `Qual o custo da contabilidade para empresas em ${name}?`,
        answer: "Planos a partir de R$ 297,90/mês com contabilidade completa, planejamento tributário e suporte dedicado. Fazemos uma análise personalizada para sua empresa e indicamos o melhor plano.",
      },
      {
        question: `Posso migrar minha contabilidade de outro escritório em ${name}?`,
        answer: "Sim! A migração é 100% gratuita. Cuidamos de toda a comunicação com seu contador atual e fazemos a transição sem interromper suas operações. O processo leva em média 15 dias.",
      },
      {
        question: `Atendem empresas do Simples Nacional em ${name}?`,
        answer: `Sim, atendemos Simples Nacional, Lucro Presumido e Lucro Real. Fazemos análise completa para indicar o melhor regime tributário para sua empresa em ${name}.`,
      },
    ],
    ...extras,
  };
}

function regionalCity(
  name: string,
  slug: string,
  state: string,
  stateAbbr: string,
  region: "sudeste" | "sul",
  ddd: string,
  juntaComercial: string,
  extras?: Partial<CityConfig>
): CityConfig {
  return {
    name,
    slug,
    state,
    stateAbbr,
    region,
    ddd,
    seoTitle: `Contabilidade em ${name} | Contador Digital 100% Online`,
    seoDescription: `Contabilidade digital em ${name} – ${stateAbbr}. Abertura de empresa, planejamento tributário e suporte dedicado. 100% online, sem burocracia.`,
    seoKeywords: `contabilidade ${name.toLowerCase()}, contador ${name.toLowerCase()}, abertura empresa ${name.toLowerCase()}, contabilidade digital ${stateAbbr.toLowerCase()}`,
    heroSubtitle: `Profissionais e empresas de ${name} já confiam na Contabilidade Zen para reduzir impostos com segurança. <span class="text-secondary font-medium">100% digital, atendimento humanizado.</span>`,
    benefitsSubtitle: `Atendimento digital completo para ${name} e todo o estado de ${state}. Planejamento tributário, abertura de empresa e suporte dedicado via WhatsApp.`,
    aberturaItems: [
      `Análise de viabilidade na Prefeitura de ${name}`,
      `Registro na ${juntaComercial}`,
      "Obtenção do CNPJ",
      `Inscrição Municipal em ${name}`,
      "Alvará de funcionamento",
      "Certificado Digital e-CNPJ",
      "Enquadramento no Simples Nacional",
      "Endereço fiscal digital incluído",
    ],
    sedeVirtual: "Endereço Fiscal Digital",
    sedeVirtualDetail: "Endereço comercial digital incluído no plano para clientes.",
    whatsappMessage: `Olá! Vim pela página de Contabilidade em ${name} e gostaria de saber mais sobre os serviços.`,
    leadSource: `landing_${slug}`,
    calculatorSource: `abertura-${slug}`,
    statsClientes: "200+",
    statsLabel: `Clientes ${stateAbbr}`,
    faqs: [
      {
        question: `Como funciona a contabilidade digital em ${name}?`,
        answer: `Atendemos ${name} de forma 100% digital. Você envia documentos pelo WhatsApp ou e-mail, e cuidamos de toda a contabilidade: impostos, folha, obrigações acessórias e planejamento tributário. Sem necessidade de deslocamento.`,
      },
      {
        question: `Vocês abrem empresa em ${name}?`,
        answer: `Sim! Cuidamos de todo o processo de abertura: registro na ${juntaComercial}, CNPJ, Inscrição Municipal em ${name}, alvarás e certificado digital. Prazo médio de 7 a 15 dias úteis.`,
      },
      {
        question: `Qual o custo da contabilidade em ${name}?`,
        answer: "Planos a partir de R$ 297,90/mês com contabilidade completa, planejamento tributário e suporte dedicado. O valor varia conforme o porte e regime tributário da empresa.",
      },
      {
        question: `Posso trocar de contador estando em ${name}?`,
        answer: "Sim, a migração é 100% gratuita e digital. Entramos em contato com seu contador atual, solicitamos toda a documentação e fazemos a transição sem interromper suas operações. Prazo médio de 15 dias.",
      },
      {
        question: `Quais regimes tributários atendem em ${name}?`,
        answer: "Atendemos Simples Nacional, Lucro Presumido e Lucro Real. Fazemos análise personalizada para identificar o regime mais vantajoso para sua empresa, considerando as particularidades fiscais do seu município.",
      },
      {
        question: `Por que escolher contabilidade digital em vez de presencial em ${name}?`,
        answer: "A contabilidade digital oferece a mesma qualidade com mais agilidade: atendimento via WhatsApp em até 2h, portal online para acompanhar tudo, sem filas ou deslocamento. Além disso, nossos preços são mais competitivos por não termos custo de estrutura física em cada cidade.",
      },
    ],
    ...extras,
  };
}

function nationalCity(
  name: string,
  slug: string,
  state: string,
  stateAbbr: string,
  ddd: string,
  extras?: Partial<CityConfig>
): CityConfig {
  return {
    name,
    slug,
    state,
    stateAbbr,
    region: "outras",
    ddd,
    seoTitle: `Contabilidade em ${name} | Contador Digital 100% Online`,
    seoDescription: `Contabilidade digital para empresas e profissionais em ${name} – ${stateAbbr}. Abertura de empresa, impostos e suporte dedicado. 100% online.`,
    seoKeywords: `contabilidade ${name.toLowerCase()}, contador online ${name.toLowerCase()}, contabilidade digital ${stateAbbr.toLowerCase()}`,
    heroSubtitle: `Empresas e profissionais de ${name} já contam com a Contabilidade Zen. <span class="text-secondary font-medium">Atendimento 100% digital, sem fronteiras.</span>`,
    benefitsSubtitle: `Atendimento digital completo para ${name}. Sem deslocamento, sem burocracia — tudo pelo WhatsApp e portal online.`,
    aberturaItems: [
      `Análise de viabilidade em ${name}`,
      `Registro na Junta Comercial de ${state}`,
      "Obtenção do CNPJ",
      `Inscrição Municipal em ${name}`,
      "Alvará de funcionamento",
      "Certificado Digital e-CNPJ",
      "Enquadramento no Simples Nacional",
      "Endereço fiscal digital incluído",
    ],
    sedeVirtual: "Endereço Fiscal Digital",
    sedeVirtualDetail: "Endereço comercial digital incluído no plano para clientes.",
    whatsappMessage: `Olá! Vim pela página de Contabilidade em ${name} e gostaria de saber mais sobre os serviços.`,
    leadSource: `landing_${slug}`,
    calculatorSource: `abertura-${slug}`,
    statsClientes: "500+",
    statsLabel: "Clientes Brasil",
    faqs: [
      {
        question: `Como funciona a contabilidade digital em ${name}?`,
        answer: `Atendemos ${name} de forma 100% digital. Você envia documentos pelo WhatsApp ou e-mail, e nossa equipe cuida de impostos, folha, obrigações acessórias e planejamento tributário. Sem necessidade de visitas presenciais.`,
      },
      {
        question: `Vocês abrem empresa em ${name}?`,
        answer: `Sim! Abrimos empresas em ${name} e em todo o Brasil. Cuidamos de Junta Comercial, CNPJ, Inscrição Municipal e todos os registros necessários. Prazo médio de 7 a 20 dias úteis conforme o município.`,
      },
      {
        question: "Qual o custo da contabilidade online?",
        answer: "Planos a partir de R$ 297,90/mês com contabilidade completa. O valor depende do porte da empresa e regime tributário. Solicite uma proposta personalizada.",
      },
      {
        question: `Posso migrar minha contabilidade em ${name}?`,
        answer: "Sim! A migração é gratuita e 100% digital. Cuidamos de toda a comunicação com seu contador atual. Prazo médio de 15 dias sem interrupção das operações.",
      },
      {
        question: "Por que escolher um contador digital?",
        answer: "Contabilidade digital combina tecnologia com atendimento humano: portal online, suporte via WhatsApp em até 2h, custos mais competitivos e a mesma (ou melhor) qualidade de um escritório tradicional.",
      },
      {
        question: `Quais tipos de empresa atendem em ${name}?`,
        answer: "Atendemos MEI, ME e EPP nos regimes Simples Nacional, Lucro Presumido e Lucro Real. Somos especialistas em profissionais da saúde, TI, produtores digitais, representantes comerciais e e-commerce.",
      },
    ],
    ...extras,
  };
}

// ────────────────────────────────────────────────────────
// Todas as 88 cidades
// ────────────────────────────────────────────────────────

export const citiesConfig: CityConfig[] = [
  // ═══════════════ PRIMARY — RMC (20 cidades) ═══════════════
  rmcCity("Campinas", "campinas", "19", {
    statsClientes: "50+",
    healthMarket: {
      heading: "Contabilidade para Profissionais de Saúde em Campinas",
      paragraph: "Campinas é o principal polo de saúde do interior paulista, com mais de 4.500 estabelecimentos de saúde cadastrados no CNES e duas das maiores universidades médicas do país (Unicamp e PUC-Campinas). A cidade concentra clínicas de alta complexidade, laboratórios e consultórios que movimentam mais de R$ 3 bilhões ao ano. A alíquota de ISS para serviços médicos em Campinas é de 2% a 5%, dependendo do enquadramento, e o município exige inscrição no Cadastro Mobiliário para emissão de NFS-e. Profissionais PJ no Simples Nacional com Fator R podem reduzir a tributação efetiva para 6% sobre o faturamento.",
      faqs: [
        { question: "Qual a alíquota de ISS para médicos em Campinas?", answer: "Em Campinas, a alíquota de ISS para serviços médicos varia de 2% a 5%, conforme a atividade e enquadramento fiscal. Profissionais no Simples Nacional pagam ISS embutido na guia DAS, com alíquota efetiva a partir de 2%." },
        { question: "Como abrir CNPJ médico em Campinas?", answer: "O processo inclui registro na JUCESP, obtenção de CNPJ, inscrição no Cadastro Mobiliário de Campinas, alvará sanitário da Vigilância Sanitária e registro no CRM-SP. A Contabilidade Zen cuida de todas as etapas em 7 a 15 dias úteis." },
        { question: "Qual o melhor regime tributário para dentistas em Campinas?", answer: "Para dentistas com faturamento até R$ 20 mil/mês, o Simples Nacional com Fator R (Anexo III) costuma ser a opção mais vantajosa, com tributação efetiva a partir de 6%. Acima disso, o Lucro Presumido com ISS de 2% pode ser mais econômico." },
      ],
    },
    faqs: [
      { question: "Vocês atendem presencialmente em Campinas?", answer: "Nosso atendimento é 100% digital, via WhatsApp, e-mail e videoconferência. Você não precisa se deslocar para nenhum escritório. Nosso foco é agilidade e praticidade para profissionais e empresas de Campinas e região." },
      { question: "Como funciona a abertura de empresa em Campinas?", answer: "Cuidamos de todo o processo: análise de viabilidade na prefeitura de Campinas, registro na Junta Comercial, CNPJ, Inscrição Municipal e alvarás necessários. Prazo médio de 5 a 10 dias úteis, dependendo do tipo de atividade." },
      { question: "A sede virtual é em Campinas?", answer: "Nossa sede virtual gratuita está localizada em Holambra (RMC). Para endereço comercial em Campinas, temos opções com parceiros locais (custo adicional). Consulte-nos para mais detalhes." },
      { question: "Qual o custo da contabilidade para empresas em Campinas?", answer: "Planos a partir de R$ 297,90/mês com contabilidade completa, planejamento tributário e suporte dedicado. Fazemos uma análise personalizada para sua empresa e indicamos o melhor plano." },
      { question: "Posso migrar minha contabilidade de outro escritório em Campinas?", answer: "Sim! A migração é 100% gratuita. Cuidamos de toda a comunicação com seu contador atual e fazemos a transição sem interromper suas operações. O processo leva em média 15 dias." },
      { question: "Atendem empresas do Simples Nacional em Campinas?", answer: "Sim, atendemos Simples Nacional, Lucro Presumido e Lucro Real. Fazemos análise completa para indicar o melhor regime tributário para sua empresa em Campinas." },
    ],
  }),
  rmcCity("Americana", "americana", "19"),
  rmcCity("Indaiatuba", "indaiatuba", "19"),
  rmcCity("Sumaré", "sumare", "19"),
  rmcCity("Hortolândia", "hortolandia", "19"),
  rmcCity("Valinhos", "valinhos", "19"),
  rmcCity("Vinhedo", "vinhedo", "19"),
  rmcCity("Santa Bárbara d'Oeste", "santa-barbara-doeste", "19"),
  rmcCity("Paulínia", "paulinia", "19"),
  rmcCity("Jaguariúna", "jaguariuna", "19"),
  rmcCity("Itatiba", "itatiba", "11"),
  rmcCity("Pedreira", "pedreira", "19"),
  rmcCity("Monte Mor", "monte-mor", "19"),
  rmcCity("Nova Odessa", "nova-odessa", "19"),
  rmcCity("Artur Nogueira", "artur-nogueira", "19"),
  rmcCity("Cosmópolis", "cosmopolis", "19"),
  rmcCity("Engenheiro Coelho", "engenheiro-coelho", "19"),
  rmcCity("Holambra", "holambra", "19", {
    faqs: [
      { question: "A sede da Contabilidade Zen é em Holambra?", answer: "Sim! Nossa sede virtual está localizada em Holambra. Isso significa que clientes da RMC podem usar nosso endereço comercial gratuitamente para registro empresarial." },
      { question: "Como funciona a abertura de empresa em Holambra?", answer: "Cuidamos de todo o processo: análise de viabilidade na prefeitura de Holambra, registro na Junta Comercial, CNPJ, Inscrição Municipal e alvarás. Prazo médio de 5 a 10 dias úteis." },
      { question: "A sede virtual em Holambra é gratuita?", answer: "Sim! Para clientes da Contabilidade Zen, o endereço comercial em Holambra é 100% gratuito, incluído no plano de contabilidade." },
      { question: "Qual o custo da contabilidade em Holambra?", answer: "Planos a partir de R$ 297,90/mês com contabilidade completa, sede virtual gratuita, planejamento tributário e suporte dedicado." },
      { question: "Posso migrar minha contabilidade para vocês em Holambra?", answer: "Sim! A migração é gratuita. Cuidamos de toda a documentação com seu contador atual. Prazo médio de 15 dias." },
      { question: "Quais regimes tributários atendem em Holambra?", answer: "Atendemos Simples Nacional, Lucro Presumido e Lucro Real. Análise personalizada para encontrar o melhor regime para sua empresa." },
    ],
  }),
  rmcCity("Morungaba", "morungaba", "11"),
  rmcCity("Santo Antônio de Posse", "santo-antonio-de-posse", "19"),

  // ═══════════════ SECONDARY — São Paulo (capital + interior) ═══════════════
  regionalCity("São Paulo", "sao-paulo", "São Paulo", "SP", "sudeste", "11", "Junta Comercial de São Paulo (JUCESP)", {
    statsClientes: "100+", statsLabel: "Clientes SP",
    healthMarket: {
      heading: "Contabilidade para Profissionais de Saúde em São Paulo",
      paragraph: "São Paulo é o maior mercado de saúde da América Latina, com mais de 82 mil estabelecimentos de saúde registrados no CNES e cerca de 120 mil médicos ativos no CRM-SP. A capital concentra os principais hospitais, redes de clínicas e laboratórios do país, movimentando mais de R$ 90 bilhões ao ano no setor. A alíquota de ISS para serviços médicos na cidade de São Paulo é de 2% (mínima prevista na LC 175/2020), uma das mais baixas do estado. Para médicos PJ, o enquadramento no Simples Nacional com Fator R (folha ≥ 28% do faturamento) permite tributação efetiva a partir de 6%, enquanto o Lucro Presumido pode ser mais vantajoso para faturamentos acima de R$ 30 mil/mês.",
      faqs: [
        { question: "Qual a alíquota de ISS para médicos em São Paulo?", answer: "Na cidade de São Paulo, a alíquota de ISS para serviços médicos é de 2%, conforme a legislação municipal (Lei 13.701/2003). No Simples Nacional, o ISS já vem embutido na guia DAS. No Lucro Presumido, o ISS de 2% é pago separadamente via DAS ou guia municipal." },
        { question: "Quais documentos um médico precisa para abrir PJ em São Paulo?", answer: "É necessário: RG, CPF, comprovante de residência, CRM-SP ativo, certificado de residência médica (se especialista), e certificado digital e-CNPJ. A Contabilidade Zen cuida de JUCESP, CNPJ, inscrição municipal (CCM) e alvará da COVISA em 7 a 15 dias úteis." },
        { question: "Vale mais a pena Simples Nacional ou Lucro Presumido para dentistas em São Paulo?", answer: "Para dentistas com faturamento até R$ 25 mil/mês e pró-labore adequado, o Simples Nacional (Anexo III via Fator R) resulta em tributação de 6%. Acima desse valor, o Lucro Presumido com ISS de 2% e IRPJ/CSLL sobre 32% da receita costuma gerar economia de 15% a 25% comparado ao Simples." },
      ],
    },
  }),
  regionalCity("Guarulhos", "guarulhos", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Santos", "santos", "São Paulo", "SP", "sudeste", "13", "JUCESP"),
  regionalCity("São José dos Campos", "sao-jose-dos-campos", "São Paulo", "SP", "sudeste", "12", "JUCESP"),
  regionalCity("Sorocaba", "sorocaba", "São Paulo", "SP", "sudeste", "15", "JUCESP"),
  regionalCity("Ribeirão Preto", "ribeirao-preto", "São Paulo", "SP", "sudeste", "16", "JUCESP"),
  regionalCity("São Bernardo do Campo", "sao-bernardo-do-campo", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Santo André", "santo-andre", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Osasco", "osasco", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Mauá", "maua", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Diadema", "diadema", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Barueri", "barueri", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Piracicaba", "piracicaba", "São Paulo", "SP", "sudeste", "19", "JUCESP"),
  regionalCity("Limeira", "limeira", "São Paulo", "SP", "sudeste", "19", "JUCESP"),
  regionalCity("Jundiaí", "jundiai", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Bauru", "bauru", "São Paulo", "SP", "sudeste", "14", "JUCESP"),
  regionalCity("São Caetano do Sul", "sao-caetano-do-sul", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Jacareí", "jacarei", "São Paulo", "SP", "sudeste", "12", "JUCESP"),
  regionalCity("Atibaia", "atibaia", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Cotia", "cotia", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Embu das Artes", "embu-das-artes", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Marília", "marilia", "São Paulo", "SP", "sudeste", "14", "JUCESP"),
  regionalCity("Mogi das Cruzes", "mogi-das-cruzes", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("São Carlos", "sao-carlos", "São Paulo", "SP", "sudeste", "16", "JUCESP"),
  regionalCity("Ibitinga", "ibitinga", "São Paulo", "SP", "sudeste", "16", "JUCESP"),
  regionalCity("Santana de Parnaíba", "santana-de-parnaiba", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("Taboão da Serra", "taboao-da-serra", "São Paulo", "SP", "sudeste", "11", "JUCESP"),
  regionalCity("São José do Rio Preto", "sao-jose-do-rio-preto", "São Paulo", "SP", "sudeste", "17", "JUCESP"),

  // ═══════════════ SECONDARY — Rio de Janeiro ═══════════════
  regionalCity("Rio de Janeiro", "rio-de-janeiro", "Rio de Janeiro", "RJ", "sudeste", "21", "Junta Comercial do Rio de Janeiro (JUCERJA)", {
    statsClientes: "50+", statsLabel: "Clientes RJ",
    healthMarket: {
      heading: "Contabilidade para Profissionais de Saúde no Rio de Janeiro",
      paragraph: "O Rio de Janeiro possui mais de 28 mil estabelecimentos de saúde e cerca de 75 mil médicos registrados no CREMERJ, sendo o segundo maior mercado de saúde do Brasil. A cidade é referência em especialidades como cardiologia, oncologia e cirurgia plástica, com hospitais de excelência como Sírio-Libanês RJ, Copa D'Or e Samaritano. A alíquota de ISS para serviços médicos no município do Rio de Janeiro é de 2% a 5%, com a maioria dos profissionais de saúde enquadrados em 3,5% (decreto municipal). O ISSQN no Simples Nacional já está embutido no DAS, mas profissionais com faturamento alto podem economizar significativamente no Lucro Presumido com planejamento tributário adequado.",
      faqs: [
        { question: "Qual a alíquota de ISS para médicos no Rio de Janeiro?", answer: "No município do Rio de Janeiro, a alíquota padrão de ISS para serviços de saúde é de 3,5%. No Simples Nacional, o ISS já vem incluído na guia DAS. Profissionais no Lucro Presumido pagam 3,5% separadamente via DARM-Rio. Sociedades simples de profissionais podem ter ISS fixo por profissional, dependendo do enquadramento." },
        { question: "Como abrir CNPJ para psicólogo no Rio de Janeiro?", answer: "O processo exige CRP-05 ativo, registro na JUCERJA, CNPJ, inscrição municipal na Secretaria de Fazenda do RJ e, para consultórios, licença da Vigilância Sanitária (VISA-RJ). A Contabilidade Zen gerencia todas as etapas em 10 a 20 dias úteis." },
        { question: "Médico PJ no Rio paga menos imposto que pessoa física?", answer: "Sim, significativamente. Um médico pessoa física com renda de R$ 20 mil/mês paga até 27,5% de IRPF. Como PJ no Simples Nacional com Fator R, a tributação total pode cair para 6% a 11%, uma economia que pode ultrapassar R$ 40 mil por ano." },
      ],
    },
  }),
  regionalCity("Duque de Caxias", "duque-de-caxias", "Rio de Janeiro", "RJ", "sudeste", "21", "JUCERJA"),
  regionalCity("Niterói", "niteroi", "Rio de Janeiro", "RJ", "sudeste", "21", "JUCERJA"),
  regionalCity("Nova Iguaçu", "nova-iguacu", "Rio de Janeiro", "RJ", "sudeste", "21", "JUCERJA"),

  // ═══════════════ SECONDARY — Minas Gerais ═══════════════
  regionalCity("Belo Horizonte", "belo-horizonte", "Minas Gerais", "MG", "sudeste", "31", "Junta Comercial de Minas Gerais (JUCEMG)", {
    statsClientes: "30+", statsLabel: "Clientes MG",
    healthMarket: {
      heading: "Contabilidade para Profissionais de Saúde em Belo Horizonte",
      paragraph: "Belo Horizonte é o terceiro maior polo de saúde do Brasil, com mais de 12 mil estabelecimentos de saúde e aproximadamente 45 mil médicos registrados no CRM-MG. A capital mineira é reconhecida nacionalmente pela excelência em ortopedia, oftalmologia e medicina reprodutiva, abrigando instituições como Hospital das Clínicas da UFMG e Rede Mater Dei. A alíquota de ISS para serviços médicos em BH é de 2% a 5%, sendo 3% a alíquota mais comum para profissionais autônomos e sociedades simples. O município permite que sociedades de profissionais liberais recolham ISS em valor fixo por sócio (ISS-SUP), o que pode representar economia expressiva para clínicas com múltiplos profissionais.",
      faqs: [
        { question: "Qual a alíquota de ISS para médicos em Belo Horizonte?", answer: "Em Belo Horizonte, a alíquota de ISS para serviços médicos é de 3% na maioria dos casos. Sociedades de profissionais liberais (SCP) podem optar pelo ISS fixo por profissional (ISS-SUP), pagando um valor fixo trimestral por sócio em vez de percentual sobre o faturamento. No Simples Nacional, o ISS já está incluído no DAS." },
        { question: "Qual o melhor regime tributário para dentistas em BH?", answer: "Para dentistas em BH com faturamento até R$ 15 mil/mês, o Simples Nacional (Anexo III com Fator R) oferece tributação a partir de 6%. Para clínicas maiores, o Lucro Presumido combinado com ISS-SUP (fixo por profissional) pode gerar economia de até 30% comparado ao Simples, especialmente em sociedades com 3 ou mais sócios." },
        { question: "Como funciona a abertura de clínica médica em Belo Horizonte?", answer: "Além do registro na JUCEMG e CNPJ, clínicas em BH precisam de alvará de localização e funcionamento (PBH), licença sanitária da Vigilância Sanitária Municipal, registro no CRM-MG e inscrição no BH-ISSQN Digital para emissão de notas fiscais eletrônicas." },
      ],
    },
  }),
  regionalCity("Contagem", "contagem", "Minas Gerais", "MG", "sudeste", "31", "JUCEMG"),
  regionalCity("Uberlândia", "uberlandia", "Minas Gerais", "MG", "sudeste", "34", "JUCEMG"),

  // ═══════════════ SECONDARY — Espírito Santo ═══════════════
  regionalCity("Vitória", "vitoria", "Espírito Santo", "ES", "sudeste", "27", "Junta Comercial do Espírito Santo (JUCEES)"),

  // ═══════════════ SECONDARY — Paraná ═══════════════
  regionalCity("Curitiba", "curitiba", "Paraná", "PR", "sul", "41", "Junta Comercial do Paraná (JUCEPAR)", {
    statsClientes: "40+", statsLabel: "Clientes PR",
    healthMarket: {
      heading: "Contabilidade para Profissionais de Saúde em Curitiba",
      paragraph: "Curitiba é o maior polo de saúde do Sul do Brasil, com mais de 8 mil estabelecimentos de saúde e cerca de 30 mil médicos registrados no CRM-PR. A capital paranaense se destaca em especialidades como neurologia, cirurgia bariátrica e medicina diagnóstica, com referências nacionais como Hospital Pequeno Príncipe e INC (Instituto de Neurologia de Curitiba). A alíquota de ISS em Curitiba para serviços de saúde é de 2% a 5%, com alíquota predominante de 2,5% para a maioria das atividades médicas. O município utiliza o sistema ISS-Curitiba para emissão de NFS-e e oferece regime de sociedade de profissionais (SUP) com ISS fixo, muito vantajoso para clínicas com vários sócios.",
      faqs: [
        { question: "Qual a alíquota de ISS para médicos em Curitiba?", answer: "Em Curitiba, a alíquota de ISS para serviços médicos é predominantemente 2,5%. Sociedades de profissionais podem optar pelo ISS fixo por profissional (SUP), pagando valor fixo em vez de percentual sobre faturamento. No Simples Nacional, o ISS está embutido na guia DAS com alíquota efetiva a partir de 2%." },
        { question: "Quais as vantagens de abrir PJ médico em Curitiba?", answer: "Curitiba oferece ISS competitivo (2,5%), processo de abertura empresarial ágil via JUCEPAR Digital (média de 5 dias úteis) e regime SUP para sociedades. Um médico com renda de R$ 25 mil/mês pode economizar mais de R$ 50 mil por ano migrando de PF para PJ com planejamento tributário adequado." },
        { question: "Como abrir consultório de psicologia em Curitiba?", answer: "É necessário CRP-08 ativo, registro na JUCEPAR, CNPJ, inscrição municipal no ISS-Curitiba, alvará de localização e, para atendimento presencial, licença da Vigilância Sanitária (VISA-PR). A Contabilidade Zen cuida de todas as etapas em 7 a 15 dias úteis." },
      ],
    },
  }),
  regionalCity("Londrina", "londrina", "Paraná", "PR", "sul", "43", "JUCEPAR"),
  regionalCity("Maringá", "maringa", "Paraná", "PR", "sul", "44", "JUCEPAR"),
  regionalCity("Pinhais", "pinhais", "Paraná", "PR", "sul", "41", "JUCEPAR"),

  // ═══════════════ SECONDARY — Santa Catarina ═══════════════
  regionalCity("Blumenau", "blumenau", "Santa Catarina", "SC", "sul", "47", "Junta Comercial de Santa Catarina (JUCESC)"),
  regionalCity("Florianópolis", "florianopolis", "Santa Catarina", "SC", "sul", "48", "JUCESC"),

  // ═══════════════ SECONDARY — Rio Grande do Sul ═══════════════
  regionalCity("Porto Alegre", "porto-alegre", "Rio Grande do Sul", "RS", "sul", "51", "Junta Comercial do Rio Grande do Sul (JUCERGS)", {
    statsClientes: "30+", statsLabel: "Clientes RS",
    healthMarket: {
      heading: "Contabilidade para Profissionais de Saúde em Porto Alegre",
      paragraph: "Porto Alegre concentra o maior polo médico do Rio Grande do Sul, com mais de 9 mil estabelecimentos de saúde cadastrados no CNES e aproximadamente 35 mil médicos ativos no CREMERS. A capital gaúcha é referência nacional em transplantes, oncologia e cardiologia, abrigando instituições como o Hospital de Clínicas, Santa Casa e Hospital Moinhos de Vento. A alíquota de ISS para serviços médicos em Porto Alegre é de 2% a 5%, sendo 3% a faixa predominante para a maioria das atividades de saúde (LC Municipal 7/1973 atualizada). Profissionais PJ no Simples Nacional com Fator R conseguem tributação efetiva a partir de 6%, enquanto sociedades no Lucro Presumido podem aproveitar o regime de ISS fixo por profissional (SUP), gerando economia expressiva para clínicas com múltiplos sócios.",
      faqs: [
        { question: "Qual a alíquota de ISS para médicos em Porto Alegre?", answer: "Em Porto Alegre, a alíquota de ISS para serviços médicos é predominantemente 3%. Sociedades de profissionais liberais podem optar pelo ISS fixo por sócio (SUP), pagando um valor fixo trimestral. No Simples Nacional, o ISS já está embutido no DAS, com alíquota efetiva a partir de 2%." },
        { question: "Como abrir CNPJ médico em Porto Alegre?", answer: "O processo inclui registro na JUCERGS, obtenção de CNPJ, inscrição municipal na Secretaria da Fazenda de Porto Alegre (ISSQN-POA), alvará sanitário da CGVS (Coordenadoria Geral de Vigilância em Saúde) e registro no CREMERS. Prazo médio de 10 a 20 dias úteis com a Contabilidade Zen." },
        { question: "Lucro Presumido ou Simples Nacional para dentistas em Porto Alegre?", answer: "Para dentistas em Porto Alegre com faturamento até R$ 20 mil/mês e pró-labore adequado, o Simples Nacional (Anexo III com Fator R) resulta em 6% de tributação. Acima disso, o Lucro Presumido com ISS de 3% e regime SUP para sociedades pode ser até 25% mais econômico." },
      ],
    },
  }),

  // ═══════════════ TERTIARY — Nordeste ═══════════════
  nationalCity("Salvador", "salvador", "Bahia", "BA", "71"),
  nationalCity("Fortaleza", "fortaleza", "Ceará", "CE", "85", {
    statsClientes: "20+", statsLabel: "Clientes CE",
    healthMarket: {
      heading: "Contabilidade para Profissionais de Saúde em Fortaleza",
      paragraph: "Fortaleza é o principal polo de saúde do Norte-Nordeste, com mais de 7 mil estabelecimentos de saúde cadastrados no CNES e cerca de 18 mil médicos registrados no CRM-CE. A capital cearense se destaca em especialidades como dermatologia, cirurgia plástica e medicina do esporte, sendo sede do IJF (Instituto Dr. José Frota) e da rede Hapvida, uma das maiores operadoras de saúde do Brasil. A alíquota de ISS para serviços médicos em Fortaleza é de 5% (alíquota máxima, conforme Código Tributário Municipal), a mais alta entre as grandes capitais. Por isso, o planejamento tributário é fundamental: profissionais PJ no Simples Nacional com Fator R pagam tributação efetiva a partir de 6% (com ISS já incluso no DAS), tornando-se a opção mais vantajosa para médicos e dentistas que faturam até R$ 25 mil/mês.",
      faqs: [
        { question: "Qual a alíquota de ISS para médicos em Fortaleza?", answer: "Em Fortaleza, a alíquota de ISS para serviços de saúde é de 5%, a alíquota máxima permitida. No Simples Nacional, o ISS já está incluso na guia DAS. No Lucro Presumido, os 5% de ISS tornam o planejamento tributário essencial para evitar carga excessiva — por isso muitos profissionais de saúde em Fortaleza optam pelo Simples com Fator R." },
        { question: "Como abrir clínica médica em Fortaleza?", answer: "É necessário registro na JUCEC (Junta Comercial do Ceará), CNPJ, inscrição no ISS-Fortaleza, alvará de localização (SEUMA), licença sanitária da Vigilância Sanitária Municipal e registro no CRM-CE. Para clínicas com procedimentos invasivos, é obrigatório alvará sanitário da VISA-CE. A Contabilidade Zen cuida de todas as etapas." },
        { question: "Quanto um médico PJ economiza em Fortaleza comparado a PF?", answer: "Com ISS de 5% em Fortaleza, a economia ao migrar de PF para PJ é ainda mais significativa. Um médico com renda de R$ 20 mil/mês paga até R$ 4.500/mês como PF (27,5% IRPF). Como PJ no Simples com Fator R, a tributação total cai para cerca de R$ 1.200/mês (6%), uma economia de mais de R$ 39 mil por ano." },
      ],
    },
  }),
  nationalCity("Recife", "recife", "Pernambuco", "PE", "81", {
    statsClientes: "20+", statsLabel: "Clientes PE",
    healthMarket: {
      heading: "Contabilidade para Profissionais de Saúde em Recife",
      paragraph: "Recife é o segundo maior polo médico do Nordeste, com mais de 6 mil estabelecimentos de saúde e aproximadamente 20 mil médicos ativos no CRM-PE. A capital pernambucana é referência em oftalmologia (HOPE – Hospital de Olhos de Pernambuco), cardiologia e medicina tropical, além de ser sede do IMIP (Instituto de Medicina Integral Professor Fernando Figueira), uma das maiores instituições de ensino médico do Norte-Nordeste. A alíquota de ISS para serviços de saúde em Recife é de 5% (LC Municipal 2/2017), igual a Fortaleza. O município exige inscrição no Sistema de ISS Eletrônico e emissão obrigatória de NFS-e para prestadores de serviços de saúde. Profissionais PJ no Simples Nacional com Fator R obtêm tributação efetiva de 6%, a opção mais econômica para a maioria dos médicos recifenses.",
      faqs: [
        { question: "Qual a alíquota de ISS para médicos em Recife?", answer: "Em Recife, a alíquota de ISS para serviços médicos é de 5%, conforme a legislação municipal. No Simples Nacional, o ISS já vem embutido na guia DAS. Sociedades de profissionais podem verificar com a Secretaria de Finanças a possibilidade de enquadramento como Sociedade Uniprofissional (SUP) para ISS fixo." },
        { question: "Como abrir CNPJ para dentista em Recife?", answer: "O processo exige registro na JUCEPE (Junta Comercial de Pernambuco), CNPJ, inscrição no ISS-Recife, alvará de localização da Prefeitura, licença sanitária da Vigilância Sanitária (APEVISA) e registro no CRO-PE. A Contabilidade Zen gerencia todas as etapas em 10 a 20 dias úteis." },
        { question: "Simples Nacional ou Lucro Presumido para psicólogos em Recife?", answer: "Para psicólogos em Recife, o Simples Nacional com Fator R (Anexo III) é quase sempre a melhor opção, com tributação a partir de 6%. Como o ISS em Recife é de 5%, o Lucro Presumido só compensa para faturamentos muito altos (acima de R$ 40 mil/mês) onde a base de cálculo de 32% resulta em carga total menor." },
      ],
    },
  }),
  nationalCity("Natal", "natal", "Rio Grande do Norte", "RN", "84"),
  nationalCity("João Pessoa", "joao-pessoa", "Paraíba", "PB", "83"),
  nationalCity("Maceió", "maceio", "Alagoas", "AL", "82"),
  nationalCity("Aracaju", "aracaju", "Sergipe", "SE", "79"),
  nationalCity("São Luís", "sao-luis", "Maranhão", "MA", "98"),
  nationalCity("Teresina", "teresina", "Piauí", "PI", "86"),

  // ═══════════════ TERTIARY — Centro-Oeste ═══════════════
  nationalCity("Brasília", "brasilia", "Distrito Federal", "DF", "61"),
  nationalCity("Goiânia", "goiania", "Goiás", "GO", "62", {
    statsClientes: "15+", statsLabel: "Clientes GO",
    healthMarket: {
      heading: "Contabilidade para Profissionais de Saúde em Goiânia",
      paragraph: "Goiânia é o principal polo de saúde do Centro-Oeste, com mais de 5 mil estabelecimentos de saúde cadastrados no CNES e cerca de 15 mil médicos ativos no CRM-GO. A capital goiana se destaca nacionalmente em reprodução humana, ortopedia e cirurgia bariátrica, abrigando instituições como o Hospital Araújo Jorge (referência em oncologia) e a rede IGOA. A alíquota de ISS para serviços médicos em Goiânia é de 2% a 5%, sendo 2% a faixa mais comum para atividades de saúde (Código Tributário Municipal – Lei Complementar 344/2021). Essa alíquota competitiva, aliada ao custo de vida mais baixo que as capitais do Sudeste, torna Goiânia uma das cidades mais vantajosas para profissionais de saúde PJ, especialmente no Simples Nacional com Fator R (tributação efetiva a partir de 6%).",
      faqs: [
        { question: "Qual a alíquota de ISS para médicos em Goiânia?", answer: "Em Goiânia, a alíquota de ISS para serviços médicos é de 2% na maioria dos enquadramentos, uma das mais baixas entre as capitais brasileiras. No Simples Nacional, o ISS já está incluso no DAS. No Lucro Presumido, os 2% de ISS tornam essa opção especialmente vantajosa para faturamentos acima de R$ 30 mil/mês." },
        { question: "Como abrir consultório médico em Goiânia?", answer: "É necessário registro na JUCEG (Junta Comercial do Estado de Goiás), CNPJ, inscrição no ISS-Goiânia (Sistema Nota Goiana), alvará de funcionamento (SEDEM), licença sanitária da Vigilância Sanitária Municipal e registro no CRM-GO. A Contabilidade Zen cuida de todo o processo em 7 a 15 dias úteis." },
        { question: "Quanto um dentista PJ economiza em Goiânia?", answer: "Com ISS de apenas 2% em Goiânia, a economia é significativa. Um dentista com faturamento de R$ 15 mil/mês no Simples Nacional com Fator R paga cerca de R$ 900/mês de tributos (6%). Como pessoa física, pagaria até R$ 3.500/mês (27,5% IRPF + INSS). Economia anual superior a R$ 31 mil." },
      ],
    },
  }),
  nationalCity("Campo Grande", "campo-grande", "Mato Grosso do Sul", "MS", "67"),
  nationalCity("Cuiabá", "cuiaba", "Mato Grosso", "MT", "65"),

  // ═══════════════ TERTIARY — Norte ═══════════════
  nationalCity("Manaus", "manaus", "Amazonas", "AM", "92", {
    statsClientes: "10+", statsLabel: "Clientes AM",
    healthMarket: {
      heading: "Contabilidade para Profissionais de Saúde em Manaus",
      paragraph: "Manaus é o maior polo de saúde da Região Norte, com mais de 3.500 estabelecimentos de saúde cadastrados no CNES e cerca de 8 mil médicos registrados no CRM-AM. A capital amazonense enfrenta desafios únicos de logística e acesso, o que valoriza ainda mais os profissionais de saúde locais e torna a gestão tributária estratégica. A cidade é sede do Hospital Universitário Getúlio Vargas (HUGV), da Fundação de Medicina Tropical e de centros de referência em doenças tropicais. A alíquota de ISS para serviços médicos em Manaus é de 2% a 5%, sendo 2% a alíquota predominante para profissionais de saúde (Lei Municipal 254/2014). Manaus ainda oferece benefícios fiscais vinculados à Zona Franca, embora para serviços de saúde o principal benefício seja a alíquota reduzida de ISS combinada com Simples Nacional.",
      faqs: [
        { question: "Qual a alíquota de ISS para médicos em Manaus?", answer: "Em Manaus, a alíquota de ISS para serviços de saúde é de 2%, uma das mais baixas do país. No Simples Nacional, o ISS já está embutido na guia DAS. No Lucro Presumido, os 2% de ISS são pagos via DAM (Documento de Arrecadação Municipal). Essa alíquota competitiva torna Manaus vantajosa para profissionais PJ." },
        { question: "Como abrir CNPJ médico em Manaus?", answer: "O processo exige registro na JUCEA (Junta Comercial do Estado do Amazonas), CNPJ, inscrição na SEMEF (Secretaria Municipal de Finanças), alvará de funcionamento, licença da Vigilância Sanitária (VISA-AM) e registro no CRM-AM. Apesar da distância, a Contabilidade Zen cuida de tudo 100% digitalmente em 10 a 20 dias úteis." },
        { question: "A Zona Franca de Manaus beneficia médicos PJ?", answer: "Os benefícios fiscais da Zona Franca de Manaus (ZFM) focam principalmente em indústria e comércio, não se aplicando diretamente a serviços médicos. Porém, médicos PJ em Manaus se beneficiam da alíquota de ISS de 2% e do custo operacional competitivo. No Simples Nacional com Fator R, a tributação total fica a partir de 6%." },
      ],
    },
  }),
  nationalCity("Belém", "belem", "Pará", "PA", "91"),
];

// Lookup map for fast slug→config resolution
export const citiesConfigMap: Record<string, CityConfig> = {};
for (const city of citiesConfig) {
  citiesConfigMap[city.slug] = city;
}

// Helper: get all slugs (useful for sitemap, prerender, etc.)
export const allCitySlugs = citiesConfig.map((c) => c.slug);
