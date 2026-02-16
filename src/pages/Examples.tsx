import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Download, Eye, ArrowRight, Star, Briefcase, GraduationCap, Award, Clock } from "lucide-react";

const Examples = () => {
  const { category } = useParams();

  const examples = [
    { id: "accountant", name: "Accountant", category: "Finance", downloads: 15420, rating: 4.9 },
    { id: "customer-service", name: "Customer Service Representative", category: "Service", downloads: 12350, rating: 4.8 },
    { id: "federal", name: "Federal Resume", category: "Government", downloads: 9870, rating: 4.7 },
    { id: "high-school", name: "High School Student", category: "Entry Level", downloads: 18200, rating: 4.9 },
    { id: "nurse", name: "Registered Nurse", category: "Healthcare", downloads: 22100, rating: 4.8 },
    { id: "sales", name: "Sales Representative", category: "Sales", downloads: 16430, rating: 4.6 },
    { id: "student", name: "College Student", category: "Entry Level", downloads: 24200, rating: 4.7 },
    { id: "teacher", name: "Teacher", category: "Education", downloads: 14300, rating: 4.8 },
    { id: "software-engineer", name: "Software Engineer", category: "Technology", downloads: 28700, rating: 4.9 },
    { id: "marketing-manager", name: "Marketing Manager", category: "Marketing", downloads: 11200, rating: 4.7 },
    { id: "project-manager", name: "Project Manager", category: "Management", downloads: 19800, rating: 4.8 },
    { id: "graphic-designer", name: "Graphic Designer", category: "Creative", downloads: 13400, rating: 4.6 }
  ];

  const filteredExamples = category 
    ? examples.filter(e => e.id === category)
    : examples;

  const showingSingle = category && filteredExamples.length === 1;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
                Resume <span className="text-secondary">Examples</span>
              </h1>
              <p className="text-white/80 text-lg">
                {showingSingle 
                  ? `${filteredExamples[0].name} Resume Example`
                  : "Browse real resume examples for various industries and experience levels to inspire your own."}
              </p>
            </div>
          </div>
        </section>

        {/* Examples Grid */}
        <section className="py-16 bg-background">
          <div className="container">
            {showingSingle ? (
              <div className="max-w-4xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Preview */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 border border-border">
                    <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Eye className="h-12 w-12 mx-auto mb-2" />
                        <p>Resume Preview</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-6">
                    <div>
                      <span className="text-sm text-secondary font-medium">{filteredExamples[0].category}</span>
                      <h2 className="font-heading text-3xl font-bold text-primary mt-1">
                        {filteredExamples[0].name} Resume
                      </h2>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-secondary text-secondary" />
                        {filteredExamples[0].rating} rating
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {(filteredExamples[0].downloads / 1000).toFixed(1)}k downloads
                      </span>
                    </div>

                    <p className="text-muted-foreground">
                      This {filteredExamples[0].name.toLowerCase()} resume example demonstrates how to effectively highlight relevant skills, experience, and achievements for your industry. Use it as inspiration or start with this template directly.
                    </p>

                    <div className="space-y-3">
                      <h3 className="font-heading font-semibold text-primary">Key Features:</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Briefcase className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                          Industry-specific keywords and phrases
                        </li>
                        <li className="flex items-start gap-2">
                          <GraduationCap className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                          Optimized sections for your field
                        </li>
                        <li className="flex items-start gap-2">
                          <Award className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                          Achievement-focused bullet points
                        </li>
                        <li className="flex items-start gap-2">
                          <Clock className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                          ATS-friendly formatting
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button variant="coral" size="lg" asChild>
                        <Link to="/resume-builder">
                          Use This Template <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="lg">
                        <Download className="mr-2 h-5 w-5" /> Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredExamples.map((example) => (
                  <Link
                    key={example.id}
                    to={`/examples/${example.id}`}
                    className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 relative">
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
                      </div>
                      <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="coral" size="sm">View Example</Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-secondary font-medium">{example.category}</span>
                      <h3 className="font-heading font-semibold text-primary mt-1">{example.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-secondary text-secondary" />
                          <span>{example.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Download className="h-4 w-4" />
                          <span>{(example.downloads / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">
              Ready to Create Your Own Resume?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Use these examples as inspiration and build your professional resume in minutes.
            </p>
            <Button variant="coral" size="lg" asChild>
              <Link to="/resume-builder">
                Start Building <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Examples;
