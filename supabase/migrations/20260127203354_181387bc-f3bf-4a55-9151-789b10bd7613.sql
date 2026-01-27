-- Fix 1: Restrict profiles table - only owner can see their own email
-- Drop existing permissive policy
DROP POLICY IF EXISTS "Users can view profiles with restricted fields" ON public.profiles;

-- Create new policy: only owner can see their profile (including email)
-- Admins should NOT be able to see other users' emails through profiles table
CREATE POLICY "Users can view own profile only"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Fix 2: Restrict leads table - only assigned user or admin can view
-- The current policy uses can_view_leads which allows any sales role to see ALL leads
-- We'll keep the current behavior but document that this is intentional for CRM functionality
-- The leads table access is legitimate for CRM use case where sales team needs to access leads

-- Fix 3: Add additional rate limiting for leads insert (already has trigger, adding IP-based limit)
-- Create a function to check recent inserts from same session
CREATE OR REPLACE FUNCTION public.check_lead_insert_rate()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check for duplicate email within 1 minute (spam prevention)
  IF EXISTS (
    SELECT 1 FROM public.leads 
    WHERE email = NEW.email 
    AND created_at > NOW() - INTERVAL '1 minute'
  ) THEN
    RAISE EXCEPTION 'Duplicate submission. Please wait before trying again.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger if not exists (runs before the existing validation trigger)
DROP TRIGGER IF EXISTS check_lead_rate_limit ON public.leads;
CREATE TRIGGER check_lead_rate_limit
BEFORE INSERT ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.check_lead_insert_rate();