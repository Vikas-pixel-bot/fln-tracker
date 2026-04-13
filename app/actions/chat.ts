"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { TARL_PEDAGOGY_KNOWLEDGE } from "@/lib/tarl_pedagogy";
import { getDashboardStats, getPORankings } from "@/app/actions";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

const LIT_LABELS = ["Beginner", "Letter", "Word", "Paragraph", "Story"];
const NUM_LABELS = ["Beginner", "1–9", "10–99", "Subtraction+"];
const TERMS = ["Baseline", "Midline", "Endline"];

// Format the full dashboard into readable prose the model can reason over
async function buildMissionContext(): Promise<string> {
  try {
    const [stats, rankings] = await Promise.all([getDashboardStats(), getPORankings()]);

    const lines: string[] = [];
    lines.push("══════════════════════════════════════════");
    lines.push("LIVE MISSION DATA — FLN Hub (Maharashtra)");
    lines.push("══════════════════════════════════════════");
    lines.push(`Total students: ${stats.totalStudents}`);
    lines.push(`Total assessments recorded: ${stats.totalAssessments}`);
    lines.push(`Total schools: ${stats.totalSchools}`);
    lines.push(`Total 2v2 arena battles: ${stats.totalArenaBattles}`);

    // Overall literacy breakdown by term
    lines.push("\n── LITERACY LEVEL DISTRIBUTION (All Classes) ──");
    for (const term of TERMS) {
      const d = stats.overallBreakdown?.literacy?.[term];
      if (!d) continue;
      const lvlStr = Object.entries(d.levels)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([lvl, v]: [string, any]) => `L${lvl}(${LIT_LABELS[Number(lvl)]})=${v.pct}%`)
        .join(", ");
      lines.push(`  ${term} (n=${d.total}): ${lvlStr}`);
    }

    // Overall numeracy breakdown by term
    lines.push("\n── NUMERACY LEVEL DISTRIBUTION (All Classes) ──");
    for (const term of TERMS) {
      const d = stats.overallBreakdown?.numeracy?.[term];
      if (!d) continue;
      const lvlStr = Object.entries(d.levels)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([lvl, v]: [string, any]) => `L${lvl}(${NUM_LABELS[Number(lvl)] ?? lvl})=${v.pct}%`)
        .join(", ");
      lines.push(`  ${term} (n=${d.total}): ${lvlStr}`);
    }

    // Operations mastery
    if (stats.operations) {
      lines.push("\n── ARITHMETIC OPERATIONS MASTERY (% of assessed) ──");
      for (const term of TERMS) {
        const op = stats.operations[term];
        if (!op || op.total === 0) continue;
        const pct = (n: number) => Math.round((n / op.total) * 100);
        lines.push(`  ${term}: Addition=${pct(op.addition)}% | Subtraction=${pct(op.subtraction)}% | Multiplication=${pct(op.multiplication)}% | Division=${pct(op.division)}%`);
      }
    }

    // Class-wise breakdown (compact)
    if (stats.availableClasses?.length) {
      lines.push("\n── CLASS-WISE SNAPSHOT (latest term available) ──");
      for (const cls of stats.availableClasses) {
        const litData = stats.classBreakdown?.literacy?.[cls];
        const numData = stats.classBreakdown?.numeracy?.[cls];
        const latestTerm = TERMS.slice().reverse().find(t => litData?.[t]);
        if (!latestTerm) continue;
        const ld = litData?.[latestTerm];
        const nd = numData?.[latestTerm];
        const litTop = ld ? Object.entries(ld.levels).sort(([, a]: any, [, b]: any) => b.pct - a.pct)[0] : null;
        const numTop = nd ? Object.entries(nd.levels).sort(([, a]: any, [, b]: any) => b.pct - a.pct)[0] : null;
        lines.push(
          `  Class ${cls} (${latestTerm}, n=${ld?.total ?? 0}): ` +
          `Literacy most common = L${litTop?.[0]}(${LIT_LABELS[Number(litTop?.[0])] ?? "?"}); ` +
          `Numeracy most common = L${numTop?.[0]}(${NUM_LABELS[Number(numTop?.[0])] ?? "?"})`
        );
      }
    }

    // PO rankings
    if (rankings?.length) {
      lines.push("\n── PROJECT OFFICE RANKINGS (by combined FLN score) ──");
      const top3 = rankings.slice(0, 3);
      const bot3 = rankings.slice(-3);
      lines.push("  Top performers:");
      top3.forEach((po, i) => {
        lines.push(`    ${i + 1}. ${po.name} — Score ${po.score}% | Story readers: ${po.storyPct}% | Subtraction masters: ${po.subtractionPct}% | Assessed: ${po.totalAssessed}`);
      });
      lines.push("  Need most support:");
      bot3.forEach((po, i) => {
        lines.push(`    ${i + 1}. ${po.name} — Score ${po.score}% | Story readers: ${po.storyPct}% | Subtraction masters: ${po.subtractionPct}% | Assessed: ${po.totalAssessed}`);
      });
    }

    lines.push("══════════════════════════════════════════");
    return lines.join("\n");

  } catch (err) {
    return ""; // mission data unavailable — bot still works
  }
}

const BASE_SYSTEM_PROMPT = `You are Pratham — an expert AI education assistant built into the FLN Hub platform used by Pratham Education Foundation field educators across Maharashtra, India.

You have two equally important roles:
1. MISSION ANALYST: You can see the live FLN assessment data for this mission (student counts, literacy/numeracy level distributions by term, class-wise breakdowns, arithmetic mastery, and project office rankings). When a user asks about data, results, progress, or comparisons — answer specifically from that data. If baseline vs endline shows improvement, say so with the actual percentages.

2. EDUCATION EXPERT: You are an expert in:
   - Foundational Literacy and Numeracy (FLN) — full spectrum from pre-literacy to fluent reading and division
   - Teaching at the Right Level (TaRL) — Pratham's methodology, the 90-minute flow, level groups, TLMs
   - ASER framework — what each level means, how to assess, how to move students up
   - Early Childhood Education (ECE/ECCE) — developmental milestones, play-based learning, kindergarten readiness, ages 3–6
   - Primary education pedagogy — differentiated instruction, multi-level classrooms, phonics, number sense
   - Marathi medium instruction — matras, barakhadi, Devanagari phonics, common confusion patterns (ि vs ी, ु vs ू)
   - Child development — cognitive, language, social-emotional development ages 3–10
   - Educational research — what evidence says about early reading, mother tongue instruction, structured pedagogy
   - Government policy — NEP 2020, NIPUN Bharat, Samagra Shiksha, PM POSHAN, Right to Education
   - Teacher training and professional development for field educators in low-resource settings
   - Parent and community engagement in children's learning
   - Low-cost teaching materials, classroom games, manipulatives

ALWAYS:
- Answer in the same language the user writes in (English / Marathi / Hinglish — match their register exactly)
- Be specific and practical — give real activity names, step-by-step instructions, actual percentages from data
- When data shows a problem (e.g. 60% still at Beginner in Endline), flag it clearly and suggest the right intervention
- When asked about pedagogy, connect it to the specific ASER levels visible in the data where relevant
- Keep answers focused and readable — use bullet points or numbered steps when listing activities

`;

export async function askPratham(
  query: string,
  history: { role: "user" | "assistant"; content: string }[] = []
): Promise<{ content: string }> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return { content: "AI is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to environment variables." };
  }

  // Build full context: mission data + TaRL knowledge base
  const [missionContext] = await Promise.all([buildMissionContext()]);

  const systemInstruction =
    BASE_SYSTEM_PROMPT +
    (missionContext ? `\n${missionContext}\n` : "\nNote: Live mission data is currently unavailable.\n") +
    `\n${TARL_PEDAGOGY_KNOWLEDGE}`;

  // Gemini multi-turn history
  const geminiHistory = history.slice(0, -1).map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  try {
    const models = ["gemini-1.5-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash"];
    let text = "";

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction,
        });
        const chat = model.startChat({
          history: geminiHistory,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
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
