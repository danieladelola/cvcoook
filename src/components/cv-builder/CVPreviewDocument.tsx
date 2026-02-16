import { forwardRef } from "react";
import { CVCustomization, fontOptions, defaultCustomization, getTemplateById } from "@/lib/cv-templates";

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

interface CVPreviewDocumentProps {
  formData: FormData;
  template?: string;
  customization?: CVCustomization;
}

const CVPreviewDocument = forwardRef<HTMLDivElement, CVPreviewDocumentProps>(
  ({ formData, template = "classic-professional", customization }, ref) => {
    const tmpl = getTemplateById(template);
    const cust = customization || defaultCustomization;
    const c = cust.colorScheme || tmpl?.defaultColors || defaultCustomization.colorScheme;
    const font = fontOptions.find((f) => f.id === cust.fontFamily) || fontOptions[0];

    const sizeMap = { small: "0.8rem", medium: "0.9rem", large: "1rem" };
    const headingSize = { small: "1.1rem", medium: "1.3rem", large: "1.5rem" };
    const sectionGap = { compact: "0.75rem", normal: "1.25rem", relaxed: "1.75rem" };
    const padding = { compact: "1rem", normal: "1.5rem", relaxed: "2rem" };

    const layout = cust.layout || tmpl?.layout || "top-header";

    const baseFontSize = sizeMap[cust.fontSize];
    const gap = sectionGap[cust.spacing];
    const pad = padding[cust.spacing];

    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
      <h2
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: c.sectionTitle || c.primary,
          borderBottom: `2px solid ${c.accent}`,
          paddingBottom: "0.25rem",
          marginBottom: "0.5rem",
        }}
      >
        {children}
      </h2>
    );

    const ContactInfo = ({ color = c.headerText, inline = false }: { color?: string; inline?: boolean }) => {
      const items = [formData.email, formData.phone, formData.location].filter(Boolean);
      return (
        <div style={{ display: inline ? "flex" : "block", gap: inline ? "1rem" : 0, flexWrap: "wrap" }}>
          {items.map((item, i) => (
            <span key={i} style={{ fontSize: "0.75rem", color, opacity: 0.85, display: inline ? "inline" : "block", marginBottom: inline ? 0 : "0.15rem" }}>
              {inline && i > 0 ? `• ${item}` : item}
            </span>
          ))}
        </div>
      );
    };

    const ExperienceSection = () => {
      const exps = formData.experiences.filter((e) => e.title);
      if (!exps.length) return null;
      return (
        <section>
          <SectionTitle>Work Experience</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {exps.map((exp, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: baseFontSize, color: c.bodyText }}>{exp.title}</div>
                    <div style={{ fontSize: "0.8rem", color: c.bodyText, opacity: 0.7 }}>{exp.company}</div>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: c.bodyText, opacity: 0.6, background: "#f3f4f6", padding: "0.15rem 0.5rem", borderRadius: "0.25rem" }}>
                    {exp.duration}
                  </span>
                </div>
                {exp.description && (
                  <p style={{ fontSize: "0.8rem", color: c.bodyText, opacity: 0.8, marginTop: "0.35rem", lineHeight: 1.5 }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    };

    const EducationSection = () => {
      const edu = formData.education.filter((e) => e.degree);
      if (!edu.length) return null;
      return (
        <section>
          <SectionTitle>Education</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {edu.map((e, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: baseFontSize, color: c.bodyText }}>{e.degree}</div>
                  <div style={{ fontSize: "0.8rem", color: c.bodyText, opacity: 0.7 }}>{e.school}</div>
                </div>
                <span style={{ fontSize: "0.7rem", color: c.bodyText, opacity: 0.6 }}>{e.year}</span>
              </div>
            ))}
          </div>
        </section>
      );
    };

    const SkillsSection = ({ compact = false }: { compact?: boolean }) => {
      const { technical, soft, languages } = formData.skills;
      if (!technical && !soft && !languages) return null;
      if (compact) {
        return (
          <section>
            <SectionTitle>Skills</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
              {[...technical.split(","), ...soft.split(",")].filter(Boolean).map((s, i) => (
                <span key={i} style={{ fontSize: "0.65rem", background: c.accent + "22", color: c.primary, padding: "0.15rem 0.5rem", borderRadius: "1rem" }}>
                  {s.trim()}
                </span>
              ))}
            </div>
            {languages && (
              <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: c.bodyText, opacity: 0.8 }}>
                <strong>Languages:</strong> {languages}
              </div>
            )}
          </section>
        );
      }
      return (
        <section>
          <SectionTitle>Skills</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {technical && <div style={{ fontSize: "0.8rem" }}><strong style={{ color: c.primary }}>Technical:</strong> <span style={{ color: c.bodyText }}>{technical}</span></div>}
            {soft && <div style={{ fontSize: "0.8rem" }}><strong style={{ color: c.primary }}>Soft Skills:</strong> <span style={{ color: c.bodyText }}>{soft}</span></div>}
            {languages && <div style={{ fontSize: "0.8rem" }}><strong style={{ color: c.primary }}>Languages:</strong> <span style={{ color: c.bodyText }}>{languages}</span></div>}
          </div>
        </section>
      );
    };

    const SummarySection = () => {
      if (!formData.summary) return null;
      return (
        <section>
          <SectionTitle>Professional Summary</SectionTitle>
          <p style={{ fontSize: "0.8rem", color: c.bodyText, lineHeight: 1.6, opacity: 0.85 }}>{formData.summary}</p>
        </section>
      );
    };

    // Layout renderers
    const renderTopHeader = () => (
      <>
        <div style={{ background: c.headerBg, color: c.headerText, padding: pad }}>
          <h1 style={{ fontSize: headingSize[cust.fontSize], fontWeight: 700 }}>{formData.fullName || "Your Name"}</h1>
          <ContactInfo inline />
        </div>
        <div style={{ padding: pad, display: "flex", flexDirection: "column", gap }}>
          <SummarySection />
          <ExperienceSection />
          <EducationSection />
          <SkillsSection />
        </div>
      </>
    );

    const renderSidebarLeft = () => (
      <div style={{ display: "flex", minHeight: "100%" }}>
        <div style={{ width: "35%", background: c.headerBg, color: c.headerText, padding: pad }}>
          {cust.showPhoto && (
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: c.headerText + "22", margin: "0 auto 0.75rem" }} />
          )}
          <h1 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{formData.fullName || "Your Name"}</h1>
          <ContactInfo />
          <div style={{ marginTop: "1.5rem" }}>
            <SkillsSection compact />
          </div>
        </div>
        <div style={{ flex: 1, padding: pad, display: "flex", flexDirection: "column", gap }}>
          <SummarySection />
          <ExperienceSection />
          <EducationSection />
        </div>
      </div>
    );

    const renderSidebarRight = () => (
      <div style={{ display: "flex", minHeight: "100%" }}>
        <div style={{ flex: 1, padding: pad }}>
          <h1 style={{ fontSize: headingSize[cust.fontSize], fontWeight: 700, color: c.primary, marginBottom: "0.25rem" }}>
            {formData.fullName || "Your Name"}
          </h1>
          <ContactInfo color={c.bodyText} inline />
          <div style={{ display: "flex", flexDirection: "column", gap, marginTop: gap }}>
            <SummarySection />
            <ExperienceSection />
            <EducationSection />
          </div>
        </div>
        <div style={{ width: "30%", background: c.headerBg, color: c.headerText, padding: pad }}>
          <SkillsSection compact />
        </div>
      </div>
    );

    const renderTwoColumn = () => (
      <>
        <div style={{ padding: pad, borderBottom: `3px solid ${c.primary}` }}>
          <h1 style={{ fontSize: headingSize[cust.fontSize], fontWeight: 700, color: c.primary }}>{formData.fullName || "Your Name"}</h1>
          <ContactInfo color={c.bodyText} inline />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: pad, padding: pad }}>
          <div style={{ display: "flex", flexDirection: "column", gap }}>
            <SummarySection />
            <ExperienceSection />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap }}>
            <EducationSection />
            <SkillsSection />
          </div>
        </div>
      </>
    );

    const renderSingleColumn = () => (
      <div style={{ padding: pad }}>
        <div style={{ borderBottom: `2px solid ${c.primary}`, paddingBottom: "0.75rem", marginBottom: gap }}>
          <h1 style={{ fontSize: headingSize[cust.fontSize], fontWeight: 700, color: c.primary }}>{formData.fullName || "Your Name"}</h1>
          <ContactInfo color={c.bodyText} inline />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap }}>
          <SummarySection />
          <ExperienceSection />
          <EducationSection />
          <SkillsSection />
        </div>
      </div>
    );

    const renderCompact = () => (
      <div style={{ padding: pad }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px solid ${c.primary}`, paddingBottom: "0.5rem", marginBottom: gap }}>
          <h1 style={{ fontSize: headingSize[cust.fontSize], fontWeight: 700, color: c.primary }}>{formData.fullName || "Your Name"}</h1>
          <ContactInfo color={c.bodyText} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <SummarySection />
          <ExperienceSection />
          <EducationSection />
          <SkillsSection compact />
        </div>
      </div>
    );

    const renderLayout = () => {
      switch (layout) {
        case "top-header": return renderTopHeader();
        case "sidebar-left": return renderSidebarLeft();
        case "sidebar-right": return renderSidebarRight();
        case "two-column": return renderTwoColumn();
        case "single-column": return renderSingleColumn();
        case "compact": return renderCompact();
        default: return renderTopHeader();
      }
    };

    return (
      <div
        ref={ref}
        className="w-full shadow-lg"
        style={{
          fontFamily: font.family,
          fontSize: baseFontSize,
          background: c.background,
          color: c.bodyText,
        }}
      >
        {renderLayout()}
      </div>
    );
  }
);

CVPreviewDocument.displayName = "CVPreviewDocument";

export default CVPreviewDocument;
