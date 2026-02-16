import { useState } from "react";
import { Check, Search, Star, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  templates,
  templateCategories,
  getTemplatesByCategory,
  type CVTemplate,
  type TemplateCategory,
} from "@/lib/cv-templates";

interface TemplateStepProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

const levelLabels: Record<string, string> = {
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior",
  executive: "Executive",
};

const TemplateStep = ({ selectedTemplate, onSelectTemplate }: TemplateStepProps) => {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = getTemplatesByCategory(activeCategory).filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q)) ||
      t.industries.some((ind) => ind.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Choose a Template</h2>
        <p className="text-sm text-muted-foreground">
          {templates.length} professional templates for every role, level, and industry
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, industry, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {templateCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-secondary text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`group relative overflow-hidden rounded-xl border-2 text-left transition-all ${
              selectedTemplate === template.id
                ? "border-secondary shadow-lg shadow-secondary/10"
                : "border-border hover:border-secondary/40 hover:shadow-md"
            }`}
          >
            {/* Featured badge */}
            {template.featured && (
              <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                <Star className="h-2.5 w-2.5 fill-white" /> Featured
              </div>
            )}

            {/* Selected check */}
            {selectedTemplate === template.id && (
              <div className="absolute right-3 top-3 z-10 rounded-full bg-secondary p-1 shadow-sm">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
            )}

            {/* Cover Image */}
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={template.coverImage}
                alt={`${template.name} template preview`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="text-sm font-semibold text-foreground">{template.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{template.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {template.level.slice(0, 2).map((lvl) => (
                  <span key={lvl} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {levelLabels[lvl]}
                  </span>
                ))}
                {template.industries.slice(0, 2).map((ind) => (
                  <span key={ind} className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border py-12 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">No templates match your search</p>
        </div>
      )}
    </div>
  );
};

export default TemplateStep;
