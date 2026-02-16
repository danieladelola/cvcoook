import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface GeneratePDFOptions {
  element: HTMLElement;
  filename?: string;
}

export const generatePDF = async ({
  element,
  filename = "resume.pdf",
}: GeneratePDFOptions): Promise<void> => {
  try {
    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    
    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    
    // Calculate dimensions to fit the page
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;
    
    // Center the image
    const x = (pdfWidth - scaledWidth) / 2;
    const y = 0;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  }
};

export const generateDOCXContent = (formData: {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: { title: string; company: string; duration: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
  skills: { technical: string; soft: string; languages: string };
}): string => {
  let content = `${formData.fullName || "Your Name"}\n`;
  content += `${formData.email} | ${formData.phone} | ${formData.location}\n\n`;
  
  if (formData.summary) {
    content += `PROFESSIONAL SUMMARY\n${"=".repeat(50)}\n${formData.summary}\n\n`;
  }
  
  if (formData.experiences.some(exp => exp.title)) {
    content += `WORK EXPERIENCE\n${"=".repeat(50)}\n`;
    formData.experiences.forEach(exp => {
      if (exp.title) {
        content += `\n${exp.title}\n${exp.company} | ${exp.duration}\n`;
        if (exp.description) content += `${exp.description}\n`;
      }
    });
    content += "\n";
  }
  
  if (formData.education.some(edu => edu.degree)) {
    content += `EDUCATION\n${"=".repeat(50)}\n`;
    formData.education.forEach(edu => {
      if (edu.degree) {
        content += `\n${edu.degree}\n${edu.school} | ${edu.year}\n`;
      }
    });
    content += "\n";
  }
  
  if (formData.skills.technical || formData.skills.soft || formData.skills.languages) {
    content += `SKILLS\n${"=".repeat(50)}\n`;
    if (formData.skills.technical) content += `Technical: ${formData.skills.technical}\n`;
    if (formData.skills.soft) content += `Soft Skills: ${formData.skills.soft}\n`;
    if (formData.skills.languages) content += `Languages: ${formData.skills.languages}\n`;
  }
  
  return content;
};

export const downloadTextFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
