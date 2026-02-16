import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminPayments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 25;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-payments", page, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("payments")
        .select("*, plans(name)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1);

      if (statusFilter !== "all") query = query.eq("status", statusFilter);

      const { data, count, error } = await query;
      if (error) throw error;
      return { payments: data || [], total: count || 0 };
    },
  });

  // Summary stats
  const { data: stats } = useQuery({
    queryKey: ["admin-payment-stats"],
    queryFn: async () => {
      const [{ data: completed }, { data: pending }, { data: all }] = await Promise.all([
        supabase.from("payments").select("amount").eq("status", "completed"),
        supabase.from("payments").select("amount").eq("status", "pending"),
        supabase.from("payments").select("amount"),
      ]);
      return {
        totalRevenue: (completed || []).reduce((s, p) => s + Number(p.amount), 0),
        pendingRevenue: (pending || []).reduce((s, p) => s + Number(p.amount), 0),
        totalTransactions: all?.length || 0,
        completedCount: completed?.length || 0,
      };
    },
  });

  const payments = data?.payments || [];
  const total = data?.total || 0;

  const filtered = searchQuery
    ? payments.filter((p: any) => p.payment_gateway?.toLowerCase().includes(searchQuery.toLowerCase()) || p.user_id?.includes(searchQuery))
    : payments;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed": return "bg-secondary/10 text-secondary";
      case "pending": return "bg-amber-500/10 text-amber-600";
      case "failed": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AdminLayout title="Payments">
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { icon: DollarSign, label: "Total Revenue", value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`, color: "text-secondary" },
          { icon: Clock, label: "Pending", value: `₦${(stats?.pendingRevenue || 0).toLocaleString()}`, color: "text-amber-500" },
          { icon: CheckCircle, label: "Completed", value: stats?.completedCount || 0, color: "text-secondary" },
          { icon: DollarSign, label: "Total Transactions", value: stats?.totalTransactions || 0, color: "text-primary" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-2xl font-bold text-foreground">{s.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No payments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Plan</th>
                  <th className="p-4 font-medium">Gateway</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">User ID</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((payment: any) => (
                  <tr key={payment.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-4 font-semibold text-foreground">₦{Number(payment.amount).toLocaleString()}</td>
                    <td className="p-4 text-sm text-muted-foreground">{(payment as any).plans?.name || "—"}</td>
                    <td className="p-4 text-sm text-muted-foreground capitalize">{payment.payment_gateway}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusStyle(payment.status)}`}>{payment.status}</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">{payment.user_id?.slice(0, 8)}...</td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">{new Date(payment.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border p-4">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {total}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={filtered.length < perPage} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
