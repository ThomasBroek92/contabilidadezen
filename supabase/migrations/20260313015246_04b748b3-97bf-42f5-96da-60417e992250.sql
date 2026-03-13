
ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS cluster_id uuid REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_pillar boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_blog_posts_cluster_id ON public.blog_posts(cluster_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_pillar ON public.blog_posts(is_pillar) WHERE is_pillar = true;
