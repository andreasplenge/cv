-- First, let's save the existing data and create the new structure
-- Create a temporary table to hold existing data for migration
CREATE TABLE cv_technical_domains_new (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('language', 'domain', 'theory', 'tool')),
  skill text NOT NULL,
  is_highlighted boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Migrate existing data from arrays to rows
-- Languages
INSERT INTO cv_technical_domains_new (type, skill, is_highlighted, order_index)
SELECT 'language', unnest(languages), false, row_number() OVER () - 1
FROM cv_technical_domains
WHERE languages IS NOT NULL AND array_length(languages, 1) > 0;

-- Domains
INSERT INTO cv_technical_domains_new (type, skill, is_highlighted, order_index)
SELECT 'domain', unnest(domains), false, row_number() OVER () - 1
FROM cv_technical_domains
WHERE domains IS NOT NULL AND array_length(domains, 1) > 0;

-- Theory
INSERT INTO cv_technical_domains_new (type, skill, is_highlighted, order_index)
SELECT 'theory', unnest(theory), false, row_number() OVER () - 1
FROM cv_technical_domains
WHERE theory IS NOT NULL AND array_length(theory, 1) > 0;

-- Tools
INSERT INTO cv_technical_domains_new (type, skill, is_highlighted, order_index)
SELECT 'tool', unnest(tools), false, row_number() OVER () - 1
FROM cv_technical_domains
WHERE tools IS NOT NULL AND array_length(tools, 1) > 0;

-- Update highlighted status based on the old highlighted arrays
UPDATE cv_technical_domains_new SET is_highlighted = true
WHERE (type = 'language' AND skill IN (SELECT unnest(highlighted_languages) FROM cv_technical_domains))
   OR (type = 'domain' AND skill IN (SELECT unnest(highlighted_domains) FROM cv_technical_domains))
   OR (type = 'theory' AND skill IN (SELECT unnest(highlighted_theory) FROM cv_technical_domains))
   OR (type = 'tool' AND skill IN (SELECT unnest(highlighted_tools) FROM cv_technical_domains));

-- Drop the old table
DROP TABLE cv_technical_domains;

-- Rename new table to the original name
ALTER TABLE cv_technical_domains_new RENAME TO cv_technical_domains;

-- Enable RLS
ALTER TABLE cv_technical_domains ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "CV technical domains is publicly readable" 
ON cv_technical_domains 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to cv_technical_domains" 
ON cv_technical_domains 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update to cv_technical_domains" 
ON cv_technical_domains 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete from cv_technical_domains" 
ON cv_technical_domains 
FOR DELETE 
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_cv_technical_domains_updated_at
BEFORE UPDATE ON cv_technical_domains
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();