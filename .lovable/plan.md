
# Plano Aprovado: Criar Página "Contabilidade em Campinas"

## Resumo
Criar landing page de SEO local em `/contabilidade-em-campinas` com formulário de lead integrado no Hero. Sede virtual em **Holambra** (conforme solicitado).

## Arquivos a Criar/Modificar

### 1. CRIAR: `src/pages/cidades/ContabilidadeCampinas.tsx`
Landing page completa com:
- Hero com formulário de captura de lead (lado direito)
- Stats (50+ clientes, 10+ anos, 4.9 Google)
- Seção de benefícios locais
- Seção abertura de empresa em Campinas (sede virtual em Holambra)
- CustomerJourney, RoutineCarousel, Testimonials, PJCalculatorSection (lazy-loaded)
- FAQ focado em Campinas (6 perguntas)
- CTA final com WhatsApp

### 2. MODIFICAR: `src/App.tsx` (linha 77)
Adicionar rota: `/contabilidade-em-campinas`

### 3. MODIFICAR: `src/pages/CidadesAtendidas.tsx`
Transformar "Campinas" em link clicável no Word Cloud da RMC

## Detalhes Técnicos

### Formulário de Lead
- Campos: Nome*, Email*, WhatsApp*, Profissão (opcional), Necessidade (radio)
- Integração: `useLeadCapture` com source `landing_campinas`
- Honeypot anti-spam
- Checkbox de política de privacidade

### Sede Virtual
Texto: "Sede virtual gratuita disponível em **Holambra** (RMC). Para endereço em Campinas, consulte opções com custo adicional."

### SEO
- Title: "Contabilidade em Campinas | Contador Digital Especializado"
- Schema: LocalBusiness + FAQPage
- Keywords: contabilidade campinas, contador campinas, abertura empresa campinas
