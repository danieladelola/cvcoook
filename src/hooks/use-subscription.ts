import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PlanLimits {
  max_cvs: number;
  max_cover_letters: number;
  premium_templates: boolean;
  ai_suggestions: boolean;
  ats_checker: boolean;
  interview_prep?: boolean;
  linkedin_opt?: boolean;
}

interface UserSubscription {
  id: string;
  plan_id: string;
  plan_name: string;
  plan_limits: PlanLimits;
  plan_features: string[];
  status: string;
  current_period_start: string;
  current_period_end: string;
  payment_gateway: string | null;
}

const FREE_LIMITS: PlanLimits = {
  max_cvs: 1,
  max_cover_letters: 0,
  premium_templates: false,
  ai_suggestions: false,
  ats_checker: false,
};

export function useSubscription() {
  const { user } = useAuth();

  const { data: subscription, isLoading, refetch } = useQuery({
    queryKey: ["user-subscription", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*, plans(name, limits, features)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const plan = (data as any).plans;
      return {
        id: data.id,
        plan_id: data.plan_id,
        plan_name: plan?.name || "Free",
        plan_limits: (plan?.limits || FREE_LIMITS) as PlanLimits,
        plan_features: (plan?.features || []) as string[],
        status: data.status,
        current_period_start: data.current_period_start,
        current_period_end: data.current_period_end,
        payment_gateway: data.payment_gateway,
      } as UserSubscription;
    },
    enabled: !!user,
  });

  const planName = subscription?.plan_name || "Free";
  const limits = subscription?.plan_limits || FREE_LIMITS;

  const canUseFeature = (feature: keyof PlanLimits): boolean => {
    return !!limits[feature];
  };

  const isWithinLimit = (feature: "max_cvs" | "max_cover_letters", currentCount: number): boolean => {
    const limit = limits[feature];
    if (limit === -1) return true; // unlimited
    return currentCount < limit;
  };

  const isPro = planName === "Pro" || planName === "Premium";
  const isPremium = planName === "Premium";
  const isFreePlan = planName === "Free" || !subscription;

  const daysRemaining = subscription
    ? Math.max(0, Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    subscription,
    isLoading,
    refetch,
    planName,
    limits,
    canUseFeature,
    isWithinLimit,
    isPro,
    isPremium,
    isFreePlan,
    daysRemaining,
  };
}
