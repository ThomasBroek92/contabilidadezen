

# Plano: Botao "Ver Meu Resultado" Rastreavel via GTM + Pagina de Resultado com CTA

## Objetivo
Tornar o botao "Ver Meu Resultado" rastreavel via Google Tag Manager (GTM), redirecionar o usuario para uma pagina dedicada de resultados apos salvar o lead, e incluir um CTA forte para contato com o contador especialista.

## O que muda

### 1. Nova rota: `/conteudo/calculadora-pj-clt/resultado`
- Pagina dedicada que recebe os dados do calculo via `state` do React Router
- Exibe o resultado completo da comparacao CLT x PJ (mesmos cards ja existentes)
- Inclui CTA prominente para falar com contador especialista via WhatsApp
- SEO: meta tag `noindex` (pagina de resultado personalizado, nao deve ser indexada)

### 2. Rastreamento GTM no botao "Ver Meu Resultado"
- Ao clicar no botao, antes de redirecionar, dispara evento `ver_resultado_calculadora` no dataLayer
- Parametros enviados: economia anual, salario bruto, fonte do lead
- Isso permite criar tags e triggers no GTM para rastrear conversoes

### 3. Redirecionamento apos salvar lead
- Apos `handleLeadSubmit` salvar o lead com sucesso, em vez de scroll para resultados na mesma pagina, navega via `useNavigate` para `/conteudo/calculadora-pj-clt/resultado`
- Os dados do calculo sao passados via `state` do React Router (sem expor dados na URL)

### 4. Pagina de Resultado com CTA
A nova pagina tera:
- Cards de comparacao CLT x PJ (reutilizando a logica visual existente)
- Card de economia destacado (gradient)
- **CTA principal**: "Falar com Contador Especialista" abrindo WhatsApp com mensagem personalizada incluindo o salario e economia calculados
- CTA secundario: "Agendar consultoria gratuita" linkando para contato
- Observacoes importantes (accordion)
- Se o usuario acessar a pagina sem dados (acesso direto), redireciona de volta para `/conteudo/calculadora-pj-clt`

---

## Detalhes Tecnicos

### Arquivos modificados

**`src/pages/conteudo/CalculadoraPJCLT.tsx`**
- Importar `useNavigate` do react-router-dom
- No `handleLeadSubmit`, apos salvar lead com sucesso:
  - Disparar `trackFormSubmit` e novo evento `ver_resultado_calculadora` no dataLayer
  - Navegar para `/conteudo/calculadora-pj-clt/resultado` passando `resultado`, `nome` e `salarioBruto` via state
- Remover a secao 3 (resultado inline) que nao sera mais necessaria nesta pagina

**`src/hooks/use-analytics.ts`**
- Nenhuma mudanca necessaria; o `trackFormSubmit` ja faz push no dataLayer
- O evento customizado `ver_resultado_calculadora` sera disparado diretamente via `window.dataLayer.push`

**`src/pages/conteudo/ResultadoCalculadoraPJCLT.tsx`** (novo arquivo)
- Recebe dados via `useLocation().state`
- Exibe resultado completo com cards CLT vs PJ
- CTA WhatsApp com mensagem personalizada
- Fallback: redireciona para calculadora se nao houver dados
- SEOHead com `noindex`

**`src/App.tsx`**
- Adicionar rota lazy: `/conteudo/calculadora-pj-clt/resultado`

**`src/lib/whatsapp.ts`**
- Adicionar template de mensagem `resultadoCalculadora` para o CTA da pagina de resultado

### Evento GTM

```text
window.dataLayer.push({
  event: 'ver_resultado_calculadora',
  calculator_type: 'CLT x PJ',
  economia_anual: resultado.economiaAnual,
  salario_bruto: salarioBruto,
  lead_nome: nome,
  lead_fonte: 'Calculadora CLT x PJ'
});
```

Este evento pode ser capturado no GTM como trigger customizado para disparar tags de conversao (Google Ads, GA4, etc.).

### Fluxo do usuario

```text
1. Usuario preenche formulario CLT (salario + beneficios)
2. Clica "Calcular Minha Economia" -> resultado calculado, form de lead aparece
3. Preenche nome/email/whatsapp
4. Clica "Ver Meu Resultado"
   -> Lead salvo no banco
   -> Evento GTM disparado (rastreavel)
   -> Redirecionado para /conteudo/calculadora-pj-clt/resultado
5. Ve resultado completo + CTA "Falar com Contador Especialista"
```

