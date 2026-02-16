import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layout, Filter, Search, Star, Download, Eye, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Templates = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  const categories = [
    { id: "all", name: "All Templates" },
    { id: "modern", name: "Modern" },
    { id: "professional", name: "Professional" },
    { id: "creative", name: "Creative" },
    { id: "simple", name: "Simple" },
    { id: "ats", name: "ATS-Friendly" }
  ];

  const templates = [
    { id: 1, name: "Executive Pro", category: "professional", rating: 4.9, downloads: 15420, featured: true },
    { id: 2, name: "Modern Minimal", category: "modern", rating: 4.8, downloads: 12350, featured: true },
    { id: 3, name: "Creative Starter", category: "creative", rating: 4.7, downloads: 9870, featured: false },
    { id: 4, name: "Clean Classic", category: "simple", rating: 4.9, downloads: 18200, featured: true },
    { id: 5, name: "ATS Optimized", category: "ats", rating: 4.8, downloads: 22100, featured: true },
    { id: 6, name: "Bold Impact", category: "modern", rating: 4.6, downloads: 8430, featured: false },
    { id: 7, name: "Elegant Touch", category: "professional", rating: 4.7, downloads: 11200, featured: false },
    { id: 8, name: "Fresh Graduate", category: "simple", rating: 4.5, downloads: 14300, featured: false },
    { id: 9, name: "Tech Pro", category: "modern", rating: 4.8, downloads: 16700, featured: true },
    { id: 10, name: "Artistic Flow", category: "creative", rating: 4.6, downloads: 7650, featured: false },
    { id: 11, name: "Corporate Classic", category: "professional", rating: 4.9, downloads: 19800, featured: true },
    { id: 12, name: "Minimalist", category: "simple", rating: 4.7, downloads: 13400, featured: false }
  ];

  const filteredTemplates = activeCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
                Professional Resume <span className="text-secondary">Templates</span>
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Choose from 500+ professionally designed templates optimized to pass ATS systems and impress hiring managers.
              </p>
              <div className="flex items-center max-w-md mx-auto bg-white rounded-lg overflow-hidden">
                <Search className="h-5 w-5 text-muted-foreground ml-4" />
                <Input 
                  placeholder="Search templates..." 
                  className="border-0 focus-visible:ring-0"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-card border-b border-border sticky top-16 z-40">
          <div className="container">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? "bg-secondary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300">
                  {template.featured && (
                    <div className="absolute top-3 left-3 z-10 bg-secondary text-white text-xs font-medium px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                  <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 relative">
                    {/* Template Preview Placeholder */}
                    <div className="absolute inset-4 bg-white rounded-lg shadow-sm p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20" />
                        <div className="flex-1">
                          <div className="h-2 w-16 bg-primary/20 rounded mb-1" />
                          <div className="h-1.5 w-12 bg-muted rounded" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-1.5 w-full bg-muted rounded" />
                        <div className="h-1.5 w-4/5 bg-muted rounded" />
                        <div className="h-1.5 w-3/4 bg-muted rounded" />
                      </div>
                      <div className="mt-3 space-y-1.5">
                        <div className="h-1.5 w-12 bg-secondary/30 rounded" />
                        <div className="h-1.5 w-full bg-muted rounded" />
                        <div className="h-1.5 w-5/6 bg-muted rounded" />
                      </div>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button size="sm" variant="coral" asChild>
                        <Link to={`/resume-builder?template=${template.id}`}>
                          Use Template
                        </Link>
                      </Button>
                      <Button size="sm" variant="heroOutline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-primary">{template.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-secondary text-secondary" />
                        <span>{template.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Download className="h-4 w-4" />
                        <span>{(template.downloads / 1000).toFixed(1)}k</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">
              Ready to Create Your Resume?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Pick a template and start building your professional resume in minutes.
            </p>
            <Button variant="coral" size="lg" asChild>
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

export default Templates;
