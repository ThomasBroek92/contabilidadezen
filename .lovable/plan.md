

# Configurar domínio www.contabilidadezen.com.br no Cloudflare Pages + redirect 301

Este é um guia de configuração no painel do Cloudflare — não requer mudanças no código, exceto a criação de um arquivo `_redirects` para o redirect non-www → www.

## Parte 1: Arquivo `_redirects` (mudança no código)

Criar `public/_redirects` com a regra de redirect 301 do Cloudflare Pages:

```
# Redirect non-www to www (301 permanent)
https://contabilidadezen.com.br/* https://www.contabilidadezen.com.br/:splat 301
http://contabilidadezen.com.br/* https://www.contabilidadezen.com.br/:splat 301
```

Este arquivo será copiado para `dist/` durante o build e o Cloudflare Pages o processa automaticamente.

## Parte 2: Configuração no Cloudflare Dashboard (manual, pelo usuário)

### Passo 1 — Adicionar domínios customizados
1. Cloudflare Dashboard → **Workers & Pages** → projeto **contabilidade-zen**
2. Aba **Custom domains** → **Set up a custom domain**
3. Adicionar **dois** domínios:
   - `www.contabilidadezen.com.br` (este será o primário)
   - `contabilidadezen.com.br` (apex, para o redirect funcionar)
4. O Cloudflare criará os registros DNS automaticamente se o domínio já estiver gerenciado no Cloudflare

### Passo 2 — Verificar DNS
No Cloudflare DNS do domínio `contabilidadezen.com.br`, confirmar que existem:
- **CNAME** `www` → `contabilidade-zen.pages.dev` (proxy ativado, nuvem laranja)
- **CNAME** `@` → `contabilidade-zen.pages.dev` (proxy ativado, nuvem laranja)

### Passo 3 — Remover registros antigos
Se existirem registros A apontando para `185.158.133.1` (Lovable), **removê-los** para evitar conflito. O domínio não pode apontar para Lovable e Cloudflare Pages ao mesmo tempo.

### Passo 4 — SSL
Em **SSL/TLS** do domínio no Cloudflare, definir modo como **Full (strict)**.

### Resultado esperado
- `contabilidadezen.com.br/qualquer-pagina` → redirect 301 → `www.contabilidadezen.com.br/qualquer-pagina`
- `www.contabilidadezen.com.br` → serve o site com HTML pré-renderizado
- Google Search Console para de reportar warnings de redirect nas ~59 URLs

## Detalhe técnico

O arquivo `_redirects` é o mecanismo nativo do Cloudflare Pages para redirects. Ele é processado no edge antes de servir qualquer conteúdo, então o redirect 301 acontece sem latência adicional. O `:splat` captura todo o path para preservar a URL completa.

