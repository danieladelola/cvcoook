
-- Add status and soft delete to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

-- Create admin audit log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action text NOT NULL,
  target_user_id uuid,
  details jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read audit logs"
  ON public.admin_audit_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert audit logs"
  ON public.admin_audit_log FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_target ON public.admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.admin_audit_log(created_at DESC);
