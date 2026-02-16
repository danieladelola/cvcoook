import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Loader2, Eye, Mail } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminCoverLetters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewLetter, setPreviewLetter] = useState<any>(null);

  const { data: letters = [], isLoading } = useQuery({
    queryKey: ["admin-cover-letters", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_cover_letters")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (data || []).filter((l: any) =>
          l.title?.toLowerCase().includes(q) ||
          l.company_name?.toLowerCase().includes(q) ||
          l.job_title?.toLowerCase().includes(q)
        );
      }
      return data || [];
    },
  });

  return (
    <AdminLayout title="Cover Letters">
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold text-foreground">{letters.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Cover Letters</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-secondary">
            {[...new Set(letters.map((l: any) => l.user_id))].length}
          </p>
          <p className="text-sm text-muted-foreground">Unique Users</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold text-foreground">
            {[...new Set(letters.map((l: any) => l.tone))].length}
          </p>
          <p className="text-sm text-muted-foreground">Tones Used</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by title, company, or job..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <span className="text-sm text-muted-foreground">{letters.length} found</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : letters.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No cover letters found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Job Title</th>
                  <th className="p-4 font-medium">Tone</th>
                  <th className="p-4 font-medium">Created</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {letters.map((letter: any) => (
                  <tr key={letter.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-4 font-medium text-foreground">{letter.title}</td>
                    <td className="p-4 text-sm text-muted-foreground">{letter.company_name || "—"}</td>
                    <td className="p-4 text-sm text-muted-foreground">{letter.job_title || "—"}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary capitalize">{letter.tone}</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{new Date(letter.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewLetter(letter)} title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewLetter} onOpenChange={() => setPreviewLetter(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{previewLetter?.title}</DialogTitle>
          </DialogHeader>
          {previewLetter && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Company:</span> <span className="font-medium">{previewLetter.company_name || "—"}</span></div>
                <div><span className="text-muted-foreground">Job:</span> <span className="font-medium">{previewLetter.job_title || "—"}</span></div>
                <div><span className="text-muted-foreground">Tone:</span> <span className="font-medium capitalize">{previewLetter.tone}</span></div>
                <div><span className="text-muted-foreground">Created:</span> <span className="font-medium">{new Date(previewLetter.created_at).toLocaleString()}</span></div>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                  {typeof previewLetter.content === "string" ? previewLetter.content : JSON.stringify(previewLetter.content, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCoverLetters;
