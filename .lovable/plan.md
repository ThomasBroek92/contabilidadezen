

# Corrigir Soft 404 em Posts de Blog Inexistentes

## Problema Identificado

As URLs `/blog/abertura-cnpj-psicologo-passo-a-passo-completo` e `/blog/abertura-empresa-representante-comercial-passo-a-passo` nao existem no banco de dados (foram deletadas ou nunca publicadas). Quando um usuario ou crawler acessa esses links, o componente `BlogPost.tsx` redireciona silenciosamente para `/blog` com `navigate('/blog', { replace: true })`.

O Google interpreta isso como **Soft 404** -- a URL nao retorna erro 404, mas tambem nao tem conteudo relevante. Isso prejudica a indexacao e gera alertas no Search Console.

## Solucao

### 1. Mostrar pagina 404 real em vez de redirecionar para /blog

**Arquivo:** `src/pages/BlogPost.tsx`

Quando o post nao e encontrado no banco (linha 127), em vez de `navigate('/blog', { replace: true })`, renderizar o componente `NotFound` diretamente com SEOHead incluindo `noindex`. Isso garante que:

- Google receba conteudo indicando "pagina nao encontrada" (nao um redirect)
- O SEOHead tenha `noindex={true}` para que o Google remova a URL do indice
- O usuario veja uma pagina util com sugestoes (link para /blog, busca, etc.)

### 2. Manter redirect apenas para slugs com timestamp (comportamento existente)

O redirect de slugs antigos com timestamp (ex: `meu-post-1234567890123`) para a versao limpa (`meu-post`) continua funcionando normalmente -- isso e um redirect legitimo.

### 3. Manter redirect para partial match (comportamento existente)

Se o slug digitado corresponde parcialmente a um post existente (linhas 113-125), o redirect para o slug correto tambem continua funcionando.

## Detalhes Tecnicos

**Mudanca principal em `BlogPost.tsx`:**

```text
// ANTES (linha 127):
navigate('/blog', { replace: true });

// DEPOIS:
setPost(null);  // Mantém post como null
setNotFound(true);  // Novo state para controlar 404
```

Adicionar um state `notFound` e renderizar uma pagina 404 inline quando ativado:

- SEOHead com title "Artigo nao encontrado", noindex/nofollow
- Mensagem clara: "Este artigo nao esta mais disponivel"
- Link para /blog e botao de WhatsApp
- Mesmo tratamento no bloco catch (linha 145)

**Impacto:**
- Zero impacto em posts existentes
- Google para de reportar Soft 404 para URLs deletadas
- URLs removidas serao naturalmente desindexadas pelo noindex
