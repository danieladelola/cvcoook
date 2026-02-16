import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Check, Shield, ArrowLeft, Loader2, Lock, Zap, Crown, Star,
  User, Mail, Phone, Sparkles, CheckCircle2, CreditCard,
} from "lucide-react";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PlanData {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_annual: number;
  features: string[];
  currency: string;
}

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, session } = useAuth();

  const planId = searchParams.get("plan_id");
  const billing = searchParams.get("billing") || "monthly";

  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack script once on mount
  useEffect(() => {
    if (window.PaystackPop) {
      setPaystackLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    script.onerror = () => {
      toast({ title: "Error", description: "Failed to load payment gateway. Please refresh.", variant: "destructive" });
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!planId) { setLoadingPlan(false); return; }
    supabase
      .from("plans")
      .select("id, name, description, price_monthly, price_annual, features, currency")
      .eq("id", planId)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setPlan({ ...data, features: Array.isArray(data.features) ? (data.features as string[]) : [] });
        }
        setLoadingPlan(false);
      });
  }, [planId]);

  const price = plan ? (billing === "annual" ? plan.price_annual : plan.price_monthly) : 0;

  const processSubscription = useCallback(async (reference: string, transactionId?: string) => {
    if (!session || !plan) return;
    try {
      const res = await supabase.functions.invoke("process-payment", {
        body: {
          plan_id: plan.id,
          payment_reference: reference,
          payment_gateway: "paystack",
          amount: price,
          currency: "NGN",
          transaction_id: transactionId,
          billing_period: billing,
        },
      });
      if (res.error) throw new Error(res.error.message || "Payment processing failed");
      const data = res.data as any;
      if (data?.error) throw new Error(data.error);

      setPaymentSuccess(true);
      toast({ title: "Payment Successful! 🎉", description: `Your ${plan.name} plan is now active.` });
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err: any) {
      toast({ title: "Subscription Error", description: err.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  }, [session, plan, price, billing, navigate, toast]);

  const handlePayment = useCallback(async () => {
    if (!user || !plan || !paystackLoaded) return;
    if (!window.PaystackPop) {
      toast({ title: "Error", description: "Payment gateway not ready. Please refresh.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    const ref = `cvcook_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    try {
      const handler = window.PaystackPop.setup({
        key: "pk_live_5d99e4187e1ee9cf999348ebedb5d4cb805ea162",
        email: user.email,
        amount: Math.round(price * 100),
        currency: "NGN",
        ref,
        metadata: {
          plan_id: plan.id,
          plan_name: plan.name,
          user_id: user.id,
          custom_fields: [
            { display_name: "Plan", variable_name: "plan", value: plan.name },
            { display_name: "User", variable_name: "user", value: profile?.full_name || user.email },
          ],
        },
        callback: (response: any) => {
          processSubscription(response.reference, response.transaction);
        },
        onClose: () => {
          setIsProcessing(false);
          toast({ title: "Payment Cancelled", description: "You closed the payment window.", variant: "destructive" });
        },
      });
      handler.openIframe();
    } catch (err: any) {
      setIsProcessing(false);
      toast({ title: "Payment Error", description: err.message || "Failed to initialize payment", variant: "destructive" });
    }
  }, [user, plan, paystackLoaded, price, processSubscription, profile, toast]);

  const planIcon = plan?.name === "Premium" ? <Crown className="h-6 w-6" /> : <Zap className="h-6 w-6" />;

  if (paymentSuccess) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-background">
          <div className="mx-auto max-w-md text-center px-6">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
              <CheckCircle2 className="h-10 w-10 text-secondary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Payment Successful!</h1>
            <p className="mt-3 text-muted-foreground">
              Your <strong className="text-secondary">{plan?.name}</strong> plan is now active. Redirecting to your dashboard...
            </p>
            <div className="mt-6">
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-secondary" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loadingPlan) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">Plan Not Found</h1>
            <p className="mt-2 text-muted-foreground">The selected plan is no longer available.</p>
            <Button variant="coral" className="mt-6" asChild>
              <Link to="/pricing">View Plans</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-8 md:py-12">
        <div className="container max-w-5xl">
          <Link to="/pricing" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Pricing
          </Link>

          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground">Complete Your Purchase</h1>
            <p className="mt-1 text-muted-foreground">You're one step away from unlocking {plan.name} features</p>
          </div>

          <div className="mb-8 flex items-center justify-center gap-0">
            {["Review", "Pay", "Done"].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {i + 1}
                  </div>
                  <span className={`text-sm font-medium ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
                </div>
                {i < 2 && <div className="mx-4 h-px w-12 bg-border sm:w-20" />}
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-secondary" />
                  <h2 className="font-heading text-lg font-semibold text-foreground">Your Information</h2>
                </div>
                <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="h-14 w-14 rounded-full object-cover ring-2 ring-secondary/20" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                      {(profile?.full_name || user?.email || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-semibold text-foreground truncate">{profile?.full_name || "—"}</p>
                    <div className="mt-1 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{user?.email}</span>
                      </div>
                      {profile?.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">Verified</div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Your account details are automatically used for billing. Update them in{" "}
                  <Link to="/dashboard/settings" className="text-secondary underline">Settings</Link>.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-secondary" />
                  <h2 className="font-heading text-lg font-semibold text-foreground">Payment Method</h2>
                </div>
                <div className="flex items-center gap-4 rounded-xl border-2 border-secondary bg-secondary/5 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                    <span className="text-xl font-bold text-secondary">P</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Paystack</p>
                    <p className="text-xs text-muted-foreground">Cards, Bank Transfer, USSD, Mobile Money</p>
                  </div>
                  <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-secondary">
                    <Check className="h-3 w-3 text-secondary-foreground" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
                  <Shield className="h-4 w-4 text-secondary shrink-0" />
                  <span className="text-xs text-muted-foreground">256-bit SSL encryption · PCI DSS compliant · Your payment data is never stored on our servers</span>
                </div>
              </div>

              <Button variant="coral" size="lg" className="w-full gap-2 text-base py-6" onClick={handlePayment} disabled={isProcessing || !paystackLoaded}>
                {isProcessing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Processing Payment...</>
                ) : (
                  <><Lock className="h-5 w-5" /> Pay ₦{price.toLocaleString()}</>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By completing this purchase, you agree to our{" "}
                <Link to="/terms" className="text-secondary underline">Terms of Service</Link> and{" "}
                <Link to="/privacy" className="text-secondary underline">Privacy Policy</Link>.
              </p>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 space-y-6">
                <h2 className="font-heading text-lg font-semibold text-foreground">Order Summary</h2>
                <div className="flex items-center gap-4 rounded-xl bg-muted/30 p-4 border border-border">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    {planIcon}
                  </div>
                  <div>
                    <p className="font-heading text-lg font-bold text-foreground">{plan.name} Plan</p>
                    <p className="text-sm text-muted-foreground">Billed {billing === "annual" ? "annually" : "monthly"}</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What's included</p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-secondary shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{plan.name} Plan ({billing})</span>
                    <span>₦{price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>₦0</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-heading text-xl font-bold text-foreground">
                    <span>Total</span>
                    <span>₦{price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-secondary/5 border border-secondary/10 px-3 py-2.5 text-xs text-secondary">
                    <Star className="h-4 w-4 shrink-0" />
                    <span className="font-medium">30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
                    <Sparkles className="h-4 w-4 shrink-0 text-secondary" />
                    <span>Cancel anytime, no questions asked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
