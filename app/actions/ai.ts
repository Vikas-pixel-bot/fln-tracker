"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function analyzeDashboardQuery(query: string, stats: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Clean up stats for the prompt to save tokens and focus on key data
    const context = {
      totalStudents: stats.totalStudents,
      totalAssessments: stats.totalAssessments,
      totalSchools: stats.totalSchools,
      overallLiteracy: stats.overallBreakdown?.literacy,
      overallNumeracy: stats.overallBreakdown?.numeracy,
      operations: stats.operations,
      availableClasses: stats.availableClasses
    };

    const prompt = `
      You are an AI Data Analyst for the FLN (Foundational Literacy and Numeracy) Progress Tracker.
      You are helping administrators understand student performance data.

      DATA CONTEXT:
      ${JSON.stringify(context, null, 2)}

      USER QUERY:
      "${query}"

      INSTRUCTIONS:
      1. Analyze the query against the provided data.
      2. Respond in a JSON format ONLY.
      3. The JSON must contain:
         - "filters": object containing any identified filters (classNum: number, subject: "literacy"|"numeracy"|"all").
         - "insight": A concise, executive summary of what the data shows for this query (1-2 sentences).
         - "recommendation": A brief actionable step based on the data.
         - "tab": "trends" or "overview" (whichever is more relevant).

      Example Response:
      {
        "filters": { "classNum": 3, "subject": "literacy" },
        "insight": "Class 3 literacy has improved significantly, with 45% of students now at Story level compared to only 10% during Baseline.",
        "recommendation": "Maintain the current emphasis on phonics training for Class 3 teachers.",
        "tab": "trends"
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
