import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Edit3, Zap, Sparkles, Target, Mic, BookOpen, Users, MessageSquare, TrendingUp, Star, ArrowRight, Award, FileText, ExternalLink } from "lucide-react";

const Resources = () => {
  const aiTools = [
    {
      icon: <Edit3 className="h-6 w-6" />,
      title: "Resume Summary Generator",
      description: "Craft a powerful resume summary that stands out to recruiters.",
      href: "/resume-summary-generator"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI Resume Skills Generator",
      description: "Generate a list of resume skills based on your target job title.",
      href: "/skills-generator"
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Interview Prep Tools",
      description: "Prepare for interviews with interactive tools and AI-powered feedback.",
      href: "/interview-prep"
    }
  ];

  const guides = [
    {
      title: "Resume Work Experience Examples & Format",
      description: "Learn how to write compelling work experience sections.",
      category: "Resume Writing",
      href: "/how-to-write"
    },
    {
      title: "Resume Objective Statement Examples",
      description: "Master the art of writing attention-grabbing objectives.",
      category: "Resume Writing",
      href: "/how-to-write"
    },
    {
      title: "Essential Resume Skills: Examples for Any Job",
      description: "Discover which skills to include for your industry.",
      category: "Skills",
      href: "/how-to-write"
    },
    {
      title: "35+ Resume Summary Examples + Expert Tips",
      description: "See real examples of effective resume summaries.",
      category: "Resume Writing",
      href: "/how-to-write"
    }
  ];

  const support = [
    { icon: <Users className="h-5 w-5" />, title: "About Us", description: "Learn about our mission and team", href: "/about" },
    { icon: <FileText className="h-5 w-5" />, title: "Pricing", description: "View our plans and pricing", href: "/pricing" },
    { icon: <MessageSquare className="h-5 w-5" />, title: "Contact", description: "Get in touch with our team", href: "/contact" },
    { icon: <Star className="h-5 w-5" />, title: "Customer Reviews", description: "See what our users say", href: "/about" }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
                Career <span className="text-secondary">Resources</span>
              </h1>
              <p className="text-white/80 text-lg">
                Everything you need to build a successful career. AI tools, expert guides, and career advice.
              </p>
            </div>
          </div>
        </section>

        {/* AI Tools */}
        <section className="py-16 bg-card border-b border-border">
          <div className="container">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-8">
              AI-Powered Tools
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {aiTools.map((tool, index) => (
                <Link
                  key={index}
                  to={tool.href}
                  className="group p-6 rounded-2xl border border-border bg-background hover:shadow-xl hover:border-secondary/50 transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                    {tool.icon}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Career Guides */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary">
                Expert Guides & Articles
              </h2>
              <Button variant="outline" asChild>
                <Link to="/how-to-write">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {guides.map((guide, index) => (
                <Link
                  key={index}
                  to={guide.href}
                  className="group p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-secondary/50 transition-all"
                >
                  <span className="text-xs text-secondary font-medium">{guide.category}</span>
                  <h3 className="font-heading font-semibold text-primary mt-1 mb-2 group-hover:text-secondary transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{guide.description}</p>
                  <div className="flex items-center gap-1 text-secondary text-sm mt-4">
                    Read more <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Career Center Promo */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm mb-4">
                    <TrendingUp className="h-4 w-4 text-secondary" />
                    Career Center
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
                    Level Up Your Career
                  </h2>
                  <p className="text-white/80 mb-6">
                    Get resume tips, stay up on industry trends, and improve your interview skills with our comprehensive career resources.
                  </p>
                  <Button variant="coral" size="lg" asChild>
                    <Link to="/how-to-write">
                      Explore Career Center <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-center">
                    <div className="text-3xl font-heading font-bold text-secondary">500+</div>
                    <p className="text-sm text-white/70">Career Articles</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-center">
                    <div className="text-3xl font-heading font-bold text-secondary">50+</div>
                    <p className="text-sm text-white/70">Interview Guides</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-center">
                    <div className="text-3xl font-heading font-bold text-secondary">100+</div>
                    <p className="text-sm text-white/70">Resume Examples</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-center">
                    <div className="text-3xl font-heading font-bold text-secondary">25+</div>
                    <p className="text-sm text-white/70">Industry Guides</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Links */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-8">
              Support & Information
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {support.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-lg hover:border-secondary/50 transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-primary">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
