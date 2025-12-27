-- Add external citation filter settings
ALTER TABLE public.geo_settings
ADD COLUMN IF NOT EXISTS exclude_competitor_quotes boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS excluded_citation_keywords text[] DEFAULT ARRAY['contabilidade digital', 'contador online', 'escritório contábil', 'contabilidade online']::text[],
ADD COLUMN IF NOT EXISTS allowed_external_sources text[] DEFAULT ARRAY['gov.br', 'cfc.org.br', 'cfm.org.br', 'cro.org.br', 'crp.org.br', 'crefito.org.br', 'receita.fazenda.gov.br', 'planalto.gov.br', 'ibge.gov.br', 'ans.gov.br', 'anvisa.gov.br']::text[];