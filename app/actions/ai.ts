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
    console.error("AI FATAL ERROR:", errorMessage);
    
    try {
      // Survival fallback using the most stable Lite model (verified authorized)
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      const simpleResult = await model.generateContent("Analyze the mission query and provide one strategic executive recommendation in JSON format: { \"insight\": \"...\", \"recommendation\": \"...\", \"summary\": \"Strategy\" }");
      const text = simpleResult.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: true, insight: "Basic mission guidance is temporarily limited." };
    } catch {
       return {
          error: true,
          insight: "I'm currently recalibrating my data sensors due to high demand. Please try a simpler question in a few moments.",
          recommendation: "Switch manually to the Trends tab for detailed mission growth views.",
          summary: "Recalibrating"
       };
    }
  }
}
