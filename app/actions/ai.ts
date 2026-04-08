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

    // Attempt model rotation to solve 404 errors
    let result;
    const modelOptions = ["gemini-1.5-flash", "gemini-pro"];
    let lastError = null;

    for (const modelName of modelOptions) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        if (result) break;
      } catch (e: any) {
        lastError = e;
        console.warn(`Model ${modelName} failed, trying next...`);
        continue;
      }
    }

    if (!result) throw lastError || new Error("All models failed.");

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    
    return JSON.parse(jsonMatch[0]);

  } catch (error: any) {
    const errorMessage = error.message || "Unknown error";
    console.error("AI HYPER-PRUNE ERROR:", errorMessage);
    
    try {
      // Use the MOST stable model for fallback
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const simpleResult = await model.generateContent(`User asked: "${query}". Give an executive FLN mission strategy recommendation in JSON format.`);
      const text = simpleResult.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { error: true, insight: "Fallback parsing failed." };
    } catch (innerError: any) {
       return {
          error: true,
          insight: `DEBUG MODE: ${innerError.message || "Survival fallback failed"}`,
          recommendation: "Switch manually to the Trends tab for detailed growth views.",
          summary: "Error Debug"
       };
    }
  }
}
