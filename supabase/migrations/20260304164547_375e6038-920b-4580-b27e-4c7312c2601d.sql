INSERT INTO public.page_metadata (path, priority, changefreq, last_modified) VALUES
  ('/segmentos/contabilidade-para-ecommerce', 0.8, 'monthly', now()),
  ('/segmentos/contabilidade-para-clinicas-e-consultorios', 0.8, 'monthly', now())
ON CONFLICT (path) DO UPDATE SET last_modified = now();