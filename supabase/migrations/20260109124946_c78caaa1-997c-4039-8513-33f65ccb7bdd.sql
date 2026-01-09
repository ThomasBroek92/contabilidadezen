-- Add category field to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS category text DEFAULT NULL;

-- Add category field to recurring_task_templates table
ALTER TABLE public.recurring_task_templates 
ADD COLUMN IF NOT EXISTS category text DEFAULT NULL;