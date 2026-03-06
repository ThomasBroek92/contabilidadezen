

## Plano: Atualizar indexacao + Corrigir FAQ schema invalido

### Problema 1: FAQ schema invalido (6 itens no Google)

O banco armazena `faq_schema` como objeto FAQPage completo:
```json
{ "@type": "FAQPage", "mainEntity": [{ "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }] }
```

`BlogPost.tsx` linha 229 passa `post.faq_schema?.mainEntity` para o SEOHead, que espera `{ question, answer }[]`. Mas o `mainEntity` tem `{ name, acceptedAnswer: { text } }`. O `generateFAQSchema` mapeia `faq.question` e `faq.answer`, que sao `undefined` — gerando schema sem `name` e `text`.

**Correcao**: Em `BlogPost.tsx`, transformar os dados antes de passar:
```tsx
faqs={post.faq_schema?.mainEntity?.map(item => ({
  question: item.name || item.question,
  answer: item.acceptedAnswer?.text || item.answer
}))}
```

Tambem corrigir no prerender Edge Function (linha 398-410) para aceitar o formato objeto (nao apenas array):
```ts
if (post.faq_schema) {
  const mainEntity = Array.isArray(post.faq_schema) 
    ? post.faq_schema 
    : (post.faq_schema as any).mainEntity;
  // ... gerar schema a partir de mainEntity
}
```

### Problema 2: index.html noscript faltando 9 segmentos

Adicionar ao bloco `<noscript>` (linhas 80-86) e ao bloco `static-prerender` (linhas 127-133):
- Produtores Digitais
- Profissionais de TI
- Exportacao de Servicos
- Prestadores de Servico
- Profissionais PJ
- E-commerce
- Clinicas e Consultorios
- YouTubers e Creators
- Outros Segmentos

### Problema 3: google-search-console staticPages faltando URLs

Adicionar ao array `staticPages` (ja tem youtubers e outros, mas faltam):
- `/segmentos/contabilidade-para-youtubers-e-creators`
- `/segmentos/contabilidade-para-outros-segmentos`
- `/conteudo/gerador-invoice`
- `/conteudo/tabela-simples-nacional`
- `/conteudo/modelo-contrato-pj`
- `/cidades-atendidas`
- `/contabilidade-em-campinas`
- `/conteudo/tabela-cnaes`

### Arquivos a editar

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/BlogPost.tsx` | Transformar mainEntity para {question, answer} antes de passar ao SEOHead |
| `supabase/functions/prerender/index.ts` | Aceitar faq_schema como objeto (nao apenas array) |
| `index.html` | Adicionar 9 segmentos nos blocos noscript e static-prerender |
| `supabase/functions/google-search-console/index.ts` | Adicionar URLs faltantes ao staticPages |

### Acao pos-deploy

Acionar `queue-all-pages` para enviar todas as URLs a fila de indexacao imediatamente.

