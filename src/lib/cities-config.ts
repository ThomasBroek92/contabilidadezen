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
  regionalCity("São Paulo", "sao-paulo", "São Paulo", "SP", "sudeste", "11", "Junta Comercial de São Paulo (JUCESP)", { statsClientes: "100+", statsLabel: "Clientes SP" }),
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
  regionalCity("Rio de Janeiro", "rio-de-janeiro", "Rio de Janeiro", "RJ", "sudeste", "21", "Junta Comercial do Rio de Janeiro (JUCERJA)", { statsClientes: "50+", statsLabel: "Clientes RJ" }),
  regionalCity("Duque de Caxias", "duque-de-caxias", "Rio de Janeiro", "RJ", "sudeste", "21", "JUCERJA"),
  regionalCity("Niterói", "niteroi", "Rio de Janeiro", "RJ", "sudeste", "21", "JUCERJA"),
  regionalCity("Nova Iguaçu", "nova-iguacu", "Rio de Janeiro", "RJ", "sudeste", "21", "JUCERJA"),

  // ═══════════════ SECONDARY — Minas Gerais ═══════════════
  regionalCity("Belo Horizonte", "belo-horizonte", "Minas Gerais", "MG", "sudeste", "31", "Junta Comercial de Minas Gerais (JUCEMG)", { statsClientes: "30+", statsLabel: "Clientes MG" }),
  regionalCity("Contagem", "contagem", "Minas Gerais", "MG", "sudeste", "31", "JUCEMG"),
  regionalCity("Uberlândia", "uberlandia", "Minas Gerais", "MG", "sudeste", "34", "JUCEMG"),

  // ═══════════════ SECONDARY — Espírito Santo ═══════════════
  regionalCity("Vitória", "vitoria", "Espírito Santo", "ES", "sudeste", "27", "Junta Comercial do Espírito Santo (JUCEES)"),

  // ═══════════════ SECONDARY — Paraná ═══════════════
  regionalCity("Curitiba", "curitiba", "Paraná", "PR", "sul", "41", "Junta Comercial do Paraná (JUCEPAR)", { statsClientes: "40+", statsLabel: "Clientes PR" }),
  regionalCity("Londrina", "londrina", "Paraná", "PR", "sul", "43", "JUCEPAR"),
  regionalCity("Maringá", "maringa", "Paraná", "PR", "sul", "44", "JUCEPAR"),
  regionalCity("Pinhais", "pinhais", "Paraná", "PR", "sul", "41", "JUCEPAR"),

  // ═══════════════ SECONDARY — Santa Catarina ═══════════════
  regionalCity("Blumenau", "blumenau", "Santa Catarina", "SC", "sul", "47", "Junta Comercial de Santa Catarina (JUCESC)"),
  regionalCity("Florianópolis", "florianopolis", "Santa Catarina", "SC", "sul", "48", "JUCESC"),

  // ═══════════════ SECONDARY — Rio Grande do Sul ═══════════════
  regionalCity("Porto Alegre", "porto-alegre", "Rio Grande do Sul", "RS", "sul", "51", "Junta Comercial do Rio Grande do Sul (JUCERGS)"),

  // ═══════════════ TERTIARY — Nordeste ═══════════════
  nationalCity("Salvador", "salvador", "Bahia", "BA", "71"),
  nationalCity("Fortaleza", "fortaleza", "Ceará", "CE", "85"),
  nationalCity("Recife", "recife", "Pernambuco", "PE", "81"),
  nationalCity("Natal", "natal", "Rio Grande do Norte", "RN", "84"),
  nationalCity("João Pessoa", "joao-pessoa", "Paraíba", "PB", "83"),
  nationalCity("Maceió", "maceio", "Alagoas", "AL", "82"),
  nationalCity("Aracaju", "aracaju", "Sergipe", "SE", "79"),
  nationalCity("São Luís", "sao-luis", "Maranhão", "MA", "98"),
  nationalCity("Teresina", "teresina", "Piauí", "PI", "86"),

  // ═══════════════ TERTIARY — Centro-Oeste ═══════════════
  nationalCity("Brasília", "brasilia", "Distrito Federal", "DF", "61"),
  nationalCity("Goiânia", "goiania", "Goiás", "GO", "62"),
  nationalCity("Campo Grande", "campo-grande", "Mato Grosso do Sul", "MS", "67"),
  nationalCity("Cuiabá", "cuiaba", "Mato Grosso", "MT", "65"),

  // ═══════════════ TERTIARY — Norte ═══════════════
  nationalCity("Manaus", "manaus", "Amazonas", "AM", "92"),
  nationalCity("Belém", "belem", "Pará", "PA", "91"),
];

// Lookup map for fast slug→config resolution
export const citiesConfigMap: Record<string, CityConfig> = {};
for (const city of citiesConfig) {
  citiesConfigMap[city.slug] = city;
}

// Helper: get all slugs (useful for sitemap, prerender, etc.)
export const allCitySlugs = citiesConfig.map((c) => c.slug);
