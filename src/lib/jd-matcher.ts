// Job Description Matcher - Analyzes JD and generates tailored cover letter content

export interface JDAnalysis {
  jobTitle: string;
  companyName: string;
  keySkills: string[];
  requirements: string[];
  responsibilities: string[];
  tone: "formal" | "semi-formal" | "casual";
  industry: string;
}

export function analyzeJobDescription(jd: string): JDAnalysis {
  const lines = jd.split("\n").map((l) => l.trim()).filter(Boolean);
  const lower = jd.toLowerCase();

  // Extract key skills
  const skillPatterns = [
    "javascript", "typescript", "react", "node", "python", "java", "sql", "aws",
    "docker", "kubernetes", "git", "agile", "scrum", "project management",
    "communication", "leadership", "team management", "data analysis", "excel",
    "marketing", "sales", "customer service", "design", "figma", "photoshop",
    "accounting", "finance", "budget", "strategic planning", "negotiation",
    "problem solving", "critical thinking", "time management", "presentation",
    "machine learning", "ai", "cloud", "devops", "ci/cd", "rest api",
    "html", "css", "angular", "vue", "next.js", "mongodb", "postgresql",
  ];

  const keySkills = skillPatterns.filter((skill) => lower.includes(skill));

  // Extract requirements (lines with years/degree keywords)
  const requirements = lines.filter((line) =>
    /(\d+\+?\s*years?|bachelor|master|degree|certification|experience|proficiency|fluent)/i.test(line)
  ).slice(0, 5);

  // Extract responsibilities (lines starting with bullet-like patterns)
  const responsibilities = lines.filter((line) =>
    /^[-•*]\s|^(\d+\.)\s|^(manage|develop|lead|create|build|design|implement|coordinate|analyze|support|ensure)/i.test(line)
  ).slice(0, 5);

  // Detect tone
  let tone: "formal" | "semi-formal" | "casual" = "semi-formal";
  if (/startup|fun|passionate|exciting|dynamic|fast-paced/i.test(jd)) tone = "casual";
  if (/corporate|executive|senior|director|compliance|regulatory/i.test(jd)) tone = "formal";

  // Detect industry
  let industry = "General";
  if (/software|developer|engineering|tech|IT/i.test(jd)) industry = "Technology";
  else if (/marketing|brand|campaign|social media/i.test(jd)) industry = "Marketing";
  else if (/finance|accounting|banking|investment/i.test(jd)) industry = "Finance";
  else if (/healthcare|medical|clinical|patient/i.test(jd)) industry = "Healthcare";
  else if (/education|teaching|academic|university/i.test(jd)) industry = "Education";
  else if (/design|creative|art|visual/i.test(jd)) industry = "Design";
  else if (/sales|revenue|business development/i.test(jd)) industry = "Sales";

  return {
    jobTitle: "",
    companyName: "",
    keySkills,
    requirements,
    responsibilities,
    tone,
    industry,
  };
}

export function generateFromJD(
  analysis: JDAnalysis,
  personalInfo: { fullName: string; jobTitle: string; companyName: string; hiringManager: string }
): { opening: string; body: string; closing: string } {
  const { fullName, jobTitle, companyName, hiringManager } = personalInfo;
  const manager = hiringManager || "Hiring Manager";
  const skillsList = analysis.keySkills.slice(0, 5).join(", ");
  const topResponsibilities = analysis.responsibilities.slice(0, 3);

  const toneMap = {
    formal: {
      greeting: `Dear ${manager},`,
      closing: "I look forward to the opportunity to discuss how my qualifications align with your needs.",
    },
    "semi-formal": {
      greeting: `Dear ${manager},`,
      closing: "I'd welcome the chance to discuss how I can contribute to your team's success.",
    },
    casual: {
      greeting: `Hi ${manager},`,
      closing: "I'm excited about the possibility of joining your team and would love to chat further!",
    },
  };

  const t = toneMap[analysis.tone];

  const opening = `${t.greeting}\n\nI am writing to express my enthusiastic interest in the ${jobTitle} position at ${companyName}. With my proven expertise in ${skillsList || "relevant areas"}, I am confident I would make a meaningful contribution to your ${analysis.industry !== "General" ? analysis.industry.toLowerCase() : ""} team.`;

  let bodyContent = `Throughout my career, I have developed strong capabilities that directly align with your requirements for this role.`;

  if (analysis.keySkills.length > 0) {
    bodyContent += ` My proficiency in ${analysis.keySkills.slice(0, 3).join(", ")} has enabled me to deliver impactful results in previous positions.`;
  }

  if (topResponsibilities.length > 0) {
    bodyContent += `\n\nI am particularly drawn to this opportunity because the role's focus on ${topResponsibilities[0]?.replace(/^[-•*]\s*/, "").toLowerCase() || "key deliverables"} closely matches my experience and passion.`;
  }

  if (analysis.requirements.length > 0) {
    bodyContent += ` I meet the qualifications you're seeking, including ${analysis.requirements[0]?.replace(/^[-•*]\s*/, "").toLowerCase() || "the required experience level"}.`;
  }

  bodyContent += `\n\nAt ${companyName}, I see an exciting opportunity to apply my skills in a way that drives real business value. I am eager to bring my dedication, expertise, and collaborative spirit to your organization.`;

  const closing = `${t.closing}\n\nThank you for considering my application. I am available at your convenience for an interview and can be reached at the contact information provided above.\n\nSincerely,\n${fullName || "Your Name"}`;

  return { opening, body: bodyContent, closing };
}
