-- Enum para etapas do pipeline
CREATE TYPE public.pipeline_stage AS ENUM (
  'primeiro_contato',
  'qualificacao', 
  'proposta',
  'negociacao',
  'fechamento',
  'perdido'
);

-- Enum para tipo de interação
CREATE TYPE public.interaction_type AS ENUM (
  'chamada',
  'reuniao',
  'email',
  'whatsapp',
  'anotacao'
);

-- Enum para origem do lead
CREATE TYPE public.lead_origin AS ENUM (
  'inbound',
  'outbound',
  'indicacao',
  'evento',
  'outro'
);

-- Adicionar novos campos à tabela leads
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS empresa text,
ADD COLUMN IF NOT EXISTS cargo text,
ADD COLUMN IF NOT EXISTS origem lead_origin DEFAULT 'inbound',
ADD COLUMN IF NOT EXISTS pipeline_stage pipeline_stage DEFAULT 'primeiro_contato',
ADD COLUMN IF NOT EXISTS valor_negocio numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS probabilidade_fechamento integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS data_ultimo_contato timestamp with time zone,
ADD COLUMN IF NOT EXISTS data_proximo_followup timestamp with time zone,
ADD COLUMN IF NOT EXISTS consentimento_lgpd boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS data_consentimento timestamp with time zone,
ADD COLUMN IF NOT EXISTS gmv_total numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS qtd_compras integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS media_compra_mensal numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS responsavel_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Tabela de interações/histórico
CREATE TABLE public.lead_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  tipo interaction_type NOT NULL,
  descricao text NOT NULL,
  data_interacao timestamp with time zone NOT NULL DEFAULT now(),
  duracao_minutos integer,
  resultado text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para interações
CREATE POLICY "Only authorized roles can view interactions"
ON public.lead_interactions FOR SELECT
USING (can_view_leads(auth.uid()));

CREATE POLICY "Only authorized roles can insert interactions"
ON public.lead_interactions FOR INSERT
WITH CHECK (can_view_leads(auth.uid()));

CREATE POLICY "Only authorized roles can update interactions"
ON public.lead_interactions FOR UPDATE
USING (can_view_leads(auth.uid()));

CREATE POLICY "Only admins can delete interactions"
ON public.lead_interactions FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Tabela de tarefas/follow-ups
CREATE TABLE public.lead_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  titulo text NOT NULL,
  descricao text,
  data_vencimento timestamp with time zone NOT NULL,
  concluida boolean DEFAULT false,
  prioridade text DEFAULT 'media',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lead_tasks ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tarefas
CREATE POLICY "Only authorized roles can view tasks"
ON public.lead_tasks FOR SELECT
USING (can_view_leads(auth.uid()));

CREATE POLICY "Only authorized roles can insert tasks"
ON public.lead_tasks FOR INSERT
WITH CHECK (can_view_leads(auth.uid()));

CREATE POLICY "Only authorized roles can update tasks"
ON public.lead_tasks FOR UPDATE
USING (can_view_leads(auth.uid()));

CREATE POLICY "Only admins can delete tasks"
ON public.lead_tasks FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_lead_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_lead_updated_at();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_pipeline_stage ON public.leads(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_leads_responsavel ON public.leads(responsavel_id);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_lead_id ON public.lead_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_tasks_lead_id ON public.lead_tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_tasks_vencimento ON public.lead_tasks(data_vencimento) WHERE NOT concluida;