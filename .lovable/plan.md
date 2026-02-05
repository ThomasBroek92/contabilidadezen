

# Plano: Resolver Erro "Página com Redirecionamento" no Google Search Console

## Diagnóstico

O erro "Página com redirecionamento" que você está vendo no Google Search Console é causado por um problema diferente dos redirects do WordPress. 

### O que está acontecendo

O Google está encontrando cada página do blog em **duas versões**:
- `https://contabilidadezen.com.br/blog/...` (sem www)  
- `https://www.contabilidadezen.com.br/blog/...` (com www)

Quando o Google acessa a versão sem www, ela redireciona para a versão com www. O Google classifica isso como "Página com redirecionamento" e não indexa - ele só indexa a versão final (com www).

**Isso NÃO é um problema** - é o comportamento esperado. O Google está:
1. Encontrando as duas versões
2. Seguindo o redirecionamento
3. Indexando apenas a versão canônica (com www)

### Sobre os redirects anteriores

Os redirects que implementamos para as URLs do WordPress (`/fale-conosco/`, `/abertura-de-empresa/`, etc.) são **independentes** deste problema e continuarão funcionando normalmente. Eles redirecionam URLs legadas para as novas páginas.

---

## Solução

### Opção 1: Não fazer nada (Recomendado)

Este "erro" é na verdade um comportamento correto de SEO. O Google:
- Vai parar de rastrear as URLs duplicadas com o tempo
- Vai manter indexadas apenas as URLs canônicas (com www)
- Os canonical tags já estão configurados corretamente

**Ação**: Apenas aguardar 2-4 semanas. O número de páginas com esse erro vai diminuir naturalmente.

### Opção 2: Configurar redirect 301 no servidor DNS/Hosting

Se quiser resolver mais rapidamente, configure no seu provedor de hospedagem:

**Regra de Redirect:**
```text
contabilidadezen.com.br/* → https://www.contabilidadezen.com.br/*
```

**Onde configurar** (depende do seu hosting):
- **Cloudflare**: Page Rules ou Redirect Rules
- **Vercel**: vercel.json com redirects
- **Netlify**: _redirects file
- **Lovable Cloud**: Já deve estar configurado automaticamente

---

## Por que não é um problema crítico

| Aspecto | Status |
|---------|--------|
| Canonical tags | Corretos (apontando para www) |
| Sitemap | Correto (apenas URLs com www) |
| Meta robots | Corretos (index, follow) |
| Conteúdo indexado | Sim (versão www está indexada) |

### O que o Google realmente diz

"Página com redirecionamento" significa que:
- O Google encontrou a URL
- Seguiu o redirect
- **Indexou a página de destino** (não a de origem)

Isso é **bom** para SEO - significa que seu redirect está funcionando corretamente.

---

## Verificação Rápida

Para confirmar que as páginas estão indexadas, busque no Google:

```text
site:www.contabilidadezen.com.br/blog
```

Você deve ver os posts listados nos resultados.

---

## Resumo

| Problema | Impacto | Ação |
|----------|---------|------|
| URLs non-www redirecionando | Baixo/Nenhum | Aguardar ou configurar redirect no servidor |
| Redirects WordPress (anterior) | Resolvido | Já implementado no código |
| Páginas do blog indexadas | OK | As versões www estão indexadas normalmente |

### Arquivos a Modificar

**Nenhum** - o código React já está correto. Se desejar, a configuração de redirect deve ser feita no painel de hospedagem/DNS, não no código.

