-- Create analytics cache table
CREATE TABLE IF NOT EXISTS public.analytics_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL UNIQUE,
  metric_value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_cache ENABLE ROW LEVEL SECURITY;

-- Admin can read analytics cache
CREATE POLICY "Admins can view analytics cache"
ON public.analytics_cache
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only service role can update (via edge function)
CREATE POLICY "Service role can manage analytics cache"
ON public.analytics_cache
FOR ALL
USING (auth.role() = 'service_role');

-- Insert initial cache entries
INSERT INTO public.analytics_cache (metric_name, metric_value) VALUES
  ('visitors', '{"total": 0, "trend": 0}'::jsonb),
  ('pageviews', '{"total": 0, "trend": 0}'::jsonb),
  ('avg_session', '{"seconds": 0, "formatted": "0:00"}'::jsonb),
  ('bounce_rate', '{"rate": 0, "trend": 0}'::jsonb),
  ('top_pages', '[]'::jsonb),
  ('top_countries', '[]'::jsonb),
  ('devices', '{"desktop": 0, "mobile": 0, "tablet": 0}'::jsonb),
  ('last_sync', '{"timestamp": null, "status": "pending"}'::jsonb)
ON CONFLICT (metric_name) DO NOTHING;