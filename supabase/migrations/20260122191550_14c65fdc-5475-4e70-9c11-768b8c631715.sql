-- Fix SECURITY DEFINER view issue by recreating as SECURITY INVOKER
DROP VIEW IF EXISTS public.blog_posts_public;

CREATE VIEW public.blog_posts_public 
WITH (security_invoker = true) AS
SELECT 
  id,
  title,
  slug,
  content,
  excerpt,
  meta_title,
  meta_description,
  meta_keywords,
  featured_image_url,
  category,
  status,
  published_at,
  created_at,
  updated_at,
  read_time_minutes,
  views,
  faq_schema,
  geo_score,
  etapa_funil,
  objetivo,
  persona_alvo
FROM public.blog_posts
WHERE status = 'published' AND (published_at IS NULL OR published_at <= now());

-- Grant access to the secure view
GRANT SELECT ON public.blog_posts_public TO anon, authenticated;