
-- Add server-side validation trigger for partner_referrals (similar to validate_lead_input for leads)
CREATE OR REPLACE FUNCTION public.validate_partner_referral_input()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Sanitize inputs
  NEW.partner_name := trim(NEW.partner_name);
  NEW.partner_email := lower(trim(NEW.partner_email));
  NEW.referred_name := trim(NEW.referred_name);
  NEW.referred_email := lower(trim(NEW.referred_email));
  NEW.referred_whatsapp := trim(NEW.referred_whatsapp);
  
  -- Validate partner_name length
  IF length(NEW.partner_name) < 2 OR length(NEW.partner_name) > 100 THEN
    RAISE EXCEPTION 'Nome do parceiro deve ter entre 2 e 100 caracteres';
  END IF;
  
  -- Validate referred_name length
  IF length(NEW.referred_name) < 2 OR length(NEW.referred_name) > 100 THEN
    RAISE EXCEPTION 'Nome do indicado deve ter entre 2 e 100 caracteres';
  END IF;
  
  -- Validate partner_email format
  IF NEW.partner_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'E-mail do parceiro inválido';
  END IF;
  
  -- Validate referred_email format
  IF NEW.referred_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'E-mail do indicado inválido';
  END IF;
  
  -- Validate referred_whatsapp format
  IF NEW.referred_whatsapp !~* '^[0-9+\s()-]{10,20}$' THEN
    RAISE EXCEPTION 'WhatsApp do indicado inválido';
  END IF;
  
  -- Validate optional fields
  IF NEW.referred_empresa IS NOT NULL AND length(NEW.referred_empresa) > 100 THEN
    RAISE EXCEPTION 'Nome da empresa muito longo';
  END IF;
  
  IF NEW.referred_segmento IS NOT NULL AND length(NEW.referred_segmento) > 50 THEN
    RAISE EXCEPTION 'Segmento muito longo';
  END IF;
  
  -- Rate limiting: max 5 referrals per partner email per hour
  IF (SELECT COUNT(*) FROM public.partner_referrals 
      WHERE partner_email = NEW.partner_email 
      AND created_at > NOW() - INTERVAL '1 hour') >= 5 THEN
    RAISE EXCEPTION 'Limite de indicações por hora atingido. Tente novamente mais tarde.';
  END IF;
  
  -- Duplicate check: same partner+referred email within 24 hours
  IF EXISTS (
    SELECT 1 FROM public.partner_referrals
    WHERE partner_email = NEW.partner_email
    AND referred_email = NEW.referred_email
    AND created_at > NOW() - INTERVAL '24 hours'
  ) THEN
    RAISE EXCEPTION 'Esta indicação já foi registrada recentemente.';
  END IF;
  
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.validate_partner_referral_input IS 'Server-side validation for partner referrals: sanitizes inputs, validates email/phone formats, enforces length limits, rate limiting (5/hour), and duplicate prevention (24h).';

CREATE TRIGGER validate_partner_referral_trigger
BEFORE INSERT ON public.partner_referrals
FOR EACH ROW
EXECUTE FUNCTION public.validate_partner_referral_input();
