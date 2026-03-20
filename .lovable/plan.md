
# Gerar Prompt Técnico do CRM (Markdown)

Vou gerar um arquivo `.md` completo e detalhado em `/mnt/documents/` contendo:

1. **Visão geral da arquitetura** — Tabelas, enums, triggers, RLS policies, funções SQL
2. **Schema SQL completo** — Migrations para recriar todas as tabelas do CRM (leads, lead_interactions, lead_tasks, cadence_templates, cadence_steps)
3. **Edge Function** — notify-new-lead com Resend
4. **Componentes React** — Estrutura de cada componente (CRMPage, CRMDashboard, CRMKanban, LeadDetail, LeadsTableEnhanced, FollowUpEngine, AlertsDashboard, CadenceManager)
5. **Hooks** — useAuth, useLeadCapture, use-whatsapp-notification
6. **Utilitários** — whatsapp.ts
7. **Instruções de implementação** — Passo a passo para replicar no Lovable

O documento será um "mega-prompt" que alguém pode colar num novo projeto Lovable para recriar o CRM inteiro.
