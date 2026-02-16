import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import {
  Search,
  Star,
  Check,
  ChevronLeft,
  LayoutGrid,
  Settings,
  FileText,
  HelpCircle,
  Mail,
  Plus,
} from "lucide-react";
import {
  templates,
  templateCategories,
  getTemplatesByCategory,
  type TemplateCategory,
} from "@/lib/cv-templates";

const levelLabels: Record<string, string> = {
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior",
  executive: "Executive",
};

const DashboardTemplates = () => {
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

  const sidebarLinks = [
    { name: "My CVs", icon: FileText, href: "/dashboard" },
    { name: "Cover Letters", icon: Mail, href: "/dashboard/cover-letter" },
    { name: "Templates", icon: LayoutGrid, href: "/dashboard/templates" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    { name: "Help", icon: HelpCircle, href: "/help" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header variant="dashboard" />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-sidebar-border bg-sidebar p-6 lg:block">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Actions
              </h3>
              <Link to="/dashboard/create">
                <Button variant="coral" size="lg" className="w-full">
                  <Plus className="mr-2 h-5 w-5" />
                  Create New CV
                </Button>
              </Link>
            </div>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    link.href === "/dashboard/templates"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              Template Gallery
            </h1>
            <p className="mt-1 text-muted-foreground">
              Browse {templates.length} professional templates and start building
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
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

          {/* Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((template) => (
              <Link
                key={template.id}
                to={`/dashboard/create?template=${template.id}`}
                className="group relative overflow-hidden rounded-xl border-2 border-border bg-card transition-all hover:border-secondary/40 hover:shadow-lg"
              >
                {template.featured && (
                  <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-white">
                    <Star className="h-2.5 w-2.5 fill-white" /> Featured
                  </div>
                )}

                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={template.coverImage}
                    alt={`${template.name} template`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-semibold text-foreground">{template.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.level.slice(0, 2).map((lvl) => (
                      <span key={lvl} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {levelLabels[lvl]}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardTemplates;
