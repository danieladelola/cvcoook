import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronLeft, ChevronRight, Check, FileText, Briefcase, User,
  Download, Loader2, Copy, Wand2, RefreshCw, Sparkles, Clock,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useSubscription } from "@/hooks/use-subscription";
import UpgradePrompt from "@/components/dashboard/UpgradePrompt";

type Step = "job" | "personal" | "generate" | "preview";
type Tone = "professional" | "confident" | "simple";

interface FormData {
  jobTitle: string;
  companyName: string;
  hiringManager: string;
  jobDescription: string;
  tone: Tone;
  letterContent: string;
}

interface VersionEntry {
  content: string;
  generatedAt: string;
  tone: string;
}

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: "job", label: "Job Details", icon: Briefcase },
  { key: "personal", label: "Your Info", icon: User },
  { key: "generate", label: "Generate", icon: Sparkles },
  { key: "preview", label: "Preview", icon: FileText },
];

const CreateCoverLetter = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { isFreePlan, canUseFeature } = useSubscription();
  const [currentStep, setCurrentStep] = useState<Step>("job");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [activeVersion, setActiveVersion] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "", companyName: "", hiringManager: "",
    jobDescription: "", tone: "professional", letterContent: "",
  });

  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep);
  const fullName = profile?.full_name || "";
  const email = user?.email || "";

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const goNext = () => {
    const next = currentStepIndex + 1;
    if (next < STEPS.length) setCurrentStep(STEPS[next].key);
  };
  const goPrev = () => {
    const prev = currentStepIndex - 1;
    if (prev >= 0) setCurrentStep(STEPS[prev].key);
  };

  const handleGenerate = async () => {
    if (!formData.jobTitle.trim() || !formData.companyName.trim()) {
      toast({ title: "Missing info", description: "Job title and company name are required.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    try {
      const res = await supabase.functions.invoke("generate-cover-letter", {
        body: {
          fullName, email,
          companyName: formData.companyName, hiringManager: formData.hiringManager,
          jobTitle: formData.jobTitle, jobDescription: formData.jobDescription, tone: formData.tone,
        },
      });
      if (res.error) throw new Error(res.error.message || "Generation failed");
      const data = res.data as { content?: string; error?: string };
      if (data.error) throw new Error(data.error);
      if (!data.content) throw new Error("No content returned");

      const newVersion: VersionEntry = { content: data.content, generatedAt: new Date().toISOString(), tone: formData.tone };
      const newVersions = [...versions, newVersion];
      setVersions(newVersions);
      setActiveVersion(newVersions.length - 1);
      setFormData((prev) => ({ ...prev, letterContent: data.content! }));
      setHasGenerated(true);
      await saveToDB(data.content!, newVersions);
      toast({ title: hasGenerated ? "Regenerated! 🔄" : "Generated! 🎉", description: "Your cover letter is ready." });
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToDB = async (content: string, versionHistory: VersionEntry[]) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const record = {
        user_id: user.id,
        title: `Cover Letter - ${formData.companyName} - ${formData.jobTitle}`,
        job_title: formData.jobTitle, company_name: formData.companyName,
        job_description: formData.jobDescription, tone: formData.tone,
        content: { letterContent: content, hiringManager: formData.hiringManager, fullName, email },
        version_history: versionHistory,
      };
      if (savedId) {
        await supabase.from("user_cover_letters").update(record as any).eq("id", savedId);
      } else {
        const { data: inserted, error } = await supabase
          .from("user_cover_letters").insert(record as any).select("id").single();
        if (error) throw error;
        if (inserted) setSavedId(inserted.id);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const switchVersion = (index: number) => {
    setActiveVersion(index);
    setFormData((prev) => ({ ...prev, letterContent: versions[index].content }));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getFormattedLetter());
    toast({ title: "Copied!", description: "Cover letter copied to clipboard." });
  };

  const getFormattedLetter = () => {
    const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    return `${fullName}\n${email}\n\n${date}\n\n${formData.hiringManager || "Hiring Manager"}\n${formData.companyName}\n\nRe: Application for ${formData.jobTitle}\n\n${formData.letterContent}`;
  };

  const handleDownloadPDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const margin = 25;
      const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
      const lineHeight = 6;
      let y = margin;

      doc.setFont("helvetica", "bold"); doc.setFontSize(13);
      doc.text(fullName, margin, y); y += lineHeight;
      doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      doc.text(email, margin, y); y += lineHeight * 2.5;

      const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      doc.text(date, margin, y); y += lineHeight * 2;
      doc.text(formData.hiringManager || "Hiring Manager", margin, y); y += lineHeight;
      doc.text(formData.companyName, margin, y); y += lineHeight * 2;

      doc.setFont("helvetica", "bold");
      doc.text(`Re: Application for ${formData.jobTitle}`, margin, y); y += lineHeight * 2;

      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(formData.letterContent, pageWidth);
      for (const line of lines) {
        if (y > doc.internal.pageSize.getHeight() - margin) { doc.addPage(); y = margin; }
        doc.text(line, margin, y); y += lineHeight;
      }
      doc.save(`cover-letter-${formData.companyName.replace(/\s+/g, "-").toLowerCase()}.pdf`);
      toast({ title: "Downloaded!", description: "PDF saved successfully." });
    } catch {
      toast({ title: "Download failed", description: "Could not generate PDF.", variant: "destructive" });
    }
  };

  // Gate cover letters for free users
  if (isFreePlan) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header variant="dashboard" />
        <div className="flex-1 flex items-center justify-center p-8">
          <UpgradePrompt feature="Cover Letters" description="Cover letter creation is available on Pro and Premium plans. Upgrade to craft AI-powered cover letters tailored to any job." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header variant="dashboard" />

      <div className="flex-1">
        {/* Top Bar with Progress */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
                <ChevronLeft className="h-4 w-4" /> Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Step {currentStepIndex + 1} of {STEPS.length}</span>
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-secondary transition-all duration-500" style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {STEPS.map((step, i) => {
                const done = i < currentStepIndex;
                const active = step.key === currentStep;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center">
                    <button
                      onClick={() => i <= currentStepIndex && setCurrentStep(step.key)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        active ? "bg-primary text-primary-foreground shadow-sm"
                          : done ? "bg-secondary/10 text-secondary hover:bg-secondary/20"
                          : "text-muted-foreground"
                      } ${i <= currentStepIndex ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                    >
                      <div className={`flex h-6 w-6 items-center justify-center rounded-md ${
                        active ? "bg-primary-foreground/20" : done ? "bg-secondary/20" : "bg-muted"
                      }`}>
                        {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                      </div>
                      <span className="hidden sm:inline">{step.label}</span>
                    </button>
                    {i < STEPS.length - 1 && <div className={`mx-1 h-px w-4 ${i < currentStepIndex ? "bg-secondary" : "bg-border"}`} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">

            {/* Step 1: Job Details */}
            {currentStep === "job" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-foreground">Job Details</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Enter the position you're applying for</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title <span className="text-destructive">*</span></Label>
                    <Input id="jobTitle" placeholder="e.g. Software Engineer" value={formData.jobTitle} onChange={(e) => updateField("jobTitle", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name <span className="text-destructive">*</span></Label>
                    <Input id="companyName" placeholder="e.g. Google" value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hiringManager">Hiring Manager <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input id="hiringManager" placeholder="e.g. Jane Smith" value={formData.hiringManager} onChange={(e) => updateField("hiringManager", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select value={formData.tone} onValueChange={(v) => updateField("tone", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="confident">Confident</SelectItem>
                        <SelectItem value="simple">Simple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea id="jobDescription" placeholder="Paste the full job description for a more tailored letter..." rows={6} value={formData.jobDescription} onChange={(e) => updateField("jobDescription", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {currentStep === "personal" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-foreground">Your Information</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Auto-filled from your profile. These fields cannot be edited here.</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Full Name</Label>
                      <Input value={fullName} disabled className="bg-muted font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <Input value={email} disabled className="bg-muted font-medium" />
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Need to update these? <Link to="/dashboard/settings" className="text-primary underline hover:no-underline">Go to Settings</Link>
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Generate */}
            {currentStep === "generate" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-foreground">Generate Cover Letter</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {hasGenerated ? "Edit your letter or regenerate a fresh version" : "Click generate to create your AI-powered cover letter"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="coral" onClick={handleGenerate} disabled={isGenerating} className="gap-2">
                    {isGenerating ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                    ) : hasGenerated ? (
                      <><RefreshCw className="h-4 w-4" /> Regenerate</>
                    ) : (
                      <><Wand2 className="h-4 w-4" /> Generate Cover Letter</>
                    )}
                  </Button>
                  {isSaving && <span className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Saving...</span>}
                </div>

                {/* Version History */}
                {versions.length > 1 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> Version History ({versions.length} versions)
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {versions.map((v, i) => (
                        <button
                          key={i}
                          onClick={() => switchVersion(i)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                            activeVersion === i
                              ? "border-secondary bg-secondary/10 text-secondary"
                              : "border-border text-muted-foreground hover:border-secondary/40"
                          }`}
                        >
                          v{i + 1} · {v.tone}
                          <span className="ml-1.5 text-[10px] opacity-60">
                            {new Date(v.generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Your Cover Letter</Label>
                  <Textarea
                    placeholder="Click 'Generate Cover Letter' to create your letter..."
                    rows={16} value={formData.letterContent}
                    onChange={(e) => updateField("letterContent", e.target.value)}
                    className="leading-relaxed font-[15px]"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Preview & Download */}
            {currentStep === "preview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-foreground">Preview & Download</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Review your cover letter and download it</p>
                </div>
                <div className="flex flex-col gap-6 lg:flex-row">
                  {/* Letter Preview */}
                  <div className="flex-1">
                    <div className="rounded-xl border border-border bg-white shadow-lg">
                      <div className="p-8 sm:p-10">
                        <div className="space-y-6 text-sm leading-relaxed">
                          <div>
                            <p className="text-base font-semibold text-foreground">{fullName}</p>
                            <p className="text-muted-foreground">{email}</p>
                          </div>
                          <p className="text-muted-foreground">
                            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </p>
                          <div className="text-muted-foreground">
                            <p>{formData.hiringManager || "Hiring Manager"}</p>
                            <p>{formData.companyName}</p>
                          </div>
                          <p className="font-semibold text-foreground">Re: Application for {formData.jobTitle}</p>
                          <div className="whitespace-pre-line text-muted-foreground leading-7">
                            {formData.letterContent || "No content generated yet."}
                          </div>
                          <div className="border-t border-border pt-4">
                            <p className="text-muted-foreground">Sincerely,</p>
                            <p className="mt-1 font-semibold text-foreground">{fullName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Actions Panel */}
                  <div className="space-y-4 lg:w-60">
                    <div className="rounded-xl border border-border bg-card p-5">
                      <h4 className="text-sm font-semibold text-foreground">Download</h4>
                      <div className="mt-3 space-y-2">
                        <Button variant="coral" className="w-full gap-2 text-sm" onClick={handleDownloadPDF}>
                          <Download className="h-4 w-4" /> Download PDF
                        </Button>
                        <Button variant="outline" className="w-full gap-2 text-sm" onClick={handleCopy}>
                          <Copy className="h-4 w-4" /> Copy Text
                        </Button>
                      </div>
                    </div>
                    {versions.length > 0 && (
                      <div className="rounded-xl border border-border bg-card p-5">
                        <h4 className="text-sm font-semibold text-foreground">Versions</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{versions.length} version{versions.length > 1 ? "s" : ""} generated</p>
                        <div className="mt-3 space-y-1.5">
                          {versions.map((v, i) => (
                            <button
                              key={i} onClick={() => switchVersion(i)}
                              className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-all ${
                                activeVersion === i ? "bg-secondary/10 text-secondary" : "text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              Version {i + 1} · {v.tone}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex justify-between border-t border-border pt-6">
              <Button variant="outline" onClick={goPrev} disabled={currentStepIndex === 0} className="gap-2">
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              {currentStepIndex < STEPS.length - 1 ? (
                <Button variant="coral" onClick={goNext} className="gap-2" disabled={currentStep === "job" && (!formData.jobTitle.trim() || !formData.companyName.trim())}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Link to="/dashboard">
                  <Button variant="coral" className="gap-2"><Check className="h-4 w-4" /> Done</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCoverLetter;
