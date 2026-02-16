import { useState, useEffect } from "react";
import { ChefHat } from "lucide-react";

interface CookingTransitionProps {
  onComplete: () => void;
  isProcessing: boolean;
}

const COOKING_STEPS = [
  { label: "Reviewing your experience", duration: 2000 },
  { label: "Structuring your achievements", duration: 2500 },
  { label: "Optimizing for recruiters", duration: 2000 },
  { label: "Finalizing layout", duration: 1500 },
];

const CookingTransition = ({ onComplete, isProcessing }: CookingTransitionProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Animate steps forward while processing
  useEffect(() => {
    if (!isProcessing) return;
    const maxStep = COOKING_STEPS.length - 1;
    if (activeStep > maxStep) return;

    const timer = setTimeout(() => {
      if (activeStep < maxStep) {
        setActiveStep((s) => s + 1);
      }
    }, COOKING_STEPS[activeStep].duration);

    return () => clearTimeout(timer);
  }, [activeStep, isProcessing]);

  // Progress bar
  useEffect(() => {
    if (!isProcessing) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return 95; // hold at 95 until done
        return p + 0.5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isProcessing]);

  // When processing finishes, snap to 100 and call onComplete
  useEffect(() => {
    if (!isProcessing && progress > 0) {
      setProgress(100);
      setActiveStep(COOKING_STEPS.length);
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
  }, [isProcessing, progress, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md px-6 text-center">
        {/* Animated Icon */}
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-secondary/10" />
          <div
            className="absolute inset-2 rounded-full border-2 border-secondary/30"
            style={{
              animation: "spin 3s linear infinite",
            }}
          />
          <ChefHat className="relative h-10 w-10 text-secondary" />
        </div>

        {/* Title */}
        <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
          Cooking your new CV…
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Our AI is crafting a polished, professional resume for you
        </p>

        {/* Progress Bar */}
        <div className="mx-auto mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-secondary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{Math.round(progress)}%</p>

        {/* Steps */}
        <div className="mt-10 space-y-3 text-left">
          {COOKING_STEPS.map((step, i) => {
            const isDone = i < activeStep;
            const isActive = i === activeStep && isProcessing;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-500 ${
                  isDone
                    ? "bg-secondary/5"
                    : isActive
                      ? "bg-card shadow-sm border border-border"
                      : "opacity-40"
                }`}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                  {isDone ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20">
                      <svg className="h-3.5 w-3.5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : isActive ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isDone ? "text-secondary" : isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CookingTransition;
