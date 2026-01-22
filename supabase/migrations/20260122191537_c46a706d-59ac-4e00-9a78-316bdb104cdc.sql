-- =============================================
-- SECURITY FIXES MIGRATION (v2)
-- =============================================

-- 1. Fix profiles SELECT policy - restrict email visibility
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view profiles with restricted fields"
ON public.profiles FOR SELECT
USING (
  auth.uid() = id 
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'sales_manager'::app_role)
);

-- 2. Fix leads INSERT policy - remove "WITH CHECK (true)"
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

CREATE POLICY "Anyone can insert leads with validation"
ON public.leads FOR INSERT
WITH CHECK (
  -- Basic validation rules (main validation is in trigger)
  length(trim(nome)) >= 2 AND
  length(trim(email)) >= 5 AND
  length(trim(whatsapp)) >= 10
);

-- 3. Fix partner_referrals INSERT policy - remove "WITH CHECK (true)"
DROP POLICY IF EXISTS "Anyone can insert referrals" ON public.partner_referrals;

CREATE POLICY "Anyone can insert referrals with validation"
ON public.partner_referrals FOR INSERT
WITH CHECK (
  length(trim(partner_name)) >= 2 AND
  length(trim(partner_email)) >= 5 AND
  length(trim(referred_name)) >= 2 AND
  length(trim(referred_email)) >= 5 AND
  length(trim(referred_whatsapp)) >= 10
);

-- 4. Create regular index for rate limiting optimization (without partial predicate)
CREATE INDEX IF NOT EXISTS idx_leads_email_created 
ON public.leads(email, created_at DESC);

-- 5. Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
ON public.security_audit_log FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert audit logs
CREATE POLICY "Service role can insert audit logs"
ON public.security_audit_log FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- 6. Create a secure view for public blog posts (excludes internal IDs)
CREATE OR REPLACE VIEW public.blog_posts_public AS
SELECT 
  id,
  title,
  slug,
  content,
  excerpt,
  meta_title,
  meta_description,
  meta_keywords,
  featured_image_url,
  category,
  status,
  published_at,
  created_at,
  updated_at,
  read_time_minutes,
  views,
  faq_schema,
  geo_score,
  etapa_funil,
  objetivo,
  persona_alvo
FROM public.blog_posts
WHERE status = 'published' AND (published_at IS NULL OR published_at <= now());

-- Grant access to the public view
GRANT SELECT ON public.blog_posts_public TO anon, authenticated;

-- 7. Add comments documenting security practices
COMMENT ON TABLE public.leads IS 'Lead capture table. Protected by: (1) validate_lead_input trigger for server-side validation, (2) Rate limiting in trigger (3 per email/hour), (3) RLS policies for access control, (4) Honeypot detection in client.';

COMMENT ON TABLE public.security_audit_log IS 'Security audit log for tracking sensitive operations. Insert-only for service role, read-only for admins.';

COMMENT ON FUNCTION public.has_role IS 'SECURITY DEFINER function to check user roles. Uses fixed search_path and parameterized inputs to prevent SQL injection.';

COMMENT ON FUNCTION public.validate_lead_input IS 'Input validation trigger with rate limiting. Validates email format, name length, whatsapp format, and enforces rate limits.';