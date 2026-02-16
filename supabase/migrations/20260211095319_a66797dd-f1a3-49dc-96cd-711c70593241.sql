
-- Add tone and version_history columns to user_cover_letters
ALTER TABLE public.user_cover_letters
  ADD COLUMN IF NOT EXISTS tone text NOT NULL DEFAULT 'professional',
  ADD COLUMN IF NOT EXISTS job_description text DEFAULT '',
  ADD COLUMN IF NOT EXISTS version_history jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Admin can view all cover letters
CREATE POLICY "Admins can view all cover letters"
  ON public.user_cover_letters
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
