import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminAuditLog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 25;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-audit-log", page, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("admin_audit_log")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1);

      const { data, count, error } = await query;
      if (error) throw error;
      return { logs: data || [], total: count || 0 };
    },
  });

  const logs = data?.logs || [];
  const total = data?.total || 0;

  const filtered = searchQuery
    ? logs.filter((log: any) => log.action.toLowerCase().includes(searchQuery.toLowerCase()))
    : logs;

  const formatAction = (action: string) =>
    action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <AdminLayout title="Audit Log">
      {/* Search */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search actions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <span className="text-sm text-muted-foreground">{total} total entries</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No audit log entries found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Action</th>
                  <th className="p-4 font-medium">Admin ID</th>
                  <th className="p-4 font-medium">Target User</th>
                  <th className="p-4 font-medium">Details</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log: any) => (
                  <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {formatAction(log.action)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">{log.admin_id?.slice(0, 8)}...</td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">
                      {log.target_user_id ? `${log.target_user_id.slice(0, 8)}...` : "—"}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : "—"}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border p-4">
          <p className="text-sm text-muted-foreground">Page {page}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={filtered.length < perPage} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAuditLog;
