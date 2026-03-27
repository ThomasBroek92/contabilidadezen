// Centralized SEO Schema.org definitions for rich snippets
// Following Google's structured data guidelines

const SITE_URL = "https://www.contabilidadezen.com.br";
const LOGO_URL = `${SITE_URL}/lovable-uploads/b2fc5c22-7b5f-4b53-88e1-973d0983e249.png`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  "name": "Contabilidade Zen",
  "alternateName": "Zen Contabilidade",
  "url": SITE_URL,
  "logo": {
    "@type": "ImageObject",
    "url": LOGO_URL,
    "width": 600,
    "height": 900
  },
  "image": LOGO_URL,
  "description": "Contabilidade digital especializada para médicos, dentistas e psicólogos. Reduza sua carga tributária em até 50% com planejamento tributário especializado.",
  "email": "contato@contabilidadezen.com.br",
  "areaServed": {
    "@type": "Country",
    "name": "BR"
  },
  "telephone": "+55-19-97415-8342",
  "foundingDate": "2015",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "minValue": 5,
    "maxValue": 20
  },
  "slogan": "Economize até 50% em impostos com especialistas",
  "sameAs": [
    "https://www.instagram.com/contabilidadezen",
    "https://www.linkedin.com/company/contabilidadezen",
    "https://www.facebook.com/contabilidadezen"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+55-19-97415-8342",
      "contactType": "sales",
      "areaServed": "BR",
      "availableLanguage": "Portuguese"
    },
    {
      "@type": "ContactPoint",
      "telephone": "+55-19-97415-8342",
      "contactType": "customer support",
      "areaServed": "BR",
      "availableLanguage": "Portuguese"
    }
  ]
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "@id": `${SITE_URL}/#localbusiness`,
  "name": "Contabilidade Zen",
  "image": LOGO_URL,
  "url": SITE_URL,
  "telephone": "+55-19-97415-8342",
  "email": "contato@contabilidadezen.com.br",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Aster, 324 - Jardim das Tulipas",
    "addressLocality": "Holambra",
    "addressRegion": "SP",
    "postalCode": "13827-072",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -22.6342,
    "longitude": -47.0556
  },
  "areaServed": {
    "@type": "Country",
    "name": "Brasil"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Dr. Carlos Silva"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Excelente atendimento! Economizei mais de R$ 30 mil por ano com o planejamento tributário."
    },
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Dra. Ana Souza"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Migrei de contador tradicional e foi a melhor decisão. Atendimento humanizado e especializado."
    }
  ]
};

export const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/#services`,
  "serviceType": "Contabilidade Especializada",
  "provider": {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`
  },
  "areaServed": {
    "@type": "Country",
    "name": "Brasil"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Serviços Contábeis para Saúde",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Contabilidade para Médicos",
          "description": "Contabilidade especializada para médicos e clínicas médicas com planejamento tributário otimizado.",
          "url": `${SITE_URL}/segmentos/contabilidade-para-medicos`
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Contabilidade para Dentistas",
          "description": "Contabilidade para dentistas e clínicas odontológicas com foco em redução de impostos.",
          "url": `${SITE_URL}/segmentos/contabilidade-para-dentistas`
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Contabilidade para Psicólogos",
          "description": "Contabilidade para psicólogos e clínicas de psicologia com otimização fiscal.",
          "url": `${SITE_URL}/segmentos/contabilidade-para-psicologos`
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Abertura de Empresa",
          "description": "Abertura de CNPJ para profissionais e empresas com sede virtual gratuita inclusa.",
          "url": `${SITE_URL}/abrir-empresa`
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Planejamento Tributário",
          "description": "Análise personalizada para reduzir impostos de forma legal usando o melhor regime tributário."
        }
      }
    ]
  }
};

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// Blog listing schema (CollectionPage + ItemList)
export const generateBlogListingSchema = (posts: Array<{ title: string; slug: string; excerpt?: string | null; featured_image_url?: string | null; published_at?: string | null; created_at?: string }>) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Blog Contabilidade Zen",
  "description": "Conteúdo especializado sobre contabilidade, impostos e gestão financeira para profissionais.",
  "url": `${SITE_URL}/blog`,
  "isPartOf": { "@id": `${SITE_URL}/#website` },
  "publisher": { "@id": `${SITE_URL}/#organization` },
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": posts.length,
    "itemListElement": posts.slice(0, 30).map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${SITE_URL}/blog/${post.slug}`,
      "name": post.title,
      "item": {
        "@type": "BlogPosting",
        "headline": post.title,
        "url": `${SITE_URL}/blog/${post.slug}`,
        ...(post.excerpt && { "description": post.excerpt }),
        ...(post.featured_image_url && { "image": post.featured_image_url }),
        ...(post.published_at && { "datePublished": post.published_at }),
      }
    }))
  }
});

// WebSite schema with SearchAction (enables sitelinks search box in Google)
export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  "name": "Contabilidade Zen",
  "alternateName": "Zen Contabilidade",
  "url": SITE_URL,
  "publisher": { "@id": `${SITE_URL}/#organization` },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${SITE_URL}/blog?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

// SiteNavigationElement schema (helps Google generate rich sitelinks)
export const siteNavigationSchema = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  "name": "Menu Principal",
  "hasPart": [
    { "@type": "WebPage", "name": "Home", "url": SITE_URL },
    { "@type": "WebPage", "name": "Abrir Empresa", "url": `${SITE_URL}/abrir-empresa` },
    { "@type": "WebPage", "name": "Contabilidade para Médicos", "url": `${SITE_URL}/segmentos/contabilidade-para-medicos` },
    { "@type": "WebPage", "name": "Contabilidade para Dentistas", "url": `${SITE_URL}/segmentos/contabilidade-para-dentistas` },
    { "@type": "WebPage", "name": "Contabilidade para Psicólogos", "url": `${SITE_URL}/segmentos/contabilidade-para-psicologos` },
    { "@type": "WebPage", "name": "Contabilidade para Advogados", "url": `${SITE_URL}/segmentos/contabilidade-para-advogados` },
    { "@type": "WebPage", "name": "Contabilidade para TI", "url": `${SITE_URL}/segmentos/contabilidade-para-profissionais-ti` },
    { "@type": "WebPage", "name": "Blog", "url": `${SITE_URL}/blog` },
    { "@type": "WebPage", "name": "Calculadora PJ x CLT", "url": `${SITE_URL}/conteudo/calculadora-pj-clt` },
    { "@type": "WebPage", "name": "Contato", "url": `${SITE_URL}/contato` },
    { "@type": "WebPage", "name": "Sobre", "url": `${SITE_URL}/sobre` },
    { "@type": "WebPage", "name": "Indique e Ganhe", "url": `${SITE_URL}/indique-e-ganhe` },
  ]
};

// About page schema
export const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "Sobre a Contabilidade Zen",
  "description": "Contabilidade digital especializada em profissionais da saúde. Mais de 500 clientes atendidos.",
  "url": `${SITE_URL}/sobre`,
  "mainEntity": { "@id": `${SITE_URL}/#organization` }
};

// HowTo Schema for process/timeline pages (rich snippets)
export const generateHowToSchema = (
  name: string,
  description: string,
  steps: Array<{ name: string; text: string; url?: string; image?: string }>,
  totalTime?: string // ISO 8601 duration, e.g. "P15D" for 15 days
) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": name,
  "description": description,
  ...(totalTime && { "totalTime": totalTime }),
  "step": steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text,
    ...(step.url && { "url": step.url }),
    ...(step.image && { "image": step.image }),
  })),
  "tool": [],
  "supply": []
});

// Review/AggregateRating Schema for testimonials on segment pages
export const generateReviewSchema = (
  itemName: string,
  itemUrl: string,
  reviews: Array<{ name: string; role?: string; content: string; rating: number }>,
  overallRating?: number
) => {
  const avgRating = overallRating || (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": itemName,
    "url": itemUrl,
    "provider": {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating.toFixed(1),
      "reviewCount": String(reviews.length),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(r => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": r.name,
        ...(r.role && { "jobTitle": r.role })
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": String(r.rating),
        "bestRating": "5"
      },
      "reviewBody": r.content
    }))
  };
};

// FAQ data for reuse across components and schema
export const homeFAQs = [
  // BLOCO 1 - CONTABILIDADE DIGITAL
  {
    question: "O que é contabilidade digital e como ela funciona?",
    answer: "Contabilidade digital é um modelo 100% online onde você gerencia toda a contabilidade da sua empresa pela internet, sem precisar ir ao escritório. Através de uma plataforma exclusiva, você envia documentos, acompanha impostos, emite notas fiscais e recebe atendimento especializado via WhatsApp. É mais ágil, econômico e transparente que a contabilidade tradicional.",
  },
  {
    question: "Como funciona o atendimento na contabilidade digital?",
    answer: "Nosso atendimento é feito principalmente via WhatsApp durante horário comercial (9h-18h, seg-sex), com tempo médio de resposta de 2 horas. Você terá um contador dedicado que conhece seu negócio, acesso ao portal do cliente 24/7 e pode agendar reuniões online sempre que precisar. Simples, rápido e humanizado.",
  },
  // BLOCO 2 - ABERTURA E MIGRAÇÃO
  {
    question: "Quanto tempo leva para abrir uma empresa?",
    answer: "O processo completo leva de 5 a 10 dias úteis, dependendo da cidade e tipo de empresa. Cuidamos de tudo: análise de viabilidade, registro na Junta Comercial, CNPJ, inscrições municipais e estaduais, alvarás e licenças. Tudo 100% digital e você acompanha cada etapa pelo nosso sistema.",
  },
  {
    question: "Posso migrar minha contabilidade sem problemas?",
    answer: "Sim! A migração é 100% gratuita e sem complicações. Cuidamos de toda a comunicação com seu contador atual, solicitamos os documentos necessários e fazemos a transição sem interromper suas operações. O processo leva em média 15 dias e você não precisa se preocupar com nada.",
  },
  {
    question: "Precisarei abrir conta bancária específica?",
    answer: "Não é obrigatório abrir uma nova conta, mas recomendamos ter uma conta PJ separada da pessoa física para melhor organização financeira e controle contábil. Isso facilita a gestão, evita mistura de patrimônios e simplifica a prestação de contas. Podemos orientar sobre as melhores opções do mercado.",
  },
  // BLOCO 3 - TRIBUTAÇÃO E ECONOMIA
  {
    question: "Como vocês ajudam a reduzir impostos legalmente?",
    answer: "Fazemos um planejamento tributário estratégico analisando seu faturamento, atividades e despesas. Identificamos o melhor regime tributário (Simples Nacional, Lucro Presumido ou Real), aplicamos o Fator R quando vantajoso, otimizamos o pró-labore e aproveitamos todos os benefícios fiscais legais. A economia pode chegar a 50% em impostos.",
  },
  {
    question: "Atendem empresas de Lucro Presumido e Real?",
    answer: "Sim! Atendemos empresas em todos os regimes tributários: Simples Nacional, Lucro Presumido e Lucro Real. Nossa equipe é especializada em cada modalidade e faz a análise completa para indicar qual é mais vantajoso para o seu negócio. Também cuidamos de todas as obrigações acessórias específicas de cada regime.",
  },
  // BLOCO 4 - SERVIÇOS E DIFERENCIAIS
  {
    question: "A sede virtual é gratuita?",
    answer: "Sim! Oferecemos sede virtual gratuita para nossos clientes (consulte disponibilidade por cidade). Você usa nosso endereço comercial para registrar sua empresa, recebe correspondências e tem um espaço profissional sem custos de aluguel. Perfeito para quem trabalha home office ou não precisa de espaço físico.",
  },
  {
    question: "Vocês fazem gestão financeira além da contabilidade?",
    answer: "Sim! Oferecemos serviço de BPO Financeiro completo: gestão de contas a pagar e receber, conciliação bancária, relatórios gerenciais, fluxo de caixa e dashboard em tempo real. Assim você tem uma visão 360° das finanças da sua empresa e pode tomar decisões estratégicas baseadas em dados reais.",
  },
];
