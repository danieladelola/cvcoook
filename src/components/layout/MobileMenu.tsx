import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, FileText, FileUser, Mail, Sparkles, Layout, CheckCircle, BookOpen, Zap, Edit3, DollarSign, Building, HelpCircle, Layers, PenTool, Truck, Users, Stethoscope, Code, Mic, MessageCircle, Star } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MobileMenuProps {
  variant: "default" | "dashboard";
  onClose: () => void;
}

interface MenuSection {
  title: string;
  items: { href: string; title: string; icon?: React.ReactNode }[];
}

const MobileMenu = ({ variant, onClose }: MobileMenuProps) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const dashboardLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My CVs", href: "/dashboard/cvs" },
    { name: "Templates", href: "/dashboard/templates" },
    { name: "Pricing", href: "/pricing" },
  ];

  const menuSections: { name: string; sections: MenuSection[] }[] = [
    {
      name: "Builders",
      sections: [
        {
          title: "Create Documents",
          items: [
            { href: "/resume-builder", title: "Resume Builder", icon: <FileText className="h-4 w-4" /> },
            { href: "/cv-builder", title: "CV Builder", icon: <FileUser className="h-4 w-4" /> },
            { href: "/cover-letter-builder", title: "Cover Letter Builder", icon: <Mail className="h-4 w-4" /> },
          ],
        },
      ],
    },
    {
      name: "Resumes",
      sections: [
        {
          title: "Tools",
          items: [
            { href: "/ai-resume-builder", title: "AI Resume Builder", icon: <Sparkles className="h-4 w-4" /> },
            { href: "/templates", title: "Resume Templates", icon: <Layout className="h-4 w-4" /> },
            { href: "/ats-checker", title: "ATS Resume Checker", icon: <CheckCircle className="h-4 w-4" /> },
            { href: "/how-to-write", title: "How to Write a Resume", icon: <BookOpen className="h-4 w-4" /> },
          ],
        },
      ],
    },
    {
      name: "Cover Letters",
      sections: [
        {
          title: "Tools",
          items: [
            { href: "/ai-cover-letter", title: "AI Cover Letter Generator", icon: <Sparkles className="h-4 w-4" /> },
            { href: "/cover-letter-format", title: "Cover Letter Format", icon: <Layout className="h-4 w-4" /> },
            { href: "/how-to-write-cover-letter", title: "How to Write", icon: <PenTool className="h-4 w-4" /> },
            { href: "/cover-letter-vs-resume", title: "Cover Letter vs Resume", icon: <Layers className="h-4 w-4" /> },
          ],
        },
      ],
    },
    {
      name: "CVs",
      sections: [
        {
          title: "Tools",
          items: [
            { href: "/cv-maker", title: "CV Maker", icon: <FileUser className="h-4 w-4" /> },
            { href: "/cv-templates", title: "CV Templates", icon: <Layout className="h-4 w-4" /> },
            { href: "/cv-vs-resume", title: "CV vs Resume", icon: <Layers className="h-4 w-4" /> },
            { href: "/how-to-make-cv", title: "How to Make a CV", icon: <BookOpen className="h-4 w-4" /> },
          ],
        },
      ],
    },
    {
      name: "Resources",
      sections: [
        {
          title: "AI Tools",
          items: [
            { href: "/resume-summary-generator", title: "Resume Summary Generator", icon: <Edit3 className="h-4 w-4" /> },
            { href: "/skills-generator", title: "AI Skills Generator", icon: <Zap className="h-4 w-4" /> },
            { href: "/interview-prep", title: "Interview Prep Tools", icon: <Mic className="h-4 w-4" /> },
          ],
        },
        {
          title: "Support",
          items: [
            { href: "/about", title: "About Us", icon: <Building className="h-4 w-4" /> },
            { href: "/pricing", title: "Pricing", icon: <DollarSign className="h-4 w-4" /> },
            { href: "/contact", title: "Contact", icon: <MessageCircle className="h-4 w-4" /> },
            { href: "/faq", title: "FAQs", icon: <HelpCircle className="h-4 w-4" /> },
          ],
        },
      ],
    },
  ];

  const toggleSection = (name: string) => {
    setOpenSection(openSection === name ? null : name);
  };

  if (variant === "dashboard") {
    return (
      <div className="border-t border-border bg-card lg:hidden">
        <nav className="container flex flex-col gap-2 py-4">
          {dashboardLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              onClick={onClose}
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <Link to="/dashboard/profile" onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start">Account</Button>
            </Link>
            <Link to="/" onClick={onClose}>
              <Button variant="outline" className="w-full">Logout</Button>
            </Link>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="border-t border-border bg-card lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="container flex flex-col py-4">
        {menuSections.map((menu) => (
          <Collapsible
            key={menu.name}
            open={openSection === menu.name}
            onOpenChange={() => toggleSection(menu.name)}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted">
              {menu.name}
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  openSection === menu.name ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4">
              {menu.sections.map((section) => (
                <div key={section.title} className="mb-3">
                  <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </p>
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-secondary"
                      onClick={onClose}
                    >
                      {item.icon && <span className="text-secondary">{item.icon}</span>}
                      {item.title}
                    </Link>
                  ))}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        <Link
          to="/pricing"
          className="rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
          onClick={onClose}
        >
          Pricing
        </Link>

        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 px-4">
          <Link to="/login" onClick={onClose}>
            <Button variant="navOutline" className="w-full">Login</Button>
          </Link>
          <Link to="/register" onClick={onClose}>
            <Button variant="coral" className="w-full">Start Now</Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
