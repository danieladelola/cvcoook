import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Clock, User } from "lucide-react";

const articles: Record<string, { title: string; category: string; readTime: string; content: string[]; tips: string[] }> = {
  "work-experience": {
    title: "Resume Work Experience Examples & Format",
    category: "Resume Writing",
    readTime: "8 min read",
    content: [
      "Your work experience section is the most critical part of your resume. It tells hiring managers what you've done, how well you've done it, and what value you can bring to their organization.",
      "The best work experience sections use a reverse-chronological format, starting with your most recent position. Each entry should include your job title, company name, location, and dates of employment.",
      "Use bullet points to describe your responsibilities and achievements. Start each bullet with a strong action verb and quantify your results whenever possible. For example, instead of 'Managed a team,' write 'Led a cross-functional team of 12 members, increasing project delivery speed by 35%.'",
      "Tailor your work experience to the job you're applying for. Review the job description carefully and mirror key phrases and skills. This not only makes your resume more relevant but also helps it pass Applicant Tracking Systems (ATS).",
      "If you have gaps in your employment history, consider using a functional or combination resume format. You can also address gaps briefly in your cover letter without drawing too much attention to them.",
    ],
    tips: [
      "Use action verbs like 'achieved,' 'implemented,' 'streamlined,' and 'spearheaded'",
      "Quantify achievements with numbers, percentages, and dollar amounts",
      "Focus on accomplishments, not just duties",
      "Keep descriptions concise — 3-5 bullet points per role",
      "Use the STAR method (Situation, Task, Action, Result) for impact",
    ],
  },
  "objective": {
    title: "Resume Objective Statement Examples",
    category: "Resume Writing",
    readTime: "6 min read",
    content: [
      "A resume objective statement is a brief introduction at the top of your resume that highlights your career goals and what you bring to the table. It's particularly useful for entry-level candidates, career changers, or those re-entering the workforce.",
      "Unlike a resume summary (which focuses on experience), an objective focuses on your aspirations and how they align with the employer's needs. A strong objective is specific, concise, and tailored to the role.",
      "For example: 'Detail-oriented marketing graduate seeking an entry-level digital marketing role at XYZ Corp where I can leverage my social media management skills and data analytics certification to drive brand awareness.'",
      "Avoid generic statements like 'Seeking a challenging position.' Instead, name the company, the role, and your key qualifications. This shows you've researched the position and are genuinely interested.",
      "Consider whether a summary or objective is more appropriate for your situation. If you have significant experience, a professional summary may serve you better.",
    ],
    tips: [
      "Keep it to 1-2 sentences maximum",
      "Mention the specific company and role by name",
      "Highlight 1-2 relevant skills or qualifications",
      "Focus on what you offer the employer, not just what you want",
      "Avoid clichés like 'hard-working' or 'team player'",
    ],
  },
  "skills": {
    title: "Essential Resume Skills: Examples for Any Job",
    category: "Skills",
    readTime: "7 min read",
    content: [
      "The skills section of your resume is your opportunity to showcase both hard and soft skills that make you the ideal candidate. Employers use this section to quickly assess whether you have the qualifications they need.",
      "Hard skills are technical abilities specific to your field — such as programming languages, data analysis, project management tools, or certifications. Soft skills are interpersonal qualities like communication, leadership, problem-solving, and adaptability.",
      "The key to an effective skills section is relevance. Study the job description and identify the skills the employer values most. Place these prominently in your resume, both in the dedicated skills section and woven into your work experience descriptions.",
      "Consider organizing your skills into categories for clarity. For example, a software developer might group skills under 'Programming Languages,' 'Frameworks,' and 'Tools & Platforms.'",
      "Don't list skills you can't back up. If an interviewer asks you to demonstrate a skill you've listed, you should be able to do so confidently.",
    ],
    tips: [
      "Match skills to the job description keywords for ATS optimization",
      "Balance hard skills and soft skills",
      "Group related skills into categories",
      "Include proficiency levels for languages or tools if relevant",
      "Update your skills section for every application",
    ],
  },
  "summary": {
    title: "35+ Resume Summary Examples + Expert Tips",
    category: "Resume Writing",
    readTime: "10 min read",
    content: [
      "A resume summary is a powerful 2-4 sentence overview at the top of your resume that encapsulates your professional experience, key skills, and career highlights. It replaces the outdated objective statement for experienced professionals.",
      "An effective summary acts as your elevator pitch. It should immediately communicate your value proposition and entice the reader to continue reviewing your resume.",
      "Structure your summary with three elements: your professional identity (years of experience + field), your key strengths or specializations, and a notable achievement or career highlight.",
      "Example: 'Results-driven marketing manager with 8+ years of experience in B2B SaaS. Expert in demand generation, content strategy, and marketing automation. Increased qualified leads by 150% and reduced cost-per-acquisition by 40% at previous role.'",
      "Customize your summary for each application. While the core of your experience stays the same, adjust the emphasis and keywords to match what each employer is looking for.",
    ],
    tips: [
      "Lead with your strongest qualification or achievement",
      "Include years of experience and your area of expertise",
      "Add 1-2 quantified accomplishments",
      "Use industry-specific keywords from the job posting",
      "Keep it between 2-4 sentences — no more",
    ],
  },
};

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? articles[slug] : null;

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-primary mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Button variant="coral" asChild><Link to="/resources">Back to Resources</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const articleKeys = Object.keys(articles);
  const currentIndex = slug ? articleKeys.indexOf(slug) : -1;
  const nextSlug = currentIndex < articleKeys.length - 1 ? articleKeys[currentIndex + 1] : null;
  const prevSlug = currentIndex > 0 ? articleKeys[currentIndex - 1] : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-16">
          <div className="container max-w-4xl">
            <Link to="/resources" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Resources
            </Link>
            <span className="inline-block bg-secondary/20 text-secondary text-xs font-medium px-3 py-1 rounded-full mb-4">
              {article.category}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1"><User className="h-4 w-4" /> CVCOOK Team</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {article.readTime}</span>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none">
              {article.content.map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-6">{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-muted/50 border border-border">
              <h3 className="font-heading text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-secondary" /> Key Tips
              </h3>
              <ul className="space-y-3">
                {article.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-secondary shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex items-center justify-between">
              {prevSlug ? (
                <Button variant="outline" asChild>
                  <Link to={`/articles/${prevSlug}`}><ArrowLeft className="mr-2 h-4 w-4" /> Previous Article</Link>
                </Button>
              ) : <div />}
              {nextSlug ? (
                <Button variant="outline" asChild>
                  <Link to={`/articles/${nextSlug}`}>Next Article <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              ) : <div />}
            </div>

            <div className="mt-12 bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-center">
              <h3 className="font-heading text-2xl font-bold text-white mb-3">Ready to build your resume?</h3>
              <p className="text-white/80 mb-6">Put these tips into practice with our AI-powered resume builder.</p>
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

export default ArticlePage;
