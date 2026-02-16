import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Sparkles, Layout, Download, CheckCircle, Star, Users, Award, ArrowRight, Zap, Shield, Clock } from "lucide-react";

const ResumeBuilder = () => {
  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered Writing",
      description: "Get intelligent suggestions for your resume content based on your industry and experience level."
    },
    {
      icon: <Layout className="h-6 w-6" />,
      title: "Professional Templates",
      description: "Choose from 100+ ATS-friendly templates designed by HR experts and professional designers."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "ATS Optimization",
      description: "Ensure your resume passes Applicant Tracking Systems with our built-in optimization tools."
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Multiple Formats",
      description: "Download your resume in PDF, Word, or plain text format - whatever the employer needs."
    }
  ];

  const stats = [
    { value: "10M+", label: "Resumes Created" },
    { value: "95%", label: "Success Rate" },
    { value: "500+", label: "Templates" },
    { value: "24/7", label: "Support" }
  ];

  const steps = [
    {
      number: "01",
      title: "Choose Your Template",
      description: "Browse our collection of professional templates and select one that matches your style and industry."
    },
    {
      number: "02",
      title: "Fill In Your Details",
      description: "Enter your work experience, education, and skills. Our AI will help you phrase everything perfectly."
    },
    {
      number: "03",
      title: "Customize & Download",
      description: "Adjust colors, fonts, and layout. Then download your polished resume in your preferred format."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark py-20 lg:py-32">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  AI-Powered Resume Builder
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Build Your Perfect Resume in <span className="text-secondary">Minutes</span>
                </h1>
                <p className="text-lg text-white/80 max-w-xl">
                  Create a professional, ATS-optimized resume that gets you noticed. Our AI-powered builder makes it easy to showcase your skills and land your dream job.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="coral" size="xl" asChild>
                    <Link to="/register">
                      Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="heroOutline" size="xl" asChild>
                    <Link to="/templates">View Templates</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-secondary to-coral-dark" />
                    ))}
                  </div>
                  <div className="text-white">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                      ))}
                    </div>
                    <p className="text-sm text-white/70">Trusted by 10M+ job seekers</p>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-coral-dark/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-dark" />
                      <div>
                        <div className="h-4 w-32 bg-primary/20 rounded" />
                        <div className="h-3 w-24 bg-muted rounded mt-2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted rounded" />
                      <div className="h-3 w-4/5 bg-muted rounded" />
                      <div className="h-3 w-3/4 bg-muted rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-secondary/30 rounded" />
                        <div className="h-2 w-full bg-muted rounded" />
                        <div className="h-2 w-4/5 bg-muted rounded" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-secondary/30 rounded" />
                        <div className="h-2 w-full bg-muted rounded" />
                        <div className="h-2 w-3/4 bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-card border-b border-border">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-heading text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                Everything You Need to Build a Winning Resume
              </h2>
              <p className="text-muted-foreground text-lg">
                Our resume builder comes packed with powerful features to help you create a standout resume quickly and easily.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group p-6 rounded-2xl border border-border bg-card hover:shadow-xl hover:border-secondary/50 transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                Create Your Resume in 3 Easy Steps
              </h2>
              <p className="text-muted-foreground text-lg">
                Our streamlined process makes it simple to create a professional resume in minutes.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-8xl font-heading font-bold text-secondary/10 absolute -top-4 left-0">
                    {step.number}
                  </div>
                  <div className="relative pt-12 pl-4">
                    <h3 className="font-heading text-xl font-semibold text-primary mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-secondary to-coral-dark">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Build Your Professional Resume?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Join millions of job seekers who have successfully landed their dream jobs with our resume builder.
            </p>
            <Button size="xl" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/register">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ResumeBuilder;
