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
  "description": "Contabilidade especializada para profissionais da saúde: médicos, dentistas, psicólogos e clínicas médicas.",
  "email": "contato@contabilidadezen.com.br",
  "telephone": "+55-19-97415-8342",
  "foundingDate": "2015",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "minValue": 5,
    "maxValue": 20
  },
  "slogan": "Você cuida da saúde, nós cuidamos dos números",
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
    "streetAddress": "Atendimento 100% Digital",
    "addressLocality": "São Paulo",
    "addressRegion": "SP",
    "postalCode": "01310-100",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -23.5505,
    "longitude": -46.6333
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
          "name": "Abertura de Empresa Grátis",
          "description": "Abertura de CNPJ gratuita para profissionais da saúde em até 15 dias úteis.",
          "url": `${SITE_URL}/abrir-empresa`,
          "price": "0",
          "priceCurrency": "BRL"
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

// Home page combined schema with @graph for multiple types
export const homePageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema,
    localBusinessSchema,
    servicesSchema,
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "Contabilidade Zen",
      "description": "Contabilidade especializada para profissionais da saúde",
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/blog?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      "url": SITE_URL,
      "name": "Contabilidade Zen - Contabilidade para Profissionais da Saúde",
      "isPartOf": {
        "@id": `${SITE_URL}/#website`
      },
      "about": {
        "@id": `${SITE_URL}/#organization`
      },
      "description": "Contabilidade especializada para médicos, dentistas, psicólogos e profissionais da saúde. Reduza seus impostos legalmente."
    }
  ]
};

// FAQ data for reuse across components and schema
export const homeFAQs = [
  {
    question: "Vale a pena abrir empresa (PJ) como médico?",
    answer: "Na maioria dos casos, sim! Como pessoa física, médicos podem pagar até 27,5% de Imposto de Renda. Como PJ, com planejamento tributário adequado, esse valor pode cair para 6% a 15%, dependendo do faturamento e regime escolhido. Fazemos uma análise personalizada para cada caso.",
  },
  {
    question: "Qual o melhor regime tributário para dentistas?",
    answer: "Depende do seu faturamento e estrutura de custos. Para dentistas com faturamento até R$ 81.000/ano, o MEI pode ser interessante. Acima disso, o Simples Nacional com otimização do Fator R geralmente é a melhor opção, permitindo pagar apenas 6% de impostos.",
  },
  {
    question: "O que é Fator R e como ele reduz meus impostos?",
    answer: "O Fator R é a razão entre a folha de pagamento (incluindo pró-labore) e a receita bruta dos últimos 12 meses. Se esse valor for maior que 28%, empresas no Simples Nacional pagam impostos pelo Anexo III (6%) ao invés do Anexo V (15,5%). Nós fazemos esse monitoramento mensalmente para garantir a menor tributação possível.",
  },
  {
    question: "Como funciona a contabilidade 100% online?",
    answer: "Todo o processo é digital: você envia documentos pelo nosso aplicativo ou WhatsApp, recebe guias de pagamento e relatórios no celular, e tem suporte via chat com especialistas. Você não precisa sair do consultório para nada relacionado à contabilidade.",
  },
  {
    question: "Posso migrar a contabilidade do meu consultório sem multa?",
    answer: "Sim! A migração é um direito seu. Nós cuidamos de todo o processo: entramos em contato com seu contador atual, solicitamos toda a documentação necessária e fazemos a transição sem que você precise se preocupar com nada.",
  },
  {
    question: "Quanto tempo leva para abrir uma empresa médica?",
    answer: "Com nosso processo 100% digital, a abertura de empresa é concluída em média em 7 a 15 dias úteis, incluindo CNPJ, Contrato Social, Inscrição Municipal, Alvará e registro no CRM. Fornecemos sede virtual gratuita para quem não tem endereço comercial.",
  },
  {
    question: "Vocês fazem a DMED e outras obrigações específicas da saúde?",
    answer: "Sim! Conhecemos todas as obrigações específicas dos profissionais da saúde: DMED, declarações aos conselhos de classe (CRM, CRO, CRP), REINF, eSocial e todas as demais. Você não precisa se preocupar com prazos - cuidamos de tudo.",
  },
  {
    question: "Atendem clínicas com funcionários?",
    answer: "Sim! Temos planos específicos para clínicas com funcionários, incluindo gestão completa de folha de pagamento, eSocial, admissões, rescisões e todas as obrigações trabalhistas. Nosso plano Empresarial inclui até 3 funcionários no valor mensal.",
  },
  {
    question: "O que está incluso na abertura de empresa gratuita?",
    answer: "Inclui: elaboração do Contrato Social (geralmente SLU), registro na Junta Comercial, obtenção do CNPJ, Inscrição Municipal, Alvará de funcionamento e auxílio no registro junto ao conselho de classe. Também oferecemos sede virtual gratuita.",
  },
  {
    question: "Como funciona o suporte ao cliente?",
    answer: "Você tem acesso a especialistas por WhatsApp, e-mail e nosso aplicativo. O tempo médio de resposta é de 2 horas em dias úteis. No plano Empresarial, você tem um gerente de conta dedicado com atendimento prioritário.",
  },
];
