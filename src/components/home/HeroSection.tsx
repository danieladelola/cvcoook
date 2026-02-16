import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Star } from "lucide-react";

const HeroSection = () => {
  const benefits = [
    "30% higher chance of getting a job",
    "42% higher response rate from recruiters",
  ];
  
  return (
    <section className="hero-gradient relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
      
      <div className="container relative py-16 md:py-24 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="animate-fade-in space-y-8">
            <div className="space-y-4">
              <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
                Create a Professional{" "}
                <span className="text-secondary">CV in Minutes</span>
              </h1>
              <p className="max-w-lg text-lg text-white/80 md:text-xl">
                Build your perfect resume from any device with our AI-powered CV Builder. 
                Access professional templates, expert tips, and get hired faster.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/register">
                <Button variant="coral" size="xl" className="group w-full sm:w-auto">
                  Start Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  View Templates
                </Button>
              </Link>
            </div>
            
            {/* Benefits */}
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* Trust indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-white/70">
                <strong className="text-white">Excellent</strong> • 17,000+ reviews
              </span>
            </div>
          </div>
          
          {/* Hero Image / CV Preview */}
          <div className="animate-slide-in-right relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main CV preview */}
              <div className="relative z-10 rounded-2xl bg-white p-6 shadow-strong">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 rounded bg-primary/80" />
                      <div className="h-3 w-24 rounded bg-muted-foreground/30" />
                      <div className="h-3 w-40 rounded bg-muted-foreground/20" />
                    </div>
                  </div>
                  
                  {/* Section */}
                  <div className="space-y-2 pt-4">
                    <div className="h-3 w-20 rounded bg-secondary/60" />
                    <div className="h-2 w-full rounded bg-muted" />
                    <div className="h-2 w-5/6 rounded bg-muted" />
                    <div className="h-2 w-4/6 rounded bg-muted" />
                  </div>
                  
                  {/* Section */}
                  <div className="space-y-2 pt-2">
                    <div className="h-3 w-24 rounded bg-secondary/60" />
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      <div className="h-2 w-32 rounded bg-muted" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      <div className="h-2 w-28 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -left-6 top-12 z-20 animate-float rounded-xl bg-white p-4 shadow-medium">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">ATS Friendly</p>
                    <p className="text-xs text-muted-foreground">Optimized format</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-4 bottom-16 z-20 animate-float rounded-xl bg-white p-4 shadow-medium" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                    <Star className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Pro Templates</p>
                    <p className="text-xs text-muted-foreground">50+ designs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(210, 25%, 97%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
