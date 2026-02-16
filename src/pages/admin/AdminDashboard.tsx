import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  FileText,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  UserPlus,
  LayoutGrid,
  BarChart3,
  Settings,
  Loader2,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  // Real stats from DB
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: totalCVs },
        { data: payments },
        { count: activeSubs },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).is("deleted_at", null),
        supabase.from("user_cvs").select("*", { count: "exact", head: true }),
        supabase.from("payments").select("amount").eq("status", "completed"),
        supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
      ]);

      const totalRevenue = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
      const totalDownloads = await supabase.from("user_cvs").select("downloads");
      const dlCount = (totalDownloads.data || []).reduce((sum, cv) => sum + (cv.downloads || 0), 0);

      return {
        totalUsers: totalUsers || 0,
        totalCVs: totalCVs || 0,
        totalDownloads: dlCount,
        totalRevenue: totalRevenue,
        activeSubs: activeSubs || 0,
      };
    },
  });

  // Recent users
  const { data: recentUsers = [] } = useQuery({
    queryKey: ["admin-recent-users"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name, created_at, status")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  // Top templates
  const { data: topTemplates = [] } = useQuery({
    queryKey: ["admin-top-templates"],
    queryFn: async () => {
      const { data } = await supabase.from("user_cvs").select("template_id");
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((cv) => {
        counts[cv.template_id] = (counts[cv.template_id] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([id, uses]) => ({ id, uses }))
        .sort((a, b) => b.uses - a.uses)
        .slice(0, 5);
    },
  });

  // Recent audit log
  const { data: recentActions = [] } = useQuery({
    queryKey: ["admin-recent-audit"],
    queryFn: async () => {
      const { data } = await supabase
        .from("admin_audit_log")
        .select("action, created_at, target_user_id, details")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? "—",
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "CVs Created",
      value: stats?.totalCVs ?? "—",
      icon: FileText,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      title: "Downloads",
      value: stats?.totalDownloads ?? "—",
      icon: Download,
      color: "text-muted-foreground",
      bg: "bg-muted",
    },
    {
      title: "Revenue (₦)",
      value: stats?.totalRevenue != null ? `₦${stats.totalRevenue.toLocaleString()}` : "—",
      icon: DollarSign,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
  ];

  const formatTemplateName = (id: string) =>
    id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <div key={stat.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <StatIcon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold text-foreground">
                {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Users */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">Recent Users</h2>
            <Link to="/admin/users">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No users yet</td></tr>
                ) : (
                  recentUsers.map((user: any) => (
                    <tr key={user.user_id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground">
                            {(user.full_name || "U").charAt(0).toUpperCase()}
                          </div>
                          <p className="font-medium text-foreground">{user.full_name || "Unnamed"}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${user.status === "active" ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Templates + Recent Activity */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">Top Templates</h2>
              <Link to="/admin/templates">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {topTemplates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No CV data yet</p>
              ) : (
                topTemplates.map((t: any, i: number) => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-foreground text-sm">{formatTemplateName(t.id)}</p>
                        <p className="text-xs text-muted-foreground">{t.uses} uses</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Admin Activity */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">Recent Activity</h2>
              <Link to="/admin/audit-log">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {recentActions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
              ) : (
                recentActions.map((log: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {log.action.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/users"><Button variant="outline" className="gap-2"><UserPlus className="h-4 w-4" />Add New User</Button></Link>
          <Link to="/admin/templates"><Button variant="outline" className="gap-2"><LayoutGrid className="h-4 w-4" />Manage Templates</Button></Link>
          <Link to="/admin/analytics"><Button variant="outline" className="gap-2"><BarChart3 className="h-4 w-4" />View Analytics</Button></Link>
          <Link to="/admin/payments"><Button variant="outline" className="gap-2"><DollarSign className="h-4 w-4" />View Payments</Button></Link>
          <Link to="/admin/settings"><Button variant="outline" className="gap-2"><Settings className="h-4 w-4" />System Settings</Button></Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
