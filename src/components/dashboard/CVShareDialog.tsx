import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, ExternalLink, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CVShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cvId: string;
  cvTitle: string;
}

const CVShareDialog = ({ open, onOpenChange, cvId, cvTitle }: CVShareDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const publicUrl = `${window.location.origin}/cv/${cvId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("cv-qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 512, 512);
      const a = document.createElement("a");
      a.download = `${cvTitle}-qr.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Share Your CV</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* QR Code */}
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 p-6">
            <QRCodeSVG
              id="cv-qr-code"
              value={publicUrl}
              size={180}
              level="H"
              includeMargin
              className="rounded-lg"
            />
            <p className="text-xs text-muted-foreground text-center">
              Scan to view <strong>{cvTitle}</strong>
            </p>
            <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={handleDownloadQR}>
              <Download className="h-3.5 w-3.5" /> Download QR Code
            </Button>
          </div>

          {/* URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Public Link</label>
            <div className="flex gap-2">
              <Input value={publicUrl} readOnly className="text-xs" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-secondary" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVShareDialog;
