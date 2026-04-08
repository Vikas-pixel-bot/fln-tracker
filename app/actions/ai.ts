"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function analyzeDashboardQuery(query: string, context: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // CRITICAL: Prune context to avoid token bloat/API errors
    const prunedHierarchy = context.hierarchy?.map((d: any) => ({
      name: d.name,
      pos: d.projectOffices?.map((p: any) => p.name)
    })).slice(0, 5); // Limit to top 5 divisions for context stability

    const prompt = `
      You are "The Brain" — the FLN Mission Strategist AI. 
      Analyze the mission data and user query below.

      MISSION CONTEXT:
      - Hierarchy: ${JSON.stringify(prunedHierarchy)}
      - Stats: ${JSON.stringify(context.stats)}
      - Rankings: ${JSON.stringify(context.rankings?.slice(0, 5))}
      - Struggle: ${JSON.stringify(context.struggling?.slice(0, 5))}

      QUERY: "${query}"

      INSTRUCTIONS:
      - Return JSON ONLY. No preamble.
      - Fields: filters {classNum: number|null, subject: "literacy"|"numeracy"|"all"|null}, insight (string), recommendation (string), tab ("trends"|"overview"|"ranking"), summary (string).

      Deliver JSON now:
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Robust JSON Extraction: Find the FIRST { and the LAST }
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI response did not contain valid JSON block.");
    }
    
    return JSON.parse(jsonMatch[0]);

  } catch (error: any) {
    console.error("AI FATAL ERROR:", error.message || error);
    return {
      error: true,
      filters: null,
      insight: "I encountered a technical glitch while analyzing that data. My logic circuits might be overloaded by the mission's scale.",
      recommendation: "Try a more specific question, like 'Which class has the best literacy growth?'",
      tab: "overview",
      summary: "System Glitch"
    };
  }
}
