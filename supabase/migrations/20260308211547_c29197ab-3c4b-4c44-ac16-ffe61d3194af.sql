CREATE OR REPLACE FUNCTION public.queue_indexing_request()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  base_url TEXT := 'https://www.contabilidadezen.com.br';
  post_url TEXT;
BEGIN
  IF NEW.status = 'published' THEN
    post_url := base_url || '/blog/' || NEW.slug;
    
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
$function$;