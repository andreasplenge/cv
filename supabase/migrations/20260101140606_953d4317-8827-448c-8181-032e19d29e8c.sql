-- Add missing fields to cv_experience for achievements/bullets
ALTER TABLE public.cv_experience ADD COLUMN IF NOT EXISTS location text;

-- Add slug field to cv_selected_work for URL routing
ALTER TABLE public.cv_selected_work ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Add tags array to cv_selected_work
ALTER TABLE public.cv_selected_work ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add full_description for project detail page
ALTER TABLE public.cv_selected_work ADD COLUMN IF NOT EXISTS full_description text;

-- Add features array for project detail page
ALTER TABLE public.cv_selected_work ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}';

-- Add tech_stack array for project detail page
ALTER TABLE public.cv_selected_work ADD COLUMN IF NOT EXISTS tech_stack text[] DEFAULT '{}';

-- Add thesis field to education
ALTER TABLE public.cv_education ADD COLUMN IF NOT EXISTS thesis text;

-- Add honours field to education
ALTER TABLE public.cv_education ADD COLUMN IF NOT EXISTS honours text;