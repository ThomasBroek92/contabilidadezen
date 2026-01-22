import { Helmet } from "react-helmet-async";
import { 
  organizationSchema, 
  localBusinessSchema, 
  breadcrumbSchema,
  generateFAQSchema 
} from "@/lib/seo-schemas";

const SITE_URL = "https://www.contabilidadezen.com.br";
const SITE_NAME = "Contabilidade Zen";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

interface SEOHeadProps {
  // Basic SEO
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  
  // Open Graph
  ogType?: "website" | "article" | "product" | "service";
  ogImage?: string;
  ogImageAlt?: string;
  
  // Article specific (for blog posts)
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  
  // Schemas
  includeOrganization?: boolean;
  includeLocalBusiness?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  customSchema?: object | object[];
  
  // Page type for automatic optimizations
  pageType?: "home" | "service" | "blog" | "blog-post" | "contact" | "legal" | "tool";
  
  // Additional
  noindex?: boolean;
  nofollow?: boolean;
}

// Auto-generate optimized title (max 60 chars with brand)
function optimizeTitle(title: string, pageType?: string): string {
  const maxLength = 60;
  const brandSuffix = " | Contabilidade Zen";
  
  // Home page doesn't need suffix
  if (pageType === "home") {
    return title.length <= maxLength ? title : title.substring(0, maxLength - 3) + "...";
  }
  
  const availableLength = maxLength - brandSuffix.length;
  if (title.length <= availableLength) {
    return title + brandSuffix;
  }
  
  return title.substring(0, availableLength - 3) + "..." + brandSuffix;
}

// Auto-generate optimized description (max 160 chars)
function optimizeDescription(description: string): string {
  const maxLength = 160;
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength - 3) + "...";
}

// Generate page-specific schemas automatically
function generatePageSchemas(props: SEOHeadProps): object[] {
  const schemas: object[] = [];
  
  // Organization schema for main pages
  if (props.includeOrganization || props.pageType === "home" || props.pageType === "contact") {
    schemas.push(organizationSchema);
  }
  
  // LocalBusiness for service and home pages
  if (props.includeLocalBusiness || props.pageType === "home" || props.pageType === "service") {
    schemas.push(localBusinessSchema);
  }
  
  // Breadcrumbs
  if (props.breadcrumbs && props.breadcrumbs.length > 0) {
    schemas.push(breadcrumbSchema(props.breadcrumbs));
  }
  
  // FAQ schema
  if (props.faqs && props.faqs.length > 0) {
    schemas.push(generateFAQSchema(props.faqs));
  }
  
  // Article schema for blog posts
  if (props.pageType === "blog-post" && props.canonical) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": props.title,
      "description": props.description,
      "image": props.ogImage || DEFAULT_IMAGE,
      "author": {
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL
      },
      "publisher": {
        "@type": "Organization",
        "name": SITE_NAME,
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/lovable-uploads/b2fc5c22-7b5f-4b53-88e1-973d0983e249.png`
        }
      },
      "datePublished": props.publishedTime,
      "dateModified": props.modifiedTime || props.publishedTime,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": props.canonical
      },
      ...(props.section && { "articleSection": props.section }),
      ...(props.tags && { "keywords": props.tags.join(", ") })
    });
  }
  
  // Service schema for service pages
  if (props.pageType === "service" && props.canonical) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": props.title,
      "description": props.description,
      "provider": {
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL
      },
      "areaServed": {
        "@type": "Country",
        "name": "Brasil"
      },
      "url": props.canonical
    });
  }
  
  // Custom schemas
  if (props.customSchema) {
    if (Array.isArray(props.customSchema)) {
      schemas.push(...props.customSchema);
    } else {
      schemas.push(props.customSchema);
    }
  }
  
  return schemas;
}

export function SEOHead(props: SEOHeadProps) {
  const {
    title,
    description,
    keywords,
    canonical,
    ogType = "website",
    ogImage = DEFAULT_IMAGE,
    ogImageAlt = "Contabilidade Zen - Contabilidade para Profissionais da Saúde",
    publishedTime,
    modifiedTime,
    author,
    tags,
    pageType,
    noindex = false,
    nofollow = false,
  } = props;
  
  const optimizedTitle = optimizeTitle(title, pageType);
  const optimizedDescription = optimizeDescription(description);
  const fullCanonical = canonical?.startsWith("http") ? canonical : `${SITE_URL}${canonical || ""}`;
  const schemas = generatePageSchemas(props);
  
  // Robots directive
  const robotsContent = [
    noindex ? "noindex" : "index",
    nofollow ? "nofollow" : "follow"
  ].join(", ");
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />
      <meta name="author" content={author || SITE_NAME} />
      
      {/* Canonical */}
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Article specific (for blog posts) */}
      {ogType === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {ogType === "article" && tags && tags.map((tag, i) => (
        <meta key={i} property="article:tag" content={tag} />
      ))}
      
      {/* Schema.org JSON-LD */}
      {schemas.length > 0 && (
        <script type="application/ld+json">
          {schemas.length === 1 
            ? JSON.stringify(schemas[0])
            : JSON.stringify({
                "@context": "https://schema.org",
                "@graph": schemas
              })
          }
        </script>
      )}
    </Helmet>
  );
}

// Pre-configured SEO components for common page types
export function HomePageSEO() {
  return (
    <SEOHead
      title="Contabilidade Zen - Contabilidade para Profissionais da Saúde | Médicos, Dentistas, Psicólogos"
      description="Contabilidade especializada para médicos, dentistas, psicólogos e profissionais da saúde. Reduza seus impostos legalmente. Abertura de empresa grátis, planejamento tributário e contabilidade 100% digital."
      keywords="contabilidade para médicos, contabilidade para dentistas, contabilidade para psicólogos, contabilidade para profissionais da saúde, médico PJ, abertura de empresa médica"
      canonical="/"
      pageType="home"
      includeOrganization
      includeLocalBusiness
    />
  );
}

export function ServicePageSEO({ 
  title, 
  description, 
  canonical,
  faqs 
}: { 
  title: string; 
  description: string; 
  canonical: string;
  faqs?: Array<{ question: string; answer: string }>;
}) {
  return (
    <SEOHead
      title={title}
      description={description}
      canonical={canonical}
      pageType="service"
      includeLocalBusiness
      faqs={faqs}
      breadcrumbs={[
        { name: "Home", url: SITE_URL },
        { name: "Serviços", url: `${SITE_URL}/servicos` },
        { name: title, url: `${SITE_URL}${canonical}` }
      ]}
    />
  );
}

export function BlogPostSEO({
  title,
  description,
  slug,
  publishedTime,
  modifiedTime,
  featuredImage,
  category,
  tags,
  faqs
}: {
  title: string;
  description: string;
  slug: string;
  publishedTime?: string;
  modifiedTime?: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  faqs?: Array<{ question: string; answer: string }>;
}) {
  return (
    <SEOHead
      title={title}
      description={description}
      canonical={`/blog/${slug}`}
      ogType="article"
      ogImage={featuredImage}
      publishedTime={publishedTime}
      modifiedTime={modifiedTime}
      section={category}
      tags={tags}
      pageType="blog-post"
      faqs={faqs}
      breadcrumbs={[
        { name: "Home", url: SITE_URL },
        { name: "Blog", url: `${SITE_URL}/blog` },
        { name: title, url: `${SITE_URL}/blog/${slug}` }
      ]}
    />
  );
}

export function ToolPageSEO({
  title,
  description,
  canonical,
  faqs
}: {
  title: string;
  description: string;
  canonical: string;
  faqs?: Array<{ question: string; answer: string }>;
}) {
  return (
    <SEOHead
      title={title}
      description={description}
      canonical={canonical}
      pageType="tool"
      faqs={faqs}
      customSchema={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": title,
        "description": description,
        "url": `${SITE_URL}${canonical}`,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "BRL"
        },
        "provider": {
          "@type": "Organization",
          "name": SITE_NAME,
          "url": SITE_URL
        }
      }}
      breadcrumbs={[
        { name: "Home", url: SITE_URL },
        { name: "Ferramentas", url: `${SITE_URL}/conteudo` },
        { name: title, url: `${SITE_URL}${canonical}` }
      ]}
    />
  );
}
