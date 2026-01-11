-- Create a table for coursework items with technical domain links
CREATE TABLE public.cv_coursework (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  education_id UUID NOT NULL REFERENCES public.cv_education(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  technical_domain TEXT, -- 'languages', 'domains', 'theory', 'tools', or null
  technical_domain_item TEXT, -- the specific item from that domain
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cv_coursework ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (matching other CV tables)
CREATE POLICY "CV coursework is publicly readable" 
ON public.cv_coursework 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to cv_coursework" 
ON public.cv_coursework 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update to cv_coursework" 
ON public.cv_coursework 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete from cv_coursework" 
ON public.cv_coursework 
FOR DELETE 
USING (true);

-- Create index for faster lookups by education_id
CREATE INDEX idx_cv_coursework_education_id ON public.cv_coursework(education_id);

-- Add trigger for updated_at
CREATE TRIGGER update_cv_coursework_updated_at
BEFORE UPDATE ON public.cv_coursework
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();