-- Add database-level input validation trigger for leads table
CREATE OR REPLACE FUNCTION public.validate_lead_input()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate email format
  IF NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate nome length (min 2, max 100)
  IF length(trim(NEW.nome)) < 2 OR length(NEW.nome) > 100 THEN
    RAISE EXCEPTION 'Nome must be between 2 and 100 characters';
  END IF;
  
  -- Validate whatsapp format (10-20 chars, only digits, spaces, plus, parentheses, dashes)
  IF NEW.whatsapp !~* '^[0-9+\s()-]{10,20}$' THEN
    RAISE EXCEPTION 'Invalid whatsapp format';
  END IF;
  
  -- Validate segmento length
  IF length(trim(NEW.segmento)) < 1 OR length(NEW.segmento) > 50 THEN
    RAISE EXCEPTION 'Invalid segmento';
  END IF;
  
  -- Validate fonte length
  IF length(trim(NEW.fonte)) < 1 OR length(NEW.fonte) > 100 THEN
    RAISE EXCEPTION 'Invalid fonte';
  END IF;
  
  -- Rate limiting: max 3 submissions per email per hour
  IF (SELECT COUNT(*) FROM public.leads 
      WHERE email = NEW.email 
      AND created_at > NOW() - INTERVAL '1 hour') >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for lead validation
DROP TRIGGER IF EXISTS validate_lead_input_trigger ON public.leads;
CREATE TRIGGER validate_lead_input_trigger
BEFORE INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.validate_lead_input();

-- Add explicit UPDATE policy for leads (admin only)
CREATE POLICY "Only admins can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add explicit DELETE policy for leads (admin only)
CREATE POLICY "Only admins can delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));