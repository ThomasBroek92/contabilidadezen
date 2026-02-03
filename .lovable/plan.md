

# Plano: Corrigir Logica de Calculo da Calculadora CLT x PJ

## Problema Identificado

A logica atual multiplica o salario CLT por 1.4 (40% de encargos) para calcular o faturamento PJ:

```typescript
const custoEmpresaCLT = salario * 1.4;  // Linha 288
const faturamentoPJ = custoEmpresaCLT;   // Linha 289
```

Quando o usuario informa R$ 15.000 de salario CLT, o sistema calcula R$ 21.000 de faturamento PJ.

## Correcao Proposta

**O faturamento PJ deve ser igual ao salario bruto CLT**, permitindo uma comparacao justa "apple-to-apple" - ou seja, se o profissional ganha R$ 15.000 no CLT, quanto ele teria liquido se faturasse R$ 15.000 como PJ?

---

## Alteracoes no Codigo

### Arquivo: src/pages/conteudo/CalculadoraPJCLT.tsx

**Alterar linhas 286-298:**

```text
ANTES:
// Custo empresa CLT ≈ salário bruto + encargos (≈40% extra)
const custoEmpresaCLT = salario * 1.4;
const faturamentoPJ = custoEmpresaCLT;

DEPOIS:
// Faturamento PJ = mesmo valor do salário bruto CLT (comparação justa)
const faturamentoPJ = salario;
```

---

## Logica Corrigida

Com a correcao, para um salario CLT de R$ 15.000:

| Metrica | CLT | PJ |
|---------|-----|-----|
| Base | R$ 15.000 | R$ 15.000 |
| INSS | R$ 908,85 (progressivo) | R$ 155,32 (11% sobre 1 SM) |
| IRRF | R$ 2.045 | - |
| Impostos Simples | - | R$ 900 (6%) |
| Contabilidade | - | R$ 297,90 |
| Liquido | R$ 12.046 | R$ 13.646 |

A comparacao fica mais clara: **mesmo faturamento, quanto sobra em cada regime?**

---

## Resumo da Alteracao

1. Remover multiplicacao por 1.4 do calculo de faturamento PJ
2. Faturamento PJ = salario bruto CLT informado
3. Manter toda a logica restante (impostos, INSS, contabilidade)

