-- Allow anyone to view public CVs (for the public CV link feature)
CREATE POLICY "Anyone can view public CVs"
ON public.user_cvs
FOR SELECT
USING (is_public = true);
