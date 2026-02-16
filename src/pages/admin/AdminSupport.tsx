import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Search, Clock, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminSupport = () => {
  const [filter, setFilter] = useState<"all" | "open" | "pending" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // For now, support tickets are still mock since there's no tickets table.
  // This is ready to be wired to a real table when created.
  const tickets = [
    { id: "TKT-001", subject: "Cannot download my CV as PDF", user: "Sarah Johnson", email: "sarah@example.com", status: "open", priority: "high", created: "10 min ago" },
    { id: "TKT-002", subject: "Billing issue with Pro subscription", user: "Michael Chen", email: "michael@example.com", status: "pending", priority: "high", created: "1 hour ago" },
    { id: "TKT-003", subject: "Template not loading correctly", user: "Emily Davis", email: "emily@example.com", status: "open", priority: "medium", created: "2 hours ago" },
    { id: "TKT-004", subject: "How to add custom sections?", user: "James Wilson", email: "james@example.com", status: "resolved", priority: "low", created: "5 hours ago" },
    { id: "TKT-005", subject: "Account deletion request", user: "Lisa Anderson", email: "lisa@example.com", status: "pending", priority: "medium", created: "1 day ago" },
  ];

  const filteredTickets = (filter === "all" ? tickets : tickets.filter((t) => t.status === filter))
    .filter((t) => !searchQuery || t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.user.toLowerCase().includes(searchQuery.toLowerCase()));

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "open": return "bg-destructive/10 text-destructive";
      case "pending": return "bg-amber-500/10 text-amber-600";
      case "resolved": return "bg-secondary/10 text-secondary";
      default: return "";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive";
      case "medium": return "bg-amber-500/10 text-amber-600";
      case "low": return "bg-muted text-muted-foreground";
      default: return "";
    }
  };

  return (
    <AdminLayout title="Support Tickets">
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { icon: MessageSquare, label: "Total Tickets", value: tickets.length, color: "text-primary" },
          { icon: AlertCircle, label: "Open", value: tickets.filter((t) => t.status === "open").length, color: "text-destructive" },
          { icon: Clock, label: "Pending", value: tickets.filter((t) => t.status === "pending").length, color: "text-amber-500" },
          { icon: CheckCircle, label: "Resolved", value: tickets.filter((t) => t.status === "resolved").length, color: "text-secondary" },
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(["all", "open", "pending", "resolved"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "secondary" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search tickets..." className="w-64 pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="p-4 font-medium">Ticket</th>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Priority</th>
                <th className="p-4 font-medium">Created</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <p className="text-xs text-muted-foreground">{ticket.id}</p>
                    <p className="font-medium text-foreground">{ticket.subject}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">{ticket.user}</p>
                    <p className="text-sm text-muted-foreground">{ticket.email}</p>
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusStyle(ticket.status)}`}>{ticket.status}</span>
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getPriorityStyle(ticket.priority)}`}>{ticket.priority}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{ticket.created}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">Reply</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSupport;
