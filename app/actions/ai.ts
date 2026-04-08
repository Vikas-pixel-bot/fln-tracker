"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function analyzeDashboardQuery(query: string, context: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are "The Brain" — the FLN Mission Strategist AI. 
      You have access to the COMPLETE organizational data for the Foundational Literacy and Numeracy mission.

      MISSION CONTEXT:
      - Hierarchy: ${JSON.stringify(context.hierarchy?.map((d: any) => ({ name: d.name, pos: d.projectOffices.map((p: any) => p.name) })), null, 2)}
      - Current Filtered Stats: ${JSON.stringify(context.stats, null, 2)}
      - Regional Rankings: ${JSON.stringify(context.rankings, null, 2)}
      - Struggling Students Sample: ${JSON.stringify(context.struggling?.slice(0, 10), null, 2)}
      - Growth Velocity: ${JSON.stringify(context.velocity, null, 2)}

      USER QUERY:
      "${query}"

      INSTRUCTIONS:
      1. Analyze the query using ALL provided context. Cross-reference data (e.g., if asked about a school, check its PO rank).
      2. Respond in a JSON format ONLY.
      3. The JSON must contain:
         - "filters": object containing any identified filters (classNum: number, subject: "literacy"|"numeracy"|"all").
         - "insight": A detailed, professional analysis (2-3 sentences).
         - "recommendation": A specific actionable strategy for the mission (1 sentence).
         - "tab": "trends", "overview", or "ranking".
         - "summary": A very short 3-5 word executive title for this response.

      Example Response:
      {
        "filters": { "classNum": 3, "subject": "literacy" },
        "insight": "Class 3 literacy has improved significantly, with 45% of students now at Story level compared to only 10% during Baseline.",
        "recommendation": "Maintain the current emphasis on phonics training for Class 3 teachers.",
        "tab": "trends",
        "summary": "Class 3 Growth Success"
      }

      Deliver the JSON response now.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the markdown-wrapped response if necessary
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      error: "I'm having trouble analyzing that right now. Please try a different query.",
      filters: {},
      insight: "Analysis unavailable.",
      recommendation: "Try manually switching filters to explore the data.",
      tab: "overview"
    };
  }
}
