
## Objetivo
Eliminar de forma definitiva o erro **“api.whatsapp.com está bloqueado (ERR_BLOCKED_BY_RESPONSE)”** em todo o site, garantindo que **todo CTA/botão/link de WhatsApp**:
1) gere URL correta (com mensagem bem codificada), e  
2) **abra fora do iframe** (sempre em nova aba/janela), evitando o bloqueio por política do WhatsApp.

## Diagnóstico (o que o print indica)
O erro do print acontece quando o WhatsApp (que redireciona para `api.whatsapp.com`) é aberto **dentro de um iframe** (como o Preview do Lovable) ou em algum contexto “embutido”. O WhatsApp envia headers que impedem exibição embutida (anti-iframe), e o browser bloqueia com **ERR_BLOCKED_BY_RESPONSE**.

Mesmo usando `wa.me`, o WhatsApp frequentemente redireciona para `api.whatsapp.com`. Então o ponto crítico é: **não navegar para WhatsApp dentro do iframe**; precisa abrir como **top-level** (nova aba/janela).

## Estado atual do projeto (encontrado no código)
- Já existe um sistema centralizado em `src/lib/whatsapp.ts` (bom).
- Porém ainda existem **links hardcoded** `https://wa.me/...` espalhados (com mensagens sem `encodeURIComponent`, e alguns sem `target="_blank"`), por exemplo:
  - `src/pages/Contato.tsx`
  - `src/pages/Servicos.tsx`
  - `src/components/abrir-empresa/AbrirEmpresaFAQ.tsx`
  - `src/components/sections/HeroMultiNiche.tsx`
  - `src/components/sections/CTA.tsx`
  - `src/pages/conteudo/ComparativoTributario.tsx`
  - `src/pages/conteudo/CalculadoraPJCLT.tsx`
  - `src/pages/conteudo/ModeloContratoPJ.tsx`
  - `src/components/segmentos/representantes/RepresentantesCTA.tsx`
  - `src/components/segmentos/shared/TaxComparisonCalculator.tsx` (usa encode manual no template)
  - `src/components/sections/CustomerJourney.tsx` (usa encode manual no template)
  - `src/pages/PartnerDashboard.tsx` (encode manual no template)
  - `src/pages/PoliticaPrivacidade.tsx` (link para WhatsApp sem `target="_blank"`)
  - `src/pages/NotFound.tsx` (número hardcoded e diferente do oficial)
  - `src/components/crm/LeadDetail.tsx` e `src/components/crm/LeadsTableEnhanced.tsx` (montam wa.me manualmente para leads)

Isso cria 3 classes de risco:
1) **Abrir no mesmo contexto/aba** (sem `target="_blank"` ou sem `window.open`) → tende a reproduzir o erro do print no Preview.
2) **Mensagem sem encoding** (espaços, acentos, pontuação) → URL inconsistente/instável (funciona “às vezes”, quebra em alguns browsers).
3) **Múltiplas formas de gerar link** (hardcode/encode manual/wa.me direto) → regressões futuras.

---

## Estratégia de correção (padrão único e “à prova de erro”)

### A) Fortalecer o módulo central `src/lib/whatsapp.ts`
Além do que já existe (`getWhatsAppLink`, `getWhatsAppLinkByKey`, `openWhatsApp`, `getWhatsAppLinkForPhone`), vamos adicionar helpers para “uso impossível de errar”:

1) **Props prontas para <a>** (garante nova aba + rel correto)
- `getWhatsAppAnchorProps(message?: string)`
- `getWhatsAppAnchorPropsByKey(key: WhatsAppMessageKey)`
- `getWhatsAppAnchorPropsForPhone(phone: string, message?: string)`

Essas funções retornam sempre:
- `href` gerado pelo sistema central (com encoding certo)
- `target="_blank"`
- `rel="noopener noreferrer"`

2) **Openers para clique**
- `openWhatsAppByKey(key)`
- `openWhatsAppForPhone(phone, message?)`

Isso padroniza também CRM/contato com leads.

> Benefício: mesmo que alguém esqueça `target="_blank"`, usando as props prontas fica automaticamente correto.

### B) (Opcional, mas recomendado) Criar um componente reutilizável
Criar `src/components/WhatsAppLink.tsx` (ou `WhatsAppCTA.tsx`) que encapsula:
- `href` via lib
- `target/rel`
- `aria-label` quando necessário

Assim, para botões futuros, o dev só usa:
- `<WhatsAppLink messageKey="default">Falar no WhatsApp</WhatsAppLink>`
ou
- `<WhatsAppLink phone={lead.whatsapp} />`

### C) “Regra anti-erro” (regressão)
Implementar 2 camadas:
1) **Auditoria automática por busca** (durante desenvolvimento): garantir que não exista mais `href="https://wa.me` hardcoded fora do módulo central.
2) **Base de conhecimento (memória do projeto)**: regra explícita e snippet padrão (ver seção “Memória do projeto”).

---

## Plano de execução (passo a passo)

### Passo 1 — Auditoria completa do repositório
1) Varredura por padrões proibidos:
- `https://wa.me/`
- `wa.me/`
- qualquer encoding manual `encodeURIComponent(` aplicado diretamente no template do href (para evitar “duplo encode” depois da migração)
2) Classificar ocorrências em:
- “hardcoded href”
- “window.open hardcoded”
- “sem target blank”
- “número divergente do oficial”
3) Resultado esperado: uma lista final de arquivos e linhas a corrigir (o objetivo é ficar com **zero ocorrências hardcoded** fora do `src/lib/whatsapp.ts`, exceto casos extremamente justificados).

### Passo 2 — Atualizar `src/lib/whatsapp.ts` (padrão final)
1) Adicionar helpers de props e openers (descritos acima).
2) Garantir que **toda geração de link** passe por `encodeURIComponent` uma única vez (sem duplo encode).
3) Manter `WHATSAPP_NUMBER` como fonte única.

### Passo 3 — Migrar site inteiro para o padrão novo
Substituições planejadas (exemplos do que será feito):

#### 3.1 Páginas/Seções com `href="https://wa.me/..."`
Trocar por:
- `getWhatsAppAnchorPropsByKey("...")` quando existir uma key apropriada em `WHATSAPP_MESSAGES`
- ou `getWhatsAppAnchorProps("mensagem crua aqui")` quando for mensagem específica
- e remover qualquer `encodeURIComponent` manual que estava sendo aplicado fora da lib.

Arquivos principais que serão ajustados (com base na auditoria já encontrada):
- `src/pages/Contato.tsx` (CTA “Falar pelo WhatsApp”)
- `src/pages/Servicos.tsx` (CTA “WhatsApp”)
- `src/components/abrir-empresa/AbrirEmpresaFAQ.tsx`
- `src/components/sections/HeroMultiNiche.tsx`
- `src/components/sections/CTA.tsx`
- `src/pages/conteudo/ComparativoTributario.tsx`
- `src/pages/conteudo/CalculadoraPJCLT.tsx`
- `src/pages/conteudo/ModeloContratoPJ.tsx`
- `src/components/segmentos/representantes/RepresentantesCTA.tsx`

#### 3.2 Locais com template + encode manual
Trocar para passar a mensagem “crua” para a lib:
- `src/components/sections/CustomerJourney.tsx`
- `src/components/segmentos/shared/TaxComparisonCalculator.tsx`
- `src/pages/PartnerDashboard.tsx`

Exemplo de regra:
- Antes: `...text=${encodeURIComponent(msg)}`
- Depois: `getWhatsAppLink(msg)` (sem encode manual)

#### 3.3 Links que abrem no mesmo contexto (risco máximo do erro do print)
Corrigir para sempre abrir em nova aba/janela:
- `src/pages/PoliticaPrivacidade.tsx` (adicionar target/rel via helper)
- Qualquer outro `<a href={...}>` que a auditoria apontar sem `target="_blank"`.

#### 3.4 NotFound e números inconsistentes
- `src/pages/NotFound.tsx`: trocar número hardcoded para o oficial e usar helper central + mensagem adequada (ex.: `default` ou uma mensagem específica incluindo o pathname).

#### 3.5 CRM / contato com leads (número variável)
Padronizar com `getWhatsAppLinkForPhone` + `openWhatsAppForPhone`:
- `src/components/crm/LeadDetail.tsx`
- `src/components/crm/LeadsTableEnhanced.tsx`
E revisar usos indevidos de `openWhatsApp()` (que hoje é para **mensagem no número oficial**, não para número de lead).

### Passo 4 — Checklist de QA (teste ponta a ponta)
Testes obrigatórios depois da migração:
1) **No Preview (iframe)**: clicar em todos CTAs de WhatsApp nas páginas principais:
   - Home, Campinas, Serviços, Contato, Abrir Empresa, Segmentos, Ferramentas (Calculadora/Comparativo/Invoice), Blog/Posts, 404, Política de Privacidade.
   - Resultado esperado: abre **nova aba** sem tela “bloqueado”.
2) **No site publicado**: repetir os cliques (desktop + mobile).
3) **Mobile**:
   - Android Chrome e iOS Safari: confirmar que abre WhatsApp app / WhatsApp Web corretamente.
4) Confirmar que textos com acentos e símbolos (ex.: “Olá!”, “PJ x CLT”) chegam íntegros no WhatsApp (sem caracteres quebrados).

---

## “Memória do projeto” (Base de conhecimento) — atualização para evitar regressões
Vamos adicionar um bloco fixo (em `.lovable/plan.md` e também no Custom Knowledge do projeto) com:

### Regra 1 — Proibição total de hardcode
- Proibido: `href="https://wa.me/..."`, `window.open("https://wa.me/...")`, `api.whatsapp.com`.
- Obrigatório: usar **somente** `src/lib/whatsapp.ts`.

### Regra 2 — Nunca encode manual fora da lib
- Proibido: `encodeURIComponent` no template do link.
- A lib já codifica a mensagem.

### Regra 3 — Sempre abrir fora do iframe
- Todo link de WhatsApp deve abrir em nova aba:
  - via `getWhatsAppAnchorProps*` (recomendado), ou
  - via `openWhatsApp*` em handlers de clique.

### Snippet padrão (para copiar/colar)
- Exemplo com mensagem por key:
  - `const wa = getWhatsAppAnchorPropsByKey("abrirEmpresa");`
  - `<a {...wa}>Falar no WhatsApp</a>`
- Exemplo com mensagem custom:
  - `<a {...getWhatsAppAnchorProps("Olá! Vim da página X...")}>WhatsApp</a>`
- Exemplo para lead/CRM:
  - `openWhatsAppForPhone(lead.whatsapp, "Olá! ...")`

---

## Entregáveis ao final
1) Zero links hardcoded para WhatsApp fora do sistema central.
2) Todos os CTAs de WhatsApp abrindo em nova aba (sem ERR_BLOCKED_BY_RESPONSE no Preview).
3) “Memória do projeto” atualizada com regras + snippets, reduzindo chance de erro em botões futuros.
4) Lista de testes executados (páginas testadas + resultado).

## Observação importante
O erro do print é muito comum no Preview por ser iframe; ao padronizar “abrir em nova aba” nós eliminamos o problema no Preview e também deixamos o comportamento mais robusto para qualquer cenário de embed/in-app browser.
