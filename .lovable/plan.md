

## Plano: Landing Pages Dinamicas para 88 Cidades (Opcao B)

### Arquitetura

Um template dinamico reutilizavel + config centralizada. Campinas migra para o template (Opcao B) — o arquivo `ContabilidadeCampinas.tsx` sera removido e substituido pela rota dinamica.

```text
src/
  lib/
    cities-config.ts          ← NOVO: config de 88 cidades (~2000 linhas)
  pages/cidades/
    CidadeLandingPage.tsx      ← NOVO: template dinamico (~400 linhas)
    ContabilidadeCampinas.tsx   ← REMOVIDO (migrado para template)
```

### Arquivo 1: `src/lib/cities-config.ts`

Interface `CityConfig` com todos os dados por cidade:
- `name`, `slug`, `state`, `region`, `ddd`
- `seoTitle`, `seoDescription`, `seoKeywords`
- `highlights` (diferenciais locais, ex: "Inscrição Municipal em Americana")
- `faqs` (6 perguntas unicas por cidade)
- `aberturaInclusions` (lista de itens do card de abertura)
- `sedeVirtual` (descricao da sede virtual — Holambra para RMC, "digital" para outras)
- `whatsappMessage` (mensagem pre-preenchida com nome da cidade)
- `leadSource` (ex: `landing_americana`)
- `stats` (numeros locais: clientes na regiao, etc.)

**Conteudo por tier:**

| Tier | Cidades | FAQs | Highlights |
|------|---------|------|------------|
| Primary (RMC) | 20 | Especificos (prefeitura local, Junta SP, sede Holambra) | Foco na RMC |
| Secondary (Sul/Sudeste) | 48 | Regionais (estado, digital, Junta local) | 100% Digital + estado |
| Tertiary (Nacional) | 20 | Genericos (contabilidade digital nacional) | Nacional digital |

Para evitar thin content, cada tier tera templates de FAQ com variacoes reais:
- RMC: referencia prefeitura local, ISS municipal, Holambra
- Sul/Sudeste: referencia Junta Comercial do estado, particularidades estaduais
- Nacional: foco em contabilidade digital sem fronteiras

### Arquivo 2: `src/pages/cidades/CidadeLandingPage.tsx`

Template identico ao Campinas atual (738 linhas), mas parametrizado:
- `useParams()` para extrair `slug`
- Busca config em `cities-config.ts`
- Se slug nao encontrado → redirect para `/cidades-atendidas`
- Todas as secoes do Campinas: Hero+Form, Benefits, Card Abertura/Migracao, CustomerJourney, RoutineCarousel, Testimonials, PJCalculator, FAQ, CTA
- Textos dinamicos: titulo, FAQs, abertura inclusions, lead source, WhatsApp message, SEO

### Alteracoes em arquivos existentes

| Arquivo | Alteracao |
|---------|-----------|
| `src/App.tsx` | Remover import/rota de Campinas. Adicionar rota dinamica: `<Route path="/contabilidade-em-:slug" element={<CidadeLandingPage />} />` |
| `src/lib/whatsapp.ts` | Nao precisa mudar — cada cidade tera mensagem customizada no config |
| `src/pages/CidadesAtendidas.tsx` | Transformar TODOS os chips de cidades em `<Link to={/contabilidade-em-${slug}}>` |
| `src/pages/cidades/ContabilidadeCampinas.tsx` | Deletar (conteudo migrado para config + template) |

### SEO (Fase 2)

| Arquivo | Alteracao |
|---------|-----------|
| `supabase/functions/sitemap/index.ts` | Nenhuma — as 88 URLs serao inseridas na tabela `page_metadata` via migration SQL |
| `supabase/functions/prerender/index.ts` | Adicionar logica para servir HTML das cidades via slug matching |
| `supabase/functions/google-search-console/index.ts` | Adicionar 88 cidades ao `queue-all-pages` |
| `index.html` | Adicionar links das cidades principais ao bloco noscript |
| Migration SQL | INSERT 88 rows em `page_metadata` com path, priority, changefreq |

### Execucao em fases

| Fase | Descricao | Arquivos |
|------|-----------|----------|
| 1 | Criar `cities-config.ts` + `CidadeLandingPage.tsx` | 2 novos |
| 2 | Atualizar `App.tsx` (rota dinamica) + deletar `ContabilidadeCampinas.tsx` | 2 editados |
| 3 | Atualizar `CidadesAtendidas.tsx` com links clicaveis | 1 editado |
| 4 | SEO: migration `page_metadata`, prerender, noscript, indexing | 4 editados + 1 migration |

### Estimativa

- ~2.500 linhas de codigo novo total (maioria em `cities-config.ts`)
- 88 URLs indexaveis: `/contabilidade-em-campinas`, `/contabilidade-em-americana`, etc.
- Campinas mantem todo o conteudo atual, apenas servido pelo template dinamico

