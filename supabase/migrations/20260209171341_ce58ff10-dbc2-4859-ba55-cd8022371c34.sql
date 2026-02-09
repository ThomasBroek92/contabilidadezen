
-- Fix 1: Leads table - remove permissive INSERT policies, restore validation
DROP POLICY IF EXISTS "Allow anonymous inserts to leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can insert leads with validation" ON public.leads;

CREATE POLICY "Anyone can insert leads with validation"
ON public.leads FOR INSERT
WITH CHECK (
  length(trim(nome)) >= 2 AND length(trim(nome)) <= 100 AND
  length(trim(email)) >= 5 AND length(trim(email)) <= 255 AND
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  length(trim(whatsapp)) >= 10 AND length(trim(whatsapp)) <= 20 AND
  length(trim(segmento)) >= 1 AND length(trim(segmento)) <= 100 AND
  length(trim(fonte)) >= 1 AND length(trim(fonte)) <= 100
);

-- Fix 2: Blog images storage - remove permissive policies
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

-- Ensure admin-only policies exist (recreate to be safe)
DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;

CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
