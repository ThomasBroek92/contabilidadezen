-- Add CTA and interaction settings to geo_settings table
ALTER TABLE public.geo_settings
ADD COLUMN IF NOT EXISTS cta_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS cta_type text DEFAULT 'consultoria_gratuita',
ADD COLUMN IF NOT EXISTS cta_title text DEFAULT 'Fale com um Especialista',
ADD COLUMN IF NOT EXISTS cta_description text DEFAULT 'Agende uma consultoria gratuita e tire todas as suas dúvidas sobre tributação para profissionais da saúde.',
ADD COLUMN IF NOT EXISTS cta_button_text text DEFAULT 'Agendar Consultoria Gratuita',
ADD COLUMN IF NOT EXISTS cta_whatsapp_message text DEFAULT 'Olá! Vi o artigo no blog e gostaria de agendar uma consultoria gratuita.',
ADD COLUMN IF NOT EXISTS show_tax_calculator boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_pj_comparison boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_lead_form boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS lead_form_title text DEFAULT 'Receba uma Análise Personalizada',
ADD COLUMN IF NOT EXISTS lead_form_description text DEFAULT 'Preencha o formulário e receba gratuitamente uma análise tributária personalizada para sua situação.',
ADD COLUMN IF NOT EXISTS cta_position text DEFAULT 'after_content';