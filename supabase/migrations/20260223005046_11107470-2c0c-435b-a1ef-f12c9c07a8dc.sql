
-- Create public storage bucket for static sitemap
INSERT INTO storage.buckets (id, name, public)
VALUES ('static-sitemaps', 'static-sitemaps', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public can read static sitemaps"
ON storage.objects
FOR SELECT
USING (bucket_id = 'static-sitemaps');

-- Allow service role to write to the bucket
CREATE POLICY "Service role can manage static sitemaps"
ON storage.objects
FOR ALL
USING (bucket_id = 'static-sitemaps' AND auth.role() = 'service_role')
WITH CHECK (bucket_id = 'static-sitemaps' AND auth.role() = 'service_role');
