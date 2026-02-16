import { CVCustomization, fontOptions, colorSchemes, ColorScheme } from "@/lib/cv-templates";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Type, Palette, Layout, Space, ImageIcon } from "lucide-react";

interface CustomizationPanelProps {
  customization: CVCustomization;
  onUpdate: (customization: CVCustomization) => void;
}

const CustomizationPanel = ({ customization, onUpdate }: CustomizationPanelProps) => {
  const update = (partial: Partial<CVCustomization>) => {
    onUpdate({ ...customization, ...partial });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground">Customize Your CV</h2>
        <p className="text-sm text-muted-foreground">Personalize fonts, colors, layout, and spacing</p>
      </div>

      {/* Font Family */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Type className="h-4 w-4 text-secondary" /> Font Family
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {fontOptions.map((font) => (
            <button
              key={font.id}
              onClick={() => update({ fontFamily: font.id })}
              className={`relative rounded-lg border-2 p-3 text-left transition-all ${
                customization.fontFamily === font.id
                  ? "border-secondary bg-secondary/5 shadow-sm"
                  : "border-border hover:border-secondary/40"
              }`}
            >
              <span className="block text-sm font-semibold text-foreground" style={{ fontFamily: font.family }}>
                {font.name}
              </span>
              <span className="text-xs text-muted-foreground">{font.style}</span>
              {customization.fontFamily === font.id && (
                <Check className="absolute right-2 top-2 h-3.5 w-3.5 text-secondary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Font Size</Label>
        <div className="flex gap-2">
          {(["small", "medium", "large"] as const).map((size) => (
            <button
              key={size}
              onClick={() => update({ fontSize: size })}
              className={`flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                customization.fontSize === size
                  ? "border-secondary bg-secondary/5 text-secondary"
                  : "border-border text-muted-foreground hover:border-secondary/40"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Scheme */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Palette className="h-4 w-4 text-secondary" /> Color Scheme
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => update({ colorScheme: scheme.colors })}
              className={`relative rounded-lg border-2 p-2.5 transition-all ${
                customization.colorScheme.primary === scheme.colors.primary
                  ? "border-secondary shadow-sm"
                  : "border-border hover:border-secondary/40"
              }`}
            >
              <div className="flex gap-1 mb-1.5">
                <div className="h-5 w-5 rounded-full" style={{ background: scheme.colors.primary }} />
                <div className="h-5 w-5 rounded-full" style={{ background: scheme.colors.accent }} />
              </div>
              <span className="text-xs font-medium text-foreground leading-tight block">{scheme.name}</span>
              {customization.colorScheme.primary === scheme.colors.primary && (
                <Check className="absolute right-1.5 top-1.5 h-3 w-3 text-secondary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-semibold">
          <Space className="h-4 w-4 text-secondary" /> Spacing
        </Label>
        <div className="flex gap-2">
          {(["compact", "normal", "relaxed"] as const).map((sp) => (
            <button
              key={sp}
              onClick={() => update({ spacing: sp })}
              className={`flex-1 rounded-lg border-2 px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                customization.spacing === sp
                  ? "border-secondary bg-secondary/5 text-secondary"
                  : "border-border text-muted-foreground hover:border-secondary/40"
              }`}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* Show Photo Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div className="flex items-center gap-3">
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
          <div>
            <span className="text-sm font-medium text-foreground">Profile Photo</span>
            <p className="text-xs text-muted-foreground">Add a photo to your CV header</p>
          </div>
        </div>
        <button
          onClick={() => update({ showPhoto: !customization.showPhoto })}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            customization.showPhoto ? "bg-secondary" : "bg-muted"
          }`}
        >
          <div
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              customization.showPhoto ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default CustomizationPanel;
