"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { TARL_PEDAGOGY_KNOWLEDGE } from "@/lib/tarl_pedagogy";
import { getDashboardStats, getPORankings } from "@/app/actions";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

function localFallback(query: string) {
  const q = query.toLowerCase();
  const isClass12 = /grade\s*[12]|class\s*[12]|1st|2nd/.test(q);
  const isClass34 = /grade\s*[34]|class\s*[34]|3rd|4th/.test(q);
  const isMaths   = /math|maths|numeracy|number|arithmetic/.test(q);
  const isLang    = /language|literacy|reading|letter|word|story|marathi/.test(q);
  const isPedagogy = /activity|session|what to (do|teach|run)|how (to|do)|teach|plan|today|game/.test(q);

  if (isClass12 && isPedagogy) return {
    insight: "For Class 1–2, all students run as one group through 90-minute flow: Play → Listen → Do → TLM Activities.",
    recommendation: "Rotate small groups through TLM stations every 10–12 minutes.",
    activitySuggestion: "चला खेळूया (15 min): Clapping alphabet game — teacher claps a rhythm saying a Marathi letter, students echo and point on the Chaudakhadi chart.",
    summary: "Class 1–2 Plan"
  };
  if (isClass34 && isLang && isPedagogy) return {
    insight: "Class 3–4 Language runs two simultaneous groups: Akshargandh+Shabdgandh (Levels 0–3) and Pushpagandh (Level 4).",
    recommendation: "Re-assess if a student has been at the same level for 3+ weeks and move them to the correct group.",
    activitySuggestion: "Akshargandh: Sort 20 picture cards by first letter. Pushpagandh: Pairs read alternate lines from Basic Stories 3, then answer 3 comprehension questions.",
    summary: "Class 3–4 Language Plan"
  };
  if (isClass34 && isMaths && isPedagogy) return {
    insight: "Class 3–4 Maths runs Pankti+Samay (Levels 0–2) and Mashal (Level 3) simultaneously.",
    recommendation: "Keep manipulatives at the desk throughout — abstract work should always follow physical activity.",
    activitySuggestion: "Pankti+Samay: Number Line Jump — draw a 0–20 line on the floor, teacher calls a sum, student jumps to the answer. Mashal: Word Problem Cards in pairs.",
    summary: "Class 3–4 Maths Plan"
  };
  return {
    insight: "TaRL daily flow: Class 1–2 runs as one group (Play→Listen→Do→TLM). Class 3–4 splits into two simultaneous level-groups for Language and Maths.",
    recommendation: "Always identify the student's current ASER level first, then pick the activity for that level regardless of grade.",
    activitySuggestion: "Class 1–2: Alphabet clapping + picture story (30 min), then TLM groups with Chitra Cards and Number Stones (45 min). Class 3–4: Run Akshargandh+Pushpagandh or Pankti+Mashal in parallel.",
    summary: "TaRL Activity Guide"
  };
}

export async function askPratham(
  query: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return {
      insight: "AI key not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to environment variables.",
      recommendation: null,
      activitySuggestion: null,
      summary: "Config Error"
    };
  }

  // Fetch live data for context (best-effort — never blocks the response)
  let statsSnippet = "";
  let rankingsSnippet = "";
  try {
    const [stats, rankings] = await Promise.all([
      getDashboardStats(),
      getPORankings()
    ]);
    statsSnippet = JSON.stringify({
      totalStudents: stats.totalStudents,
      totalAssessments: stats.totalAssessments,
      totalSchools: stats.totalSchools,
      operations: stats.operations,
    });
    rankingsSnippet = JSON.stringify(rankings?.slice(0, 3).concat(rankings?.slice(-3)));
  } catch (_) {
    statsSnippet = "{}";
    rankingsSnippet = "[]";
  }

  const historyText = history.length > 0
    ? `\nCONVERSATION SO FAR:\n${history.map(m => `${m.role === 'user' ? 'User' : 'Pratham'}: ${m.content}`).join('\n')}\n`
    : '';

  const prompt = `
You are Pratham — a friendly, knowledgeable AI assistant for Pratham Education Foundation's FLN Hub platform used by field educators across Maharashtra.

You can help with:
1. TaRL PEDAGOGY: Specific activities, session plans, what to teach for each ASER level.
2. MISSION DATA: Insights from student assessment data across schools and project offices.
3. PLATFORM HELP: How to use FLN Hub — recording assessments, viewing dashboards, running games and simulations.
4. GENERAL FLN: Any question about foundational literacy and numeracy, ASER framework, Pratham's methods.
5. GENERAL QUESTIONS: Answer helpfully on any topic a field educator might ask.

Be warm, encouraging, and concise. Use simple language appropriate for field educators. When relevant, suggest concrete next actions.

LIVE MISSION DATA (Maharashtra):
${statsSnippet}
Rankings (Top/Bottom 3 Project Offices): ${rankingsSnippet}

${TARL_PEDAGOGY_KNOWLEDGE}
${historyText}
USER QUERY: "${query}"

Return JSON ONLY. No markdown, no preamble, no code fences.
Fields:
  insight           string — direct, friendly answer (1–3 sentences)
  recommendation    string|null — one concrete action to take next, or null
  activitySuggestion string|null — a specific TaRL activity if relevant, otherwise null
  summary           string — 3–5 word label for this response
`;

  try {
    const models = ["gemini-1.5-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash"];
    let result;
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        if (result) break;
      } catch (_) { continue; }
    }
    if (!result) throw new Error("All models failed");

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error("askPratham fallback:", error.message);
    return localFallback(query);
  }
}
