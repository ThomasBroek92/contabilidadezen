-- Add expert quote auto-generation settings to geo_settings
ALTER TABLE public.geo_settings
ADD COLUMN IF NOT EXISTS auto_expert_quotes_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS expert_name text DEFAULT 'Thomas Broek',
ADD COLUMN IF NOT EXISTS expert_title text DEFAULT 'Contador Especialista',
ADD COLUMN IF NOT EXISTS expert_company text DEFAULT 'Contabilidade Zen',
ADD COLUMN IF NOT EXISTS expert_bio text DEFAULT 'Contador especializado em tributação para profissionais da saúde, com mais de 15 anos de experiência em planejamento tributário e abertura de empresas para médicos, dentistas e psicólogos.';