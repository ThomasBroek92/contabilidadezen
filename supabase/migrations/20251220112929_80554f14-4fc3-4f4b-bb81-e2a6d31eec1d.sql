-- Create enum for funnel stage
CREATE TYPE public.funnel_stage AS ENUM ('topo', 'meio', 'fundo');

-- Create enum for content objective
CREATE TYPE public.content_objective AS ENUM ('trafego', 'leads', 'autoridade');

-- Create enum for editorial status (more granular than current text status)
CREATE TYPE public.editorial_status AS ENUM ('draft', 'writing', 'review', 'scheduled', 'published');

-- Add new columns to blog_posts for editorial calendar
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS persona_alvo TEXT,
ADD COLUMN IF NOT EXISTS etapa_funil funnel_stage DEFAULT 'topo',
ADD COLUMN IF NOT EXISTS objetivo content_objective DEFAULT 'trafego',
ADD COLUMN IF NOT EXISTS responsavel_redator_id UUID,
ADD COLUMN IF NOT EXISTS responsavel_revisor_id UUID,
ADD COLUMN IF NOT EXISTS responsavel_editor_id UUID,
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ctr DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS leads_gerados INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS roi DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS editorial_status editorial_status DEFAULT 'draft';

-- Update existing posts to have editorial_status based on current status
UPDATE public.blog_posts 
SET editorial_status = CASE 
  WHEN status = 'published' THEN 'published'::editorial_status
  WHEN status = 'scheduled' THEN 'scheduled'::editorial_status
  ELSE 'draft'::editorial_status
END;