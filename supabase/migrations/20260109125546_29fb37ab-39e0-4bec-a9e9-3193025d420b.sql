-- Add categories column to task_board_settings for custom category definitions
ALTER TABLE public.task_board_settings 
ADD COLUMN IF NOT EXISTS categories jsonb DEFAULT '[
  {"id": "vendas", "title": "Vendas", "color": "blue", "order": 0},
  {"id": "financeiro", "title": "Financeiro", "color": "green", "order": 1},
  {"id": "marketing", "title": "Marketing", "color": "purple", "order": 2},
  {"id": "operacional", "title": "Operacional", "color": "orange", "order": 3},
  {"id": "administrativo", "title": "Administrativo", "color": "gray", "order": 4},
  {"id": "suporte", "title": "Suporte", "color": "yellow", "order": 5},
  {"id": "desenvolvimento", "title": "Desenvolvimento", "color": "pink", "order": 6},
  {"id": "rh", "title": "RH", "color": "red", "order": 7}
]'::jsonb;