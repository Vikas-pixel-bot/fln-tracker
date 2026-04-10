"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { TARL_PEDAGOGY_KNOWLEDGE } from "@/lib/tarl_pedagogy";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function analyzeDashboardQuery(
  query: string,
  context: any,
  history: { role: 'user' | 'assistant'; content: string }[] = []
) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    return {
      error: true,
      insight: "CRITICAL ERROR: AI API Key is missing from the server environment. 'The Brain' is currently disconnected.",
      recommendation: "Please add 'GOOGLE_GENERATIVE_AI_API_KEY' to your hosting environment variables (e.g., Vercel Dashboard) and redeploy.",
      activitySuggestion: null,
      summary: "Key Missing",
      tab: "overview"
    };
  }

  try {
    // HYPER-PRUNING: Strip all large data arrays
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
      ? `\n      CONVERSATION SO FAR:\n${history.map(m => `      ${m.role === 'user' ? 'User' : 'Brain'}: ${m.content}`).join('\n')}\n`
      : '';

    const prompt = `
      You are "The Brain" — the FLN Mission Strategist AI for Pratham's Maharashtra field program.
      You have two capabilities:
      1. DATA ANALYSIS: Interpret student assessment data to surface insights about learning outcomes.
      2. PEDAGOGY ADVISOR: Recommend specific TaRL activities and teaching strategies from the manual.
      Always blend both — ground recommendations in the data AND in the pedagogical knowledge.

      ════════════════════════════════════════
      MISSION DATA SUMMARY:
      - Totals: ${JSON.stringify(stats)}
      - Key Rankings (Top/Bottom 3): ${JSON.stringify(rankings)}
      - Struggle Sample: ${JSON.stringify(context.struggling?.slice(0, 3))}
      ════════════════════════════════════════
${TARL_PEDAGOGY_KNOWLEDGE}
      ════════════════════════════════════════
${historyText}
      CURRENT QUERY: "${query}"

      INSTRUCTIONS:
      - Return JSON ONLY. No preamble, no markdown.
      - Fields:
          filters          { classNum: number|null, subject: "literacy"|"numeracy"|"all"|null }
          insight          string  — data-grounded observation (1–3 sentences)
          recommendation   string  — strategic action for the program coordinator (1–2 sentences)
          activitySuggestion string|null — ONE specific classroom activity from the TaRL manual the teacher can run TODAY, with the group name and a 1-sentence "how to" (null if the query is purely strategic/managerial)
          tab              "trends"|"overview"|"ranking"
          summary          string  — 3–5 word label for this response
    `;

    const modelOptions = [
      "gemini-2.0-flash-lite",
      "gemini-2.5-flash",
      "gemini-pro-latest",
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

    if (!result) throw lastError || new Error("Mission Brain is currently calibrating for high-demand.");

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not parse mission strategist insights.");

    return JSON.parse(jsonMatch[0]);

  } catch (error: any) {
    const errorMessage = error.message || "Unknown error";
    console.error("AI FALLBACK TRIGGERED:", errorMessage);

    // Local intelligence fallback
    const breakdown = context.stats.overallBreakdown || {};

    const getHeadlinePct = (data: any) => {
      if (!data) return 0;
      for (const term of ["Endline", "Midline", "Baseline"]) {
        const termData = data[term];
        if (termData?.levels) {
          const levels = termData.levels;
          const count = Object.keys(levels).length;
          return (levels[count - 1]?.pct || 0) + (levels[count - 2]?.pct || 0);
        }
      }
      return 0;
    };

    const litPct = getHeadlinePct(breakdown.literacy);
    const numPct = getHeadlinePct(breakdown.numeracy);
    const lowPo = context.rankings?.slice(-1)[0]?.name || "selected clusters";
    const isLitWeak = litPct < numPct;

    return {
      error: false,
      insight: `Mission analysis shows ${Math.round(litPct)}% of students reaching literacy proficiency and ${Math.round(numPct)}% in numeracy. ${litPct < 50 ? "Literacy acquisition remains the primary bottleneck." : "Foundational literacy is trending upward."}`,
      recommendation: `Prioritize targeted intervention in ${lowPo}. Increase frequency of ${isLitWeak ? 'Chitra Card and Linking Card' : 'Number Flash Card and Bundle Stick'} sessions.`,
      activitySuggestion: isLitWeak
        ? `Akshargandh group — run "Chitra Card Sort": students sort picture cards by first letter, then swap to check each other's groups. Targets Literacy Levels 1–2.`
        : `Pankti+Samay group — run "Bundle Builder": students physically bundle 10 sticks into 1 ten, then build a 2-digit number called by the teacher. Targets Numeracy Level 2.`,
      tab: litPct < 50 ? "overview" : "trends",
      summary: "Mission Fallback"
    };
  }
}
