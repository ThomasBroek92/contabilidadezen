

# Plano: Corrigir Estrutura do robots.txt

## Problema Identificado

O arquivo `robots.txt` atual tem um **erro de estrutura** que compromete as regras de bloqueio. No formato robots.txt, cada diretiva `Disallow` ou `Allow` se aplica ao bloco `User-agent` imediatamente acima. Atualmente:

- As regras de bloqueio (`Disallow: /admin`, `/auth`, URLs legadas, etc.) estao posicionadas **apos** o bloco `User-agent: Google-Extended`
- Isso significa que essas regras so se aplicam ao `Google-Extended`, e nao a todos os bots
- O bloco `User-agent: *` (linha 18-19) so tem `Allow: /`, sem nenhum `Disallow`

Na pratica, **nenhum bot esta sendo bloqueado de acessar `/admin`, `/auth` ou URLs legadas** -- exceto o Google-Extended.

## Solucao

Reorganizar o arquivo para que:

1. O bloco `User-agent: *` contenha todas as regras de `Allow` e `Disallow` globais
2. Blocos especificos por bot (Googlebot, Bingbot, etc.) fiquem separados apenas se tiverem regras diferentes (como `Crawl-delay`)
3. Bots de IA mantenham suas permissoes explicitas
4. As diretivas `Sitemap` e `Host` fiquem no final (sao globais por especificacao)

## Estrutura Corrigida

```text
# Contabilidade Zen - robots.txt

# Regras globais (todos os bots)
User-agent: *
Allow: /
Allow: /assets/
Allow: /*.js$
Allow: /*.css$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.webp$
Allow: /*.svg$
Disallow: /admin
Disallow: /admin/
Disallow: /auth
Disallow: /auth/
Disallow: /parceiro/
Disallow: /lovable-uploads/
Disallow: /*.json$
Disallow: /*?*
Disallow: /2019/
Disallow: /2020/
Disallow: /2021/
Disallow: /2022/
Disallow: /2023/
Disallow: /2024/
Disallow: /2025/
Disallow: /tags/
Disallow: /author/
Disallow: /search/
Disallow: /wp-login.php
Disallow: /cdn-cgi/
Disallow: */feed/
Disallow: */feed$
Disallow: /sede-virtual-gratuita/
Disallow: /gestor-de-trafego-pode-ser-mei/
Disallow: /impostos-na-venda-de-e-books-2/
Disallow: /sdsdsd/

# Googlebot (crawl-delay especifico)
User-agent: Googlebot
Crawl-delay: 1

# Bingbot (crawl-delay especifico)
User-agent: Bingbot
Crawl-delay: 2

# Bots sociais (permitir explicitamente)
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Bots de IA (permitir busca/indexacao)
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Anthropic-AI
Allow: /

# Bloquear treinamento de IA
User-agent: Google-Extended
Disallow: /

# Sitemaps
Sitemap: https://xqlkjoajrefbvbhkusdn.supabase.co/functions/v1/sitemap
Sitemap: https://www.contabilidadezen.com.br/sitemap.xml

# Host preferencial
Host: https://www.contabilidadezen.com.br
```

## Detalhes Tecnicos

### Arquivo alterado

- `public/robots.txt` -- reorganizar estrutura para que Disallow/Allow fiquem dentro dos blocos User-agent corretos

### O que muda na pratica

| Antes | Depois |
|-------|--------|
| `/admin` bloqueado apenas para Google-Extended | `/admin` bloqueado para **todos** os bots |
| `/auth` bloqueado apenas para Google-Extended | `/auth` bloqueado para **todos** os bots |
| URLs legadas bloqueadas apenas para Google-Extended | URLs legadas bloqueadas para **todos** os bots |
| Regras Allow de assets aplicadas a ninguem | Regras Allow de assets aplicadas a **todos** os bots |

### Nenhum outro arquivo alterado

O sitemap, llm.html e SEOHead permanecem inalterados.

