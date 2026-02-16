import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, FileText, Mic, Newspaper, Sparkles, TrendingUp, Zap } from "lucide-react";

const CareerCenter = () => {
  const articles = [
    { slug: "work-experience", title: "Resume Work Experience Examples & Format", category: "Resume Writing" },
    { slug: "objective", title: "Resume Objective Statement Examples", category: "Resume Writing" },
    { slug: "skills", title: "Essential Resume Skills: Examples for Any Job", category: "Skills" },
    { slug: "summary", title: "35+ Resume Summary Examples + Expert Tips", category: "Resume Writing" },
  ];

  const news = [
    { slug: "career-gaps", title: "Nearly Half of Workers Report Career Gaps", date: "Feb 10, 2026" },
    { slug: "worker-concerns", title: "Workers on Edge: 80% Fear Wage Loss", date: "Feb 5, 2026" },
  ];

  const tools = [
    { icon: <Sparkles className="h-5 w-5" />, title: "AI Resume Builder", href: "/ai-resume-builder", description: "Create a professional resume with AI assistance." },
    { icon: <Zap className="h-5 w-5" />, title: "Skills Generator", href: "/skills-generator", description: "Generate relevant skills for your target role." },
    { icon: <Mic className="h-5 w-5" />, title: "Interview Prep", href: "/interview-prep", description: "Practice with AI-powered interview tools." },
    { icon: <FileText className="h-5 w-5" />, title: "ATS Checker", href: "/ats-checker", description: "Optimize your resume for applicant tracking systems." },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-16">
          <div className="container max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm mb-4">
              <TrendingUp className="h-4 w-4 text-secondary" /> Career Center
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Your Career <span className="text-secondary">Hub</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Expert guides, career news, and AI-powered tools to help you land your dream job.
            </p>
          </div>
        </section>

        {/* Tools */}
        <section className="py-14 bg-card border-b border-border">
          <div className="container">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">AI-Powered Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tools.map((tool, i) => (
                <Link key={i} to={tool.href} className="group p-5 rounded-xl border border-border bg-background hover:shadow-lg hover:border-secondary/50 transition-all">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-3 group-hover:bg-secondary group-hover:text-white transition-colors">
                    {tool.icon}
                  </div>
                  <h3 className="font-heading font-semibold text-primary mb-1 group-hover:text-secondary transition-colors">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="py-14 bg-background">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-secondary" /> Featured Articles
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {articles.map((a, i) => (
                <Link key={i} to={`/articles/${a.slug}`} className="group p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:border-secondary/50 transition-all">
                  <span className="text-xs text-secondary font-medium">{a.category}</span>
                  <h3 className="font-heading font-semibold text-primary mt-1 mb-2 group-hover:text-secondary transition-colors">{a.title}</h3>
                  <span className="flex items-center gap-1 text-secondary text-sm">Read more <ArrowRight className="h-4 w-4" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* News */}
        <section className="py-14 bg-muted/30">
          <div className="container">
            <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-2 mb-6">
              <Newspaper className="h-6 w-6 text-secondary" /> Career News
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {news.map((n, i) => (
                <Link key={i} to={`/news/${n.slug}`} className="group p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:border-secondary/50 transition-all">
                  <span className="text-xs text-muted-foreground">{n.date}</span>
                  <h3 className="font-heading font-semibold text-primary mt-1 mb-2 group-hover:text-secondary transition-colors">{n.title}</h3>
                  <span className="flex items-center gap-1 text-secondary text-sm">Read more <ArrowRight className="h-4 w-4" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-background">
          <div className="container max-w-3xl">
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-center">
              <h2 className="font-heading text-2xl font-bold text-white mb-3">Ready to take the next step?</h2>
              <p className="text-white/80 mb-6">Build a professional resume that gets you noticed.</p>
              <Button variant="coral" size="lg" asChild>
                <Link to="/resume-builder">Start Building <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CareerCenter;
