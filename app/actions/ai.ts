"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { TARL_PEDAGOGY_KNOWLEDGE } from "@/lib/tarl_pedagogy";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

// ─── Local pedagogy fallback ───────────────────────────────────────────────
// When Gemini is unavailable, answer pedagogy questions from the knowledge
// base directly rather than defaulting to a generic data summary.

function localPedagogyFallback(query: string, context: any) {
  const q = query.toLowerCase();

  // Detect class/grade mentions
  const isClass12 = /grade\s*[12]|class\s*[12]|std\s*[12]|1st|2nd|grade 1|grade 2/.test(q);
  const isClass34 = /grade\s*[34]|class\s*[34]|std\s*[34]|3rd|4th|grade 3|grade 4/.test(q);
  const isMaths   = /math|maths|numeracy|number|arithmetic/.test(q);
  const isLang    = /language|literacy|reading|letter|word|story|marathi/.test(q);

  // Detect pedagogy intent (activity / session / how to teach)
  const isPedagogy = /activity|activities|session|what to (do|teach|run)|how (to|do)|teach|plan|today|game|exercise/.test(q);

  // ── Class 1-2 pedagogy ──
  if (isClass12 && isPedagogy) {
    return {
      filters: { classNum: null, subject: null },
      insight: "For Class 1–2, all students run as a single group through the 90-minute daily flow: Play → Listen → Do → TLM Activities.",
      recommendation: "Rotate small groups through TLM stations every 10–12 minutes so every child gets hands-on time with Chitra Cards, Linking Cards, and Number Stones.",
      activitySuggestion: "चला खेळूया (15 min): Start with a clapping alphabet game — teacher claps a rhythm while saying a Marathi letter, students echo and point to it on the Chaudakhadi chart. Then move to चला ऐकुया: read a picture story aloud and ask 2 questions. End TLM time with Linking Card sorting in groups of 4.",
      tab: "trends",
      summary: "Class 1–2 Activity Plan"
    };
  }

  // ── Class 3-4 Language pedagogy ──
  if (isClass34 && isLang && isPedagogy) {
    return {
      filters: { classNum: null, subject: "literacy" },
      insight: "Class 3–4 Language runs two simultaneous groups: Akshargandh+Shabdgandh (Levels 0–3) and Pushpagandh (Level 4). Teacher circulates between them every 15–20 minutes.",
      recommendation: "Ensure group composition is up to date — re-assess if a student has been at the same level for 3+ weeks and move them to the correct group.",
      activitySuggestion: "Akshargandh+Shabdgandh: Chitra Card Sort — students sort 20 picture cards by first letter, then check each other's groups. Pushpagandh: Basic Stories 3 — pairs read alternate lines, then answer 3 comprehension questions in writing.",
      tab: "trends",
      summary: "Class 3–4 Language Plan"
    };
  }

  // ── Class 3-4 Maths pedagogy ──
  if (isClass34 && isMaths && isPedagogy) {
    return {
      filters: { classNum: null, subject: "numeracy" },
      insight: "Class 3–4 Maths runs two simultaneous groups: Pankti+Samay (Numeracy Levels 0–2) and Mashal (Level 3). Both run for 90 minutes at the same time.",
      recommendation: "For Pankti+Samay, keep manipulatives (bundle sticks, stones) at the desk throughout — abstract written work should always follow physical activity.",
      activitySuggestion: "Pankti+Samay: Number Line Jump — draw a 0–20 number line on the floor; teacher calls '6 + 4', one student jumps to the answer while others verify. Mashal: Word Problem Cards — pairs solve 3 three-digit problems and explain their column method to the class.",
      tab: "trends",
      summary: "Class 3–4 Maths Plan"
    };
  }

  // ── Generic pedagogy question (no specific class) ──
  if (isPedagogy) {
    return {
      filters: { classNum: null, subject: null },
      insight: "The TaRL daily flow applies to all classes: Class 1–2 runs as one group (Play → Listen → Do → TLM), while Class 3–4 splits into two simultaneous level-groups for Language and Maths.",
      recommendation: "Always identify the student's current ASER level first — then pick the activity for that level, regardless of their grade.",
      activitySuggestion: "Class 1–2: Start with चला खेळूया (alphabet clapping game, 15 min), then चला ऐकुया (picture story read-aloud, 15 min), then TLM groups with Chitra Cards and Number Stones (45 min). Class 3–4: Run Akshargandh+Shabdgandh alongside Pushpagandh (Language) or Pankti+Samay alongside Mashal (Maths).",
      tab: "trends",
      summary: "TaRL Activity Guide"
    };
  }

  // ── Pure data fallback (no pedagogy intent detected) ──
  const breakdown = context.stats?.overallBreakdown || {};
  const getHeadlinePct = (data: any) => {
    if (!data) return 0;
    for (const term of ["Endline", "Midline", "Baseline"]) {
      const d = data[term];
      if (d?.levels) {
        const count = Object.keys(d.levels).length;
        return (d.levels[count - 1]?.pct || 0) + (d.levels[count - 2]?.pct || 0);
      }
    }
    return 0;
  };
  const litPct = getHeadlinePct(breakdown.literacy);
  const numPct = getHeadlinePct(breakdown.numeracy);
  const lowPo  = context.rankings?.slice(-1)[0]?.name || "selected clusters";
  const isLitWeak = litPct <= numPct;

  return {
    filters: { classNum: null, subject: null },
    insight: `Mission data shows ${Math.round(litPct)}% of students reaching literacy proficiency and ${Math.round(numPct)}% in numeracy. ${litPct < 50 ? "Literacy acquisition is the primary bottleneck." : "Literacy is trending upward — numeracy is now the focus area."}`,
    recommendation: `Prioritize intervention in ${lowPo}. Increase ${isLitWeak ? 'Chitra Card and Linking Card' : 'Number Flash Card and Bundle Stick'} session frequency.`,
    activitySuggestion: isLitWeak
      ? `For Literacy Level 1–2 students: Chitra Card Sort — sort 20 picture cards by first letter, swap groups to cross-check. Run for 10 minutes in TLM time.`
      : `For Numeracy Level 2 students: Bundle Builder — group 10 sticks into 1 bundle, build a 2-digit number called by the teacher. Run for 10 minutes in TLM time.`,
    tab: litPct < 50 ? "overview" : "trends",
    summary: "Data + Activity Suggestion"
  };
}

// ─── Main action ───────────────────────────────────────────────────────────

export async function analyzeDashboardQuery(
  query: string,
  context: any,
  history: { role: 'user' | 'assistant'; content: string }[] = []
) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    return {
      error: true,
      insight: "CRITICAL ERROR: AI API Key is missing from the server environment.",
      recommendation: "Please add 'GOOGLE_GENERATIVE_AI_API_KEY' to your Vercel environment variables and redeploy.",
      activitySuggestion: null,
      summary: "Key Missing",
      tab: "overview"
    };
  }

  try {
    const stats = {
      totalStudents: context.stats.totalStudents,
      totalAssessments: context.stats.totalAssessments,
      totalSchools: context.stats.totalSchools,
      overallBreakdown: context.stats.overallBreakdown,
      operations: context.stats.operations,
      availableClasses: context.stats.availableClasses,
    };
    const rankings = context.rankings?.slice(0, 3).concat(context.rankings?.slice(-3));
    const historyText = history.length > 0
      ? `\nCONVERSATION SO FAR:\n${history.map(m => `${m.role === 'user' ? 'User' : 'Brain'}: ${m.content}`).join('\n')}\n`
      : '';

    const prompt = `
You are "The Brain" — FLN Mission Strategist AI for Pratham Maharashtra.
You have two capabilities:
1. DATA ANALYSIS: Surface insights from student assessment data.
2. PEDAGOGY ADVISOR: Recommend specific TaRL activities from the manual.

If the question is about pedagogy/activities/what to teach, focus primarily on PEDAGOGY and use data only as supporting context.
If the question is about data/rankings/outcomes, focus on DATA and add a relevant activity tip.

MISSION DATA:
${JSON.stringify(stats)}
Rankings (Top/Bottom 3): ${JSON.stringify(rankings)}
${historyText}
${TARL_PEDAGOGY_KNOWLEDGE}

QUERY: "${query}"

Return JSON ONLY. No markdown, no preamble.
Fields:
  filters          { classNum: number|null, subject: "literacy"|"numeracy"|"all"|null }
  insight          string — direct answer to the query (1–3 sentences, specific and actionable)
  recommendation   string — one strategic action (1–2 sentences)
  activitySuggestion string|null — ONE specific named TaRL activity with group name and 1–2 sentence how-to. Null only if query is purely administrative.
  tab              "trends"|"overview"|"ranking"
  summary          string — 3–5 word label
`;

    // Try models in order — start with the most reliable
    const modelOptions = [
      "gemini-1.5-flash",
      "gemini-2.0-flash-lite",
      "gemini-2.5-flash",
    ];
    let result;
    let lastError = null;

    for (const modelName of modelOptions) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        if (result) break;
      } catch (e: any) {
        lastError = e;
        continue;
      }
    }

    if (!result) throw lastError || new Error("All models unavailable.");

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse response JSON.");

    return JSON.parse(jsonMatch[0]);

  } catch (error: any) {
    console.error("AI FALLBACK TRIGGERED:", error.message || error);
    return localPedagogyFallback(query, context);
  }
}
