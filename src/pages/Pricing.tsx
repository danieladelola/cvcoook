import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, X, Star, Zap, Crown, ArrowRight, HelpCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DBPlan {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_annual: number;
  features: string[];
  highlighted: boolean;
  sort_order: number;
}

const planIcons: Record<string, React.ReactNode> = {
  Free: <Star className="h-6 w-6" />,
  Pro: <Zap className="h-6 w-6" />,
  Premium: <Crown className="h-6 w-6" />,
};

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"1month" | "3month" | "6month" | "1year">("1month");
  const [plans, setPlans] = useState<DBPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("plans")
      .select("id, name, description, price_monthly, price_annual, features, highlighted, sort_order")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data) {
          setPlans(
            data.map((p) => ({
              ...p,
              features: Array.isArray(p.features) ? (p.features as string[]) : [],
            }))
          );
        }
        setLoading(false);
      });
  }, []);

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! You can cancel your subscription at any time. If you cancel, you'll still have access to your plan until the end of your billing period."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 7-day free trial for our Pro plan. No credit card required to start."
    },
    {
      question: "Can I download my resume after my subscription ends?",
      answer: "Absolutely! Any resumes you create are yours to keep. You can download them anytime, even after your subscription ends."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Paystack, supporting cards, bank transfers, USSD, and mobile money."
    }
  ];

  // For the Free plan, show included/excluded features
  const freeIncluded = ["1 Resume", "Basic Templates", "PDF Download"];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
                Simple, Transparent <span className="text-secondary">Pricing</span>
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Choose the plan that fits your career goals. No hidden fees, cancel anytime.
              </p>
              
              {/* Billing Toggle */}
              <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2 bg-white/10 backdrop-blur-sm rounded-full p-1.5 md:p-1 md:inline-flex">
                <button
                  onClick={() => setBillingPeriod("1month")}
                  className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    billingPeriod === "1month" ? "bg-white text-primary" : "text-white/80 hover:text-white"
                  }`}
                >
                  1 Month
                </button>
                <button
                  onClick={() => setBillingPeriod("3month")}
                  className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    billingPeriod === "3month" ? "bg-white text-primary" : "text-white/80 hover:text-white"
                  }`}
                >
                  3M <span className="hidden sm:inline">onths</span> <span className="text-secondary text-xs ml-0.5 md:ml-1">-8%</span>
                </button>
                <button
                  onClick={() => setBillingPeriod("6month")}
                  className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    billingPeriod === "6month" ? "bg-white text-primary" : "text-white/80 hover:text-white"
                  }`}
                >
                  6M <span className="hidden sm:inline">onths</span> <span className="text-secondary text-xs ml-0.5 md:ml-1">-15%</span>
                </button>
                <button
                  onClick={() => setBillingPeriod("1year")}
                  className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    billingPeriod === "1year" ? "bg-white text-primary" : "text-white/80 hover:text-white"
                  }`}
                >
                  1 Year <span className="text-secondary text-xs ml-0.5 md:ml-1">-30%</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-background -mt-8">
          <div className="container">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto px-4 md:px-0">
                {plans.map((plan) => {
                  // Calculate price based on selected billing period
                  let price = plan.price_monthly;
                  if (billingPeriod === "3month") {
                    price = plan.price_monthly * 3 * 0.92; // 8% discount
                  } else if (billingPeriod === "6month") {
                    price = plan.price_monthly * 6 * 0.85; // 15% discount
                  } else if (billingPeriod === "1year") {
                    price = plan.price_annual;
                  }
                  const isFree = price === 0;
                  const ctaText = isFree ? "Get Started" : plan.highlighted ? "Start Pro Trial" : `Go ${plan.name}`;
                  const ctaLink = isFree
                    ? "/register"
                    : `/payment?plan_id=${plan.id}&billing=${billingPeriod}`;

                  return (
                    <div
                      key={plan.id}
                      className={`relative rounded-2xl p-6 md:p-8 ${
                        plan.highlighted
                          ? "bg-gradient-to-b from-secondary/10 to-coral-dark/5 border-2 border-secondary shadow-xl md:scale-105"
                          : "bg-card border border-border"
                      }`}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white text-sm font-medium px-4 py-1 rounded-full">
                          Most Popular
                        </div>
                      )}
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                        plan.highlighted ? "bg-secondary text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        {planIcons[plan.name] || <Star className="h-6 w-6" />}
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-primary">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {plan.description || ""}
                      </p>
                      <div className="mb-6">
                        <span className="font-heading text-3xl md:text-4xl font-bold text-primary">
                          {isFree ? "Free" : `₦${price.toLocaleString()}`}
                        </span>
                        {!isFree && (
                          <div className="text-muted-foreground">
                            <p className="text-xs md:text-sm">
                              {billingPeriod === "1month" && "per month"}
                              {billingPeriod === "3month" && `for 3 months (₦${Math.round(price / 3).toLocaleString()}/mo)`}
                              {billingPeriod === "6month" && `for 6 months (₦${Math.round(price / 6).toLocaleString()}/mo)`}
                              {billingPeriod === "1year" && `per year (₦${Math.round(price / 12).toLocaleString()}/mo)`}
                            </p>
                          </div>
                        )}
                      </div>
                      <ul className="space-y-3 mb-8">
                        {isFree ? (
                          // For the Free plan, show what's included/excluded
                          <>
                            {plan.features.map((feature, fi) => {
                              const included = freeIncluded.includes(feature);
                              return (
                                <li key={fi} className="flex items-center gap-3">
                                  {included ? (
                                    <Check className="h-5 w-5 text-secondary" />
                                  ) : (
                                    <X className="h-5 w-5 text-muted-foreground/50" />
                                  )}
                                  <span className={included ? "text-foreground" : "text-muted-foreground/50"}>
                                    {feature}
                                  </span>
                                </li>
                              );
                            })}
                          </>
                        ) : (
                          plan.features.map((feature, fi) => (
                            <li key={fi} className="flex items-center gap-3">
                              <Check className="h-5 w-5 text-secondary" />
                              <span className="text-foreground">{feature}</span>
                            </li>
                          ))
                        )}
                      </ul>
                      <Button
                        variant={plan.highlighted ? "coral" : "outline"}
                        className="w-full"
                        size="lg"
                        asChild
                      >
                        <Link to={ctaLink}>{ctaText}</Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-secondary" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-secondary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-secondary" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-secondary" />
                <span>Secure payment</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-background">
          <div className="container max-w-3xl">
            <h2 className="font-heading text-3xl font-bold text-primary text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="font-heading font-semibold text-primary flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-secondary" />
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground mt-2 ml-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-secondary to-coral-dark">
          <div className="container text-center">
            <h2 className="font-heading text-3xl font-bold text-white mb-4">
              Ready to Build Your Perfect Resume?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Join millions of job seekers who have successfully landed their dream jobs.
            </p>
            <Button size="xl" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/register">
                Start For Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
