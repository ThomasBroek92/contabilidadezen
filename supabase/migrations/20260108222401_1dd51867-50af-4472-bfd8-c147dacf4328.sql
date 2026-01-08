-- Create enum for recurrence frequency
CREATE TYPE public.recurrence_frequency AS ENUM ('daily', 'weekly', 'monthly');

-- Create recurring task templates table
CREATE TABLE public.recurring_task_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority public.task_priority NOT NULL DEFAULT 'medium',
  assignee_id UUID,
  frequency public.recurrence_frequency NOT NULL DEFAULT 'weekly',
  day_of_week INTEGER, -- 0-6 for weekly (0 = Sunday)
  day_of_month INTEGER, -- 1-31 for monthly
  time_of_day TIME NOT NULL DEFAULT '09:00:00',
  is_active BOOLEAN NOT NULL DEFAULT true,
  next_run_at TIMESTAMP WITH TIME ZONE,
  last_run_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_day_of_week CHECK (day_of_week IS NULL OR (day_of_week >= 0 AND day_of_week <= 6)),
  CONSTRAINT valid_day_of_month CHECK (day_of_month IS NULL OR (day_of_month >= 1 AND day_of_month <= 31))
);

-- Enable RLS
ALTER TABLE public.recurring_task_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authorized users can view recurring templates"
ON public.recurring_task_templates
FOR SELECT
USING (can_view_leads(auth.uid()));

CREATE POLICY "Authorized users can create recurring templates"
ON public.recurring_task_templates
FOR INSERT
WITH CHECK (can_view_leads(auth.uid()));

CREATE POLICY "Authorized users can update recurring templates"
ON public.recurring_task_templates
FOR UPDATE
USING (can_view_leads(auth.uid()));

CREATE POLICY "Admins can delete recurring templates"
ON public.recurring_task_templates
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_recurring_task_templates_updated_at
  BEFORE UPDATE ON public.recurring_task_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate next run date
CREATE OR REPLACE FUNCTION public.calculate_next_run(
  p_frequency recurrence_frequency,
  p_day_of_week INTEGER,
  p_day_of_month INTEGER,
  p_time_of_day TIME,
  p_from_date TIMESTAMP WITH TIME ZONE DEFAULT now()
)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  v_next_run TIMESTAMP WITH TIME ZONE;
  v_today DATE := (p_from_date AT TIME ZONE 'America/Sao_Paulo')::DATE;
  v_current_dow INTEGER := EXTRACT(DOW FROM v_today);
  v_days_until INTEGER;
BEGIN
  CASE p_frequency
    WHEN 'daily' THEN
      -- Next day at specified time
      v_next_run := (v_today + INTERVAL '1 day')::DATE + p_time_of_day;
      
    WHEN 'weekly' THEN
      -- Calculate days until next occurrence
      v_days_until := p_day_of_week - v_current_dow;
      IF v_days_until <= 0 THEN
        v_days_until := v_days_until + 7;
      END IF;
      v_next_run := (v_today + (v_days_until || ' days')::INTERVAL)::DATE + p_time_of_day;
      
    WHEN 'monthly' THEN
      -- Next month on specified day
      v_next_run := (DATE_TRUNC('month', v_today) + INTERVAL '1 month' + ((p_day_of_month - 1) || ' days')::INTERVAL)::DATE + p_time_of_day;
      -- Handle months with fewer days
      IF EXTRACT(DAY FROM v_next_run) != p_day_of_month THEN
        v_next_run := (DATE_TRUNC('month', v_next_run) - INTERVAL '1 day')::DATE + p_time_of_day;
      END IF;
  END CASE;
  
  RETURN v_next_run AT TIME ZONE 'America/Sao_Paulo';
END;
$$;

-- Trigger to auto-calculate next_run_at on insert/update
CREATE OR REPLACE FUNCTION public.set_next_run_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.is_active THEN
    NEW.next_run_at := calculate_next_run(
      NEW.frequency,
      NEW.day_of_week,
      NEW.day_of_month,
      NEW.time_of_day,
      COALESCE(NEW.last_run_at, now())
    );
  ELSE
    NEW.next_run_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_recurring_template_next_run
  BEFORE INSERT OR UPDATE ON public.recurring_task_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.set_next_run_at();