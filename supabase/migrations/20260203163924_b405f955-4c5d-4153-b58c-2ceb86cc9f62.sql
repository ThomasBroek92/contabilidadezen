-- Allow anonymous inserts to leads table (for public lead capture forms)
CREATE POLICY "Allow anonymous inserts to leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Make sure the policy for public inserts exists
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);