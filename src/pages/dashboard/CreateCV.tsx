import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import {
  User, Briefcase, GraduationCap, Award, ChevronLeft, ChevronRight, Check,
  FileText, LayoutGrid, Loader2, ZoomIn, ZoomOut, Maximize2, Minimize2,
  Download, RefreshCw, Save, Upload, Share2,
} from "lucide-react";

import CVUploadStep from "@/components/cv-builder/CVUploadStep";
import TemplateStep from "@/components/cv-builder/TemplateStep";
import PersonalInfoStep from "@/components/cv-builder/PersonalInfoStep";
import ExperienceStep from "@/components/cv-builder/ExperienceStep";
import EducationStep from "@/components/cv-builder/EducationStep";
import SkillsStep from "@/components/cv-builder/SkillsStep";
import CVPreviewDocument from "@/components/cv-builder/CVPreviewDocument";
import CookingTransition from "@/components/cv-builder/CookingTransition";
import CVShareDialog from "@/components/dashboard/CVShareDialog";
import { CVCustomization, defaultCustomization, getTemplateById } from "@/lib/cv-templates";
import { callCVAI } from "@/lib/cv-ai";
import { generatePDF } from "@/lib/pdf-generator";
import { useSubscription } from "@/hooks/use-subscription";
import UpgradePrompt from "@/components/dashboard/UpgradePrompt";

type Step = "upload" | "template" | "personal" | "experience" | "education" | "skills" | "cooking" | "review";

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  degree: string;
  school: string;
  year: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: {
    technical: string;
    soft: string;
    languages: string;
  };
}

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: "upload", label: "Upload", icon: Upload },
  { key: "template", label: "Template", icon: LayoutGrid },
  { key: "personal", label: "Personal", icon: User },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "skills", label: "Skills", icon: Award },
  { key: "review", label: "Review", icon: FileText },
];

// Steps visible in the progress bar (no "cooking")
const VISIBLE_STEPS = STEPS.filter((s) => s.key !== "cooking");

const CreateCV = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  
  const [currentStep, setCurrentStep] = useState<Step>(editId ? "personal" : "upload");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customization, setCustomization] = useState<CVCustomization>(defaultCustomization);
  const [isSaving, setIsSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [zoom, setZoom] = useState(0.65);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [savedCvId, setSavedCvId] = useState<string | null>(editId);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);
  const { isFreePlan, isWithinLimit, canUseFeature } = useSubscription();

  const [formData, setFormData] = useState<FormData>({
    fullName: "", email: "", phone: "", location: "", summary: "",
    experiences: [{ title: "", company: "", duration: "", description: "" }],
    education: [{ degree: "", school: "", year: "" }],
    skills: { technical: "", soft: "", languages: "" },
  });

  // Original form data before AI enhancement (for regeneration)
  const [originalFormData, setOriginalFormData] = useState<FormData | null>(null);

  // Load existing CV for editing
  useEffect(() => {
    if (editId && user) {
      supabase
        .from("user_cvs")
        .select("*")
        .eq("id", editId)
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            const fd = data.form_data as any;
            if (fd) {
              setFormData({
                fullName: fd.fullName || "",
                email: fd.email || "",
                phone: fd.phone || "",
                location: fd.location || "",
                summary: fd.summary || "",
                experiences: fd.experiences || [{ title: "", company: "", duration: "", description: "" }],
                education: fd.education || [{ degree: "", school: "", year: "" }],
                skills: fd.skills || { technical: "", soft: "", languages: "" },
              });
            }
            setSelectedTemplate(data.template_id || "classic-professional");
            if (data.customization) setCustomization(data.customization as any);
          }
        });
    }
  }, [editId, user]);

  const visibleIndex = VISIBLE_STEPS.findIndex((s) => s.key === currentStep);
  const showLivePreview = ["personal", "experience", "education", "skills"].includes(currentStep);

  const goToStep = (step: Step) => setCurrentStep(step);

  const goNext = () => {
    const allSteps: Step[] = ["upload", "template", "personal", "experience", "education", "skills", "cooking", "review"];
    const idx = allSteps.indexOf(currentStep);
    if (idx < allSteps.length - 1) setCurrentStep(allSteps[idx + 1]);
  };

  const goPrev = () => {
    const allSteps: Step[] = ["upload", "template", "personal", "experience", "education", "skills"];
    const idx = allSteps.indexOf(currentStep);
    if (idx > 0) setCurrentStep(allSteps[idx - 1]);
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = getTemplateById(templateId);
    if (tmpl) {
      setCustomization((prev) => ({ ...prev, colorScheme: tmpl.defaultColors, layout: tmpl.layout }));
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle CV upload extraction
  const handleExtractData = (data: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      fullName: data.fullName || prev.fullName,
      email: data.email || prev.email,
      phone: data.phone || prev.phone,
      location: data.location || prev.location,
      summary: data.summary || prev.summary,
      experiences: data.experiences && data.experiences.length > 0 ? data.experiences : prev.experiences,
      education: data.education && data.education.length > 0 ? data.education : prev.education,
      skills: data.skills || prev.skills,
    }));
    // Skip to template selection after extraction
    setCurrentStep("template");
  };

  const handleSkipUpload = () => {
    setCurrentStep("template");
  };

  // AI Enhancement - "Cooking" stage
  const handleCookCV = async () => {
    if (!canUseFeature("ai_suggestions")) {
      toast({ title: "Upgrade Required", description: "AI enhancement is a Pro feature. Upgrade to unlock it.", variant: "destructive" });
      return;
    }
    setOriginalFormData({ ...formData });
    setCurrentStep("cooking");
    setIsEnhancing(true);

    try {
      const result = await callCVAI("enhance_cv", {
        fullName: formData.fullName,
        summary: formData.summary,
        experiences: formData.experiences,
        skills: formData.skills,
      });

      if (typeof result === "object" && result !== null) {
        const enhanced = result as {
          summary?: string;
          experiences?: Experience[];
          skills?: { technical?: string; soft?: string; languages?: string };
        };

        setFormData((prev) => ({
          ...prev,
          summary: enhanced.summary || prev.summary,
          experiences: enhanced.experiences && enhanced.experiences.length > 0
            ? enhanced.experiences.map((e, i) => ({
                title: e.title || prev.experiences[i]?.title || "",
                company: e.company || prev.experiences[i]?.company || "",
                duration: e.duration || prev.experiences[i]?.duration || "",
                description: e.description || prev.experiences[i]?.description || "",
              }))
            : prev.experiences,
          skills: {
            technical: enhanced.skills?.technical || prev.skills.technical,
            soft: enhanced.skills?.soft || prev.skills.soft,
            languages: enhanced.skills?.languages || prev.skills.languages,
          },
        }));
      }
    } catch (err: any) {
      console.error("Enhancement failed:", err);
      toast({
        title: "Enhancement had an issue",
        description: "We'll show your original content. You can try regenerating.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCookingComplete = () => {
    setCurrentStep("review");
  };

  // Regenerate
  const handleRegenerate = async () => {
    if (!originalFormData) return;
    setIsRegenerating(true);
    try {
      const result = await callCVAI("enhance_cv", {
        fullName: originalFormData.fullName,
        summary: originalFormData.summary,
        experiences: originalFormData.experiences,
        skills: originalFormData.skills,
      });

      if (typeof result === "object" && result !== null) {
        const enhanced = result as {
          summary?: string;
          experiences?: Experience[];
          skills?: { technical?: string; soft?: string; languages?: string };
        };

        setFormData((prev) => ({
          ...prev,
          summary: enhanced.summary || prev.summary,
          experiences: enhanced.experiences && enhanced.experiences.length > 0
            ? enhanced.experiences.map((e, i) => ({
                title: e.title || prev.experiences[i]?.title || "",
                company: e.company || prev.experiences[i]?.company || "",
                duration: e.duration || prev.experiences[i]?.duration || "",
                description: e.description || prev.experiences[i]?.description || "",
              }))
            : prev.experiences,
          skills: {
            technical: enhanced.skills?.technical || prev.skills.technical,
            soft: enhanced.skills?.soft || prev.skills.soft,
            languages: enhanced.skills?.languages || prev.skills.languages,
          },
        }));
        toast({ title: "CV Regenerated! ✨", description: "Your content has been refreshed." });
      }
    } catch (err: any) {
      toast({ title: "Regeneration failed", description: err.message, variant: "destructive" });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Please log in to save", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const title = formData.fullName ? `${formData.fullName}'s CV` : "Untitled CV";
      
      if (savedCvId) {
        // Update existing CV
        const { error } = await supabase.from("user_cvs").update({
          title,
          template_id: selectedTemplate || "classic-professional",
          form_data: formData as any,
          customization: customization as any,
        }).eq("id", savedCvId).eq("user_id", user.id);
        if (error) throw error;
        toast({ title: "CV Updated!", description: "Your changes have been saved." });
      } else {
        // Create new CV
        const { data, error } = await supabase.from("user_cvs").insert({
          user_id: user.id, title,
          template_id: selectedTemplate || "classic-professional",
          form_data: formData as any, customization: customization as any,
        }).select("id").single();
        if (error) throw error;
        setSavedCvId(data.id);
        toast({ title: "CV Saved!", description: "Your CV has been saved to your dashboard." });
      }
      
      localStorage.removeItem(`cv-draft-${user.id}`);
    } catch (err: any) {
      toast({ title: "Failed to save", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    try {
      await generatePDF({ element: previewRef.current, filename: `${formData.fullName || "resume"}.pdf` });
      toast({ title: "PDF Downloaded!" });
    } catch {
      toast({ title: "PDF failed", description: "Could not generate PDF.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareCV = async () => {
    if (!savedCvId) {
      // Save first, then share
      await handleSave();
    }
    if (savedCvId) {
      // Make it public
      await supabase.from("user_cvs").update({ is_public: true }).eq("id", savedCvId);
      setShareDialogOpen(true);
    }
  };

  // Auto-save draft
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user && formData.fullName && currentStep !== "cooking") {
        localStorage.setItem(`cv-draft-${user.id}`, JSON.stringify({ formData, selectedTemplate, customization }));
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [formData, selectedTemplate, customization, user, currentStep]);

  // Load draft (only if not editing)
  useEffect(() => {
    if (user && !editId) {
      const draft = localStorage.getItem(`cv-draft-${user.id}`);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed.formData) setFormData(parsed.formData);
          if (parsed.selectedTemplate) setSelectedTemplate(parsed.selectedTemplate);
          if (parsed.customization) setCustomization(parsed.customization);
        } catch {}
      }
    }
  }, [user, editId]);

  // Cooking transition overlay
  if (currentStep === "cooking") {
    return <CookingTransition onComplete={handleCookingComplete} isProcessing={isEnhancing} />;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "upload":
        return <CVUploadStep onExtractData={handleExtractData} onSkip={handleSkipUpload} />;
      case "template":
        return <TemplateStep selectedTemplate={selectedTemplate} onSelectTemplate={handleSelectTemplate} />;
      case "personal":
        return <PersonalInfoStep formData={{ ...formData, experiences: formData.experiences, skills: formData.skills }} onUpdate={updateFormData} />;
      case "experience":
        return <ExperienceStep experiences={formData.experiences} onUpdate={(experiences) => setFormData((prev) => ({ ...prev, experiences }))} />;
      case "education":
        return <EducationStep education={formData.education} onUpdate={(education) => setFormData((prev) => ({ ...prev, education }))} />;
      case "skills":
        return <SkillsStep skills={formData.skills} onUpdate={(skills) => setFormData((prev) => ({ ...prev, skills }))} experiences={formData.experiences} />;
      default:
        return null;
    }
  };

  // Review screen
  if (currentStep === "review") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header variant="dashboard" />
        <div className="flex-1">
          {/* Top bar */}
          <div className="border-b border-border bg-card">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6">
              <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
                <ChevronLeft className="h-4 w-4" /> Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline" size="sm" className="gap-2 text-xs"
                  onClick={handleRegenerate} disabled={isRegenerating}
                >
                  {isRegenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  Regenerate
                </Button>
                <Button
                  variant="outline" size="sm" className="gap-2 text-xs"
                  onClick={() => setCurrentStep("personal")}
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="outline" size="sm" className="gap-2 text-xs"
                  onClick={handleDownloadPDF} disabled={isDownloading}
                >
                  {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                  PDF
                </Button>
                <Button
                  variant="outline" size="sm" className="gap-2 text-xs"
                  onClick={handleShareCV}
                >
                  <Share2 className="h-3.5 w-3.5" /> Share
                </Button>
                <Button
                  variant="coral" size="sm" className="gap-2 text-xs"
                  onClick={handleSave} disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  {savedCvId ? "Update CV" : "Save CV"}
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
            {/* Zoom controls */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-foreground">Your CV is Ready 🎉</h2>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="min-w-[3.5rem] text-center text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.min(1.2, z + 0.1))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsFullscreen(true)}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-auto rounded-xl border border-border bg-muted/30 shadow-inner" style={{ maxHeight: "78vh" }}>
              <div className="flex justify-center p-8">
                <div
                  ref={previewRef}
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top center",
                    width: "210mm",
                    minHeight: "297mm",
                    transition: "transform 0.2s ease",
                  }}
                  className="rounded-sm shadow-2xl"
                >
                  <CVPreviewDocument formData={formData} template={selectedTemplate} customization={customization} />
                </div>
              </div>
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
                <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(false)}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-center">
                <div style={{ transform: "scale(0.9)", transformOrigin: "top center", width: "210mm", minHeight: "297mm" }} className="shadow-2xl">
                  <CVPreviewDocument formData={formData} template={selectedTemplate} customization={customization} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Share Dialog */}
        {savedCvId && (
          <CVShareDialog
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
            cvId={savedCvId}
            cvTitle={formData.fullName ? `${formData.fullName}'s CV` : "My CV"}
          />
        )}
      </div>
    );
  }

  // Main builder flow
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header variant="dashboard" />

      <div className="flex-1">
        {/* Top Bar with Progress */}
        <div className="border-b border-border bg-card">
          <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
                <ChevronLeft className="h-4 w-4" /> Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Step {Math.min(visibleIndex + 1, VISIBLE_STEPS.length)} of {VISIBLE_STEPS.length}
                </span>
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-secondary transition-all duration-500"
                    style={{ width: `${((Math.min(visibleIndex + 1, VISIBLE_STEPS.length)) / VISIBLE_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {VISIBLE_STEPS.map((step, i) => {
                const done = i < visibleIndex;
                const active = step.key === currentStep;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center">
                    <button
                      onClick={() => i <= visibleIndex && goToStep(step.key)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : done
                            ? "bg-secondary/10 text-secondary hover:bg-secondary/20"
                            : "text-muted-foreground"
                      } ${i <= visibleIndex ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                    >
                      <div className={`flex h-6 w-6 items-center justify-center rounded-md ${
                        active ? "bg-primary-foreground/20" : done ? "bg-secondary/20" : "bg-muted"
                      }`}>
                        {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                      </div>
                      <span className="hidden sm:inline">{step.label}</span>
                    </button>
                    {i < VISIBLE_STEPS.length - 1 && (
                      <div className={`mx-1 h-px w-4 ${i < visibleIndex ? "bg-secondary" : "bg-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
          {showLivePreview ? (
            /* Split Layout: Form + Live Preview */
            <div className="flex gap-6">
              {/* Left: Form */}
              <div className="w-full lg:w-1/2 xl:w-[55%]">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  {renderStepContent()}
                  {/* Navigation */}
                  <div className="mt-8 flex justify-between border-t border-border pt-6">
                    <Button variant="outline" onClick={goPrev} className="gap-2">
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    {currentStep === "skills" ? (
                      <Button variant="coral" onClick={handleCookCV} className="gap-2">
                        <FileText className="h-4 w-4" /> Generate CV
                      </Button>
                    ) : (
                      <Button variant="coral" onClick={goNext} className="gap-2">
                        Next <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Live Preview */}
              <div className="hidden lg:block lg:w-1/2 xl:w-[45%]">
                <div className="sticky top-20">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Preview</h3>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}>
                        <ZoomOut className="h-3.5 w-3.5" />
                      </Button>
                      <span className="min-w-[3rem] text-center text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.min(1.2, z + 0.1))}>
                        <ZoomIn className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsFullscreen(!isFullscreen)}>
                        {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>
                  <div
                    className={`overflow-auto rounded-xl border border-border bg-muted/30 shadow-inner ${
                      isFullscreen ? "fixed inset-4 z-50 bg-background p-8" : "max-h-[calc(100vh-12rem)]"
                    }`}
                  >
                    {isFullscreen && (
                      <div className="mb-4 flex justify-between">
                        <h3 className="font-heading text-lg font-semibold">CV Preview</h3>
                        <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(false)}>
                          <Minimize2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex justify-center p-4" style={{ minHeight: isFullscreen ? "auto" : "500px" }}>
                      <div
                        style={{
                          transform: `scale(${isFullscreen ? 0.85 : zoom})`,
                          transformOrigin: "top center",
                          width: "210mm",
                          minHeight: "297mm",
                          transition: "transform 0.2s ease",
                        }}
                        className="rounded-sm shadow-2xl"
                      >
                        <CVPreviewDocument formData={formData} template={selectedTemplate} customization={customization} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Full Width: Upload & Template steps */
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
              {renderStepContent()}
              {/* Navigation */}
              {currentStep !== "upload" && (
                <div className="mt-8 flex justify-between border-t border-border pt-6">
                  <Button variant="outline" onClick={goPrev} className="gap-2">
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <Button
                    variant="coral" onClick={goNext}
                    disabled={currentStep === "template" && !selectedTemplate}
                    className="gap-2"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen overlay backdrop */}
      {isFullscreen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsFullscreen(false)} />
      )}
    </div>
  );
};

export default CreateCV;
