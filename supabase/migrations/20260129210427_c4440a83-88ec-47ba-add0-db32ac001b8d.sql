-- Criar tabela page_metadata para armazenar datas de modificação das páginas
CREATE TABLE public.page_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT UNIQUE NOT NULL,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  priority DECIMAL(2,1) DEFAULT 0.5,
  changefreq TEXT DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.page_metadata ENABLE ROW LEVEL SECURITY;

-- Política: Service role pode gerenciar (para Edge Functions)
CREATE POLICY "Service role can manage page_metadata"
ON public.page_metadata
FOR ALL
USING (auth.role() = 'service_role');

-- Política: Qualquer pessoa pode ler (sitemap é público)
CREATE POLICY "Anyone can read page_metadata"
ON public.page_metadata
FOR SELECT
USING (true);

-- Inserir páginas estáticas com dados iniciais
INSERT INTO public.page_metadata (path, priority, changefreq) VALUES
  ('/', 1.0, 'weekly'),
  ('/servicos', 0.9, 'monthly'),
  ('/sobre', 0.8, 'monthly'),
  ('/contato', 0.8, 'monthly'),
  ('/blog', 0.9, 'daily'),
  ('/abrir-empresa', 0.9, 'monthly'),
  ('/medicos', 0.8, 'monthly'),
  ('/indique-e-ganhe', 0.7, 'monthly'),
  ('/segmentos/contabilidade-para-medicos', 0.9, 'monthly'),
  ('/segmentos/contabilidade-para-dentistas', 0.9, 'monthly'),
  ('/segmentos/contabilidade-para-psicologos', 0.9, 'monthly'),
  ('/segmentos/contabilidade-para-representantes-comerciais', 0.9, 'monthly'),
  ('/conteudo/calculadora-pj-clt', 0.8, 'monthly'),
  ('/conteudo/comparativo-tributario', 0.8, 'monthly'),
  ('/conteudo/gerador-rpa', 0.8, 'monthly'),
  ('/politica-de-privacidade', 0.3, 'yearly'),
  ('/termos', 0.3, 'yearly');

-- Criar função para atualizar sitemap quando blog posts mudam
CREATE OR REPLACE FUNCTION public.update_sitemap_on_blog_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza a data do /blog quando qualquer post muda
  UPDATE public.page_metadata 
  SET last_modified = NOW() 
  WHERE path = '/blog';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar trigger para blog posts
CREATE TRIGGER blog_sitemap_trigger
AFTER INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
WHEN (NEW.status = 'published')
EXECUTE FUNCTION public.update_sitemap_on_blog_change();