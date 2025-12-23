-- Adicionar campos GEO na tabela blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS geo_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS expert_quotes jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS statistics jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS authority_citations text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS faq_schema jsonb,
ADD COLUMN IF NOT EXISTS answer_first_validated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_published boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS freshness_date timestamp with time zone DEFAULT now();

-- Criar tabela de configurações GEO
CREATE TABLE IF NOT EXISTS public.geo_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  min_geo_score_publish integer DEFAULT 80,
  auto_suggest_frequency text DEFAULT 'daily',
  preferred_expert_types text[] DEFAULT ARRAY['contador', 'advogado tributarista', 'consultor']::text[],
  brand_statistics jsonb DEFAULT '[]'::jsonb,
  target_personas text[] DEFAULT ARRAY['médicos', 'dentistas', 'psicólogos']::text[],
  brand_name text DEFAULT 'Contabilidade Zona Sul',
  brand_authority_keywords text[] DEFAULT ARRAY['contabilidade saúde', 'contador médico', 'tributação PJ médico']::text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Inserir configuração padrão
INSERT INTO public.geo_settings (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Habilitar RLS na tabela geo_settings
ALTER TABLE public.geo_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para geo_settings (apenas admins)
CREATE POLICY "Admins can view geo_settings"
ON public.geo_settings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update geo_settings"
ON public.geo_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert geo_settings"
ON public.geo_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_geo_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para auto-atualizar updated_at
CREATE TRIGGER update_geo_settings_updated_at
BEFORE UPDATE ON public.geo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_geo_settings_updated_at();