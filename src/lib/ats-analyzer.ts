interface ATSResult {
  score: number;
  sections: {
    name: string;
    score: number;
    status: "good" | "warning" | "error";
    suggestions: string[];
  }[];
  overallSuggestions: string[];
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: { title: string; company: string; duration: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
  skills: { technical: string; soft: string; languages: string };
}

const ACTION_VERBS = [
  "achieved", "accomplished", "administered", "analyzed", "built", "collaborated",
  "conducted", "created", "delivered", "designed", "developed", "directed",
  "established", "executed", "generated", "implemented", "improved", "increased",
  "launched", "led", "managed", "negotiated", "optimized", "organized",
  "oversaw", "planned", "produced", "reduced", "resolved", "spearheaded",
  "streamlined", "supervised", "trained", "transformed"
];

const QUANTIFIABLE_PATTERNS = [
  /\d+%/, // percentages
  /\$[\d,]+/, // dollar amounts
  /\d+\s*(users|customers|clients|projects|teams|members)/i, // user counts
  /\d+\s*(years?|months?)/i, // time periods
  /increased|decreased|improved|reduced.*\d+/i, // metrics
];

export const analyzeATS = (formData: FormData): ATSResult => {
  const sections: ATSResult["sections"] = [];
  let totalScore = 0;
  let sectionCount = 0;

  // 1. Contact Information Analysis
  const contactSuggestions: string[] = [];
  let contactScore = 0;
  
  if (formData.fullName) contactScore += 25;
  else contactSuggestions.push("Add your full name");
  
  if (formData.email) {
    if (formData.email.includes("@") && formData.email.includes(".")) {
      contactScore += 25;
    } else {
      contactSuggestions.push("Use a valid professional email address");
    }
  } else {
    contactSuggestions.push("Add your email address");
  }
  
  if (formData.phone) contactScore += 25;
  else contactSuggestions.push("Add your phone number");
  
  if (formData.location) contactScore += 25;
  else contactSuggestions.push("Add your location (city, state/country)");
  
  sections.push({
    name: "Contact Information",
    score: contactScore,
    status: contactScore >= 75 ? "good" : contactScore >= 50 ? "warning" : "error",
    suggestions: contactSuggestions,
  });
  totalScore += contactScore;
  sectionCount++;

  // 2. Professional Summary Analysis
  const summarySuggestions: string[] = [];
  let summaryScore = 0;
  
  if (formData.summary) {
    const wordCount = formData.summary.split(/\s+/).length;
    
    if (wordCount >= 30 && wordCount <= 100) {
      summaryScore += 40;
    } else if (wordCount < 30) {
      summaryScore += 20;
      summarySuggestions.push("Expand your summary to 30-100 words for better impact");
    } else {
      summaryScore += 20;
      summarySuggestions.push("Consider shortening your summary to under 100 words");
    }
    
    // Check for keywords
    const hasKeywords = /experience|skilled|professional|expertise|years/i.test(formData.summary);
    if (hasKeywords) summaryScore += 30;
    else summarySuggestions.push("Include industry keywords and years of experience");
    
    // Check for quantifiable achievements
    const hasNumbers = QUANTIFIABLE_PATTERNS.some(p => p.test(formData.summary));
    if (hasNumbers) summaryScore += 30;
    else summarySuggestions.push("Add quantifiable achievements (e.g., '5+ years experience')");
  } else {
    summarySuggestions.push("Add a professional summary - this is highly valued by ATS systems");
  }
  
  sections.push({
    name: "Professional Summary",
    score: summaryScore,
    status: summaryScore >= 70 ? "good" : summaryScore >= 40 ? "warning" : "error",
    suggestions: summarySuggestions,
  });
  totalScore += summaryScore;
  sectionCount++;

  // 3. Work Experience Analysis
  const experienceSuggestions: string[] = [];
  let experienceScore = 0;
  
  const validExperiences = formData.experiences.filter(exp => exp.title);
  
  if (validExperiences.length > 0) {
    // Base score for having experiences
    experienceScore += 20;
    
    // Check each experience
    let totalExpScore = 0;
    validExperiences.forEach((exp, index) => {
      let expScore = 0;
      
      if (exp.title) expScore += 10;
      if (exp.company) expScore += 10;
      if (exp.duration) expScore += 10;
      
      if (exp.description) {
        const words = exp.description.split(/\s+/);
        
        // Check for action verbs
        const hasActionVerbs = ACTION_VERBS.some(verb => 
          exp.description.toLowerCase().includes(verb)
        );
        if (hasActionVerbs) expScore += 15;
        else if (index === 0) experienceSuggestions.push("Start bullet points with action verbs (e.g., 'Led', 'Developed', 'Achieved')");
        
        // Check for quantifiable results
        const hasMetrics = QUANTIFIABLE_PATTERNS.some(p => p.test(exp.description));
        if (hasMetrics) expScore += 15;
        else if (index === 0) experienceSuggestions.push("Include quantifiable results (e.g., 'Increased sales by 25%')");
        
        // Check description length
        if (words.length >= 20) expScore += 10;
        else if (index === 0) experienceSuggestions.push("Provide more detail in job descriptions (aim for 20+ words)");
      } else {
        if (index === 0) experienceSuggestions.push("Add descriptions to your work experiences");
      }
      
      totalExpScore += expScore;
    });
    
    experienceScore += Math.min(60, totalExpScore / validExperiences.length);
    
    if (validExperiences.length < 2) {
      experienceSuggestions.push("Consider adding more work experience entries");
    }
  } else {
    experienceSuggestions.push("Add at least one work experience entry");
  }
  
  sections.push({
    name: "Work Experience",
    score: Math.round(experienceScore),
    status: experienceScore >= 70 ? "good" : experienceScore >= 40 ? "warning" : "error",
    suggestions: experienceSuggestions,
  });
  totalScore += experienceScore;
  sectionCount++;

  // 4. Education Analysis
  const educationSuggestions: string[] = [];
  let educationScore = 0;
  
  const validEducation = formData.education.filter(edu => edu.degree);
  
  if (validEducation.length > 0) {
    educationScore += 40;
    
    validEducation.forEach(edu => {
      if (edu.school) educationScore += 20;
      if (edu.year) educationScore += 20;
    });
    
    educationScore = Math.min(100, educationScore);
  } else {
    educationSuggestions.push("Add your educational background");
  }
  
  sections.push({
    name: "Education",
    score: educationScore,
    status: educationScore >= 70 ? "good" : educationScore >= 40 ? "warning" : "error",
    suggestions: educationSuggestions,
  });
  totalScore += educationScore;
  sectionCount++;

  // 5. Skills Analysis
  const skillsSuggestions: string[] = [];
  let skillsScore = 0;
  
  if (formData.skills.technical) {
    const skillCount = formData.skills.technical.split(/[,;]/).filter(s => s.trim()).length;
    if (skillCount >= 5) skillsScore += 40;
    else if (skillCount >= 3) {
      skillsScore += 25;
      skillsSuggestions.push("Add more technical skills (aim for 5-10)");
    } else {
      skillsScore += 15;
      skillsSuggestions.push("List at least 5 technical skills for better ATS matching");
    }
  } else {
    skillsSuggestions.push("Add technical skills relevant to your target job");
  }
  
  if (formData.skills.soft) {
    skillsScore += 30;
  } else {
    skillsSuggestions.push("Include soft skills (e.g., Leadership, Communication)");
  }
  
  if (formData.skills.languages) {
    skillsScore += 30;
  } else {
    skillsSuggestions.push("Add language proficiencies if applicable");
  }
  
  sections.push({
    name: "Skills",
    score: skillsScore,
    status: skillsScore >= 70 ? "good" : skillsScore >= 40 ? "warning" : "error",
    suggestions: skillsSuggestions,
  });
  totalScore += skillsScore;
  sectionCount++;

  // Calculate overall score
  const overallScore = Math.round(totalScore / sectionCount);
  
  // Generate overall suggestions
  const overallSuggestions: string[] = [];
  
  if (overallScore < 50) {
    overallSuggestions.push("Your CV needs significant improvements to pass ATS systems");
  } else if (overallScore < 70) {
    overallSuggestions.push("Your CV is good but could use some optimization");
  } else {
    overallSuggestions.push("Your CV is well-optimized for ATS systems!");
  }
  
  // Add top priority suggestions
  const prioritySuggestions = sections
    .filter(s => s.status === "error")
    .flatMap(s => s.suggestions)
    .slice(0, 3);
  
  overallSuggestions.push(...prioritySuggestions);

  return {
    score: overallScore,
    sections,
    overallSuggestions,
  };
};
