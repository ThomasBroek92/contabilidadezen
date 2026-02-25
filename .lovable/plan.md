

# Auditoria Completa de Dados Estruturados (JSON-LD) -- Todas as Paginas Publicas

## Metodologia

Auditei todas as 25+ paginas publicas do site contra as best practices do Google Rich Results Test, a documentacao do Lovable e as regras internas do Custom Knowledge (`#STRUCTURED_DATA_RULES`).

---

## Resumo Executivo

| Aspecto | Status |
|---------|--------|
| Componente centralizado (SEOHead) | OK |
| @graph para multiplos schemas | OK |
| @id com URLs canonicas absolutas | PARCIAL (problemas) |
| FAQPage com conteudo visivel | OK na maioria |
| BreadcrumbList | AUSENTE em varias paginas |
| 1 unico script JSON-LD por pagina | OK (Helmet gerencia) |
| Schemas duplicados (Organization + LocalBusiness) | RISCO em algumas paginas |

---

## Problemas Encontrados por Pagina

### CRITICO -- Schemas com URLs relativas (Service schema)

O schema `Service` gerado automaticamente no SEOHead (linha 152) usa `props.canonical` diretamente na propriedade `url`, resultando em URLs relativas como `/servicos` ao inves de `https://www.contabilidadezen.com.br/servicos`. O Google rejeita URLs relativas em JSON-LD.

**Afeta**: Todas as paginas com `pageType="service"` (Servicos, Sobre, Medicos, Dentistas, Psicologos, Representantes, Campinas, CidadesAtendidas, IndiqueGanhe, AbrirEmpresa).

**Correcao**: Linha 152 do SEOHead.tsx -- prefixar `SITE_URL` na URL do Service schema.

---

### ALTO -- Paginas SEM breadcrumbs (BreadcrumbList ausente)

As seguintes paginas nao passam `breadcrumbs` ao SEOHead, perdendo rich snippets de navegacao:

| Pagina | Rota | Status |
|--------|------|--------|
| Medicos (legado) | `/medicos` | SEM breadcrumbs |
| AbrirEmpresa | `/abrir-empresa` | SEM breadcrumbs |
| CidadesAtendidas | `/cidades-atendidas` | SEM breadcrumbs |
| ContabilidadeCampinas | `/contabilidade-em-campinas` | SEM breadcrumbs |
| IndiqueGanhe | `/indique-e-ganhe` | SEM breadcrumbs |
| CalculadoraPJCLT | `/conteudo/calculadora-pj-clt` | SEM breadcrumbs |
| ComparativoTributario | `/conteudo/comparativo-tributario` | SEM breadcrumbs |
| GeradorRPA | `/conteudo/gerador-rpa` | SEM breadcrumbs |
| NotFound | `*` | OK (nao precisa) |

**Nota**: As paginas que usam `ToolPageSEO` (GeradorInvoice, ModeloContratoPJ) JA tem breadcrumbs automaticos. Porem as que usam `SEOHead` diretamente com `pageType="tool"` (CalculadoraPJCLT, ComparativoTributario, GeradorRPA, TabelaSimplesNacional) NAO herdam breadcrumbs automaticamente.

---

### ALTO -- Paginas de ferramentas SEM schema WebApplication

As paginas de ferramentas que usam `SEOHead` diretamente (em vez de `ToolPageSEO`) nao recebem o schema `WebApplication`:

| Pagina | Rota | Tem WebApplication? |
|--------|------|---------------------|
| CalculadoraPJCLT | `/conteudo/calculadora-pj-clt` | NAO |
| ComparativoTributario | `/conteudo/comparativo-tributario` | NAO |
| GeradorRPA | `/conteudo/gerador-rpa` | NAO |
| TabelaSimplesNacional | `/conteudo/tabela-simples-nacional` | NAO |
| GeradorInvoice | `/conteudo/gerador-invoice` | SIM (usa ToolPageSEO) |
| ModeloContratoPJ | `/conteudo/modelo-contrato-pj` | SIM (usa ToolPageSEO) |

**Correcao**: Ou migrar essas paginas para usar `ToolPageSEO`, ou gerar WebApplication automaticamente quando `pageType="tool"` no SEOHead.

---

### MEDIO -- FAQs ausentes em paginas com FAQ visivel

| Pagina | Tem FAQ visivel? | Passa `faqs` ao SEOHead? |
|--------|------------------|--------------------------|
| Medicos (legado `/medicos`) | NAO | NAO |
| ComparativoTributario | NAO | NAO |
| GeradorRPA | NAO | NAO |

---

### MEDIO -- Schemas @context duplicados dentro do @graph

Quando o SEOHead gera um `@graph`, cada schema individual (organizationSchema, localBusinessSchema, etc.) ja contem `"@context": "https://schema.org"`. Dentro de um `@graph`, o `@context` deve existir apenas no nivel raiz. O Google tolera isso, mas e tecnicamente incorreto e pode gerar warnings no Rich Results Test.

**Correcao**: Remover `@context` dos schemas individuais ao inseri-los no `@graph`, ou usar uma funcao de limpeza antes de serializar.

---

### MEDIO -- AbrirEmpresa.tsx tem faqSchema definido mas nao utilizado

A pagina define uma constante `faqSchema` com FAQ (linhas 13-45) mas ja passa as FAQs corretamente via `faqs` prop ao SEOHead. O `faqSchema` esta morto (dead code) e pode confundir futuros desenvolvedores.

---

### BAIXO -- Paginas legais sem breadcrumbs

PoliticaPrivacidade e Termos nao tem breadcrumbs. Embora menos impactante, breadcrumbs melhoram a experiencia no SERP.

---

### BAIXO -- homePageSchema exportado mas nao usado

O `seo-schemas.ts` exporta `homePageSchema` (linha 218) que nunca e importado em nenhuma pagina. A homepage usa o sistema automatico do SEOHead. Dead code.

---

## Plano de Correcao (7 alteracoes)

### 1. Corrigir URL relativa no Service schema (SEOHead.tsx)

Linha 152: mudar `"url": props.canonical` para `"url": fullCanonicalUrl` (ja calculado na linha 102).

### 2. Gerar WebApplication automaticamente para pageType="tool" (SEOHead.tsx)

Adicionar logica no `generatePageSchemas` para que `pageType="tool"` gere o schema WebApplication automaticamente (mesmo comportamento do `ToolPageSEO`), incluindo breadcrumbs default quando nao fornecidos.

### 3. Limpar @context duplicados no @graph (SEOHead.tsx)

Antes de serializar os schemas no @graph, remover a propriedade `@context` de cada schema individual.

### 4. Adicionar breadcrumbs nas 8 paginas que faltam

Adicionar prop `breadcrumbs` nas paginas: Medicos, AbrirEmpresa, CidadesAtendidas, ContabilidadeCampinas, IndiqueGanhe, CalculadoraPJCLT, ComparativoTributario, GeradorRPA.

### 5. Migrar ferramentas para ToolPageSEO ou adicionar breadcrumbs padrao

CalculadoraPJCLT, ComparativoTributario, GeradorRPA e TabelaSimplesNacional podem receber breadcrumbs + WebApplication via a correcao #2.

### 6. Remover dead code

- Remover `faqSchema` de AbrirEmpresa.tsx (linhas 13-45)
- Remover `homePageSchema` de seo-schemas.ts (linhas 218-256) se nao for referenciado em nenhum lugar

### 7. Adicionar FAQs faltantes

ComparativoTributario e GeradorRPA: se tiverem FAQ visivel no conteudo, passar array `faqs` ao SEOHead para gerar FAQPage schema.

---

## Arquivos Alterados

| Arquivo | Mudanca |
|---------|---------|
| `src/components/SEOHead.tsx` | Corrigir URL Service, gerar WebApplication para tool, limpar @context no @graph |
| `src/lib/seo-schemas.ts` | Remover homePageSchema (dead code) |
| `src/pages/Medicos.tsx` | Adicionar breadcrumbs |
| `src/pages/AbrirEmpresa.tsx` | Adicionar breadcrumbs, remover faqSchema morto |
| `src/pages/CidadesAtendidas.tsx` | Adicionar breadcrumbs |
| `src/pages/cidades/ContabilidadeCampinas.tsx` | Adicionar breadcrumbs |
| `src/pages/IndiqueGanhe.tsx` | Adicionar breadcrumbs |
| `src/pages/conteudo/CalculadoraPJCLT.tsx` | Adicionar breadcrumbs |
| `src/pages/conteudo/ComparativoTributario.tsx` | Adicionar breadcrumbs |
| `src/pages/conteudo/GeradorRPA.tsx` | Adicionar breadcrumbs |
| `src/pages/conteudo/TabelaSimplesNacional.tsx` | Adicionar breadcrumbs |
| `src/pages/PoliticaPrivacidade.tsx` | Adicionar breadcrumbs (opcional) |
| `src/pages/Termos.tsx` | Adicionar breadcrumbs (opcional) |

