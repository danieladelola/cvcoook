import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const CTASection = () => {
  const benefits = [
    "No credit card required",
    "Free templates available",
    "Export to PDF, Word & more",
    "ATS-optimized formatting",
  ];
  
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 md:px-16 md:py-20">
          {/* Decorative elements */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Ready to Build Your{" "}
              <span className="text-secondary">Perfect Resume?</span>
            </h2>
            <p className="mt-6 text-lg text-white/80">
              Join thousands of job seekers who have already created winning resumes with CVBuilder. 
              Start for free and land your dream job.
            </p>
            
            {/* Benefits grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-white/90">
                  <Check className="h-4 w-4 text-accent" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* CTA buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button variant="coral" size="xl" className="group">
                  Create My Resume Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="heroOutline" size="xl">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
