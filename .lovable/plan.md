
# Plano: Adicionar Card Dinâmico de Abertura de Empresa em Campinas

## Resumo

Substituir a seção atual simples de "Abertura de Empresa em Campinas" (linhas 436-485 do `ContabilidadeCampinas.tsx`) por um card grande e dinâmico igual ao da homepage (`MainServices.tsx`), mesclando as informações locais de Campinas com o layout visual atraente que inclui:
- Card gradiente com decorações visuais
- Calculadora de economia integrada (LeadGatedCalculator)
- Destaque da sede virtual em Holambra
- Card secundário de migração de contabilidade

---

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `src/pages/cidades/ContabilidadeCampinas.tsx` | MODIFICAR - Substituir seção de abertura por card dinâmico |

---

## Estrutura Visual do Novo Card

```text
+------------------------------------------------------------------------+
|  CARD PRINCIPAL - ABERTURA DE EMPRESA EM CAMPINAS (gradiente teal)     |
+------------------------------------------------------------------------+
|                                                                        |
|  [Sparkles] Mais Popular                                               |
|                                                                        |
|  Abertura de Empresa           +-------------------------------------+ |
|  em Campinas                   | [Gift] Sede Virtual em Holambra     | |
|                                | Endereço comercial GRÁTIS           | |
|  Abra seu CNPJ em até 7 dias   | R$99/mês → R$ 0                     | |
|  úteis com todo suporte...     +-------------------------------------+ |
|                                                                        |
|  ✓ Análise na Prefeitura       +-------------------------------------+ |
|  ✓ Registro Junta SP           | [Calculator] Calcule sua economia   | |
|  ✓ Inscrição Municipal         | Faturamento mensal: R$ 0,00         | |
|  ✓ Alvará e licenças           | [VER MINHA ECONOMIA]                | |
|  ✓ Certificado Digital         +-------------------------------------+ |
|  ✓ Suporte especializado                                               |
|                                                                        |
|  [ABRIR MINHA EMPRESA]  A partir de R$ 0*                              |
|                                                                        |
+------------------------------------------------------------------------+

+------------------------------------------------------------------------+
|  CARD SECUNDÁRIO - MIGRAÇÃO DE CONTABILIDADE (gradiente azul)          |
+------------------------------------------------------------------------+
|  [ArrowLeftRight]  Migração de Contabilidade  [Gratuito]               |
|                                                                        |
|  Troque de contador sem dor de cabeça...                               |
|                                                                        |
|  [100% Digital] [15 dias] [Sem interrupção]  [MIGRAR AGORA]            |
+------------------------------------------------------------------------+
```

---

## Alterações no Código

### Importações a Adicionar

```typescript
import { Sparkles, Gift, ArrowLeftRight } from "lucide-react";
import { LeadGatedCalculator } from "@/components/sections/LeadGatedCalculator";
import { HoverLift, AnimatedIcon } from "@/components/ui/scroll-animation";
```

### Substituir Seção (linhas 436-485)

A seção atual com cards simples será substituída por:

1. **Card Principal de Abertura de Empresa**
   - Fundo gradiente `from-secondary via-secondary/90 to-secondary/80`
   - Decorações circulares de fundo (igual homepage)
   - 2 colunas: conteúdo + calculadora
   - Lista de benefícios focados em Campinas
   - Destaque da sede virtual em Holambra (R$ 0)
   - Componente `LeadGatedCalculator` com source `abertura-campinas`

2. **Card Secundário de Migração**
   - Fundo gradiente `from-primary to-primary/80`
   - Layout horizontal com ícone + texto + badges + CTA
   - Mesmo estilo da homepage

---

## Lista de Benefícios Campinas

```typescript
const aberturaCheckmarks = [
  "Análise na Prefeitura de Campinas",
  "Registro na Junta Comercial SP",
  "Inscrição Municipal Campinas",
  "Alvará e licenças inclusos",
  "Certificado Digital e-CNPJ",
  "Processo 100% digital",
];
```

---

## Destaque Sede Virtual Holambra

```typescript
<div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 flex items-center gap-4">
  <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center shrink-0">
    <Gift className="h-6 w-6 text-warning-foreground" />
  </div>
  <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
      <Building2 className="h-4 w-4 text-white" />
      <span className="font-bold text-white">Sede Virtual em Holambra</span>
    </div>
    <p className="text-white/80 text-sm">
      Endereço comercial gratuito na RMC incluído para clientes.
    </p>
  </div>
  <div className="text-right shrink-0">
    <p className="text-white/60 text-xs line-through">R$ 99/mês</p>
    <p className="text-white font-bold text-lg">R$ 0</p>
  </div>
</div>
```

---

## Componentes Reutilizados

- `LeadGatedCalculator` com source `abertura-campinas`
- `HoverLift` para efeito de elevação
- `AnimatedIcon` para ícones animados
- `StaggerContainer` e `StaggerItem` para animações de entrada

---

## SEO/Conversão

- Calculadora captura leads antes de mostrar resultado (gated)
- Source do lead: `abertura-campinas` (rastreável no CRM)
- Botão primário direciona para `/abrir-empresa`
- Botão de migração direciona para `/contato`

---

## Resultado Esperado

A página de Campinas terá um visual muito mais impactante e alinhado com a homepage, mantendo as informações locais (Holambra, Campinas) e aumentando a conversão com a calculadora integrada.
