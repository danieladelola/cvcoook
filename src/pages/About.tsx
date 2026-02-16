import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Target, Heart, Award, ArrowRight, Globe, Briefcase, GraduationCap, TrendingUp } from "lucide-react";

const About = () => {
  const stats = [
    { value: "10M+", label: "Resumes Created", icon: <Briefcase className="h-6 w-6" /> },
    { value: "190+", label: "Countries Served", icon: <Globe className="h-6 w-6" /> },
    { value: "95%", label: "Success Rate", icon: <TrendingUp className="h-6 w-6" /> },
    { value: "500+", label: "Templates", icon: <GraduationCap className="h-6 w-6" /> }
  ];

  const values = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "User-Centered Design",
      description: "Every feature we build starts with our users' needs. We obsess over making the resume-building experience as smooth and intuitive as possible."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Results-Driven",
      description: "We measure our success by your success. Our templates and tools are continuously optimized based on real hiring data and user outcomes."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Accessible to All",
      description: "We believe everyone deserves access to professional career tools. That's why we offer a robust free plan and affordable premium options."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence in Quality",
      description: "From our templates to our AI suggestions, we maintain the highest standards. Every detail matters when it comes to your career."
    }
  ];

  const team = [
    { name: "Sarah Chen", role: "CEO & Co-Founder", image: null },
    { name: "Michael Rodriguez", role: "CTO & Co-Founder", image: null },
    { name: "Emily Watson", role: "Head of Design", image: null },
    { name: "David Kim", role: "Head of AI", image: null }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-20 lg:py-32">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Empowering Careers, <span className="text-secondary">One Resume at a Time</span>
              </h1>
              <p className="text-lg text-white/80 mb-8">
                We're on a mission to help millions of job seekers create professional resumes that open doors to new opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-card border-b border-border">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="h-12 w-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-4">
                    {stat.icon}
                  </div>
                  <div className="font-heading text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    CVBuilder started in 2018 with a simple observation: creating a professional resume shouldn't be complicated or expensive. Too many talented people were missing out on opportunities because they couldn't present themselves effectively on paper.
                  </p>
                  <p>
                    Our founders, Sarah and Michael, experienced this firsthand during their job searches. They saw friends and family struggle with outdated resume formats, confusing software, and expensive career services.
                  </p>
                  <p>
                    So they built CVBuilder – a platform that combines beautiful design, AI-powered writing assistance, and ATS optimization to give everyone access to professional-quality resumes. Today, we've helped over 10 million job seekers across 190+ countries land their dream jobs.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-coral-dark/20 rounded-3xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white">
                  <blockquote className="text-lg italic mb-4">
                    "We believe that your resume should never be the reason you miss out on an opportunity. Everyone deserves the chance to present their best self to potential employers."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-secondary/20" />
                    <div>
                      <div className="font-semibold">Sarah Chen</div>
                      <div className="text-sm text-white/70">CEO & Co-Founder</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground text-lg">
                These core principles guide everything we do at CVBuilder.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="bg-card p-8 rounded-2xl border border-border">
                  <div className="h-14 w-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-primary mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                Meet Our Team
              </h2>
              <p className="text-muted-foreground text-lg">
                The passionate people behind CVBuilder who are committed to your career success.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-primary-dark mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-primary">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-secondary to-coral-dark">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Join Millions of Successful Job Seekers
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Start building your professional resume today and take the first step toward your dream career.
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

export default About;
