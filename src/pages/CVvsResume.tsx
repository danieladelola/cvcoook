import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, FileUser, ArrowRight, CheckCircle, XCircle } from "lucide-react";

const CVvsResume = () => {
  const differences = [
    {
      aspect: "Length",
      resume: "1-2 pages maximum",
      cv: "No page limit; can be 3+ pages"
    },
    {
      aspect: "Content Focus",
      resume: "Highlights relevant experience for specific job",
      cv: "Comprehensive record of entire career"
    },
    {
      aspect: "Education Section",
      resume: "Brief mention of degrees",
      cv: "Detailed academic history, research, publications"
    },
    {
      aspect: "Customization",
      resume: "Tailored for each job application",
      cv: "Generally static; updated with new achievements"
    },
    {
      aspect: "Common Use",
      resume: "Most jobs in USA, Canada",
      cv: "Academic, research, medical, international jobs"
    },
    {
      aspect: "Publications/Research",
      resume: "Rarely included unless directly relevant",
      cv: "Full list of publications, presentations, grants"
    }
  ];

  const whenToUse = {
    resume: [
      "Applying for jobs in the private sector (USA/Canada)",
      "Positions that don't require academic credentials",
      "When the job posting specifically asks for a resume",
      "Entry-level to mid-career positions",
      "Switching careers or industries"
    ],
    cv: [
      "Academic positions (professor, researcher)",
      "Medical field positions",
      "Scientific research positions",
      "International job applications (UK, Europe, Asia)",
      "Grant or fellowship applications",
      "When specifically requested by the employer"
    ]
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
                CV vs Resume: <span className="text-secondary">What's the Difference?</span>
              </h1>
              <p className="text-white/80 text-lg">
                Understanding when to use each document is crucial for your job search success.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Overview */}
        <section className="py-16 bg-card border-b border-border">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-8 rounded-2xl bg-background border border-border">
                <div className="h-12 w-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-4">Resume</h2>
                <p className="text-muted-foreground mb-4">
                  A concise 1-2 page document highlighting your most relevant skills and experience for a specific job. It's the standard for most jobs in the United States and Canada.
                </p>
                <Button variant="coral" asChild>
                  <Link to="/resume-builder">Build Your Resume</Link>
                </Button>
              </div>
              <div className="p-8 rounded-2xl bg-background border border-border">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <FileUser className="h-6 w-6" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-primary mb-4">CV (Curriculum Vitae)</h2>
                <p className="text-muted-foreground mb-4">
                  A comprehensive document detailing your entire academic and professional history. Common for academic, research, medical, and international positions.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/cv-builder">Build Your CV</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="font-heading text-3xl font-bold text-primary text-center mb-12">
              Key Differences
            </h2>
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-heading font-semibold text-primary">Aspect</th>
                    <th className="text-left py-4 px-4 font-heading font-semibold text-secondary">Resume</th>
                    <th className="text-left py-4 px-4 font-heading font-semibold text-primary">CV</th>
                  </tr>
                </thead>
                <tbody>
                  {differences.map((diff, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-4 px-4 font-medium text-primary">{diff.aspect}</td>
                      <td className="py-4 px-4 text-muted-foreground">{diff.resume}</td>
                      <td className="py-4 px-4 text-muted-foreground">{diff.cv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* When to Use */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="font-heading text-3xl font-bold text-primary text-center mb-12">
              When to Use Each
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-card p-8 rounded-2xl border border-border">
                <h3 className="font-heading text-xl font-semibold text-secondary mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Use a Resume When:
                </h3>
                <ul className="space-y-3">
                  {whenToUse.resume.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card p-8 rounded-2xl border border-border">
                <h3 className="font-heading text-xl font-semibold text-primary mb-6 flex items-center gap-2">
                  <FileUser className="h-5 w-5" /> Use a CV When:
                </h3>
                <ul className="space-y-3">
                  {whenToUse.cv.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
          <div className="container text-center">
            <h2 className="font-heading text-3xl font-bold text-white mb-4">
              Ready to Create Your Document?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Whether you need a resume or CV, we have the perfect builder for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="coral" size="lg" asChild>
                <Link to="/resume-builder">
                  Build Resume <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/cv-builder">
                  Build CV <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CVvsResume;
