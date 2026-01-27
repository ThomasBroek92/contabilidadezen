-- Create indexing_stats table for tracking indexing metrics
CREATE TABLE public.indexing_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_processed INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  fail_count INTEGER NOT NULL DEFAULT 0,
  quota_exceeded BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.indexing_stats ENABLE ROW LEVEL SECURITY;

-- Only admins can view stats
CREATE POLICY "Admins can view indexing stats"
  ON public.indexing_stats
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert stats
CREATE POLICY "Service role can insert indexing stats"
  ON public.indexing_stats
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Update CRON job: process-indexing-queue to run daily at 6h UTC (3h BRT)
SELECT cron.unschedule('process-indexing-queue');

SELECT cron.schedule(
  'process-indexing-queue-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://xqlkjoajrefbvbhkusdn.supabase.co/functions/v1/process-indexing-queue',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxbGtqb2FqcmVmYnZiaGt1c2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDIxNDAsImV4cCI6MjA4MDI3ODE0MH0.ttPYf6U4LR54U_EjVcpm6u_2Xyza4igDm8OEkiX5Mr0"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- Create weekly CRON job: queue-all-pages every Monday at 5h UTC (2h BRT)
SELECT cron.schedule(
  'queue-all-pages-weekly',
  '0 5 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://xqlkjoajrefbvbhkusdn.supabase.co/functions/v1/google-search-console',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxbGtqb2FqcmVmYnZiaGt1c2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDIxNDAsImV4cCI6MjA4MDI3ODE0MH0.ttPYf6U4LR54U_EjVcpm6u_2Xyza4igDm8OEkiX5Mr0"}'::jsonb,
    body := '{"action": "queue-all-pages"}'::jsonb
  ) AS request_id;
  $$
);