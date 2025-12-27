-- Create cadence_templates table for storing follow-up cadence configurations
CREATE TABLE public.cadence_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    is_active boolean DEFAULT true,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create cadence_steps table for individual steps in a cadence
CREATE TABLE public.cadence_steps (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cadence_id uuid REFERENCES public.cadence_templates(id) ON DELETE CASCADE NOT NULL,
    day_offset integer NOT NULL, -- D1 = 0, D2 = 1, D3 = 2, etc.
    task_title text NOT NULL,
    task_description text,
    task_type text DEFAULT 'chamada', -- chamada, email, whatsapp, reuniao
    priority text DEFAULT 'media',
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cadence_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cadence_steps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cadence_templates
CREATE POLICY "Admins can manage cadence templates"
ON public.cadence_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authorized roles can view cadence templates"
ON public.cadence_steps
FOR SELECT
USING (can_view_leads(auth.uid()));

-- RLS Policies for cadence_steps
CREATE POLICY "Admins can manage cadence steps"
ON public.cadence_steps
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authorized roles can view cadence steps"
ON public.cadence_steps
FOR SELECT
USING (can_view_leads(auth.uid()));

-- Function to auto-create tasks when a lead is inserted
CREATE OR REPLACE FUNCTION public.create_cadence_tasks_for_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    default_cadence_id uuid;
    step record;
BEGIN
    -- Get the default active cadence
    SELECT id INTO default_cadence_id
    FROM public.cadence_templates
    WHERE is_active = true AND is_default = true
    LIMIT 1;
    
    -- If no default cadence, exit
    IF default_cadence_id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Create tasks for each step in the cadence
    FOR step IN 
        SELECT * FROM public.cadence_steps 
        WHERE cadence_id = default_cadence_id
        ORDER BY day_offset
    LOOP
        INSERT INTO public.lead_tasks (
            lead_id,
            titulo,
            descricao,
            data_vencimento,
            prioridade
        ) VALUES (
            NEW.id,
            step.task_title,
            COALESCE(step.task_description, ''),
            NEW.created_at + (step.day_offset || ' days')::interval,
            step.priority
        );
    END LOOP;
    
    RETURN NEW;
END;
$$;

-- Create trigger to auto-create tasks on lead insert
CREATE TRIGGER on_lead_created_create_cadence_tasks
    AFTER INSERT ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.create_cadence_tasks_for_lead();

-- Insert a default cadence template
INSERT INTO public.cadence_templates (name, is_active, is_default) 
VALUES ('Cadência Padrão de Vendas', true, true);

-- Insert default cadence steps
INSERT INTO public.cadence_steps (cadence_id, day_offset, task_title, task_description, task_type, priority)
SELECT 
    ct.id,
    steps.day_offset,
    steps.task_title,
    steps.task_description,
    steps.task_type,
    steps.priority
FROM public.cadence_templates ct
CROSS JOIN (VALUES
    (0, 'Primeiro contato - Ligação D1', 'Ligar para o lead no mesmo dia do cadastro para fazer a primeira abordagem', 'chamada', 'alta'),
    (1, 'Follow-up D2 - WhatsApp', 'Enviar mensagem de follow-up via WhatsApp caso não tenha conseguido contato', 'whatsapp', 'media'),
    (3, 'Ligação D3 - Segunda tentativa', 'Segunda tentativa de ligação para qualificação', 'chamada', 'alta'),
    (5, 'E-mail de apresentação D5', 'Enviar e-mail com apresentação da empresa e serviços', 'email', 'media'),
    (7, 'Ligação D7 - Fechamento', 'Terceira ligação para tentar agendar reunião ou fechar proposta', 'chamada', 'alta')
) AS steps(day_offset, task_title, task_description, task_type, priority)
WHERE ct.is_default = true;