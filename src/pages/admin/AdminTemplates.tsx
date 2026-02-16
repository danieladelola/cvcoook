import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Search, Eye, Star, Plus, Edit, Trash2, Download,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminTemplates = () => {
  const [category, setCategory] = useState("All");

  const { data: templateStats = [] } = useQuery({
    queryKey: ["admin-template-stats"],
    queryFn: async () => {
      const { data } = await supabase.from("user_cvs").select("template_id");
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((cv) => { counts[cv.template_id] = (counts[cv.template_id] || 0) + 1; });
      return Object.entries(counts).map(([id, uses]) => ({ id, uses })).sort((a, b) => b.uses - a.uses);
    },
  });

  const templates = [
    { id: "classic-professional", name: "Classic Professional", category: "Business", isPro: false },
    { id: "modern-sleek", name: "Modern Sleek", category: "Creative", isPro: true },
    { id: "creative-edge", name: "Creative Edge", category: "Design", isPro: true },
    { id: "minimal-clean", name: "Minimal Clean", category: "Simple", isPro: false },
    { id: "executive-suite", name: "Executive Suite", category: "Business", isPro: true },
    { id: "ats-optimized", name: "ATS Optimized", category: "Business", isPro: false },
  ];

  const categories = ["All", "Business", "Creative", "Design", "Simple"];

  const filtered = category === "All" ? templates : templates.filter((t) => t.category === category);

  const getUses = (id: string) => templateStats.find((s) => s.id === id)?.uses || 0;
  const totalUses = templateStats.reduce((sum, s) => sum + s.uses, 0);
  const proCount = templates.filter((t) => t.isPro).length;

  return (
    <AdminLayout title="Template Management">
      {/* Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search templates..." className="w-64 pl-10" />
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button key={cat} variant={category === cat ? "secondary" : "outline"} size="sm" onClick={() => setCategory(cat)}>{cat}</Button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-foreground">{templates.length}</p>
          <p className="text-sm text-muted-foreground">Total Templates</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-secondary">{proCount}</p>
          <p className="text-sm text-muted-foreground">Pro Templates</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-primary">{totalUses.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Uses</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-foreground">{templates.length - proCount}</p>
          <p className="text-sm text-muted-foreground">Free Templates</p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => (
          <div key={template.id} className="group rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="relative aspect-[4/5] bg-gradient-to-br from-primary/5 to-secondary/5 p-3">
              <div className="h-full rounded-lg border border-border bg-white p-2 shadow-sm">
                <div className="space-y-1.5">
                  <div className="h-2 w-12 rounded bg-muted" />
                  <div className="h-1.5 w-full rounded bg-muted/60" />
                  <div className="h-1.5 w-5/6 rounded bg-muted/60" />
                  <div className="h-1.5 w-4/6 rounded bg-muted/60" />
                </div>
              </div>
              {template.isPro && (
                <span className="absolute right-2 top-2 rounded bg-gradient-to-r from-secondary to-destructive px-2 py-0.5 text-xs font-medium text-white">PRO</span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="secondary" size="sm"><Eye className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{template.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{template.category}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Download className="h-3.5 w-3.5" />
                {getUses(template.id).toLocaleString()} uses
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminTemplates;
