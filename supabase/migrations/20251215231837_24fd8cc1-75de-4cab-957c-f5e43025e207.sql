-- Create leads table for storing captured leads from all forms
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  segmento TEXT NOT NULL,
  fonte TEXT NOT NULL,
  faturamento_mensal NUMERIC,
  economia_anual NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Leads can be inserted by anyone (public form submission)
CREATE POLICY "Anyone can insert leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users can view leads (for future admin panel)
CREATE POLICY "Authenticated users can view leads" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (true);

-- Create index for faster queries
CREATE INDEX idx_leads_segmento ON public.leads(segmento);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);