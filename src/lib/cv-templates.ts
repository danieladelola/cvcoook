// CV Template System - Definitions, metadata, and customization options

import professionalImg from "@/assets/templates/professional.jpg";
import modernImg from "@/assets/templates/modern.jpg";
import creativeImg from "@/assets/templates/creative.jpg";
import minimalImg from "@/assets/templates/minimal.jpg";
import executiveImg from "@/assets/templates/executive.jpg";
import atsFriendlyImg from "@/assets/templates/ats-friendly.jpg";

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  level: TemplateLevel[];
  industries: string[];
  layout: LayoutType;
  defaultColors: ColorScheme;
  featured: boolean;
  coverImage: string;
}

export type TemplateCategory = "professional" | "modern" | "creative" | "minimal" | "executive" | "ats-friendly";
export type TemplateLevel = "entry" | "mid" | "senior" | "executive";
export type LayoutType = "single-column" | "two-column" | "sidebar-left" | "sidebar-right" | "top-header" | "compact";

export interface ColorScheme {
  primary: string;
  accent: string;
  headerBg: string;
  headerText: string;
  sectionTitle: string;
  bodyText: string;
  background: string;
}

export interface CVCustomization {
  fontFamily: string;
  fontSize: "small" | "medium" | "large";
  colorScheme: ColorScheme;
  layout: LayoutType;
  spacing: "compact" | "normal" | "relaxed";
  showPhoto: boolean;
}

export const fontOptions = [
  { id: "inter", name: "Inter", family: "'Inter', sans-serif", style: "Clean & Modern" },
  { id: "georgia", name: "Georgia", family: "'Georgia', serif", style: "Classic Serif" },
  { id: "roboto", name: "Roboto", family: "'Roboto', sans-serif", style: "Professional" },
  { id: "playfair", name: "Playfair Display", family: "'Playfair Display', serif", style: "Elegant" },
  { id: "source-sans", name: "Source Sans", family: "'Source Sans 3', sans-serif", style: "Technical" },
  { id: "lato", name: "Lato", family: "'Lato', sans-serif", style: "Friendly" },
  { id: "merriweather", name: "Merriweather", family: "'Merriweather', serif", style: "Traditional" },
  { id: "raleway", name: "Raleway", family: "'Raleway', sans-serif", style: "Stylish" },
];

export const colorSchemes: { id: string; name: string; colors: ColorScheme }[] = [
  {
    id: "navy-coral",
    name: "Navy & Coral",
    colors: {
      primary: "#1e3a5f", accent: "#e8734a", headerBg: "#1e3a5f",
      headerText: "#ffffff", sectionTitle: "#1e3a5f", bodyText: "#374151", background: "#ffffff",
    },
  },
  {
    id: "midnight-gold",
    name: "Midnight & Gold",
    colors: {
      primary: "#1a1a2e", accent: "#d4a03c", headerBg: "#1a1a2e",
      headerText: "#ffffff", sectionTitle: "#1a1a2e", bodyText: "#374151", background: "#ffffff",
    },
  },
  {
    id: "forest-sage",
    name: "Forest & Sage",
    colors: {
      primary: "#2d5016", accent: "#7ca65a", headerBg: "#2d5016",
      headerText: "#ffffff", sectionTitle: "#2d5016", bodyText: "#374151", background: "#ffffff",
    },
  },
  {
    id: "charcoal-teal",
    name: "Charcoal & Teal",
    colors: {
      primary: "#2d3436", accent: "#00b894", headerBg: "#2d3436",
      headerText: "#ffffff", sectionTitle: "#2d3436", bodyText: "#374151", background: "#ffffff",
    },
  },
  {
    id: "burgundy-cream",
    name: "Burgundy & Cream",
    colors: {
      primary: "#6b1d2a", accent: "#c9a96e", headerBg: "#6b1d2a",
      headerText: "#ffffff", sectionTitle: "#6b1d2a", bodyText: "#374151", background: "#fffdf7",
    },
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    colors: {
      primary: "#0077b6", accent: "#00b4d8", headerBg: "#0077b6",
      headerText: "#ffffff", sectionTitle: "#0077b6", bodyText: "#374151", background: "#ffffff",
    },
  },
  {
    id: "slate-orange",
    name: "Slate & Orange",
    colors: {
      primary: "#334155", accent: "#f97316", headerBg: "#334155",
      headerText: "#ffffff", sectionTitle: "#334155", bodyText: "#374151", background: "#ffffff",
    },
  },
  {
    id: "monochrome",
    name: "Monochrome",
    colors: {
      primary: "#111827", accent: "#6b7280", headerBg: "#111827",
      headerText: "#ffffff", sectionTitle: "#111827", bodyText: "#374151", background: "#ffffff",
    },
  },
  {
    id: "rose-blush",
    name: "Rose & Blush",
    colors: {
      primary: "#9f1239", accent: "#fb7185", headerBg: "#9f1239",
      headerText: "#ffffff", sectionTitle: "#9f1239", bodyText: "#374151", background: "#fff5f7",
    },
  },
  {
    id: "purple-lavender",
    name: "Purple & Lavender",
    colors: {
      primary: "#5b21b6", accent: "#a78bfa", headerBg: "#5b21b6",
      headerText: "#ffffff", sectionTitle: "#5b21b6", bodyText: "#374151", background: "#faf5ff",
    },
  },
];

const categoryImages: Record<TemplateCategory, string> = {
  professional: professionalImg,
  modern: modernImg,
  creative: creativeImg,
  minimal: minimalImg,
  executive: executiveImg,
  "ats-friendly": atsFriendlyImg,
};

export const templates: CVTemplate[] = [
  {
    id: "classic-professional",
    name: "Classic Professional",
    description: "Timeless design trusted by Fortune 500 companies",
    category: "professional",
    tags: ["corporate", "traditional", "formal"],
    level: ["entry", "mid", "senior", "executive"],
    industries: ["Any"],
    layout: "top-header",
    defaultColors: colorSchemes[0].colors,
    featured: true,
    coverImage: categoryImages.professional,
  },
  {
    id: "modern-sleek",
    name: "Modern Sleek",
    description: "Contemporary design with clean lines and bold accents",
    category: "modern",
    tags: ["tech", "startup", "contemporary"],
    level: ["entry", "mid", "senior"],
    industries: ["Technology", "Design", "Marketing"],
    layout: "sidebar-left",
    defaultColors: colorSchemes[3].colors,
    featured: true,
    coverImage: categoryImages.modern,
  },
  {
    id: "creative-edge",
    name: "Creative Edge",
    description: "Stand out with a unique layout for creative professionals",
    category: "creative",
    tags: ["design", "art", "portfolio"],
    level: ["entry", "mid"],
    industries: ["Design", "Media", "Arts"],
    layout: "sidebar-right",
    defaultColors: colorSchemes[9].colors,
    featured: false,
    coverImage: categoryImages.creative,
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Less is more — elegant simplicity that lets your content shine",
    category: "minimal",
    tags: ["simple", "elegant", "clean"],
    level: ["entry", "mid", "senior"],
    industries: ["Any"],
    layout: "single-column",
    defaultColors: colorSchemes[7].colors,
    featured: false,
    coverImage: categoryImages.minimal,
  },
  {
    id: "executive-suite",
    name: "Executive Suite",
    description: "Premium format for C-level executives and senior leaders",
    category: "executive",
    tags: ["leadership", "c-suite", "premium"],
    level: ["senior", "executive"],
    industries: ["Finance", "Consulting", "Management"],
    layout: "two-column",
    defaultColors: colorSchemes[1].colors,
    featured: true,
    coverImage: categoryImages.executive,
  },
  {
    id: "ats-optimized",
    name: "ATS Optimized",
    description: "Maximized for applicant tracking systems with clean parsing",
    category: "ats-friendly",
    tags: ["ats", "parsing", "optimized"],
    level: ["entry", "mid", "senior"],
    industries: ["Any"],
    layout: "compact",
    defaultColors: colorSchemes[5].colors,
    featured: false,
    coverImage: categoryImages["ats-friendly"],
  },
];

export const templateCategories: { id: TemplateCategory | "all"; name: string; description: string }[] = [
  { id: "all", name: "All Templates", description: "Browse all available templates" },
  { id: "professional", name: "Professional", description: "Classic, corporate designs" },
  { id: "modern", name: "Modern", description: "Contemporary and bold" },
  { id: "creative", name: "Creative", description: "For creative professionals" },
  { id: "minimal", name: "Minimal", description: "Clean and simple" },
  { id: "executive", name: "Executive", description: "For senior leaders" },
  { id: "ats-friendly", name: "ATS Friendly", description: "Optimized for ATS" },
];

export const defaultCustomization: CVCustomization = {
  fontFamily: "inter",
  fontSize: "medium",
  colorScheme: colorSchemes[0].colors,
  layout: "top-header",
  spacing: "normal",
  showPhoto: false,
};

export function getTemplateById(id: string): CVTemplate | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: TemplateCategory | "all"): CVTemplate[] {
  if (category === "all") return templates;
  return templates.filter((t) => t.category === category);
}
