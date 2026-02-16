import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText, Plus, Edit, Download, Trash2, LayoutGrid, Settings, HelpCircle,
  Calendar, Eye, Mail, Loader2, Crown, Clock, Sparkles, ArrowRight, Zap, CheckCircle2,
  Share2, ExternalLink, QrCode,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import CVShareDialog from "@/components/dashboard/CVShareDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/hooks/use-subscription";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { planName, isPro, isPremium, isFreePlan, daysRemaining, subscription } = useSubscription();
  const [shareCV, setShareCV] = useState<{ id: string; title: string } | null>(null);

  const { data: userCVs = [], isLoading } = useQuery({
    queryKey: ["user-cvs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_cvs")
        .select("*")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: coverLetters = [] } = useQuery({
    queryKey: ["user-cover-letters", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_cover_letters")
        .select("id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const stats = {
    totalCVs: userCVs.length,
    totalCoverLetters: coverLetters.length,
    totalViews: userCVs.reduce((acc, cv) => acc + (cv.views || 0), 0),
    totalDownloads: userCVs.reduce((acc, cv) => acc + (cv.downloads || 0), 0),
  };

  const handleDelete = async (cvId: string) => {
    const { error } = await supabase.from("user_cvs").delete().eq("id", cvId);
    if (error) {
      toast({ title: "Error", description: "Failed to delete CV", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "CV has been removed." });
      queryClient.invalidateQueries({ queryKey: ["user-cvs"] });
    }
  };

  const handleTogglePublic = async (cvId: string, isPublic: boolean) => {
    const { error } = await supabase.from("user_cvs").update({ is_public: !isPublic }).eq("id", cvId);
    if (error) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    } else {
      if (!isPublic) {
        const url = `https://cvcook.vura.pro/cv/${cvId}`;
        await navigator.clipboard.writeText(url);
        toast({ title: "Public link copied!", description: url });
      } else {
        toast({ title: "CV is now private" });
      }
      queryClient.invalidateQueries({ queryKey: ["user-cvs"] });
    }
  };

  const sidebarLinks = [
    { name: "My CVs", icon: FileText, href: "/dashboard" },
    { name: "Cover Letters", icon: Mail, href: "/dashboard/cover-letter" },
    { name: "Templates", icon: LayoutGrid, href: "/dashboard/templates" },
    { name: "Settings", icon: Settings, href: "/dashboard/settings" },
    { name: "Help", icon: HelpCircle, href: "/help" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header variant="dashboard" />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-[260px] shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
          <div className="flex flex-1 flex-col gap-6 p-5">
            {/* Create Button */}
            <div className="space-y-2">
              <Link to="/dashboard/create">
                <Button variant="coral" size="lg" className="w-full gap-2 text-sm">
                  <Plus className="h-4 w-4" /> Create New CV
                </Button>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="space-y-0.5">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Menu
              </p>
              {sidebarLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <link.icon className={`h-[18px] w-[18px] ${isActive(link.href) ? "text-primary" : ""}`} />
                  {link.name}
                </Link>
              ))}
            </nav>

            {isFreePlan ? (
              <div className="mt-auto rounded-xl border border-secondary/20 bg-gradient-to-br from-secondary/5 via-secondary/10 to-accent/5 p-4">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-secondary" />
                  <h4 className="font-heading text-sm font-semibold text-foreground">Upgrade to Pro</h4>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Unlock all templates and premium AI features.
                </p>
                <Link to="/pricing">
                  <Button variant="secondary" size="sm" className="mt-3 w-full text-xs">
                    View Plans
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="mt-auto rounded-xl border border-secondary/20 bg-gradient-to-br from-secondary/5 via-secondary/10 to-accent/5 p-4">
                <div className="flex items-center gap-2">
                  {isPremium ? <Crown className="h-4 w-4 text-secondary" /> : <Zap className="h-4 w-4 text-secondary" />}
                  <h4 className="font-heading text-sm font-semibold text-foreground">{planName} Plan</h4>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-secondary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Active</span>
                  {daysRemaining > 0 && (
                    <span className="text-muted-foreground ml-1">· {daysRemaining} days left</span>
                  )}
                </div>
                {!isPremium && (
                  <Link to="/pricing">
                    <Button variant="ghost" size="sm" className="mt-2 w-full text-xs text-secondary hover:text-secondary">
                      Upgrade to Premium
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8 md:px-8 lg:py-10">
            {/* Welcome */}
            <div className="mb-10">
              <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}! 👋
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Manage your resumes and create new ones from your dashboard.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total CVs", value: stats.totalCVs, icon: FileText, color: "bg-primary/10 text-primary" },
                { label: "Cover Letters", value: stats.totalCoverLetters, icon: Mail, color: "bg-secondary/10 text-secondary" },
                { label: "Total Views", value: stats.totalViews, icon: Eye, color: "bg-accent/10 text-accent" },
                { label: "Downloads", value: stats.totalDownloads, icon: Download, color: "bg-primary/10 text-primary" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions (mobile) */}
            <div className="mb-6 flex gap-3 lg:hidden">
              <MobileSidebar />
              <Link to="/dashboard/create" className="flex-1">
                <Button variant="coral" className="w-full gap-2"><Plus className="h-4 w-4" /> New CV</Button>
              </Link>
              <Link to="/dashboard/cover-letter" className="flex-1">
                <Button variant="outline" className="w-full gap-2"><Mail className="h-4 w-4" /> Cover Letter</Button>
              </Link>
            </div>

            {/* My Resumes */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-foreground">My Resumes</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">Your saved CVs and resumes</p>
                </div>
              </div>

              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-4">
                      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                      <Skeleton className="mt-4 h-4 w-3/4" />
                      <Skeleton className="mt-2 h-3 w-1/2" />
                      <div className="mt-4 flex gap-2">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 flex-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {/* Create Card */}
                  <Link
                    to="/dashboard/create"
                    className="group flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center transition-all hover:border-secondary hover:bg-card hover:shadow-md"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 transition-transform group-hover:scale-110">
                      <Plus className="h-7 w-7 text-secondary" />
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold text-foreground">Create New Resume</p>
                      <p className="mt-1 text-xs text-muted-foreground">Start from scratch or choose a template</p>
                    </div>
                  </Link>

                  {/* CV Cards */}
                  {userCVs.map((cv) => (
                    <div key={cv.id} className="group rounded-xl border border-border bg-card transition-all hover:shadow-lg">
                      <div className="aspect-[4/3] overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/5 to-secondary/5 p-5">
                        <div className="h-full rounded-lg border border-border/60 bg-white p-4 shadow-sm">
                          <div className="space-y-2.5">
                            <div className="h-3.5 w-24 rounded bg-primary/20" />
                            <div className="h-2 w-full rounded bg-muted/70" />
                            <div className="h-2 w-5/6 rounded bg-muted/60" />
                            <div className="h-2 w-4/6 rounded bg-muted/50" />
                            <div className="mt-3 h-2.5 w-16 rounded bg-secondary/20" />
                            <div className="h-2 w-full rounded bg-muted/40" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading text-sm font-semibold text-foreground line-clamp-1">{cv.title}</h3>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="rounded-md bg-muted px-2 py-0.5 font-medium">{cv.template_id}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(cv.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Link to={`/dashboard/create?edit=${cv.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-secondary hover:bg-secondary/10"
                            onClick={async () => {
                              if (!cv.is_public) {
                                await handleTogglePublic(cv.id, cv.is_public);
                              }
                              setShareCV({ id: cv.id, title: cv.title });
                            }}
                            title="Share & QR Code"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(cv.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && userCVs.length === 0 && (
                <div className="mt-4 rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <FileText className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <p className="mt-5 text-base font-semibold text-foreground">No resumes yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Create your first CV to get started</p>
                  <Link to="/dashboard/create">
                    <Button variant="coral" className="mt-5 gap-2">
                      <Sparkles className="h-4 w-4" /> Create Your First CV
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Share Dialog */}
      {shareCV && (
        <CVShareDialog
          open={!!shareCV}
          onOpenChange={(open) => !open && setShareCV(null)}
          cvId={shareCV.id}
          cvTitle={shareCV.title}
        />
      )}
    </div>
  );
};

export default Dashboard;
