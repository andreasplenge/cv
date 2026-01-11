-- CV General Info (single row for main CV details)
CREATE TABLE public.cv_general_info (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL DEFAULT 'Software Engineer',
  summary text,
  email text,
  linkedin text,
  github text,
  location text,
  last_compiled timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- CV Technical Domains (single row with arrays for each category)
CREATE TABLE public.cv_technical_domains (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  languages text[] DEFAULT '{}',
  domains text[] DEFAULT '{}',
  theory text[] DEFAULT '{}',
  tools text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- CV Experience entries
CREATE TABLE public.cv_experience (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company text NOT NULL,
  role text NOT NULL,
  period text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- CV Selected Work (projects)
CREATE TABLE public.cv_selected_work (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  link text,
  color text DEFAULT 'blue',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- CV Education
CREATE TABLE public.cv_education (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution text NOT NULL,
  degree text NOT NULL,
  year integer NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- CV Publications
CREATE TABLE public.cv_publications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  authors text,
  venue text,
  year integer,
  link text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.cv_general_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_technical_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_selected_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_publications ENABLE ROW LEVEL SECURITY;

-- Public read access policies (CV is public)
CREATE POLICY "CV general info is publicly readable" ON public.cv_general_info FOR SELECT USING (true);
CREATE POLICY "CV technical domains is publicly readable" ON public.cv_technical_domains FOR SELECT USING (true);
CREATE POLICY "CV experience is publicly readable" ON public.cv_experience FOR SELECT USING (true);
CREATE POLICY "CV selected work is publicly readable" ON public.cv_selected_work FOR SELECT USING (true);
CREATE POLICY "CV education is publicly readable" ON public.cv_education FOR SELECT USING (true);
CREATE POLICY "CV publications is publicly readable" ON public.cv_publications FOR SELECT USING (true);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers to all CV tables
CREATE TRIGGER update_cv_general_info_updated_at BEFORE UPDATE ON public.cv_general_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cv_technical_domains_updated_at BEFORE UPDATE ON public.cv_technical_domains FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cv_experience_updated_at BEFORE UPDATE ON public.cv_experience FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cv_selected_work_updated_at BEFORE UPDATE ON public.cv_selected_work FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cv_education_updated_at BEFORE UPDATE ON public.cv_education FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cv_publications_updated_at BEFORE UPDATE ON public.cv_publications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();