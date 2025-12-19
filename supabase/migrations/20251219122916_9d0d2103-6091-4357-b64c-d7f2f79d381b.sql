-- Create blog_topics table for scheduling automatic content generation
CREATE TABLE public.blog_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  category text NOT NULL DEFAULT 'Dicas',
  search_query text,
  scheduled_date timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  generated_post_id uuid REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_topics ENABLE ROW LEVEL SECURITY;

-- RLS policies for admins only
CREATE POLICY "Admins can view all topics"
ON public.blog_topics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert topics"
ON public.blog_topics
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update topics"
ON public.blog_topics
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete topics"
ON public.blog_topics
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_blog_topics_updated_at
BEFORE UPDATE ON public.blog_topics
FOR EACH ROW
EXECUTE FUNCTION public.update_blog_post_updated_at();