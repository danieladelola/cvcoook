import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, FileText, Sparkles, Target, ArrowRight, Upload, BarChart3, AlertTriangle, Star } from "lucide-react";

const ATSChecker = () => {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "ATS Compatibility Score",
      description: "Get an instant score showing how well your resume will perform with Applicant Tracking Systems."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Keyword Analysis",
      description: "See which keywords are missing and get suggestions based on your target job description."
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Format Issues",
      description: "Identify formatting problems that could cause your resume to be rejected by ATS software."
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI Recommendations",
      description: "Receive personalized suggestions to improve your resume's chances of getting past the ATS."
    }
  ];

  const tips = [
    "Use standard section headings (Experience, Education, Skills)",
    "Avoid tables, graphics, and complex formatting",
    "Include keywords from the job description",
    "Use a clean, simple font (Arial, Calibri, Times New Roman)",
    "Save as .docx or .pdf format",
    "Don't use headers or footers for important information"
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
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  Free ATS Resume Checker
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Is Your Resume <span className="text-secondary">ATS-Ready?</span>
                </h1>
                <p className="text-lg text-white/80 max-w-xl">
                  Over 75% of resumes are rejected by ATS before a human ever sees them. Check your resume now and get instant feedback to improve your chances.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="coral" size="xl" asChild>
                    <Link to="/register">
                      Check My Resume <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Upload Card */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="border-2 border-dashed border-muted rounded-xl p-12 text-center">
                    <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                      Upload Your Resume
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Drag and drop or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports PDF, DOC, DOCX (max 5MB)
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    Your resume is analyzed securely and never shared
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is ATS */}
        <section className="py-20 bg-card">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
                  What is an ATS?
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    An <strong className="text-primary">Applicant Tracking System (ATS)</strong> is software used by employers to manage job applications. It scans resumes for keywords, formatting, and relevance before a human recruiter ever sees them.
                  </p>
                  <p>
                    Companies like Amazon, Google, and most Fortune 500 companies use ATS to filter through thousands of applications. If your resume isn't optimized for ATS, it could be automatically rejected—even if you're perfectly qualified for the job.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/30 text-center">
                    <div className="text-3xl font-heading font-bold text-secondary">75%</div>
                    <p className="text-sm text-muted-foreground">of resumes rejected by ATS</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-xl border border-primary/30 text-center">
                    <div className="text-3xl font-heading font-bold text-primary">98%</div>
                    <p className="text-sm text-muted-foreground">of Fortune 500 use ATS</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-heading text-xl font-semibold text-primary">ATS Optimization Tips:</h3>
                <ul className="space-y-3">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 bg-background p-4 rounded-lg border border-border">
                      <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                What Our ATS Checker Analyzes
              </h2>
              <p className="text-muted-foreground text-lg">
                Get comprehensive feedback on how to improve your resume's ATS compatibility.
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

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-secondary to-coral-dark">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Don't Let ATS Reject Your Resume
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Check your resume now and get instant feedback to improve your chances of landing interviews.
            </p>
            <Button size="xl" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/register">
                Check My Resume Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ATSChecker;
