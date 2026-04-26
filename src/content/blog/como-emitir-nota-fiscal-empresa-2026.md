---
title: "Como Emitir Nota Fiscal pela Empresa em 2026: NFS-e, NF-e e NFC-e"
slug: como-emitir-nota-fiscal-empresa-2026
category: abertura-empresa
keyword_principal: como emitir nota fiscal empresa
meta_title: "Como Emitir Nota Fiscal pela Empresa em 2026"
meta_description: "Guia completo para emitir nota fiscal em 2026: NFS-e para serviços, NF-e para comércio, NFC-e para varejo, ISS, cancelamento e sistemas de emissão."
author: Thomas Broek
author_crc: CRC-SP 337693/O-7
date: 2026-04-26
freshness_date: 2026-04-26
schema_type: BlogPosting
reading_time: 8 min
etapa_funil: meio
is_pillar: false
keywords:
  - como emitir nota fiscal empresa
  - nfs-e servicos
  - nf-e comercio
  - nota fiscal electronica 2026
  - cancelar nota fiscal
internal_links:
  - /abrir-empresa
  - /contato
  - /calculadora-pj-clt
  - /conteudo/tabela-simples-nacional
---

# Como Emitir Nota Fiscal pela Empresa em 2026: NFS-e, NF-e e NFC-e

A nota fiscal é o documento fiscal mais importante da sua empresa — e emiti-la errada pode resultar em multas que chegam a **R$ 5.000 por nota** em alguns municípios, cancelamentos intempestivos e problemas na auditoria fiscal. Em 2026, existem três tipos principais de nota fiscal eletrônica no Brasil, cada uma para um contexto específico: **NFS-e** para prestação de serviços, **NF-e** para comércio e indústria, e **NFC-e** para varejo ao consumidor final. Este guia prático explica como emitir cada tipo, o que precisa estar cadastrado, como funciona o ISS e o que fazer quando você emite uma nota errada.

---

## Os Três Tipos de Nota Fiscal Eletrônica em 2026

Entender qual tipo de nota emitir é o primeiro passo. Usar o tipo errado pode gerar rejeição pelo sistema ou autuação fiscal.

| Tipo | Nome | Quando Usar | Quem Emite | Base Legal |
|------|------|-------------|------------|------------|
| NFS-e | Nota Fiscal de Serviços Eletrônica | Prestação de serviços | Prestadores de serviço (PJ) | LC 116/2003 + regulamento municipal |
| NF-e | Nota Fiscal Eletrônica (modelo 55) | Venda de mercadorias, indústria, transporte | Comércio e indústria | Ajuste SINIEF 07/2005 |
| NFC-e | Nota Fiscal de Consumidor Eletrônica (modelo 65) | Venda ao consumidor final (varejo) | Comércio varejista | Ajuste SINIEF 19/2016 |

**Nota Fiscal de Produto (série 1 ou A, modelo 1/1A):** nota em papel, praticamente em desuso. Em 2026, apenas empresas com autorização específica do Fisco ainda emitem nota em papel. A grande maioria usa exclusivamente NF-e eletrônica.

**E a NF de serviços fora do ISSQN?** Algumas prefeituras ainda utilizam modelos próprios de nota de serviço que não seguem o padrão NFS-e nacional. Em 2026, a maioria dos municípios de grande e médio porte já adotou a NFS-e no padrão ABRASF ou o padrão nacional de NFS-e (que está sendo implantado progressivamente pela SEFIN/RFB).

---

## NFS-e: Nota Fiscal de Serviços Eletrônica

A **NFS-e** é a nota fiscal usada por empresas prestadoras de serviços. Ela é emitida diretamente no portal da prefeitura do município onde a empresa está registrada ou em sistemas de gestão que se integram ao portal.

### O Que Precisa para Emitir NFS-e

**Requisitos básicos:**

| Requisito | Onde Obter | Prazo |
|-----------|-----------|-------|
| CNPJ ativo | Receita Federal | No ato da abertura |
| Inscrição Municipal (IM) | Prefeitura | 3 a 15 dias após a abertura |
| Alvará de funcionamento | Prefeitura | Junto com a IM |
| Senha no portal da NFS-e | Prefeitura | Após obter a IM |
| Certificado digital A1 ou A3 | Autoridade certificadora | 1 dia |

**Certificado digital:** nem todas as prefeituras exigem certificado digital para NFS-e. Municípios menores permitem emissão com login e senha simples. Mas para NF-e (comércio/indústria) e para integrações com sistemas de gestão, o certificado digital é obrigatório.

### Como Emitir NFS-e Passo a Passo

1. **Acesse o portal da NFS-e da sua prefeitura**
   - São Paulo: nfe.prefeitura.sp.gov.br
   - Rio de Janeiro: notacarioca.rio.rj.gov.br
   - Belo Horizonte: bhiss.pbh.gov.br
   - Curitiba: tributacao.curitiba.pr.gov.br
   - Para outros municípios: busque "[nome do município] NFS-e"

2. **Faça login com inscrição municipal e senha**

3. **Clique em "Emitir NFS-e" ou "Nova Nota"**

4. **Preencha os campos obrigatórios:**
   - **Tomador do serviço:** razão social + CNPJ (se PJ) ou nome + CPF (se PF)
   - **Discriminação do serviço:** descrição detalhada do que foi prestado
   - **Código do serviço:** conforme lista da LC 116/2003 e lista municipal
   - **Valor do serviço**
   - **Data da prestação do serviço** (pode ser diferente da data de emissão)
   - **Deduções** (se houver materiais ou subcontratação)

5. **Revise e transmita**

6. **O sistema gera a NFS-e com número sequencial e RPS** (Recibo Provisório de Serviços, quando emitido em lote)

7. **Envie o XML e o PDF ao tomador do serviço**

---

## O ISS na Nota Fiscal de Serviços

O ISS (Imposto sobre Serviços) é o principal tributo da NFS-e. Ele incide sobre o valor do serviço prestado e é recolhido ao município onde está localizado o prestador do serviço (regra geral — há exceções na LC 116/2003 para serviços prestados no local da execução).

**Alíquotas de ISS (LC 116/2003 — lei nacional):**
- Mínimo: 2% (art. 88 do ADCT da CF/88 — fixado como piso pelo STF)
- Máximo: 5% (art. 8º da LC 116/2003)

**Como o ISS aparece na NFS-e:**

| Campo | O Que É | Exemplo |
|-------|---------|---------|
| Valor do serviço | Valor bruto cobrado | R$ 5.000,00 |
| Alíquota ISS | % definida pela lei municipal | 2,00% |
| Valor ISS | Alíquota × Valor do serviço | R$ 100,00 |
| Valor líquido NFS-e | Valor do serviço − ISS retido (quando há retenção) | R$ 4.900,00 |

**ISS retido na fonte:** quando o tomador do serviço é uma empresa e está enquadrada como substituta tributária pelo município, ela retém o ISS e recolhe diretamente à prefeitura. Nesse caso, o prestador recebe o valor com desconto do ISS — mas isso já está coberto no DAS do Simples Nacional (não há duplo pagamento).

---

## NF-e: Nota Fiscal Eletrônica para Comércio e Indústria

A **NF-e (modelo 55)** é o documento fiscal obrigatório para operações de venda de mercadorias, transporte e indústria. Diferentemente da NFS-e (que é municipal), a NF-e é federal, emitida e autorizada pela SEFAZ (Secretaria da Fazenda) do estado.

### O Que Precisa para Emitir NF-e

| Requisito | Observação |
|-----------|-----------|
| CNPJ ativo + Inscrição Estadual | Obrigatória para comércio |
| Certificado digital A1 ou A3 | Obrigatório — sem exceção |
| Software emissor de NF-e | Portal da SEFAZ (gratuito) ou sistema ERP |
| Credenciamento na SEFAZ | Feito automaticamente ao emitir a 1ª NF-e |

**Sistema gratuito da SEFAZ:** cada estado oferece um emissor gratuito de NF-e. Em São Paulo, é o "NF-e SP" disponível no portal da Secretaria da Fazenda. Funciona bem para empresas com volume baixo de notas.

**Sistemas pagos de gestão:** para empresas com volume maior, sistemas como Bling, Tiny ERP, Netsuite ou SAP Business One integram a emissão de NF-e com o estoque e as finanças.

---

## NFC-e: Nota Fiscal de Consumidor Eletrônica (Varejo)

A **NFC-e (modelo 65)** substitui o cupom fiscal eletrônico (ECF) nos pontos de venda de varejo. É o documento emitido no caixa quando você vende para o consumidor final.

| Característica | NFC-e | NF-e |
|---------------|-------|------|
| Modelo | 65 | 55 |
| Uso | Venda para consumidor final (PF) | Venda entre empresas |
| CPF do comprador | Opcional (pedido pelo comprador) | Necessário se PJ |
| Emissão | No caixa (PDV integrado) | No sistema de faturamento |
| Autorização | SEFAZ estadual | SEFAZ estadual |
| Contingência | Modo offline disponível | Modo offline disponível |

Para emitir NFC-e, é necessário um sistema de PDV (Ponto de Venda) credenciado na SEFAZ estadual. O cupom gerado é impresso em impressora não fiscal (impressora térmica comum) e também enviado eletronicamente à SEFAZ.

---

## Qual CNPJ e CNAE Devem Constar na Nota Fiscal

Este é um ponto de atenção crítico. A nota fiscal deve conter:

- **CNPJ do estabelecimento emitente:** o CNPJ principal da empresa (ou o CNPJ do estabelecimento filial, se for o caso)
- **CNAE da atividade prestada:** deve ser compatível com o serviço descrito na nota
- **Código do serviço (NFS-e):** deve corresponder à lista da LC 116/2003 e à lista do município

**Erro comum:** emitir nota com CNAE que não está cadastrado na empresa. Exemplo: empresa cadastrada como consultoria (CNAE 7020-4/00) que emite nota de desenvolvimento de software (CNAE 6201-5/01) sem ter esse CNAE no cadastro. Isso pode gerar impugnação da nota pela prefeitura ou autuação fiscal.

**Como verificar:** acesse o cartão CNPJ no portal da Receita Federal (cnpj.receita.fazenda.gov.br) e confirme quais CNAEs estão cadastrados. Se precisar adicionar um CNAE, faça uma alteração cadastral na Junta Comercial.

---

## Como Cancelar Nota Fiscal Emitida Errada

Emitiu uma nota com valor errado, tomador incorreto ou descrição equivocada? O processo de cancelamento depende do tipo de nota e do prazo:

**Cancelamento de NFS-e:**

| Prazo após emissão | Possibilidade de cancelamento |
|--------------------|-------------------------------|
| Até 24 horas | Cancelamento simples no portal da prefeitura |
| 24h a 7 dias | Cancelamento com justificativa (alguns municípios) |
| Após 7 dias | Cancelamento geralmente não permitido — necessário carta de correção ou nota de débito/crédito |

**Processo de cancelamento de NFS-e:**
1. Acesse o portal da NFS-e da prefeitura
2. Localize a nota pelo número ou período
3. Selecione "Cancelar nota"
4. Informe a justificativa do cancelamento
5. Confirme — o sistema cancela e envia comunicação ao tomador (em alguns municípios)

**Cancelamento de NF-e:**
- Prazo: até 24 horas após autorização pela SEFAZ
- Após 24 horas: é necessário emitir Carta de Correção Eletrônica (CC-e) para erros específicos, ou carta de anulação com nota de retorno para situações de cancelamento de operação

**O que pode ser corrigido com CC-e (Carta de Correção):**
- Dados do tomador (endereço, inscrição estadual, observações)
- Natureza da operação
- Código fiscal de operações (CFOP)

**O que NÃO pode ser corrigido com CC-e (exige cancelamento e reemissão):**
- Valor da operação
- CNPJ do emitente ou tomador
- Quantidade ou espécie de mercadoria

---

## Sistemas de Emissão: Portal da Prefeitura vs Sistemas Privados

| Opção | Custo | Recursos | Indicado Para |
|-------|-------|----------|---------------|
| Portal da prefeitura | Gratuito | Básico (emissão manual) | MEI, ME com baixo volume |
| Sistemas de NFS-e integrados (ex.: Notas.com.br, GestãoClick) | R$ 30–R$ 150/mês | Automatização, relatórios, integração bancária | ME/SLU com volume médio |
| ERP completo (ex.: Bling, Omie, Conta Azul) | R$ 80–R$ 350/mês | NFS-e + NF-e + financeiro + estoque | Empresas com operação mais complexa |
| ERP robusto (Totvs, SAP, Oracle) | Sob medida | Completo | Grandes empresas |

Para a maioria das micro e pequenas empresas prestadoras de serviços, o **portal da prefeitura + planilha de controle** é suficiente no início. Conforme o volume cresce, um sistema de gestão integrado economiza tempo e reduz erros.

---

## FAQ — Perguntas Frequentes

**1. MEI pode emitir nota fiscal?**
Sim. O MEI pode emitir NFS-e pelo portal da prefeitura do seu município. Não é necessário certificado digital — o MEI usa login e senha. O processo é simples e gratuito.

**2. Preciso emitir nota fiscal para pessoa física (consumidor final)?**
Depende da atividade. Para serviços: a NFS-e deve ser emitida quando o cliente solicitar. Para comércio ao consumidor final: a NFC-e (ou cupom fiscal) é obrigatória na venda. Muitos municípios exigem NFS-e para qualquer prestação de serviço acima de R$ 50–R$ 100.

**3. Qual o prazo para emitir nota fiscal após a prestação do serviço?**
Varia por município. Em geral, a NFS-e deve ser emitida no ato da prestação do serviço ou até o 5º dia útil após o término do período de apuração (geralmente o mês). Consulte a legislação do seu município.

**4. Empresa do Simples Nacional paga ISS na nota?**
O ISS já está incluído no DAS do Simples Nacional. Ao emitir a NFS-e, o campo ISS é preenchido com a alíquota municipal, mas o valor não é recolhido separadamente — já está coberto pelo pagamento mensal do DAS.

**5. O que é o "substituto tributário" no ISS?**
Quando uma empresa contrata um prestador de serviços, ela pode ser obrigada (pela legislação municipal) a reter o ISS do prestador e recolhê-lo diretamente à prefeitura. Nesse caso, o prestador recebe o valor líquido (sem ISS), mas deve emitir a nota pelo valor bruto normalmente.

**6. Posso emitir nota fiscal retroativa (de um mês anterior)?**
Tecnicamente sim — os portais de NFS-e geralmente permitem informar uma data de competência diferente da data de emissão. Mas emissão retroativa em grande quantidade pode gerar auditoria fiscal. Emita sempre no prazo correto.

---

## Conclusão

Emitir nota fiscal corretamente é uma obrigação legal e uma proteção para sua empresa. Usar o tipo certo de nota (NFS-e para serviços, NF-e para comércio, NFC-e para varejo), preencher o CNAE correto e respeitar os prazos de cancelamento são práticas que evitam multas e complicações fiscais.

O passo mais importante para quem acabou de abrir empresa é: **obtenha a inscrição municipal e configure o acesso ao portal de NFS-e antes de prestar o primeiro serviço**. Não deixe acumular notas para emitir depois — a burocracia de regularização posterior é muito mais trabalhosa.

[Abra sua empresa com a Contabilidade Zen](/abrir-empresa) e já saia configurado para emitir notas fiscais desde o primeiro dia. Dúvidas sobre sua situação específica? [Fale com nossa equipe](/contato).

---

*Autor: Thomas Broek — CRC-SP 337693/O-7 | Contabilidade Zen*

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"MEI pode emitir nota fiscal?","acceptedAnswer":{"@type":"Answer","text":"Sim. O MEI pode emitir NFS-e pelo portal da prefeitura usando login e senha, sem necessidade de certificado digital."}},{"@type":"Question","name":"Preciso emitir nota fiscal para pessoa física?","acceptedAnswer":{"@type":"Answer","text":"Para serviços, a NFS-e deve ser emitida quando o cliente solicitar. Para comércio ao consumidor final, a NFC-e é obrigatória na venda."}},{"@type":"Question","name":"Empresa do Simples Nacional paga ISS na nota?","acceptedAnswer":{"@type":"Answer","text":"O ISS já está incluído no DAS do Simples Nacional. Ao emitir a NFS-e, o campo ISS é preenchido, mas o valor já está coberto pelo pagamento mensal do DAS."}},{"@type":"Question","name":"O que é o substituto tributário no ISS?","acceptedAnswer":{"@type":"Answer","text":"Quando uma empresa contrata um prestador, ela pode ser obrigada a reter o ISS e recolhê-lo diretamente à prefeitura. O prestador recebe o valor líquido mas emite a nota pelo valor bruto."}},{"@type":"Question","name":"Posso emitir nota fiscal retroativa?","acceptedAnswer":{"@type":"Answer","text":"Os portais de NFS-e geralmente permitem informar data de competência diferente da data de emissão. Mas emissão retroativa em grande quantidade pode gerar auditoria fiscal."}}]}
</script>
