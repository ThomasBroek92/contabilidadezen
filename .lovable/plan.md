

# Auditoria e Correção: Captura de Leads em Páginas de Conteúdo

## Diagnóstico

Revisão completa de todos os formulários de captura nas páginas de conteúdo:

| Página | Salva Lead? | Problema |
|--------|-------------|----------|
| Calculadora PJ x CLT | Sim | Nenhum |
| Comparativo Tributário | Sim | Nenhum |
| Gerador de RPA | Sim | Nenhum |
| Modelo Contrato PJ | Sim | Nenhum |
| **Gerador de Invoice** | **Condicional** | **Só salva se `acceptMarketing` estiver marcado** |
| PJCalculatorSection (Home) | Sim | Nenhum |
| LeadGatedCalculator (Cidades) | Sim | Nenhum |
| Tabela Simples Nacional | N/A | Não tem formulário (é só consulta) |

## Problema Principal

O **Gerador de Invoice/Fatura** só salva o lead se o checkbox de marketing estiver marcado. Como o usuário já preenche nome, e-mail e telefone para gerar o documento, esses dados devem **sempre** ir para o CRM.

## Correção

**`src/pages/conteudo/GeradorInvoice.tsx`**

Mover a chamada `saveLead()` para fora da condição `acceptMarketing`. Salvar o lead **sempre** que o usuário gerar um PDF e tiver e-mail preenchido. O checkbox de marketing continua existindo para fins de LGPD/comunicação, mas a captura para o CRM acontece independentemente.

```
// ANTES
if (formData.acceptMarketing && formData.providerEmail) {
  await saveLead({ ... });
}

// DEPOIS
if (formData.providerEmail) {
  await saveLead({ ... });
}
```

Apenas 1 arquivo a modificar: `src/pages/conteudo/GeradorInvoice.tsx`

