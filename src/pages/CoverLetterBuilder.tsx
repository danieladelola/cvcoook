import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, Sparkles, Layout, PenTool, Target, ArrowRight, CheckCircle, MessageSquare, Zap, FileText } from "lucide-react";

const CoverLetterBuilder = () => {
  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Generated Content",
      description: "Let our AI craft compelling paragraphs based on your experience and the job you're applying for."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Job-Specific Targeting",
      description: "Automatically tailor your cover letter to match the job description and company culture."
    },
    {
      icon: <Layout className="h-6 w-6" />,
      title: "Professional Templates",
      description: "Choose from elegant templates that complement your resume and make a lasting impression."
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Tone Optimization",
      description: "Adjust the tone from formal to friendly to match the company's communication style."
    }
  ];

  const sections = [
    {
      title: "Opening Paragraph",
      description: "Hook the reader with a compelling introduction that highlights your enthusiasm and key qualifications.",
      tips: ["Mention the specific position", "Show genuine interest", "Include a hook"]
    },
    {
      title: "Body Paragraphs",
      description: "Demonstrate your value with specific examples of achievements and skills that match the job requirements.",
      tips: ["Use quantified achievements", "Address job requirements", "Tell your story"]
    },
    {
      title: "Closing Paragraph",
      description: "End with a strong call to action and express your eagerness to contribute to the company.",
      tips: ["Request an interview", "Thank the reader", "Provide contact info"]
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
                  <Mail className="h-4 w-4 text-secondary" />
                  AI Cover Letter Generator
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Write Cover Letters That <span className="text-secondary">Get Interviews</span>
                </h1>
                <p className="text-lg text-white/80 max-w-xl">
                  Create personalized, compelling cover letters in minutes. Our AI helps you craft the perfect message that complements your resume and lands you interviews.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="coral" size="xl" asChild>
                    <Link to="/register">
                      Build My Cover Letter <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="heroOutline" size="xl" asChild>
                    <Link to="/cover-letter/examples">See Examples</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-coral-dark/20 rounded-3xl blur-3xl" />
                  <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                    <div className="space-y-4">
                      <div className="text-right text-sm text-muted-foreground">
                        <p>January 15, 2024</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Dear Hiring Manager,</p>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 w-full bg-muted rounded" />
                        <div className="h-3 w-11/12 bg-muted rounded" />
                        <div className="h-3 w-4/5 bg-muted rounded" />
                      </div>
                      <div className="space-y-3 pt-2">
                        <div className="h-3 w-full bg-muted rounded" />
                        <div className="h-3 w-10/12 bg-muted rounded" />
                        <div className="h-3 w-full bg-muted rounded" />
                        <div className="h-3 w-3/4 bg-muted rounded" />
                      </div>
                      <div className="pt-4 space-y-1">
                        <p className="text-sm text-muted-foreground">Best regards,</p>
                        <p className="text-sm font-medium text-primary">Your Name</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Cover Letters Matter */}
        <section className="py-20 bg-card">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
                  Why You Need a Great Cover Letter
                </h2>
                <p className="text-muted-foreground mb-6">
                  A well-crafted cover letter can be the difference between getting an interview and being overlooked. It's your chance to:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Show personality that doesn't come through on a resume</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Explain career gaps, transitions, or unique situations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Demonstrate genuine interest in the specific company</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Highlight the most relevant qualifications for the role</span>
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/30">
                  <div className="text-4xl font-heading font-bold text-secondary mb-2">83%</div>
                  <p className="text-sm text-muted-foreground">of hiring managers read cover letters</p>
                </div>
                <div className="bg-primary/10 p-6 rounded-2xl border border-primary/30">
                  <div className="text-4xl font-heading font-bold text-primary mb-2">2x</div>
                  <p className="text-sm text-muted-foreground">more likely to get interviewed with a cover letter</p>
                </div>
                <div className="bg-primary/10 p-6 rounded-2xl border border-primary/30">
                  <div className="text-4xl font-heading font-bold text-primary mb-2">45%</div>
                  <p className="text-sm text-muted-foreground">of jobs require a cover letter</p>
                </div>
                <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/30">
                  <div className="text-4xl font-heading font-bold text-secondary mb-2">30s</div>
                  <p className="text-sm text-muted-foreground">average time to review a cover letter</p>
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
                Powerful Features to Craft the Perfect Letter
              </h2>
              <p className="text-muted-foreground text-lg">
                Our AI-powered cover letter builder makes it easy to create compelling, personalized cover letters.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Cover Letter Structure */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                The Perfect Cover Letter Structure
              </h2>
              <p className="text-muted-foreground text-lg">
                Our builder guides you through each section to create a compelling narrative.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {sections.map((section, index) => (
                <div key={index} className="bg-card p-8 rounded-2xl border border-border">
                  <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center font-heading font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-primary mb-3">{section.title}</h3>
                  <p className="text-muted-foreground mb-4">{section.description}</p>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-secondary" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-secondary to-coral-dark">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Write Your Winning Cover Letter?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Start creating a personalized cover letter that gets you noticed by hiring managers.
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

export default CoverLetterBuilder;
