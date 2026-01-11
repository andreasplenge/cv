-- Add optional references to experience or education for selected work
ALTER TABLE public.cv_selected_work
ADD COLUMN related_experience_id uuid REFERENCES public.cv_experience(id) ON DELETE SET NULL,
ADD COLUMN related_education_id uuid REFERENCES public.cv_education(id) ON DELETE SET NULL;

-- Add a check constraint to ensure only one can be set at a time
ALTER TABLE public.cv_selected_work
ADD CONSTRAINT check_single_relation 
CHECK (
  (related_experience_id IS NULL OR related_education_id IS NULL)
);