-- Add INSERT, UPDATE, DELETE policies for all CV tables (public access for editing)

-- cv_general_info
CREATE POLICY "Allow public insert to cv_general_info" ON public.cv_general_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to cv_general_info" ON public.cv_general_info FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete from cv_general_info" ON public.cv_general_info FOR DELETE USING (true);

-- cv_technical_domains
CREATE POLICY "Allow public insert to cv_technical_domains" ON public.cv_technical_domains FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to cv_technical_domains" ON public.cv_technical_domains FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete from cv_technical_domains" ON public.cv_technical_domains FOR DELETE USING (true);

-- cv_experience
CREATE POLICY "Allow public insert to cv_experience" ON public.cv_experience FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to cv_experience" ON public.cv_experience FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete from cv_experience" ON public.cv_experience FOR DELETE USING (true);

-- cv_selected_work
CREATE POLICY "Allow public insert to cv_selected_work" ON public.cv_selected_work FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to cv_selected_work" ON public.cv_selected_work FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete from cv_selected_work" ON public.cv_selected_work FOR DELETE USING (true);

-- cv_education
CREATE POLICY "Allow public insert to cv_education" ON public.cv_education FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to cv_education" ON public.cv_education FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete from cv_education" ON public.cv_education FOR DELETE USING (true);

-- cv_publications
CREATE POLICY "Allow public insert to cv_publications" ON public.cv_publications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to cv_publications" ON public.cv_publications FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete from cv_publications" ON public.cv_publications FOR DELETE USING (true);