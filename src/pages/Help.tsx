import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Search,
  FileText,
  CreditCard,
  Settings,
  Download,
  HelpCircle,
  MessageSquare,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const Help = () => {
  const categories = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Getting Started",
      description: "Learn how to create your first CV or resume",
      articles: ["How to create a CV", "Choosing the right template", "Uploading an existing CV"],
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Account & Settings",
      description: "Manage your account, profile, and preferences",
      articles: ["Reset your password", "Update profile info", "Delete your account"],
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Billing & Plans",
      description: "Questions about pricing, payments, and subscriptions",
      articles: ["Available plans", "Payment methods", "Cancel subscription"],
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Downloads & Export",
      description: "Learn about exporting and sharing your documents",
      articles: ["Download as PDF", "Share via link", "Print your CV"],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary py-16">
          <div className="container max-w-3xl text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-secondary mb-4" />
            <h1 className="font-heading text-4xl font-bold text-white mb-4">How can we help?</h1>
            <p className="text-white/80 mb-8">Search our knowledge base or browse categories below</p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles..."
                className="h-12 pl-12 bg-white text-foreground"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-background">
          <div className="container max-w-5xl">
            <div className="grid gap-6 md:grid-cols-2">
              {categories.map((cat, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{cat.title}</h3>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {cat.articles.map((article, j) => (
                      <li key={j}>
                        <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                          <span className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            {article}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container text-center max-w-2xl">
            <MessageSquare className="mx-auto h-10 w-10 text-secondary mb-4" />
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Still need help?</h2>
            <p className="text-muted-foreground mb-6">Our support team is here to assist you</p>
            <Button variant="coral" size="lg" asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
