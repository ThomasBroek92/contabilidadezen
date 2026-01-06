-- Create partner_referrals table to track referrals made by partners
CREATE TABLE public.partner_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_email text NOT NULL,
  partner_name text NOT NULL,
  referred_name text NOT NULL,
  referred_email text NOT NULL,
  referred_whatsapp text NOT NULL,
  referred_empresa text,
  referred_segmento text DEFAULT 'Não informado',
  status text NOT NULL DEFAULT 'pendente',
  commission_value numeric DEFAULT 0,
  paid_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_referrals ENABLE ROW LEVEL SECURITY;

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION public.update_partner_referrals_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_partner_referrals_updated_at
  BEFORE UPDATE ON public.partner_referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_partner_referrals_updated_at();

-- RLS Policies

-- Anyone can insert referrals (public form)
CREATE POLICY "Anyone can insert referrals"
ON public.partner_referrals
FOR INSERT
WITH CHECK (true);

-- Partners can view their own referrals (by email match with authenticated user)
CREATE POLICY "Partners can view own referrals"
ON public.partner_referrals
FOR SELECT
USING (
  partner_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Admins can view all referrals
CREATE POLICY "Admins can view all referrals"
ON public.partner_referrals
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update referrals
CREATE POLICY "Admins can update referrals"
ON public.partner_referrals
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete referrals
CREATE POLICY "Admins can delete referrals"
ON public.partner_referrals
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for partner email lookups
CREATE INDEX idx_partner_referrals_partner_email ON public.partner_referrals(partner_email);

-- Create index for status
CREATE INDEX idx_partner_referrals_status ON public.partner_referrals(status);