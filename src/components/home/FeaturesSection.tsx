import { FileCheck, Pencil, Download, Sparkles, Shield, Clock } from "lucide-react";

const FeaturesSection = () => {
  const steps = [
    {
      number: 1,
      icon: FileCheck,
      title: "Pick a Template",
      description: "Choose from 50+ professionally designed templates that suit your industry and style.",
    },
    {
      number: 2,
      icon: Pencil,
      title: "Enter Your Info",
      description: "Fill in your details with our smart form. Get AI-powered suggestions to enhance your content.",
    },
    {
      number: 3,
      icon: Download,
      title: "Download Your CV",
      description: "Export your polished resume as PDF, Word, or plain text. Ready to impress employers.",
    },
  ];
  
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Writing",
      description: "Get intelligent suggestions to improve your resume content and language.",
    },
    {
      icon: Shield,
      title: "ATS-Friendly",
      description: "All templates are optimized to pass Applicant Tracking Systems.",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Create a professional resume in under 10 minutes with our intuitive builder.",
    },
  ];
  
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Build Your Winning Resume in{" "}
            <span className="text-secondary">3 Easy Steps</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our streamlined process makes creating a professional CV quick and effortless.
          </p>
        </div>
        
        {/* Steps */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="card-hover relative rounded-2xl border border-border bg-card p-8"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden h-0.5 w-8 bg-border md:block" />
              )}
              
              {/* Step number */}
              <div className="step-number mb-6">
                {step.number}
              </div>
              
              {/* Icon */}
              <div className="feature-icon mb-6">
                <step.icon className="h-8 w-8 text-secondary" />
              </div>
              
              {/* Content */}
              <h3 className="mb-3 font-heading text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Additional Features */}
        <div className="mt-20 rounded-2xl bg-primary/5 p-8 md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Why Choose CVBuilder?
            </h3>
          </div>
          
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
                  <feature.icon className="h-7 w-7 text-secondary" />
                </div>
                <h4 className="mb-2 font-heading font-semibold text-foreground">
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
