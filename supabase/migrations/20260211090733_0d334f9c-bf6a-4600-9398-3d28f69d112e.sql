
-- ============================================
-- CVCOOK Full Database Schema
-- ============================================

-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  location TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  website TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. User roles table (separate from profiles per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Security definer function for role checks (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_annual NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  limits JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  highlighted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- 6. User subscriptions
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.plans(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  payment_gateway TEXT CHECK (payment_gateway IN ('paystack', 'flutterwave')),
  gateway_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 7. Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.user_subscriptions(id),
  plan_id UUID REFERENCES public.plans(id),
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed', 'refunded')),
  payment_gateway TEXT NOT NULL CHECK (payment_gateway IN ('paystack', 'flutterwave')),
  gateway_reference TEXT UNIQUE,
  gateway_transaction_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 8. Site settings (admin-managed key-value store)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 9. User CVs (saved resumes)
CREATE TABLE public.user_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled CV',
  template_id TEXT NOT NULL DEFAULT 'classic-professional',
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  customization JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT false,
  views INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_cvs ENABLE ROW LEVEL SECURITY;

-- 10. User cover letters
CREATE TABLE public.user_cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Cover Letter',
  job_title TEXT DEFAULT '',
  company_name TEXT DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_cover_letters ENABLE ROW LEVEL SECURITY;

-- 11. Uploaded files metadata
CREATE TABLE public.uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  bucket TEXT NOT NULL DEFAULT 'user-uploads',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles: users see own, admins see all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- User roles: only admins can manage, users can read own
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Plans: everyone can read active plans, admins can manage
CREATE POLICY "Anyone can view active plans" ON public.plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage plans" ON public.plans
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Subscriptions: users see own, admins see all
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" ON public.user_subscriptions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Payments: users see own, admins see all
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Site settings: admins can manage, authenticated can read
CREATE POLICY "Authenticated can read settings" ON public.site_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage settings" ON public.site_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- User CVs: users own, admins see all
CREATE POLICY "Users can manage own CVs" ON public.user_cvs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all CVs" ON public.user_cvs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Cover letters: users own
CREATE POLICY "Users can manage own cover letters" ON public.user_cover_letters
  FOR ALL USING (auth.uid() = user_id);

-- Uploaded files: users own, admins see all
CREATE POLICY "Users can manage own files" ON public.uploaded_files
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all files" ON public.uploaded_files
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER plans_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER cvs_updated_at BEFORE UPDATE ON public.user_cvs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER cover_letters_updated_at BEFORE UPDATE ON public.user_cover_letters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile + user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STORAGE
-- ============================================

-- User uploads bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('user-uploads', 'avatars') 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id IN ('user-uploads', 'avatars')
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('user-uploads', 'avatars')
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public avatar access" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- ============================================
-- SEED DEFAULT PLANS
-- ============================================

INSERT INTO public.plans (name, description, price_monthly, price_annual, features, limits, sort_order, highlighted) VALUES
(
  'Free',
  'Perfect for getting started',
  0, 0,
  '["1 Resume", "Basic Templates", "PDF Download"]'::jsonb,
  '{"max_cvs": 1, "max_cover_letters": 0, "premium_templates": false, "ai_suggestions": false, "ats_checker": false}'::jsonb,
  0, false
),
(
  'Pro',
  'Best for active job seekers',
  14.99, 9.99,
  '["Unlimited Resumes", "All Premium Templates", "PDF & Word Download", "AI Writing Assistant", "ATS Score Checker", "3 Cover Letters", "Email Support"]'::jsonb,
  '{"max_cvs": -1, "max_cover_letters": 3, "premium_templates": true, "ai_suggestions": true, "ats_checker": true}'::jsonb,
  1, true
),
(
  'Premium',
  'For serious career advancement',
  24.99, 19.99,
  '["Everything in Pro", "Unlimited Cover Letters", "LinkedIn Optimization", "Interview Prep Tools", "Career Coaching Session", "Resume Review by Expert", "Priority 24/7 Support"]'::jsonb,
  '{"max_cvs": -1, "max_cover_letters": -1, "premium_templates": true, "ai_suggestions": true, "ats_checker": true, "linkedin_opt": true, "interview_prep": true}'::jsonb,
  2, false
);

-- ============================================
-- SEED DEFAULT SITE SETTINGS
-- ============================================

INSERT INTO public.site_settings (key, value) VALUES
('general', '{"site_name": "CVCOOK", "site_url": "https://cvcook.com", "description": "Create professional resumes and CVs in minutes", "language": "English", "timezone": "UTC", "maintenance_mode": false}'::jsonb),
('email', '{"from_email": "noreply@cvcook.com", "from_name": "CVCOOK"}'::jsonb),
('security', '{"two_factor_admin": true, "force_https": true, "rate_limiting": true, "session_timeout": 30}'::jsonb),
('payment', '{"active_gateway": "paystack", "currency": "NGN"}'::jsonb);
