import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle, ArrowRight, FileText, PenTool, Target, Sparkles, Users, Award } from "lucide-react";

const HowToWrite = () => {
  const sections = [
    {
      title: "1. Choose the Right Format",
      content: "Start by selecting a resume format that best showcases your experience. Chronological is best for steady career progression, functional for career changers, and combination for experienced professionals.",
      tips: ["Chronological: Lists experience from most recent to oldest", "Functional: Focuses on skills rather than timeline", "Combination: Blends both approaches"]
    },
    {
      title: "2. Write a Compelling Summary",
      content: "Your resume summary is your elevator pitch. In 2-3 sentences, highlight your most relevant experience, key skills, and what you bring to the table. Make every word count.",
      tips: ["Lead with your years of experience", "Include your specialization or industry", "Mention 1-2 key achievements"]
    },
    {
      title: "3. Highlight Your Experience",
      content: "Your work experience section should tell the story of your career through achievements, not just responsibilities. Use action verbs and quantify results whenever possible.",
      tips: ["Start bullets with action verbs (Led, Developed, Increased)", "Include numbers and percentages", "Focus on impact, not just duties"]
    },
    {
      title: "4. Showcase Relevant Skills",
      content: "Include a mix of hard skills (technical abilities) and soft skills (interpersonal abilities). Tailor your skills section to match the job description.",
      tips: ["List technical skills relevant to the role", "Include industry-specific keywords", "Don't forget soft skills like leadership"]
    },
    {
      title: "5. Include Education & Certifications",
      content: "List your educational background, relevant certifications, and any continuing education. Recent graduates should place education near the top.",
      tips: ["Include degree, school, and graduation year", "List relevant certifications", "Add coursework if relevant to the job"]
    },
    {
      title: "6. Optimize for ATS",
      content: "Most companies use Applicant Tracking Systems to filter resumes. Use keywords from the job description and stick to clean, simple formatting.",
      tips: ["Use standard section headings", "Include keywords from the job posting", "Avoid graphics and complex tables"]
    }
  ];

  const mistakes = [
    "Using a generic resume for every job application",
    "Including irrelevant work experience or skills",
    "Using passive language instead of action verbs",
    "Forgetting to proofread for typos and errors",
    "Making the resume too long (keep it to 1-2 pages)",
    "Including personal information like age or marital status"
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm mb-8">
                <BookOpen className="h-4 w-4 text-secondary" />
                Complete Guide
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                How to Write a <span className="text-secondary">Winning Resume</span>
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Follow our step-by-step guide to create a resume that gets noticed by hiring managers and passes ATS filters.
              </p>
              <Button variant="coral" size="xl" asChild>
                <Link to="/resume-builder">
                  Start Building Your Resume <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 bg-card border-b border-border">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-heading font-bold text-secondary">6 sec</div>
                <p className="text-sm text-muted-foreground">Average resume scan time</p>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-secondary">75%</div>
                <p className="text-sm text-muted-foreground">Resumes rejected by ATS</p>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-secondary">1-2</div>
                <p className="text-sm text-muted-foreground">Ideal page length</p>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-secondary">40%</div>
                <p className="text-sm text-muted-foreground">Better response with keywords</p>
              </div>
            </div>
          </div>
        </section>

        {/* Step by Step */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {sections.map((section, index) => (
                <div key={index} className="mb-12 last:mb-0">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center font-heading font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-heading text-2xl font-bold text-primary mb-4">{section.title}</h2>
                      <p className="text-muted-foreground mb-4">{section.content}</p>
                      <div className="bg-muted/30 rounded-xl p-6">
                        <h4 className="font-heading font-semibold text-primary mb-3">Pro Tips:</h4>
                        <ul className="space-y-2">
                          {section.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2 text-muted-foreground">
                              <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-3xl font-bold text-primary text-center mb-12">
                Common Resume Mistakes to Avoid
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {mistakes.map((mistake, index) => (
                  <div key={index} className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border">
                    <div className="h-6 w-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                      ✕
                    </div>
                    <span className="text-muted-foreground">{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-secondary to-coral-dark">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Build Your Resume?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Put these tips into practice with our easy-to-use resume builder. Create a professional resume in minutes.
            </p>
            <Button size="xl" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/resume-builder">
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

export default HowToWrite;
