INSERT INTO public.page_metadata (path, priority, changefreq, last_modified)
VALUES
  ('/segmentos/contabilidade-para-youtubers-e-creators', 0.8, 'monthly', now()),
  ('/segmentos/contabilidade-para-outros-segmentos', 0.8, 'monthly', now())
ON CONFLICT (path) DO NOTHING;