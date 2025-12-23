-- Tabela para armazenar agendamentos recorrentes de geração de conteúdo
CREATE TABLE public.recurring_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  topics_per_run INTEGER NOT NULL DEFAULT 5,
  categories TEXT[] NOT NULL DEFAULT ARRAY['Dicas'::text],
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=domingo, 6=sábado
  time_of_day TIME NOT NULL DEFAULT '09:00:00',
  auto_publish BOOLEAN NOT NULL DEFAULT true,
  min_geo_score INTEGER NOT NULL DEFAULT 80,
  topic_templates TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recurring_schedules ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (apenas admins)
CREATE POLICY "Admins can manage recurring schedules" 
ON public.recurring_schedules 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_recurring_schedules_updated_at
BEFORE UPDATE ON public.recurring_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_lead_updated_at();

-- Índice para buscar agendamentos ativos
CREATE INDEX idx_recurring_schedules_active ON public.recurring_schedules (is_active, next_run_at);