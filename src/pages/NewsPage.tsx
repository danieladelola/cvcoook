import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, TrendingUp, User } from "lucide-react";

const newsArticles: Record<string, { title: string; date: string; readTime: string; content: string[]; keyTakeaways: string[] }> = {
  "career-gaps": {
    title: "Nearly Half of Workers Report Career Gaps — Here's What That Means for Your Resume",
    date: "February 10, 2026",
    readTime: "5 min read",
    content: [
      "A recent study reveals that nearly 47% of professionals have experienced at least one significant career gap in their working lives. This finding is reshaping how employers and job seekers approach the topic of employment breaks.",
      "Career gaps can occur for many reasons: caregiving responsibilities, health issues, further education, travel, entrepreneurial ventures, or simply the effects of economic downturns and layoffs. The stigma once attached to these gaps is slowly diminishing.",
      "Leading HR professionals now recommend addressing career gaps proactively. Rather than trying to hide them, candidates should briefly explain the gap and focus on any skills or experiences gained during the time away — such as freelance work, volunteer activities, online courses, or personal development.",
      "For job seekers concerned about gaps on their resume, consider using a functional or combination resume format that emphasizes skills over chronological employment history. Our AI resume builder can help you create a format that presents your experience in the best possible light.",
      "The key takeaway: career gaps are far more common than many realize, and they don't have to be a barrier to landing your next role. What matters most is how you frame your experience and demonstrate your readiness to contribute.",
    ],
    keyTakeaways: [
      "47% of workers have experienced a career gap — you're not alone",
      "Employers are becoming more understanding of employment breaks",
      "Use your gap period to build skills through courses, volunteering, or freelancing",
      "Consider a functional resume format to highlight skills over chronology",
      "Always frame gaps positively in both your resume and interviews",
    ],
  },
  "worker-concerns": {
    title: "Workers on Edge: 80% Fear Wage Loss Amid Economic Uncertainty",
    date: "February 5, 2026",
    readTime: "6 min read",
    content: [
      "A comprehensive survey of over 10,000 workers across multiple industries has found that 80% express significant concern about potential wage stagnation or loss in the coming year. This anxiety is driven by inflation, AI-driven automation, and shifting market dynamics.",
      "The survey highlights a growing trend: workers are increasingly investing in upskilling and personal branding to protect their career prospects. Over 60% of respondents reported taking at least one online course or certification program in the past year.",
      "Industry experts suggest that the best defense against wage uncertainty is a strong, well-crafted resume that clearly communicates your evolving skill set. Workers who regularly update their resumes and LinkedIn profiles are 40% more likely to receive recruiter outreach.",
      "Sectors most affected by wage concerns include retail, hospitality, and administrative services, while technology, healthcare, and renewable energy continue to show strong growth and competitive salaries.",
      "Career coaches recommend a three-pronged approach to navigate uncertain times: continuously learn new skills relevant to your field, maintain an updated and ATS-optimized resume, and build a strong professional network through both online and in-person connections.",
    ],
    keyTakeaways: [
      "80% of workers are concerned about wage stagnation in 2026",
      "Upskilling is the top strategy workers are using to stay competitive",
      "Regularly updating your resume increases recruiter outreach by 40%",
      "Tech, healthcare, and green energy remain strong growth sectors",
      "Building a professional network is critical for career resilience",
    ],
  },
};

const NewsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? newsArticles[slug] : null;

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-primary mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">The news article you're looking for doesn't exist.</p>
            <Button variant="coral" asChild><Link to="/resources">Back to Resources</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-16">
          <div className="container max-w-4xl">
            <Link to="/resources" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Resources
            </Link>
            <span className="inline-flex items-center gap-1 bg-secondary/20 text-secondary text-xs font-medium px-3 py-1 rounded-full mb-4">
              <TrendingUp className="h-3 w-3" /> Career News
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1"><User className="h-4 w-4" /> CVCOOK Team</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {article.date}</span>
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
                <TrendingUp className="h-5 w-5 text-secondary" /> Key Takeaways
              </h3>
              <ul className="space-y-3">
                {article.keyTakeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-secondary shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-center">
              <h3 className="font-heading text-2xl font-bold text-white mb-3">Stay ahead in your career</h3>
              <p className="text-white/80 mb-6">Build a standout resume that sets you apart in today's competitive market.</p>
              <Button variant="coral" size="lg" asChild>
                <Link to="/resume-builder">Build My Resume <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NewsPage;
