import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";
import { useState } from "react";

const TemplatesSection = () => {
  const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);
  
  const templates = [
    {
      id: 1,
      name: "Professional",
      category: "Business",
      color: "from-blue-500 to-indigo-600",
      popular: true,
    },
    {
      id: 2,
      name: "Modern",
      category: "Creative",
      color: "from-secondary to-coral-dark",
      popular: false,
    },
    {
      id: 3,
      name: "Minimal",
      category: "All Industries",
      color: "from-gray-600 to-gray-800",
      popular: true,
    },
    {
      id: 4,
      name: "Executive",
      category: "Leadership",
      color: "from-primary to-navy-light",
      popular: false,
    },
    {
      id: 5,
      name: "Creative",
      category: "Design",
      color: "from-purple-500 to-pink-500",
      popular: false,
    },
    {
      id: 6,
      name: "Technical",
      category: "IT & Engineering",
      color: "from-accent to-teal-600",
      popular: true,
    },
  ];
  
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Professional Resume Templates
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Choose from our collection of ATS-friendly, expertly designed templates.
            </p>
          </div>
          <Link to="/templates">
            <Button variant="outline" size="lg" className="group">
              View All Templates
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        {/* Templates Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="template-card group cursor-pointer"
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              {/* Template Preview */}
              <div className={`relative aspect-[3/4] bg-gradient-to-br ${template.color} p-6`}>
                {/* Popular badge */}
                {template.popular && (
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary">
                    Popular
                  </div>
                )}
                
                {/* Mock CV content */}
                <div className="h-full rounded-lg bg-white/95 p-4 shadow-lg">
                  {/* Header */}
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                    <div className="space-y-1">
                      <div className="h-2.5 w-20 rounded bg-gray-300" />
                      <div className="h-2 w-16 rounded bg-gray-200" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="mt-4 space-y-4">
                    <div className="space-y-1.5">
                      <div className="h-2 w-16 rounded bg-gray-300" />
                      <div className="h-1.5 w-full rounded bg-gray-100" />
                      <div className="h-1.5 w-5/6 rounded bg-gray-100" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-20 rounded bg-gray-300" />
                      <div className="h-1.5 w-full rounded bg-gray-100" />
                      <div className="h-1.5 w-4/6 rounded bg-gray-100" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-12 rounded bg-gray-300" />
                      <div className="flex flex-wrap gap-1.5">
                        <div className="h-4 w-10 rounded bg-gray-100" />
                        <div className="h-4 w-12 rounded bg-gray-100" />
                        <div className="h-4 w-8 rounded bg-gray-100" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
                    hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex gap-3">
                    <Button variant="coral" size="sm">
                      Use Template
                    </Button>
                    <Button variant="heroOutline" size="sm">
                      <Eye className="mr-1 h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Template Info */}
              <div className="p-4">
                <h3 className="font-heading font-semibold text-foreground">
                  {template.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {template.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplatesSection;
