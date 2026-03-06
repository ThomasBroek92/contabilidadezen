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
  "/contabilidade-em-campinas": {
    title: "Contabilidade em Campinas | Contabilidade Zen",
    description: "Contabilidade digital em Campinas-SP. Especializada em profissionais da saúde e prestadores de serviço na região de Campinas.",
    h1: "Contabilidade em Campinas – SP",
    content: `<p>Contabilidade digital especializada para empresas e profissionais em Campinas e região metropolitana.</p>`,
  },
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

// ─── JSON-LD Schemas ────────────────────────────────────────────────
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

    // 2) Check static pages
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
        .limit(20);

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
