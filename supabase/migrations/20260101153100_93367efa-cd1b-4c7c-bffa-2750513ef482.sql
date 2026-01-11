-- Add visibility column to cv_selected_work
ALTER TABLE public.cv_selected_work 
ADD COLUMN visibility text NOT NULL DEFAULT 'selected_work' 
CHECK (visibility IN ('selected_work', 'work_page_project', 'personal_document'));