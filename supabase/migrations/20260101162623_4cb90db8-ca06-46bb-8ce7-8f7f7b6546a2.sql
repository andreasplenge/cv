-- Add full_description to cv_experience for longer overview
ALTER TABLE public.cv_experience 
ADD COLUMN full_description text NULL;

-- Add full_description to cv_education for longer overview
ALTER TABLE public.cv_education 
ADD COLUMN full_description text NULL;