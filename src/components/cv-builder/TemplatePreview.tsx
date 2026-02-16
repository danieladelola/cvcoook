import { CVTemplate, ColorScheme } from "@/lib/cv-templates";

interface TemplatePreviewProps {
  template: CVTemplate;
  colors?: ColorScheme;
}

/** Miniature CV layout preview that visually represents each template's structure */
const TemplatePreview = ({ template, colors }: TemplatePreviewProps) => {
  const c = colors || template.defaultColors;

  const Line = ({ w = "100%", h = 3, color = "#e5e7eb" }: { w?: string; h?: number; color?: string }) => (
    <div style={{ width: w, height: h, background: color, borderRadius: 2 }} />
  );

  const Block = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`space-y-1 ${className}`}>{children}</div>
  );

  const renderSingleColumn = () => (
    <div className="flex flex-col h-full">
      <div style={{ background: c.headerBg }} className="px-3 py-2.5">
        <Line w="55%" h={5} color={c.headerText + "cc"} />
        <div className="flex gap-1 mt-1.5">
          <Line w="25%" h={2} color={c.headerText + "88"} />
          <Line w="20%" h={2} color={c.headerText + "88"} />
        </div>
      </div>
      <div className="flex-1 p-3 space-y-2.5">
        <Block>
          <Line w="30%" h={2.5} color={c.primary} />
          <Line w="100%" color="#e5e7eb" />
          <Line w="85%" color="#e5e7eb" />
        </Block>
        <Block>
          <Line w="35%" h={2.5} color={c.primary} />
          <Line w="45%" h={2.5} color={c.bodyText + "44"} />
          <Line w="100%" color="#e5e7eb" />
          <Line w="75%" color="#e5e7eb" />
        </Block>
        <Block>
          <Line w="28%" h={2.5} color={c.primary} />
          <Line w="90%" color="#e5e7eb" />
        </Block>
      </div>
    </div>
  );

  const renderSidebarLeft = () => (
    <div className="flex h-full">
      <div style={{ background: c.headerBg }} className="w-[35%] p-2.5 space-y-2.5">
        <div className="w-8 h-8 rounded-full mx-auto" style={{ background: c.headerText + "33" }} />
        <Line w="80%" h={3} color={c.headerText + "cc"} />
        <div className="space-y-1 pt-1">
          <Line w="60%" h={2} color={c.headerText + "88"} />
          <Line w="70%" h={2} color={c.headerText + "88"} />
          <Line w="50%" h={2} color={c.headerText + "88"} />
        </div>
        <div className="pt-1.5 space-y-1">
          <Line w="65%" h={2} color={c.accent} />
          <div className="flex gap-1 flex-wrap">
            {[35, 45, 40, 30].map((w, i) => (
              <div key={i} style={{ width: `${w}%`, height: 8, background: c.headerText + "22", borderRadius: 3 }} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 p-2.5 space-y-2">
        <Block>
          <Line w="40%" h={2.5} color={c.primary} />
          <Line w="100%" color="#e5e7eb" />
          <Line w="90%" color="#e5e7eb" />
        </Block>
        <Block>
          <Line w="35%" h={2.5} color={c.primary} />
          <Line w="50%" h={2.5} color={c.bodyText + "44"} />
          <Line w="100%" color="#e5e7eb" />
          <Line w="80%" color="#e5e7eb" />
        </Block>
        <Block>
          <Line w="30%" h={2.5} color={c.primary} />
          <Line w="100%" color="#e5e7eb" />
          <Line w="65%" color="#e5e7eb" />
        </Block>
      </div>
    </div>
  );

  const renderSidebarRight = () => (
    <div className="flex h-full">
      <div className="flex-1 p-2.5 space-y-2">
        <div>
          <Line w="60%" h={5} color={c.primary} />
          <div className="flex gap-1 mt-1">
            <Line w="25%" h={2} color={c.bodyText + "66"} />
            <Line w="20%" h={2} color={c.bodyText + "66"} />
          </div>
        </div>
        <Block>
          <Line w="35%" h={2.5} color={c.primary} />
          <Line w="100%" color="#e5e7eb" />
          <Line w="90%" color="#e5e7eb" />
        </Block>
        <Block>
          <Line w="40%" h={2.5} color={c.primary} />
          <Line w="100%" color="#e5e7eb" />
          <Line w="70%" color="#e5e7eb" />
        </Block>
      </div>
      <div style={{ background: c.headerBg }} className="w-[30%] p-2.5 space-y-2">
        <div className="space-y-1">
          <Line w="70%" h={2} color={c.accent} />
          <Line w="80%" h={2} color={c.headerText + "77"} />
          <Line w="60%" h={2} color={c.headerText + "77"} />
        </div>
        <div className="space-y-1 pt-1">
          <Line w="65%" h={2} color={c.accent} />
          <div className="flex gap-1 flex-wrap">
            {[40, 50, 35].map((w, i) => (
              <div key={i} style={{ width: `${w}%`, height: 7, background: c.headerText + "22", borderRadius: 3 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTopHeader = () => (
    <div className="flex flex-col h-full">
      <div style={{ background: c.headerBg }} className="px-3 py-3">
        <Line w="50%" h={5} color={c.headerText + "dd"} />
        <Line w="35%" h={2} color={c.headerText + "77"} />
        <div className="flex gap-2 mt-1.5">
          <Line w="20%" h={2} color={c.accent} />
          <Line w="20%" h={2} color={c.accent} />
          <Line w="20%" h={2} color={c.accent} />
        </div>
      </div>
      <div className="flex-1 p-2.5 grid grid-cols-2 gap-2">
        <Block>
          <Line w="60%" h={2.5} color={c.primary} />
          <Line w="100%" color="#e5e7eb" />
          <Line w="85%" color="#e5e7eb" />
          <Line w="70%" color="#e5e7eb" />
        </Block>
        <Block>
          <Line w="55%" h={2.5} color={c.primary} />
          <Line w="100%" color="#e5e7eb" />
          <Line w="90%" color="#e5e7eb" />
        </Block>
      </div>
    </div>
  );

  const renderTwoColumn = () => (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2" style={{ borderBottom: `2px solid ${c.primary}` }}>
        <Line w="55%" h={5} color={c.primary} />
        <div className="flex gap-1 mt-1">
          <Line w="18%" h={2} color={c.bodyText + "66"} />
          <Line w="22%" h={2} color={c.bodyText + "66"} />
          <Line w="18%" h={2} color={c.bodyText + "66"} />
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 p-2.5">
        <Block>
          <Line w="50%" h={2.5} color={c.primary} />
          <Line w="60%" h={2.5} color={c.bodyText + "44"} />
          <Line w="100%" color="#e5e7eb" />
          <Line w="80%" color="#e5e7eb" />
          <Line w="50%" h={2.5} color={c.bodyText + "44"} />
          <Line w="100%" color="#e5e7eb" />
          <Line w="70%" color="#e5e7eb" />
        </Block>
        <Block>
          <Line w="45%" h={2.5} color={c.primary} />
          <Line w="100%" color="#e5e7eb" />
          <Line w="65%" color="#e5e7eb" />
          <div className="pt-1">
            <Line w="50%" h={2.5} color={c.primary} />
            <div className="flex gap-1 flex-wrap mt-1">
              {[40, 50, 35, 45].map((w, i) => (
                <div key={i} style={{ width: `${w}%`, height: 7, background: c.accent + "33", borderRadius: 3 }} />
              ))}
            </div>
          </div>
        </Block>
      </div>
    </div>
  );

  const renderCompact = () => (
    <div className="flex flex-col h-full p-2.5 space-y-1.5">
      <div className="flex justify-between items-start">
        <div>
          <Line w="120px" h={5} color={c.primary} />
          <Line w="80px" h={2} color={c.bodyText + "66"} />
        </div>
        <div className="text-right space-y-0.5">
          <Line w="60px" h={2} color={c.bodyText + "66"} />
          <Line w="50px" h={2} color={c.bodyText + "66"} />
        </div>
      </div>
      <div style={{ height: 1, background: c.primary }} />
      <Block>
        <Line w="100%" color="#e5e7eb" />
        <Line w="90%" color="#e5e7eb" />
      </Block>
      <Line w="30%" h={2.5} color={c.primary} />
      <Block>
        <div className="flex justify-between">
          <Line w="40%" h={2.5} color={c.bodyText + "77"} />
          <Line w="20%" h={2} color={c.bodyText + "55"} />
        </div>
        <Line w="100%" color="#e5e7eb" />
        <Line w="80%" color="#e5e7eb" />
      </Block>
      <Line w="25%" h={2.5} color={c.primary} />
      <Block>
        <Line w="85%" color="#e5e7eb" />
        <Line w="60%" color="#e5e7eb" />
      </Block>
    </div>
  );

  const renderLayout = () => {
    switch (template.layout) {
      case "single-column": return renderSingleColumn();
      case "sidebar-left": return renderSidebarLeft();
      case "sidebar-right": return renderSidebarRight();
      case "top-header": return renderTopHeader();
      case "two-column": return renderTwoColumn();
      case "compact": return renderCompact();
      default: return renderSingleColumn();
    }
  };

  return (
    <div
      className="aspect-[3/4] rounded-md overflow-hidden bg-white shadow-sm"
      style={{ background: c.background }}
    >
      {renderLayout()}
    </div>
  );
};

export default TemplatePreview;
