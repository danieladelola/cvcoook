import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileUser, Sparkles, Layout, Download, CheckCircle, Star, GraduationCap, Briefcase, Award, ArrowRight, Globe, BookOpen } from "lucide-react";

const CVBuilder = () => {
  const features = [
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Academic Excellence",
      description: "Highlight your academic achievements, research, and publications with dedicated sections."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "International Standards",
      description: "Create CVs that meet international standards for academic and professional applications."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Comprehensive Sections",
      description: "Include detailed sections for publications, conferences, grants, and professional memberships."
    },
    {
      icon: <Layout className="h-6 w-6" />,
      title: "Flexible Layouts",
      description: "Choose from various layouts designed for different industries and career stages."
    }
  ];

  const cvTypes = [
    {
      title: "Academic CV",
      description: "Perfect for researchers, professors, and academic positions",
      icon: <GraduationCap className="h-8 w-8" />
    },
    {
      title: "Professional CV",
      description: "Ideal for senior roles and international job applications",
      icon: <Briefcase className="h-8 w-8" />
    },
    {
      title: "Medical CV",
      description: "Specialized format for healthcare professionals",
      icon: <Award className="h-8 w-8" />
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
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm mb-8">
                <FileUser className="h-4 w-4 text-secondary" />
                Professional CV Builder
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Create an Impressive <span className="text-secondary">CV</span> That Stands Out
              </h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                Build a comprehensive curriculum vitae that showcases your complete professional and academic journey. Perfect for academic, medical, and senior professional positions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="coral" size="xl" asChild>
                  <Link to="/register">
                    Build My CV <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/cv-templates">View CV Templates</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CV vs Resume */}
        <section className="py-20 bg-card">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
                  CV vs Resume: What's the Difference?
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    A <strong className="text-primary">Curriculum Vitae (CV)</strong> is a comprehensive document that details your entire academic and professional history. Unlike a resume, a CV can be multiple pages and includes:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      Complete educational background with thesis topics
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      Publications, research papers, and presentations
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      Grants, fellowships, and awards
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      Professional memberships and affiliations
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      Teaching experience and courses taught
                    </li>
                  </ul>
                </div>
                <Button variant="coral" className="mt-6" asChild>
                  <Link to="/cv-vs-resume">Learn More About CVs vs Resumes</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-6 rounded-2xl border border-border">
                  <h3 className="font-heading font-semibold text-primary mb-2">Resume</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 1-2 pages</li>
                    <li>• Tailored to job</li>
                    <li>• Key highlights only</li>
                    <li>• Most jobs in USA</li>
                  </ul>
                </div>
                <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/30">
                  <h3 className="font-heading font-semibold text-secondary mb-2">CV</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 2+ pages</li>
                    <li>• Complete history</li>
                    <li>• All achievements</li>
                    <li>• Academic/International</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CV Types */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                Choose the Right CV Format
              </h2>
              <p className="text-muted-foreground text-lg">
                Different careers require different CV formats. Find the perfect one for your field.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {cvTypes.map((type, index) => (
                <div key={index} className="group p-8 rounded-2xl border border-border bg-card hover:shadow-xl hover:border-secondary/50 transition-all duration-300 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                    {type.icon}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-primary mb-3">{type.title}</h3>
                  <p className="text-muted-foreground">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                Powerful Features for Your CV
              </h2>
              <p className="text-muted-foreground text-lg">
                Our CV builder includes everything you need to create a comprehensive curriculum vitae.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="p-6 rounded-2xl bg-card border border-border">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
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
        <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Start Building Your Professional CV Today
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of professionals who trust our CV builder to advance their careers.
            </p>
            <Button size="xl" variant="coral" asChild>
              <Link to="/register">
                Create My CV Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CVBuilder;
