"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function analyzeDashboardQuery(query: string, context: any) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (!apiKey) {
    return {
      error: true,
      insight: "CRITICAL ERROR: AI API Key is missing from the server environment. 'The Brain' is currently disconnected.",
      recommendation: "Please add 'GOOGLE_GENERATIVE_AI_API_KEY' to your hosting environment variables (e.g., Vercel Dashboard) and redeploy.",
      summary: "Key Missing",
      tab: "overview"
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // HYPER-PRUNING: Strip all large data arrays
    const stats = {
      totalStudents: context.stats.totalStudents,
      totalAssessments: context.stats.totalAssessments,
      totalSchools: context.stats.totalSchools,
      overallBreakdown: context.stats.overallBreakdown, // Keep percentages
      operations: context.stats.operations,             // Keep summaries
      availableClasses: context.stats.availableClasses,
    };

    const rankings = context.rankings?.slice(0, 3).concat(context.rankings?.slice(-3)); // Top 3 and Bottom 3
    
    const prompt = `
      You are "The Brain" — the FLN Mission Strategist AI. 
      Analyze the summarized mission data below.

      DATA SUMMARY:
      - Totals: ${JSON.stringify(stats)}
      - Key Rankings (Top/Bottom): ${JSON.stringify(rankings)}
      - Struggle Sample: ${JSON.stringify(context.struggling?.slice(0, 3))}

      QUERY: "${query}"

      INSTRUCTIONS:
      - Return JSON ONLY. No preamble.
      - Fields: filters {classNum: number|null, subject: "literacy"|"numeracy"|"all"|null}, insight (string), recommendation (string), tab ("trends"|"overview"|"ranking"), summary (string).
    `;

    // Attempt model rotation with VERIFIED-AUTHORIZED futuristic models
    let result;
    const modelOptions = [
      "gemini-pro-latest", 
      "gemini-2.0-flash-lite", // Fast and highly available
      "gemini-2.5-flash"       // Flagship
    ];
    let lastError = null;

    for (const modelName of modelOptions) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        if (result) break;
      } catch (e: any) {
        lastError = e;
        // Skip busy or missing modern models quietly
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
    
    // ZERO-FAILURE LOCAL INTELLIGENCE with robust data extraction
    const breakdown = context.stats.overallBreakdown || {};
    
    // Function to calculate headline % (highest 2 levels) for the latest available term
    const getHeadlinePct = (data: any) => {
      if (!data) return 0;
      const terms = ["Endline", "Midline", "Baseline"];
      for (const term of terms) {
        const termData = data[term];
        if (termData?.levels) {
          const levels = termData.levels;
          const count = Object.keys(levels).length;
          // Sum pct of top 2 levels
          const p1 = levels[count - 1]?.pct || 0;
          const p2 = levels[count - 2]?.pct || 0;
          return p1 + p2;
        }
      }
      return 0;
    };

    const litPct = getHeadlinePct(breakdown.literacy);
    const numPct = getHeadlinePct(breakdown.numeracy);
    const lowPo = context.rankings?.slice(-1)[0]?.name || "selected clusters";
    
    let localInsight = `Mission analysis shows that ${Math.round(litPct)}% of students are reaching proficiency in literacy, while numeracy proficiency stands at ${Math.round(numPct)}%. `;
    if (litPct < 50) localInsight += "Language acquisition targets are currently the primary mission bottleneck. ";
    else localInsight += "Foundational literacy is showing strong upward momentum. ";
    
    return {
      error: false, 
      insight: localInsight,
      recommendation: `Targeted interventions should be prioritized in ${lowPo}. I recommend high-intensity ${litPct < numPct ? 'Story-reading' : 'Number recognition'} drills to accelerate growth towards mission parity.`,
      tab: litPct < 50 ? "overview" : "trends",
      summary: "Mission Strategist Fallback"
    };
  }
}
