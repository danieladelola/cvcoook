import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Search, Eye, ExternalLink, QrCode, Filter,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CVPreviewDocument from "@/components/cv-builder/CVPreviewDocument";
import { QRCodeSVG } from "qrcode.react";
import AdminLayout from "@/components/admin/AdminLayout";

const AdminCVs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [previewCV, setPreviewCV] = useState<any>(null);
  const [qrCV, setQrCV] = useState<any>(null);

  const { data: cvs = [], isLoading } = useQuery({
    queryKey: ["admin-cvs", searchQuery, templateFilter],
    queryFn: async () => {
      let query = supabase.from("user_cvs").select("*").order("created_at", { ascending: false }).limit(100);
      if (templateFilter !== "all") query = query.eq("template_id", templateFilter);
      const { data, error } = await query;
      if (error) throw error;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (data || []).filter((cv: any) => {
          const fd = cv.form_data as any;
          return cv.title?.toLowerCase().includes(q) || fd?.fullName?.toLowerCase().includes(q) || fd?.email?.toLowerCase().includes(q);
        });
      }
      return data || [];
    },
  });

  return (
    <AdminLayout title="CV Management">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, email, or title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={templateFilter} onValueChange={setTemplateFilter}>
          <SelectTrigger className="w-[180px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Template" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            <SelectItem value="classic-professional">Classic Professional</SelectItem>
            <SelectItem value="modern-sleek">Modern Sleek</SelectItem>
            <SelectItem value="creative-edge">Creative Edge</SelectItem>
            <SelectItem value="minimal-clean">Minimal Clean</SelectItem>
            <SelectItem value="executive-suite">Executive Suite</SelectItem>
            <SelectItem value="ats-optimized">ATS Optimized</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{cvs.length} CVs found</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="p-4 font-medium">CV Title</th>
                <th className="p-4 font-medium">Owner</th>
                <th className="p-4 font-medium">Template</th>
                <th className="p-4 font-medium">Views</th>
                <th className="p-4 font-medium">Downloads</th>
                <th className="p-4 font-medium">Public</th>
                <th className="p-4 font-medium">Created</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : cvs.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No CVs found</td></tr>
              ) : (
                cvs.map((cv: any) => {
                  const fd = cv.form_data as any;
                  return (
                    <tr key={cv.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-4"><p className="font-medium text-foreground">{cv.title}</p></td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm text-foreground">{fd?.fullName || "—"}</p>
                          <p className="text-xs text-muted-foreground">{fd?.email || "—"}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{cv.template_id}</span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{cv.views || 0}</td>
                      <td className="p-4 text-sm text-muted-foreground">{cv.downloads || 0}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${cv.is_public ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>
                          {cv.is_public ? "Public" : "Private"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{new Date(cv.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewCV(cv)} title="Preview"><Eye className="h-4 w-4" /></Button>
                          {cv.is_public && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Open public URL">
                                <a href={`/cv/${cv.id}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQrCV(cv)} title="QR Code"><QrCode className="h-4 w-4" /></Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewCV} onOpenChange={() => setPreviewCV(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle>{previewCV?.title}</DialogTitle></DialogHeader>
          {previewCV && (
            <div className="flex justify-center">
              <div style={{ width: "210mm", minHeight: "297mm", transform: "scale(0.6)", transformOrigin: "top center" }} className="shadow-2xl">
                <CVPreviewDocument formData={previewCV.form_data || {}} template={previewCV.template_id} customization={previewCV.customization} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* QR Dialog */}
      <Dialog open={!!qrCV} onOpenChange={() => setQrCV(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>QR Code</DialogTitle></DialogHeader>
          {qrCV && (
            <div className="flex flex-col items-center gap-4 py-4">
              <QRCodeSVG value={`${window.location.origin}/cv/${qrCV.id}`} size={200} level="H" includeMargin />
              <p className="text-sm text-muted-foreground text-center">{qrCV.title}</p>
              <p className="text-xs text-muted-foreground">{`${window.location.origin}/cv/${qrCV.id}`}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCVs;
