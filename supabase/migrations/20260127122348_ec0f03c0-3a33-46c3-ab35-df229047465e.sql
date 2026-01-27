-- Adiciona campo de observações/notas para informações adicionais do lead
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- Adiciona comentário explicativo
COMMENT ON COLUMN public.leads.observacoes IS 'Campo livre para informações adicionais coletadas nos formulários de lead';