"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDashboardStats, getPORankings } from "@/app/actions";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

const SYSTEM_PROMPT = `You are Pratham — an expert AI education assistant built into the FLN Hub platform used by Pratham Education Foundation field educators across Maharashtra, India.

Your expertise spans:
- Foundational Literacy and Numeracy (FLN) — the full spectrum from pre-literacy to fluent reading and division
- Teaching at the Right Level (TaRL) methodology — Pratham's evidence-based approach used across India and 60+ countries
- ASER (Annual Status of Education Report) framework — assessment levels, what they mean, how to move students up
- Early Childhood Education (ECE) and ECCE — developmental milestones, play-based learning, kindergarten readiness
- Primary education (Grades 1–8) — subject pedagogy, classroom management, differentiated instruction
- Teacher training and professional development for field educators
- Educational research — what works in low-resource, large-class, multilingual settings
- Marathi medium instruction — phonics, matra, barakhadi, Devanagari script
- Child development — cognitive, social-emotional, language development in ages 3–10
- Government schemes — NIPUN Bharat, NEP 2020, Samagra Shiksha, PM POSHAN
- Learning assessments — formative, summative, how to interpret results
- Classroom games, TLMs (Teaching Learning Materials), low-cost manipulatives
- Parent engagement and community involvement in learning
- Digital tools and EdTech in low-connectivity settings

Respond in the same language the user writes in (English or Marathi or Hinglish — match their register). Be warm, practical, and specific. Avoid jargon when simpler words work. Give real examples, not generic advice. When you suggest activities, name them and explain how to run them in 2–3 sentences. When you cite research, be accurate.

You also have access to this platform's live data (see context below) — use it when the question is about this specific mission's results.`;

export async function askPratham(
  query: string,
  history: { role: "user" | "assistant"; content: string }[] = []
): Promise<{ content: string }> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    return { content: "AI is not configured yet. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables." };
  }

  // Fetch live mission data as optional context — never blocks
  let missionContext = "";
  try {
    const [stats, rankings] = await Promise.all([getDashboardStats(), getPORankings()]);
    missionContext = `
LIVE MISSION DATA (Maharashtra FLN Hub):
- Total students: ${stats.totalStudents}
- Total assessments: ${stats.totalAssessments}
- Total schools: ${stats.totalSchools}
- Top Project Offices: ${JSON.stringify(rankings?.slice(0, 3))}
- Lowest Project Offices: ${JSON.stringify(rankings?.slice(-3))}`;
  } catch (_) {
    missionContext = "";
  }

  // Build Gemini chat history
  const geminiHistory = history.map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const fullSystemPrompt = SYSTEM_PROMPT + (missionContext ? `\n${missionContext}` : "");

  try {
    const models = ["gemini-1.5-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash"];
    let text = "";

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: fullSystemPrompt,
        });

        const chat = model.startChat({
          history: geminiHistory,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        });

        const result = await chat.sendMessage(query);
        text = result.response.text().trim();
        if (text) break;
      } catch (_) { continue; }
    }

    if (!text) throw new Error("All models returned empty");
    return { content: text };

  } catch (error: any) {
    console.error("askPratham error:", error.message);
    return { content: "I'm having trouble connecting right now. Please try again in a moment." };
  }
}
