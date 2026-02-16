import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2, CheckCircle2, Sparkles, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: { title: string; company: string; duration: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
  skills: {
    technical: string;
    soft: string;
    languages: string;
  };
}

interface CVUploadStepProps {
  onExtractData: (data: Partial<CVData>) => void;
  onSkip: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const CVUploadStep = ({ onExtractData, onSkip }: CVUploadStepProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtracted, setIsExtracted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      return "Please upload a PDF or DOCX file.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB.";
    }
    return null;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      const err = validateFile(file);
      if (err) {
        setError(err);
        return;
      }
      setUploadedFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      const err = validateFile(file);
      if (err) {
        setError(err);
        return;
      }
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setIsExtracted(false);
    setError(null);
  };

  const handleExtract = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Please log in to use CV extraction.");
      }

      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-cv`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Extraction failed (${response.status})`);
      }

      const result = await response.json();
      const extracted = result.data;

      if (!extracted) {
        throw new Error("No data could be extracted from the document.");
      }

      // Normalize the extracted data
      const normalizedData: Partial<CVData> = {
        fullName: extracted.fullName || "",
        email: extracted.email || "",
        phone: extracted.phone || "",
        location: extracted.location || "",
        summary: extracted.summary || "",
        experiences: Array.isArray(extracted.experiences) && extracted.experiences.length > 0
          ? extracted.experiences.map((exp: any) => ({
              title: exp.title || "",
              company: exp.company || "",
              duration: exp.duration || "",
              description: exp.description || "",
            }))
          : undefined,
        education: Array.isArray(extracted.education) && extracted.education.length > 0
          ? extracted.education.map((edu: any) => ({
              degree: edu.degree || "",
              school: edu.school || "",
              year: edu.year || "",
            }))
          : undefined,
        skills: extracted.skills
          ? {
              technical: extracted.skills.technical || "",
              soft: extracted.skills.soft || "",
              languages: extracted.skills.languages || "",
            }
          : undefined,
      };

      setIsExtracted(true);
      onExtractData(normalizedData);
      toast({
        title: "CV Data Extracted!",
        description: "Your information has been populated across all steps.",
      });
    } catch (err: any) {
      console.error("Extraction error:", err);
      setError(err.message || "Failed to extract data. Please try again.");
      toast({
        title: "Extraction Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Upload Your Existing CV
        </h2>
        <p className="text-sm text-muted-foreground">
          Our AI will extract your information and populate all the forms automatically
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {!uploadedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Drag & drop your CV here
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Supports PDF and DOCX files (max 10MB)
          </p>
          <label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <span className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
              Browse Files
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {isExtracted ? (
              <div className="flex items-center gap-2 text-secondary">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Extracted</span>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                disabled={isProcessing}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {!isExtracted && (
            <Button
              variant="coral"
              size="lg"
              className="w-full gap-2"
              onClick={handleExtract}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Extracting with AI... This may take a moment
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Extract Information with AI
                </>
              )}
            </Button>
          )}

          {isExtracted && (
            <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Information Extracted Successfully!</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    We've populated all forms with data from your CV. Review and edit in the next steps.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={onSkip}
      >
        Start Fresh - I'll Enter My Information
      </Button>
    </div>
  );
};

export default CVUploadStep;
