-- Tabela para cache de avaliações do Google Meu Negócio
CREATE TABLE public.gmb_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_review_id TEXT UNIQUE NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_photo_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  review_time TIMESTAMPTZ NOT NULL,
  reply_comment TEXT,
  reply_time TIMESTAMPTZ,
  is_visible BOOLEAN DEFAULT true,
  synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_gmb_reviews_rating ON public.gmb_reviews(rating);
CREATE INDEX idx_gmb_reviews_visible ON public.gmb_reviews(is_visible);
CREATE INDEX idx_gmb_reviews_time ON public.gmb_reviews(review_time DESC);

-- Trigger para updated_at
CREATE TRIGGER update_gmb_reviews_updated_at
  BEFORE UPDATE ON public.gmb_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS: Leitura pública para exibir no site
ALTER TABLE public.gmb_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Avaliações visíveis são públicas"
  ON public.gmb_reviews FOR SELECT
  USING (is_visible = true AND rating >= 4);

CREATE POLICY "Admins podem gerenciar avaliações"
  ON public.gmb_reviews FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Tabela para cache de estatísticas gerais
CREATE TABLE public.gmb_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  average_rating NUMERIC(2,1) NOT NULL,
  total_reviews INTEGER NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT now()
);

-- RLS para gmb_stats
ALTER TABLE public.gmb_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stats são públicos" 
  ON public.gmb_stats FOR SELECT 
  USING (true);

CREATE POLICY "Admins podem atualizar stats" 
  ON public.gmb_stats FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));