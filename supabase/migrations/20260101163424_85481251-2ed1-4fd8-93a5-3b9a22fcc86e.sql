-- Add coursework array to cv_education
ALTER TABLE public.cv_education 
ADD COLUMN coursework text[] NULL DEFAULT '{}'::text[];