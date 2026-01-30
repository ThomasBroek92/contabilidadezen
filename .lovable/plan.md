

# Plano: Atualizar Aparência no Google Search

## Objetivo
Fazer com que os resultados de busca do Google exibam:
1. O logo da Contabilidade Zen (ícone "CZ") ao invés do logo do Lovable
2. Meta description alinhada com a proposta de valor do Hero (redução de carga tributária para diversos nichos)

---

## Parte 1: Correção do Favicon

### Diagnóstico
O Google pode estar exibindo o favicon antigo do Lovable por um destes motivos:
- Cache do Google ainda não atualizou
- O arquivo `favicon.ico` ainda contém o ícone antigo
- Falta de referência explícita no HTML

### Ações
1. **Verificar e atualizar `favicon.ico`**
   - Garantir que `public/favicon.ico` contenha o ícone "CZ" da Contabilidade Zen
   - Caso necessário, gerar nova versão a partir do `logo-icon.png`

2. **Adicionar referência explícita no index.html**
   - Incluir ambas as referências (PNG e ICO) para máxima compatibilidade

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
```

---

## Parte 2: Atualização das Meta Tags

### Problema Atual
Existem **duas fontes** de meta description em conflito:
- `index.html` (estático): Foca em "médicos, dentistas, psicólogos"
- `SEOHead` no `Index.tsx` (dinâmico): Já está mais genérica

O Google prioriza o conteúdo estático do `index.html` no primeiro carregamento.

### Nova Meta Description (alinhada ao Hero)
**Proposta** (max 160 caracteres):

> "Economize até 50% em impostos com contabilidade digital especializada. Médicos, advogados, TI, produtores digitais e mais. 100% online, 0% burocracia."

### Arquivos a Atualizar

**1. index.html (meta tags estáticas)**
```html
<title>Contabilidade Zen | Economize até 50% em Impostos | Contabilidade Digital</title>
<meta name="description" content="Economize até 50% em impostos com contabilidade digital especializada. Médicos, advogados, TI, produtores digitais e mais. 100% online, 0% burocracia." />
<meta name="keywords" content="contabilidade digital, redução de impostos, planejamento tributário, contabilidade online, abrir empresa, MEI, Simples Nacional" />
```

**2. SEOHead em Index.tsx**
```tsx
<SEOHead
  title="Contabilidade Zen | Economize até 50% em Impostos | Contabilidade Digital"
  description="Economize até 50% em impostos com contabilidade digital especializada. Médicos, advogados, TI, produtores digitais e mais. 100% online, 0% burocracia."
  keywords="contabilidade digital, redução de impostos, planejamento tributário, contabilidade online, abrir empresa, MEI, Simples Nacional, contabilidade para médicos, contabilidade para advogados"
  ...
/>
```

**3. Open Graph (index.html e SEOHead)**
```html
<meta property="og:title" content="Contabilidade Zen | Economize até 50% em Impostos" />
<meta property="og:description" content="Contabilidade digital que reduz sua carga tributária em até 50%. Para profissionais e empresas de diversos nichos. Atendimento humanizado e 100% online." />
```

---

## Parte 3: Atualização dos Schemas JSON-LD

### Arquivo: src/lib/seo-schemas.ts

Atualizar as descrições para refletir a proposta de valor multi-nicho:

```typescript
organizationSchema.description = 
  "Contabilidade digital especializada para profissionais e empresas. Médicos, advogados, TI, produtores digitais, e-commerce e mais. Reduza sua carga tributária em até 50%.";

organizationSchema.slogan = 
  "Economize até 50% em impostos com especialistas";
```

---

## Resumo das Alterações

| Arquivo | Alteração |
|---------|-----------|
| `index.html` | Atualizar title, meta description, OG tags |
| `src/pages/Index.tsx` | Atualizar props do SEOHead |
| `src/lib/seo-schemas.ts` | Atualizar description e slogan do Organization |
| `public/favicon.ico` | Verificar/substituir pelo ícone CZ |

---

## Seção Técnica

### Sobre o Cache do Google
- O Google pode levar de **1 a 4 semanas** para atualizar o favicon nos resultados de busca
- Para acelerar, após publicar:
  1. Acessar Google Search Console
  2. Solicitar nova indexação da página inicial
  3. O favicon será atualizado automaticamente após o recrawl

### Verificação Pós-Publicação
Após publicar as alterações:
1. Testar em [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Verificar meta tags com [metatags.io](https://metatags.io)
3. Solicitar reindexação no Google Search Console
4. Aguardar 1-2 semanas para atualização completa nos resultados

