-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for user task board settings
CREATE TABLE public.task_board_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  columns JSONB NOT NULL DEFAULT '[
    {"id": "backlog", "title": "Backlog", "emoji": "📋", "order": 0},
    {"id": "todo", "title": "A Fazer", "emoji": "📝", "order": 1},
    {"id": "in_progress", "title": "Em Progresso", "emoji": "🔄", "order": 2},
    {"id": "review", "title": "Revisão", "emoji": "👀", "order": 3},
    {"id": "done", "title": "Concluído", "emoji": "✅", "order": 4}
  ]'::jsonb,
  default_view TEXT NOT NULL DEFAULT 'kanban',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.task_board_settings ENABLE ROW LEVEL SECURITY;

-- Users can view their own settings
CREATE POLICY "Users can view own board settings" 
ON public.task_board_settings 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can insert own board settings" 
ON public.task_board_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own board settings" 
ON public.task_board_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_task_board_settings_updated_at
BEFORE UPDATE ON public.task_board_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();