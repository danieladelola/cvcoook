import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CVPreviewDocument from "@/components/cv-builder/CVPreviewDocument";
import { Loader2 } from "lucide-react";

const PublicCV = () => {
  const { id } = useParams<{ id: string }>();
  const [cv, setCv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }

    supabase
      .from("user_cvs")
      .select("*")
      .eq("id", id)
      .eq("is_public", true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setCv(data);
          // Increment views
          supabase.from("user_cvs").update({ views: (data.views || 0) + 1 }).eq("id", id).then(() => {});
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !cv) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">CV Not Found</h1>
          <p className="mt-2 text-muted-foreground">This CV is private or doesn't exist.</p>
        </div>
      </div>
    );
  }

  const formData = cv.form_data || {};
  const customization = cv.customization || {};

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="mx-auto max-w-[900px] px-4">
        <div className="mb-4 text-center">
          <h1 className="font-heading text-lg font-semibold text-foreground">{cv.title}</h1>
          <p className="text-xs text-muted-foreground">Powered by CVCOOK · cvcook.vura.pro</p>
        </div>
        <div className="mx-auto overflow-hidden rounded-xl border border-border bg-white shadow-2xl" style={{ width: "210mm", minHeight: "297mm" }}>
          <CVPreviewDocument formData={formData} template={cv.template_id} customization={customization} />
        </div>
      </div>
    </div>
  );
};

export default PublicCV;
