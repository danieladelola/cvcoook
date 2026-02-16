import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp, TrendingDown, Calendar, Download, BarChart3, Users, FileText, DollarSign, Loader2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import AdminLayout from "@/components/admin/AdminLayout";

const COLORS = ["hsl(0,80%,50%)", "hsl(0,0%,5%)", "hsl(0,0%,40%)", "hsl(0,0%,70%)", "hsl(0,60%,60%)", "hsl(0,0%,85%)"];

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  // User signups over time
  const { data: signupData = [], isLoading } = useQuery({
    queryKey: ["admin-analytics-signups", timeRange],
    queryFn: async () => {
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const { data } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", since)
        .is("deleted_at", null)
        .order("created_at");

      if (!data) return [];

      // Group by date
      const grouped: Record<string, number> = {};
      data.forEach((p) => {
        const date = new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        grouped[date] = (grouped[date] || 0) + 1;
      });
      return Object.entries(grouped).map(([date, count]) => ({ date, signups: count }));
    },
  });

  // CV creation over time
  const { data: cvData = [] } = useQuery({
    queryKey: ["admin-analytics-cvs", timeRange],
    queryFn: async () => {
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const { data } = await supabase
        .from("user_cvs")
        .select("created_at")
        .gte("created_at", since)
        .order("created_at");

      if (!data) return [];
      const grouped: Record<string, number> = {};
      data.forEach((cv) => {
        const date = new Date(cv.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        grouped[date] = (grouped[date] || 0) + 1;
      });
      return Object.entries(grouped).map(([date, count]) => ({ date, cvs: count }));
    },
  });

  // Template distribution
  const { data: templateDist = [] } = useQuery({
    queryKey: ["admin-analytics-templates"],
    queryFn: async () => {
      const { data } = await supabase.from("user_cvs").select("template_id");
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((cv) => { counts[cv.template_id] = (counts[cv.template_id] || 0) + 1; });
      return Object.entries(counts)
        .map(([name, value]) => ({ name: name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()), value }))
        .sort((a, b) => b.value - a.value);
    },
  });

  // Revenue over time
  const { data: revenueData = [] } = useQuery({
    queryKey: ["admin-analytics-revenue", timeRange],
    queryFn: async () => {
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const { data } = await supabase
        .from("payments")
        .select("amount, created_at")
        .eq("status", "completed")
        .gte("created_at", since)
        .order("created_at");

      if (!data) return [];
      const grouped: Record<string, number> = {};
      data.forEach((p) => {
        const date = new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        grouped[date] = (grouped[date] || 0) + Number(p.amount);
      });
      return Object.entries(grouped).map(([date, amount]) => ({ date, revenue: amount }));
    },
  });

  // Summary stats
  const { data: summaryStats } = useQuery({
    queryKey: ["admin-analytics-summary"],
    queryFn: async () => {
      const [{ count: users }, { count: cvs }, { data: payments }, { count: subs }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).is("deleted_at", null),
        supabase.from("user_cvs").select("*", { count: "exact", head: true }),
        supabase.from("payments").select("amount").eq("status", "completed"),
        supabase.from("user_subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
      ]);
      const revenue = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
      return { users: users || 0, cvs: cvs || 0, revenue, subs: subs || 0 };
    },
  });

  const metrics = [
    { label: "Total Users", value: summaryStats?.users ?? 0, icon: Users },
    { label: "Total CVs", value: summaryStats?.cvs ?? 0, icon: FileText },
    { label: "Revenue (₦)", value: summaryStats?.revenue != null ? `₦${summaryStats.revenue.toLocaleString()}` : "₦0", icon: DollarSign },
    { label: "Active Subs", value: summaryStats?.subs ?? 0, icon: TrendingUp },
  ];

  return (
    <AdminLayout title="Analytics">
      {/* Time Range */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <Button key={range} variant={timeRange === range ? "secondary" : "outline"} size="sm" onClick={() => setTimeRange(range)}>
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{m.label}</p>
                  <p className="text-2xl font-bold text-foreground">{m.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Signups Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">User Signups</h2>
          {signupData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">No signup data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={signupData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(0,0%,40%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(0,0%,40%)" />
                <Tooltip />
                <Bar dataKey="signups" fill="hsl(0,80%,50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Revenue Trend</h2>
          {revenueData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">No revenue data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(0,0%,40%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(0,0%,40%)" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(0,0%,5%)" strokeWidth={2} dot={{ fill: "hsl(0,80%,50%)" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* CV Creation Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">CV Creations</h2>
          {cvData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">No CV data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={cvData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(0,0%,40%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(0,0%,40%)" />
                <Tooltip />
                <Bar dataKey="cvs" fill="hsl(0,0%,5%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Template Distribution */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">Template Distribution</h2>
          {templateDist.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">No template data</div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={260}>
                <PieChart>
                  <Pie data={templateDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={false}>
                    {templateDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {templateDist.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-foreground truncate">{t.name}</span>
                    <span className="ml-auto text-muted-foreground">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
