ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS author text NOT NULL DEFAULT 'Emerson Cordeiro';
UPDATE public.blog_posts SET author = 'Emerson Cordeiro' WHERE author IS NULL OR author = '';