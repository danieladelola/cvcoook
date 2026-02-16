import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Service unavailable" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { type, context } = body;

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "summary":
        systemPrompt = "You are a professional resume writer. Generate a compelling professional summary (2-3 sentences) based on the provided information. Be specific and impactful. Return only the summary text, no quotes or labels.";
        userPrompt = `Generate a professional summary for: ${context.fullName || "a professional"}. Job titles: ${context.experiences?.map((e: any) => e.title).join(", ") || "N/A"}. Skills: ${context.skills || "N/A"}.`;
        break;

      case "enhance_description":
        systemPrompt = "You are a professional resume writer. Enhance the job description to be more impactful with action verbs and measurable achievements. Keep it concise (2-4 bullet points). Return only the enhanced text.";
        userPrompt = `Enhance this job description for "${context.title}" at "${context.company}": ${context.description}`;
        break;

      case "suggest_skills":
        systemPrompt = "You are a career advisor. Based on the job titles and experience, suggest relevant skills. Return JSON with this structure: {\"technical\": \"comma-separated\", \"soft\": \"comma-separated\", \"languages\": \"keep existing or suggest\"}. Return ONLY JSON.";
        userPrompt = `Suggest skills for someone with these roles: ${context.experiences?.map((e: any) => `${e.title} at ${e.company}`).join("; ") || "N/A"}. Current skills: ${context.currentSkills || "None listed"}.`;
        break;

      case "enhance_cv":
        systemPrompt = `You are a world-class professional resume writer with 20 years of experience. Your task is to take raw CV content and transform it into a polished, recruiter-ready document.

RULES:
- Rewrite all job descriptions using strong action verbs (Led, Spearheaded, Delivered, Orchestrated, Optimized, Achieved)
- Convert vague responsibilities into quantified achievements wherever possible
- Remove weak phrases like "responsible for", "helped with", "worked on", "assisted in"
- Keep each bullet point concise (1-2 lines max)
- Make the professional summary compelling, specific, and results-oriented (2-3 sentences)
- Ensure the tone is confident, professional, and recruiter-friendly
- Maintain truthfulness - enhance wording but don't fabricate facts
- Keep technical skills accurate and well-organized
- Format consistently across all sections

Return a JSON object with this exact structure:
{
  "summary": "enhanced professional summary",
  "experiences": [
    {
      "title": "original title",
      "company": "original company",
      "duration": "original duration",
      "description": "enhanced description with bullet points"
    }
  ],
  "skills": {
    "technical": "enhanced comma-separated technical skills",
    "soft": "enhanced comma-separated soft skills",
    "languages": "original languages"
  }
}

Return ONLY valid JSON. No markdown, no code fences, no extra text.`;
        userPrompt = `Enhance this CV content:\n\nName: ${context.fullName}\nCurrent Summary: ${context.summary || "None provided"}\n\nExperience:\n${context.experiences?.map((e: any) => `- ${e.title} at ${e.company} (${e.duration}): ${e.description}`).join("\n") || "None"}\n\nSkills:\n- Technical: ${context.skills?.technical || "None"}\n- Soft: ${context.skills?.soft || "None"}\n- Languages: ${context.skills?.languages || "None"}`;
        break;

      default:
        return new Response(JSON.stringify({ error: "Invalid type" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: type === "enhance_cv" ? 0.6 : 0.7,
        max_tokens: type === "enhance_cv" ? 3000 : 1000,
      }),
    });

    if (!response.ok) {
      console.error("AI request failed:", response.status);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    if (type === "suggest_skills" || type === "enhance_cv") {
      try {
        const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(jsonStr);
        return new Response(JSON.stringify({ result: parsed }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        if (type === "suggest_skills") {
          return new Response(JSON.stringify({ result: { technical: content, soft: "", languages: "" } }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ result: content }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CV AI assist error:", error);
    return new Response(JSON.stringify({ error: "An error occurred processing your request" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
