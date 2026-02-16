import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, FileText, Target, CheckCircle, Zap, PenTool, Copy } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AIResumeBuilder = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState("");

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI Content Generation",
      description: "Get professionally written bullet points tailored to your experience and target role."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Job-Specific Optimization",
      description: "Paste a job description and watch your resume automatically optimize for that role."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "ATS-Friendly Output",
      description: "All AI-generated content is optimized to pass Applicant Tracking Systems."
    },
    {
      icon: <PenTool className="h-6 w-6" />,
      title: "Easy Customization",
      description: "Edit and refine AI suggestions to match your personal voice and style."
    }
  ];

  const examples = [
    {
      title: "Marketing Manager",
      before: "Managed marketing campaigns",
      after: "Spearheaded integrated marketing campaigns that increased brand awareness by 45% and generated $2.3M in attributed revenue within 12 months"
    },
    {
      title: "Software Engineer",
      before: "Wrote code and fixed bugs",
      after: "Engineered scalable microservices architecture serving 1M+ daily active users, reducing system latency by 60% and achieving 99.9% uptime"
    },
    {
      title: "Sales Representative",
      before: "Made sales calls and met quotas",
      after: "Exceeded quarterly sales targets by 125% through strategic account management and relationship building, closing $1.5M in new business annually"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-20 lg:py-32">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  Powered by Advanced AI
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Let AI Write Your <span className="text-secondary">Perfect Resume</span>
                </h1>
                <p className="text-lg text-white/80 max-w-xl">
                  Our AI analyzes thousands of successful resumes to generate compelling, job-winning content tailored to your experience and target role.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="coral" size="xl" asChild>
                    <Link to="/register">
                      Try AI Resume Builder <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Demo Card */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                  <h3 className="font-heading font-semibold text-primary mb-4">Try it now:</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Your job title</label>
                      <Input 
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Marketing Manager"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Brief description of your experience</label>
                      <Textarea 
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g., Led digital marketing campaigns for B2B SaaS company..."
                        rows={3}
                      />
                    </div>
                    <Button variant="coral" className="w-full">
                      <Sparkles className="mr-2 h-4 w-4" /> Generate Resume Content
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                AI That Understands Your Career
              </h2>
              <p className="text-muted-foreground text-lg">
                Our AI is trained on millions of successful resumes to help you create content that gets results.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="group p-6 rounded-2xl border border-border bg-card hover:shadow-xl hover:border-secondary/50 transition-all">
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

        {/* Before/After Examples */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                See the AI Difference
              </h2>
              <p className="text-muted-foreground text-lg">
                Transform basic job descriptions into powerful, achievement-focused bullet points.
              </p>
            </div>
            <div className="space-y-8 max-w-4xl mx-auto">
              {examples.map((example, index) => (
                <div key={index} className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="bg-primary/5 px-6 py-3 border-b border-border">
                    <span className="text-sm font-medium text-primary">{example.title}</span>
                  </div>
                  <div className="grid md:grid-cols-2">
                    <div className="p-6 border-r border-border">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Before</div>
                      <p className="text-muted-foreground">{example.before}</p>
                    </div>
                    <div className="p-6 bg-secondary/5">
                      <div className="flex items-center gap-2 text-xs text-secondary uppercase tracking-wider mb-2">
                        <Sparkles className="h-3 w-3" /> AI Enhanced
                      </div>
                      <p className="text-foreground">{example.after}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-secondary to-coral-dark">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Let AI Build Your Resume?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Join millions who have transformed their resumes with AI-powered content suggestions.
            </p>
            <Button size="xl" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/register">
                Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AIResumeBuilder;
