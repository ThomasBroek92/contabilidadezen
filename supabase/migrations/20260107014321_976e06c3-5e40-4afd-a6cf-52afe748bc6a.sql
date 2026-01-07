-- Create indexing queue table
CREATE TABLE public.indexing_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  action TEXT NOT NULL DEFAULT 'URL_UPDATED',
  status TEXT NOT NULL DEFAULT 'pending',
  blog_post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  result JSONB,
  retry_count INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.indexing_queue ENABLE ROW LEVEL SECURITY;

-- Admin can manage indexing queue
CREATE POLICY "Admins can manage indexing queue"
  ON public.indexing_queue
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to queue indexing request
CREATE OR REPLACE FUNCTION public.queue_indexing_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  base_url TEXT := 'https://contabilidadezen.com.br';
  post_url TEXT;
BEGIN
  -- Only queue if post is being published or updated while published
  IF NEW.status = 'published' THEN
    post_url := base_url || '/blog/' || NEW.slug;
    
    -- Check if URL was recently queued (within last hour) to avoid duplicates
    IF NOT EXISTS (
      SELECT 1 FROM public.indexing_queue 
      WHERE url = post_url 
      AND created_at > NOW() - INTERVAL '1 hour'
      AND status = 'pending'
    ) THEN
      INSERT INTO public.indexing_queue (url, blog_post_id, action)
      VALUES (post_url, NEW.id, 'URL_UPDATED');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new published posts
CREATE TRIGGER trigger_queue_indexing_on_publish
  AFTER INSERT ON public.blog_posts
  FOR EACH ROW
  WHEN (NEW.status = 'published')
  EXECUTE FUNCTION public.queue_indexing_request();

-- Create trigger for updated posts
CREATE TRIGGER trigger_queue_indexing_on_update
  AFTER UPDATE ON public.blog_posts
  FOR EACH ROW
  WHEN (NEW.status = 'published' AND (OLD.status != 'published' OR OLD.updated_at != NEW.updated_at))
  EXECUTE FUNCTION public.queue_indexing_request();

-- Index for efficient queue processing
CREATE INDEX idx_indexing_queue_pending ON public.indexing_queue(status, created_at) WHERE status = 'pending';