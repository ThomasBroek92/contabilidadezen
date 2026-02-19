

# Plano: Configurar LovableHTML Pre-rendering + Pagina LLM Estatica

## Contexto

O site ja possui o conteudo estatico dentro do `#root` (fallback para crawlers), mas o crawler simulator ainda mostra 0 palavras porque muitos simuladores e bots sociais ignoram conteudo dentro de SPAs. A solucao definitiva e o pre-rendering via LovableHTML.

## Parte 1: Configurar LovableHTML (externo, sem codigo)

LovableHTML funciona como um proxy DNS: intercepta requests de crawlers e serve HTML pre-renderizado completo. Setup em 5 minutos.

### Passos para voce (no painel do LovableHTML):

1. Criar conta em https://lovablehtml.com
2. Adicionar o dominio `contabilidadezen.com.br`
3. Alterar os registros DNS no seu provedor de dominio:
   - Tipo A: `@` apontando para o IP fornecido pelo LovableHTML
   - Tipo A: `www` apontando para o IP fornecido pelo LovableHTML
4. Aguardar propagacao DNS (ate 24h, geralmente minutos)
5. Testar no crawler simulator do LovableHTML

### O que o LovableHTML resolve automaticamente:
- Previews sociais corretos (WhatsApp, LinkedIn, Twitter, Telegram) com titulo, descricao e imagem unicos por pagina
- Visibilidade 100% para crawlers do Google (conteudo completo renderizado)
- Visibilidade para bots de IA (ChatGPT, Claude, Perplexity, Gemini)
- Sem alteracao de codigo necessaria
- Cache automatico de paginas pre-renderizadas

## Parte 2: Criar pagina `llm.html` estatica (recomendacao oficial do Lovable)

A documentacao oficial do Lovable recomenda criar uma pagina estatica em `/public/llm.html` com informacoes-chave da empresa para maximizar a visibilidade em mecanismos generativos (ChatGPT, Claude, Perplexity).

### Arquivo: `public/llm.html`

Pagina HTML estatica (sem React) contendo:
- Quem e a Contabilidade Zen (resumo da empresa)
- Servicos oferecidos (lista completa)
- Segmentos atendidos (medicos, dentistas, psicologos, etc.)
- Diferenciais competitivos
- Ferramentas gratuitas disponibilizadas
- Modelo de atendimento (100% digital, WhatsApp)
- Informacoes de contato (NAP)
- FAQs principais (10+)
- Schema JSON-LD (Organization + FAQPage)
- Links para todas as paginas publicas

### Arquivo: `public/robots.txt`

Adicionar permissao explicita para bots de IA:
- `User-agent: GPTBot` -> `Allow: /`
- `User-agent: PerplexityBot` -> `Allow: /`
- `User-agent: Claude-Web` -> `Allow: /`
- `User-agent: Google-Extended` -> `Disallow: /` (bloqueia treinamento, permite busca)

### Atualizacoes no Sitemap

Adicionar `/llm.html` ao sitemap (Edge Function `sitemap/index.ts`).

## Parte 3: Atualizar Base de Conhecimento

Adicionar regra `#PRERENDERING_RULES` ao Custom Knowledge:
- LovableHTML e o servico de pre-rendering oficial do projeto
- Toda nova pagina publica sera automaticamente pre-renderizada via proxy DNS
- A pagina `/llm.html` deve ser atualizada quando servicos, segmentos ou ferramentas mudarem
- O `robots.txt` deve manter permissoes explicitas para bots de IA

## Detalhes Tecnicos

### `public/llm.html` -- Estrutura

```text
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Contabilidade Zen - Informacoes para IA e Crawlers</title>
  <meta name="description" content="..." />
  <link rel="canonical" href="https://www.contabilidadezen.com.br/llm.html" />
</head>
<body>
  <h1>Contabilidade Zen</h1>
  <p>Definicao clara: O que e, quem atende, como funciona</p>
  <h2>Servicos</h2> ...lista completa...
  <h2>Segmentos</h2> ...lista com descricoes...
  <h2>Ferramentas</h2> ...lista com descricoes...
  <h2>FAQ</h2> ...perguntas e respostas factuais...
  <h2>Contato</h2> ...NAP completo...
  <script type="application/ld+json">
    { Organization + FAQPage schemas }
  </script>
</body>
</html>
```

### `public/robots.txt` -- Adicoes

```text
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Google-Extended
Disallow: /
```

### Arquivos alterados pelo Lovable

1. `public/llm.html` -- novo arquivo
2. `public/robots.txt` -- adicionar regras para bots de IA
3. `supabase/functions/sitemap/index.ts` -- adicionar `/llm.html`

### O que voce faz externamente (sem codigo)

1. Criar conta no LovableHTML
2. Configurar DNS conforme instrucoes do servico
3. Testar no crawler simulator

### Impacto esperado

- Social previews: corretos em todas as paginas (via pre-rendering)
- Crawler visibility: 100% (HTML completo servido)
- IA visibility: maximizada (pagina `/llm.html` + robots.txt + pre-rendering)
- Score SEO: deve subir de 55 para 85+ no crawler simulator
- Zero impacto na performance para usuarios reais

