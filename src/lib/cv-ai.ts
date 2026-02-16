import { supabase } from "@/integrations/supabase/client";

export async function callCVAI(type: string, context: Record<string, unknown>): Promise<string | Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cv-ai-assist`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ type, context }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "AI request failed");
  }

  const data = await res.json();
  return data.result;
}
