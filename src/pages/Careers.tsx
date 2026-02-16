import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Clock, Heart, Zap, Users, Coffee, TrendingUp, ArrowRight, Globe } from "lucide-react";

const Careers = () => {
  const benefits = [
    { icon: <Heart className="h-6 w-6" />, title: "Health & Wellness", description: "Comprehensive medical, dental, and vision coverage for you and your family." },
    { icon: <Coffee className="h-6 w-6" />, title: "Flexible Work", description: "Work from anywhere with flexible hours and unlimited PTO." },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Growth", description: "Professional development budget and clear career progression paths." },
    { icon: <Zap className="h-6 w-6" />, title: "Equity", description: "Competitive salary plus equity so you share in our success." }
  ];

  const openPositions = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time"
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Machine Learning Engineer",
      department: "AI/ML",
      location: "Remote / New York",
      type: "Full-time"
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Content Marketing Manager",
      department: "Marketing",
      location: "San Francisco",
      type: "Full-time"
    },
    {
      title: "Technical Writer",
      department: "Engineering",
      location: "Remote",
      type: "Contract"
    }
  ];

  const values = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "User First",
      description: "Every decision starts with 'How does this help our users?'"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Move Fast",
      description: "We ship quickly, iterate based on feedback, and don't fear failure."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Think Global",
      description: "We serve job seekers worldwide and embrace diverse perspectives."
    }
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
                Join Us in Shaping the <span className="text-secondary">Future of Work</span>
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Help millions of people land their dream jobs. We're building the best career tools in the world, and we need exceptional people to do it.
              </p>
              <Button variant="coral" size="xl" asChild>
                <a href="#positions">
                  View Open Positions <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-card border-b border-border">
          <div className="container">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary text-center mb-12">
              Why Work With Us
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="p-6 rounded-xl bg-background border border-border">
                  <div className="h-12 w-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-heading font-semibold text-primary mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                Our Culture
              </h2>
              <p className="text-muted-foreground text-lg">
                We're a team of passionate individuals who believe in making a difference.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="text-center p-8 rounded-2xl bg-muted/30">
                  <div className="h-16 w-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-primary mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                Open Positions
              </h2>
              <p className="text-muted-foreground text-lg">
                Find your next role and help us build the future of career tools.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {openPositions.map((position, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-xl border border-border hover:shadow-lg hover:border-secondary/50 transition-all cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-primary">{position.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {position.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <Button variant="coral" size="sm">
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Don't See the Right Fit?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button size="xl" variant="coral" asChild>
              <Link to="/contact">
                Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
