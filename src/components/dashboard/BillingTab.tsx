import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Crown, Zap, Star, CreditCard, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const BillingTab = () => {
  const { user } = useAuth();
  const { subscription, planName, isFreePlan, isPremium, daysRemaining, limits } = useSubscription();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["user-payments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*, plans(name)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const planIcon = isPremium ? <Crown className="h-5 w-5" /> : isFreePlan ? <Star className="h-5 w-5" /> : <Zap className="h-5 w-5" />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Billing & Subscription</h2>
        <p className="text-sm text-muted-foreground">Manage your plan and view payment history</p>
      </div>

      {/* Current Plan */}
      <div className="rounded-xl border border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              isFreePlan ? "bg-muted text-muted-foreground" : "bg-secondary text-white"
            }`}>
              {planIcon}
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{planName} Plan</h3>
              {subscription ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-secondary" />
                  <span>Active · {daysRemaining} days remaining</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Free tier — limited features</p>
              )}
            </div>
          </div>
          <Link to="/pricing">
            <Button variant={isFreePlan ? "coral" : "outline"} className="gap-2">
              {isFreePlan ? (
                <>Upgrade <ArrowRight className="h-4 w-4" /></>
              ) : isPremium ? "Manage" : (
                <>Upgrade <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </Link>
        </div>

        {subscription && (
          <div className="mt-4 grid gap-3 rounded-lg bg-muted/50 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Billing Period</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(subscription.current_period_start).toLocaleDateString()} — {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment Gateway</p>
              <p className="text-sm font-medium text-foreground capitalize">{subscription.payment_gateway || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max CVs</p>
              <p className="text-sm font-medium text-foreground">{limits.max_cvs === -1 ? "Unlimited" : limits.max_cvs}</p>
            </div>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-secondary" /> Payment History
        </h3>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : payments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No payments yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    p.status === "completed" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                  }`}>
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{(p as any).plans?.name || "Plan"} Plan</p>
                    <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{p.currency} {Number(p.amount).toFixed(2)}</p>
                  <p className={`text-xs font-medium ${p.status === "completed" ? "text-secondary" : "text-muted-foreground"}`}>
                    {p.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingTab;
