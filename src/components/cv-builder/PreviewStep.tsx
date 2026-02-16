import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CVPreviewDocument from "./CVPreviewDocument";
import { generatePDF, generateDOCXContent, downloadTextFile } from "@/lib/pdf-generator";
import { analyzeATS } from "@/lib/ats-analyzer";
import { QRCodeSVG } from "qrcode.react";
import {
  Download, FileText, Loader2, CheckCircle2, AlertTriangle, XCircle,
  QrCode, Share2, Copy, ZoomIn, ZoomOut, Maximize2, Minimize2,
} from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: { title: string; company: string; duration: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
  skills: { technical: string; soft: string; languages: string };
}

interface PreviewStepProps {
  formData: FormData;
  template?: string;
  customization?: import("@/lib/cv-templates").CVCustomization;
}

const PreviewStep = ({ formData, template = "classic-professional", customization }: PreviewStepProps) => {
  const cvRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "ats" | "share">("preview");
  const [zoom, setZoom] = useState(0.7);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const atsResult = analyzeATS(formData);
  const shareableUrl = `https://cvcook.app/cv/${formData.fullName.toLowerCase().replace(/\s+/g, "-") || "preview"}`;

  const handleDownloadPDF = async () => {
    if (!cvRef.current) return;
    setIsGeneratingPDF(true);
    try {
      await generatePDF({ element: cvRef.current, filename: `${formData.fullName || "resume"}.pdf` });
      toast({ title: "PDF Downloaded!", description: "Your CV has been downloaded successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadDOCX = () => {
    const content = generateDOCXContent(formData);
    downloadTextFile(content, `${formData.fullName || "resume"}.txt`);
    toast({ title: "File Downloaded!", description: "Your CV has been downloaded as a text file." });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    toast({ title: "Link Copied!" });
  };

  const getScoreColor = (score: number) => score >= 70 ? "text-green-600" : score >= 40 ? "text-yellow-600" : "text-red-600";
  const getScoreBg = (score: number) => score >= 70 ? "bg-green-50" : score >= 40 ? "bg-yellow-50" : "bg-red-50";
  const getStatusIcon = (status: "good" | "warning" | "error") => {
    if (status === "good") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (status === "warning") return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const tabs = [
    { key: "preview" as const, label: "Preview", icon: FileText },
    { key: "ats" as const, label: `ATS Score: ${atsResult.score}%`, icon: CheckCircle2 },
    { key: "share" as const, label: "Share", icon: QrCode },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-foreground">Preview Your CV</h2>
          <p className="text-sm text-muted-foreground">Review, analyze, and download your resume</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium transition-all ${
              activeTab === tab.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* CV Preview - Large */}
        <div className="flex-1">
          {activeTab === "preview" && (
            <div>
              {/* Zoom controls */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Document Preview</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}>
                    <ZoomOut className="h-3.5 w-3.5" />
                  </Button>
                  <span className="min-w-[3rem] text-center text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.min(1.2, z + 0.1))}>
                    <ZoomIn className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsFullscreen(true)}>
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="overflow-auto rounded-xl border border-border bg-muted/30 shadow-inner" style={{ maxHeight: "70vh" }}>
                <div className="flex justify-center p-6">
                  <div
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "top center",
                      width: "210mm",
                      minHeight: "297mm",
                      transition: "transform 0.2s ease",
                    }}
                    className="rounded-sm shadow-2xl"
                  >
                    <CVPreviewDocument ref={cvRef} formData={formData} template={template} customization={customization} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ats" && (
            <div className="space-y-4">
              <div className={`rounded-xl p-6 ${getScoreBg(atsResult.score)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-semibold">ATS Compatibility Score</h3>
                    <p className="text-sm text-muted-foreground">How well your CV matches ATS requirements</p>
                  </div>
                  <div className={`text-4xl font-bold ${getScoreColor(atsResult.score)}`}>{atsResult.score}%</div>
                </div>
              </div>
              <div className="space-y-3">
                {atsResult.sections.map((section, i) => (
                  <div key={i} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(section.status)}
                        <span className="text-sm font-medium">{section.name}</span>
                      </div>
                      <span className={`text-sm font-semibold ${getScoreColor(section.score)}`}>{section.score}%</span>
                    </div>
                    {section.suggestions.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {section.suggestions.map((s, j) => (
                          <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span>•</span> {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "share" && (
            <div className="rounded-xl border border-border p-8 text-center">
              <h3 className="font-heading text-lg font-semibold mb-4">Share Your CV</h3>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-border">
                  <QRCodeSVG value={shareableUrl} size={180} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Scan this QR code to view your CV online</p>
              <div className="mx-auto flex max-w-sm items-center gap-2 rounded-lg border border-border bg-muted/30 p-2">
                <input type="text" value={shareableUrl} readOnly className="flex-1 bg-transparent text-xs text-muted-foreground outline-none" />
                <Button variant="ghost" size="sm" onClick={handleCopyLink}><Copy className="h-3.5 w-3.5" /></Button>
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">Public sharing requires saving your CV first.</p>
            </div>
          )}
        </div>

        {/* Right Panel: Download */}
        <div className="space-y-4 lg:w-56">
          <div className="rounded-xl border border-border bg-card p-5">
            <h4 className="text-sm font-semibold text-foreground">Download</h4>
            <div className="mt-3 space-y-2">
              <Button variant="coral" className="w-full text-sm" onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Download className="mr-2 h-4 w-4" /> PDF</>}
              </Button>
              <Button variant="outline" className="w-full text-sm" onClick={handleDownloadDOCX}>
                <FileText className="mr-2 h-4 w-4" /> TXT
              </Button>
            </div>
          </div>
          <div className={`rounded-xl border p-5 ${atsResult.score >= 70 ? "border-green-200 bg-green-50/50" : "border-secondary/20 bg-secondary/5"}`}>
            <h4 className={`text-sm font-semibold flex items-center gap-2 ${atsResult.score >= 70 ? "text-green-700" : "text-secondary"}`}>
              <CheckCircle2 className="h-4 w-4" /> ATS: {atsResult.score}%
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              {atsResult.score >= 70 ? "Well-optimized for ATS." : "Check ATS tab for improvements."}
            </p>
          </div>
        </div>
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <>
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsFullscreen(false)} />
          <div className="fixed inset-4 z-50 overflow-auto rounded-2xl border border-border bg-background p-8 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold">CV Preview</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(false)}><Minimize2 className="h-4 w-4" /></Button>
            </div>
            <div className="flex justify-center">
              <div style={{ transform: "scale(0.9)", transformOrigin: "top center", width: "210mm", minHeight: "297mm" }} className="shadow-2xl">
                <CVPreviewDocument formData={formData} template={template} customization={customization} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PreviewStep;
