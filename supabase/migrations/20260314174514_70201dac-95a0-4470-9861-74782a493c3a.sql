CREATE OR REPLACE FUNCTION public.increment_blog_views(post_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.blog_posts
  SET views = COALESCE(views, 0) + 1
  WHERE slug = post_slug
    AND status = 'published';
END;
$$;