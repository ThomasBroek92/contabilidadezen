INSERT INTO public.page_metadata (path, priority, changefreq, last_modified) VALUES
  ('/segmentos/contabilidade-para-produtores-digitais', 0.8, 'monthly', now()),
  ('/segmentos/contabilidade-para-profissionais-de-ti', 0.8, 'monthly', now()),
  ('/segmentos/contabilidade-para-exportacao-de-servicos', 0.8, 'monthly', now()),
  ('/segmentos/contabilidade-para-prestadores-de-servico', 0.8, 'monthly', now()),
  ('/segmentos/contabilidade-para-profissionais-pj', 0.8, 'monthly', now())
ON CONFLICT (path) DO UPDATE SET last_modified = now();