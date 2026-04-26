-- Add author_name column for storing the author display name from markdown frontmatter
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS author_name text;

-- Drop the FK on cluster_id (if it exists) so we can change its type to text
ALTER TABLE public.blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_cluster_id_fkey;

-- The script sends cluster_id as a text slug (e.g. "saude-pj"), so convert to text
ALTER TABLE public.blog_posts
  ALTER COLUMN cluster_id TYPE text USING cluster_id::text;