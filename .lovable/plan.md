

## Plano: 3 Novas Features (Mini-Questionário WhatsApp + Centro de Materiais + Dashboard Parceiro Gamificado)

---

### Feature 3: Mini-Questionário Qualificador antes do WhatsApp

**O que faz**: Antes de abrir o WhatsApp, o usuario responde 3 perguntas rapidas (segmento, faturamento, necessidade). As respostas sao enviadas como mensagem pre-preenchida no WhatsApp e salvas como lead no CRM.

**Arquivos**:
- `src/components/WhatsAppQualifier.tsx` (novo) -- Modal/drawer com 3 steps: segmento, faturamento mensal, necessidade principal. Usa `useLeadCapture` para salvar no CRM com `fonte: "qualificador_whatsapp"`. Apos salvar, abre WhatsApp com mensagem contendo as respostas.
- `src/components/FloatingWhatsApp.tsx` -- Ao clicar no botao flutuante, abre o WhatsAppQualifier em vez de ir direto ao wa.me. Manter link direto como fallback (ex: long press ou se o usuario ja preencheu antes via sessionStorage).
- `src/lib/whatsapp.ts` -- Adicionar template `qualificador` em WHATSAPP_MESSAGES com placeholders.

**Campos salvos no CRM (tabela leads)**:
- nome, whatsapp (obrigatorios no questionario)
- segmento (resposta da pergunta 1)
- faturamento_mensal (resposta da pergunta 2)
- observacoes (necessidade principal -- pergunta 3)
- fonte: `"qualificador_whatsapp"`
- consentimento_lgpd: true, data_consentimento: now()

**UX**: 3 telas progressivas (progress bar), mobile-first, botao "Pular e ir direto ao WhatsApp" sempre visivel.

---

### Feature 6: Centro de Materiais Ricos (Gated Content)

**O que faz**: Pagina `/materiais` com cards de e-books, checklists e planilhas. Download exige preenchimento de nome + email + whatsapp (lead gating). Dados vao para o CRM.

**Arquivos**:
- `src/pages/Materiais.tsx` (novo) -- Pagina com SEOHead, Header, Footer. Grid de cards com titulo, descricao, thumbnail e badge (E-book, Checklist, Planilha). Ao clicar, abre modal de captura.
- `src/components/materiais/MaterialCard.tsx` (novo) -- Card individual.
- `src/components/materiais/MaterialGateForm.tsx` (novo) -- Modal com formulario de 3 campos (nome, email, whatsapp) + honeypot. Usa `useLeadCapture` com `fonte: "material_[slug]"`. Apos salvar, libera link de download (URL publica do Storage bucket ou link externo).
- `src/App.tsx` -- Adicionar rota `/materiais`.
- `supabase/functions/sitemap/index.ts` -- Adicionar `/materiais` ao sitemap.

**Materiais iniciais** (conteudo estatico, links configurados em array):
1. "Checklist: Documentos para Abrir Empresa PJ" 
2. "Guia: CLT x PJ -- Qual Compensa Mais?" 
3. "Planilha: Controle Financeiro para PJ"
4. "E-book: Tributação para Médicos 2026"

Os arquivos PDF/XLSX serao hospedados no bucket `blog-images` (publico) ou em URL externa. Os cards apontam para esses links apos captura.

**CRM**: Todos os downloads geram lead com `fonte: "material_[slug-do-material]"`, `segmento: "Geral"`, `observacoes: "Download: [nome do material]"`.

**Database**: Nenhuma nova tabela necessaria -- usa tabela `leads` existente.

---

### Feature 10: Dashboard Gamificado para Parceiros

**O que faz**: Aprimorar o `/parceiro` existente com elementos de gamificacao: niveis (Bronze/Prata/Ouro/Diamante), barra de progresso, conquistas desbloqueadas, e ranking visual.

**Arquivos**:
- `src/pages/PartnerDashboard.tsx` -- Adicionar secao de gamificacao acima da tabela de indicacoes:
  - **Nivel atual**: Badge com icone (Bronze: 0-2 indicacoes, Prata: 3-5, Ouro: 6-10, Diamante: 11+). Calculado client-side a partir do count de referrals.
  - **Barra de progresso**: "Faltam X indicacoes para o proximo nivel"
  - **Conquistas**: Cards pequenos (primeira indicacao, 5 indicacoes, primeiro convertido, etc.) com estado locked/unlocked baseado nos dados existentes.
  - **Comissao acumulada**: Card destacado com total de `commission_value` onde `status = 'convertida'` ou `'paga'`.

**Database**: Nenhuma nova tabela -- usa `partner_referrals` existente. Niveis e conquistas sao logica client-side pura.

**UX**: Cards com icones, cores por nivel (bronze=#CD7F32, prata=#C0C0C0, ouro=#FFD700, diamante=#B9F2FF), animacao sutil ao desbloquear conquista.

---

### Resumo de arquivos

| Acao | Arquivo |
|------|---------|
| Criar | `src/components/WhatsAppQualifier.tsx` |
| Criar | `src/pages/Materiais.tsx` |
| Criar | `src/components/materiais/MaterialCard.tsx` |
| Criar | `src/components/materiais/MaterialGateForm.tsx` |
| Editar | `src/components/FloatingWhatsApp.tsx` |
| Editar | `src/lib/whatsapp.ts` |
| Editar | `src/pages/PartnerDashboard.tsx` |
| Editar | `src/App.tsx` (2 novas rotas) |
| Editar | `supabase/functions/sitemap/index.ts` |
| Editar | `index.html` (noscript link para /materiais) |

