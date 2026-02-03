
# Plano: Redesign da Calculadora CLT x PJ

## Resumo

Redesenho completo da pagina da calculadora, mantendo a Secao 1 (Hero) inalterada e implementando um novo fluxo que compara CLT x PJ (ao inves do atual "Autonomo x PJ"). A nova estrutura tera formulario focado em dados CLT, resultados detalhados com comparativo visual, conteudo educativo em tabs, e secoes de conversao otimizadas.

---

## Mudanca de Conceito

**Atual**: Compara Autonomo (PF) x PJ
**Novo**: Compara CLT (empregado com carteira) x PJ

Isso requer ajustes na logica de calculo:
- CLT: considera salario bruto, descontos (INSS, IRRF) e beneficios anualizados (ferias, 13o, FGTS)
- PJ: faturamento bruto igual ao custo empresa CLT, com impostos do Simples Nacional

---

## Estrutura das Secoes

### Secao 1 - Hero (MANTER)
- Nao alterar nada
- Hero atual permanece identico

### Secao 2 - Formulario Interativo (SUBSTITUIR)

**Novo layout:**
- Card com sombra suave e titulo "Preencha com seus dados CLT"
- 5 campos de input com mascara de moeda brasileira:
  1. Salario Bruto Mensal (CLT) - obrigatorio, minimo R$ 1.412
  2. Vale Refeicao/Alimentacao - opcional
  3. Vale Transporte - opcional
  4. Plano de Saude - opcional
  5. Outros Beneficios - opcional
- Botao CTA verde: "Calcular Minha Economia"
- Disclaimer com links para Politica de Privacidade e Termos de Uso

### Secao 3 - Resultado da Calculadora (SUBSTITUIR)

**Novo layout - aparece apos calculo:**

1. **Card de Comparacao Split (2 colunas)**
   - Coluna esquerda (CLT): icone carteira, salario bruto, descontos IRPF e INSS, salario liquido, beneficios anualizados (ferias, 13o, FGTS), ganho anual total
   - Coluna direita (PJ): icone predio, faturamento bruto, impostos Simples (6-11%), INSS pro-labore, contabilidade, salario liquido, ganho anual total

2. **Card de Economia (destaque central)**
   - Icone cifrao/seta para cima
   - Valor da economia anual
   - Percentual de ganho
   - Fundo verde gradiente

3. **Observacoes Importantes (Accordion)**
   - Simples Nacional Anexo III com Fator R
   - Deducao de despesas operacionais como PJ
   - Conversao de beneficios CLT para valor mensal
   - Disclaimer sobre estimativas

### Secao 4 - Conteudo Educativo (NOVA)

**Componente Tabs com 3 abas:**

1. **Tab "Entendendo o CLT"**
   - Icone carteira
   - Lista visual com composicao CLT: salario liquido, ferias+terco, 13o, FGTS, beneficios

2. **Tab "Calculando o PJ"**
   - Icone calculadora
   - Lista visual: faturamento bruto, impostos, INSS pro-labore, custos operacionais, liquido PJ

3. **Tab "Principais Diferencas"**
   - Tabela comparativa responsiva: vinculo, ferias, 13o, FGTS, jornada, impostos, rescisao

### Secao 5 - CTA Conversao Principal (NOVA)

**Card com fundo gradiente:**
- Titulo: "Quer pagar menos impostos de forma 100% legal?"
- Subtitulo: "Abra sua empresa em ate 7 dias com a Contabilidade Zen"

**3 colunas de beneficios com icones:**
- Planejamento tributario personalizado
- Processo simplificado (sem mencionar gratis)
- Suporte humanizado via WhatsApp

**2 CTAs lado a lado:**
- "Abrir Minha Empresa" (primario)
- "Falar com Especialista" (outline)

### Secao 6 - Obrigacoes PJ vs CLT (NOVA)

**Accordion com 3 itens:**

1. **"Obrigacoes como PJ"**
   - Abrir CNPJ, contabilidade, notas fiscais, impostos, contratos

2. **"Obrigacoes como CLT"**
   - Jornada, exclusividade, exames, faltas, normas internas

3. **"Quando vale a pena ser PJ?"**
   - Faturamento > R$ 3.000, autonomia, multiplos clientes, flexibilidade

### Secao 7 - FAQ Rapido (SUBSTITUIR)

**4 perguntas otimizadas:**

1. "A calculadora e precisa?"
2. "Posso ser CLT e PJ ao mesmo tempo?"
3. "Quanto custa abrir um CNPJ?"
4. "Preciso de contador obrigatoriamente como PJ?"

---

## Alteracoes Tecnicas

### Logica de Calculo (Nova)

```typescript
interface ResultadoCalculoCLT {
  // CLT
  salarioBrutoCLT: number;
  inssCLT: number;
  irrfCLT: number;
  salarioLiquidoCLT: number;
  feriasMensal: number;
  decimoTerceiroMensal: number;
  fgtsMensal: number;
  beneficiosTotais: number;
  totalMensalCLT: number;
  totalAnualCLT: number;
  
  // PJ
  faturamentoPJ: number;
  impostosPJ: number;
  inssPJ: number;
  contabilidade: number;
  salarioLiquidoPJ: number;
  totalAnualPJ: number;
  
  // Economia
  economiaMensal: number;
  economiaAnual: number;
  percentualEconomia: number;
}
```

**Formulas CLT:**
- Ferias mensal = (salarioBruto / 12) + (salarioBruto / 12 * 0.3333)
- 13o mensal = salarioBruto / 12
- FGTS mensal = salarioBruto * 0.08
- Total mensal equivalente = salarioLiquido + feriasMensal + decimoTerceiroMensal + fgtsMensal + beneficios

**Formulas PJ:**
- Faturamento PJ = salarioBrutoCLT + encargos (custo empresa)
- Impostos = faturamentoPJ * aliquotaSimples (6%)
- INSS PJ = proLabore * 0.11
- Contabilidade = R$ 297,90 (plano basico)

### Componentes Novos

1. **ResultadoComparacao** - Card split CLT x PJ
2. **EconomiaCard** - Card de destaque da economia
3. **ConteudoEducativoTabs** - Tabs com 3 abas
4. **CTAConversao** - Secao de conversao com beneficios
5. **ObrigacoesAccordion** - Accordion com 3 itens

### Componentes Reutilizados

- Input com mascara de moeda (existente)
- Accordion (existente)
- Tabs (existente)
- Button variants (existente)
- Card (existente)

### Icones Necessarios (Lucide)

- Briefcase (CLT/carteira)
- Building2 (PJ/empresa)
- TrendingUp (economia)
- Calculator
- FileText (documentos)
- Users (beneficios)
- Clock (tempo)
- CheckCircle
- AlertCircle

### Validacoes

- Salario bruto obrigatorio e minimo R$ 1.412
- Campos opcionais podem ser vazios
- Mascara de moeda brasileira em todos os campos
- Mensagens de erro amigaveis

### Responsividade

- Grid 1 coluna no mobile
- Grid 2 colunas no desktop para resultados
- Tabela com scroll horizontal no mobile
- CTAs empilhados no mobile

---

## Arquivos a Modificar

1. **src/pages/conteudo/CalculadoraPJCLT.tsx**
   - Atualizar interface ResultadoCalculo para CLT
   - Modificar funcao calcular() para logica CLT
   - Substituir secoes 2-7 conforme especificacao
   - Manter Hero (secao 1) intacto
   - Atualizar FAQ Schema para novas perguntas

---

## Consideracoes de SEO

- Atualizar title e meta description para refletir CLT x PJ
- Atualizar FAQ schema com novas perguntas
- Manter keywords relevantes: calculadora clt pj, quanto ganha pj, vale a pena ser pj

---

## Estimativa de Tamanho

- Arquivo atual: ~1300 linhas
- Estimativa apos mudancas: ~1500-1700 linhas (mais conteudo educativo e secoes)

---

## Ordem de Implementacao

1. Atualizar interface e logica de calculo para CLT
2. Redesenhar Secao 2 (formulario)
3. Implementar Secao 3 (resultados)
4. Adicionar Secao 4 (conteudo educativo com tabs)
5. Adicionar Secao 5 (CTA conversao)
6. Adicionar Secao 6 (obrigacoes accordion)
7. Substituir Secao 7 (FAQ)
8. Atualizar SEO meta e schema
