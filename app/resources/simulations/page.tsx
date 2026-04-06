"use client";
import React, { useState } from "react";
import { ArrowLeft, Zap, Trophy, Gamepad2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Simulations
import BundleBuilder from "@/components/simulations/BundleBuilder";
import NumberHunter from "@/components/simulations/NumberHunter";
import AdditionMaster from "@/components/simulations/AdditionMaster";
import SoundExplorer from "@/components/simulations/SoundExplorer";
import WordBuilder from "@/components/simulations/WordBuilder";
import SentenceArchitect from "@/components/simulations/SentenceArchitect";
import MathSprint from "@/components/simulations/MathSprint";
import SoundDuel from "@/components/simulations/SoundDuel";

// Games
import CountingStones from "@/components/games/CountingStones";
import BiggerSmaller from "@/components/games/BiggerSmaller";
import LetterPicker from "@/components/games/LetterPicker";
import OddOneOut from "@/components/games/OddOneOut";
import FishGame from "@/components/games/FishGame";
import MissingLetter from "@/components/games/MissingLetter";
import RhymeTime from "@/components/games/RhymeTime";
import TrueFalse from "@/components/games/TrueFalse";
import SentenceBuilder from "@/components/games/SentenceBuilder";
import StorySequence from "@/components/games/StorySequence";
import NumberTrain from "@/components/games/NumberTrain";
import WeightMatcher from "@/components/games/WeightMatcher";
import PlaceValue from "@/components/games/PlaceValue";
import NumberBonds from "@/components/games/NumberBonds";
import MarketMath from "@/components/games/MarketMath";
import NumberRiver from "@/components/games/NumberRiver";
import ClockReader from "@/components/games/ClockReader";
import SortingHat from "@/components/games/SortingHat";

type Item = { id: string; title: string; level: string; subject: string; emoji: string; component: React.ReactNode; tag?: string };

const SIMS: Item[] = [
  { id: "math-sprint",     title: "Math Sprint",        level: "10-99",      subject: "Battle",   emoji: "⚡", tag: "60s Race",   component: <MathSprint /> },
  { id: "sound-duel",      title: "Sound Duel",         level: "Letter",     subject: "Battle",   emoji: "🎙️", tag: "60s Race",  component: <SoundDuel /> },
  { id: "number-hunter",   title: "Number Hunter",      level: "1-9",        subject: "Math",     emoji: "🔢", component: <NumberHunter /> },
  { id: "bundle-builder",  title: "Bundle Builder",     level: "10-99",      subject: "Math",     emoji: "📦", component: <BundleBuilder /> },
  { id: "addition-master", title: "Addition Master",    level: "Operations", subject: "Math",     emoji: "➕", component: <AdditionMaster /> },
  { id: "sound-explorer",  title: "Sound Explorer",     level: "Letter",     subject: "Literacy", emoji: "🔊", component: <SoundExplorer /> },
  { id: "word-builder",    title: "Word Builder",       level: "Word",       subject: "Literacy", emoji: "🔤", component: <WordBuilder /> },
  { id: "sentence-arch",   title: "Sentence Architect", level: "Para/Story", subject: "Literacy", emoji: "📜", component: <SentenceArchitect /> },
];

const GAMES: Item[] = [
  { id: "g-oddone",   title: "Odd One Out",        level: "Beginner",    subject: "Literacy", emoji: "🔍", component: <OddOneOut /> },
  { id: "g-letters",  title: "Letter Explorer",    level: "Letter",      subject: "Literacy", emoji: "🔤", component: <LetterPicker /> },
  { id: "g-missing",  title: "Missing Letter",     level: "Word",        subject: "Literacy", emoji: "🔡", component: <MissingLetter /> },
  { id: "g-fish",     title: "Fish Word Catch",    level: "Word",        subject: "Literacy", emoji: "🐟", component: <FishGame /> },
  { id: "g-rhyme",    title: "Rhyme Time",         level: "Word",        subject: "Literacy", emoji: "🎵", component: <RhymeTime /> },
  { id: "g-sentence", title: "Sentence Builder",   level: "Paragraph",   subject: "Literacy", emoji: "📝", component: <SentenceBuilder /> },
  { id: "g-story",    title: "Story Sequence",     level: "Paragraph",   subject: "Literacy", emoji: "📖", component: <StorySequence /> },
  { id: "g-true",     title: "True or False",      level: "Story",       subject: "Literacy", emoji: "✅", component: <TrueFalse /> },
  { id: "g-bigger",   title: "Bigger or Smaller",  level: "Beginner",    subject: "Numeracy", emoji: "🔢", component: <BiggerSmaller /> },
  { id: "g-counting", title: "Count the Stones",   level: "Beginner",    subject: "Numeracy", emoji: "🪨", component: <CountingStones /> },
  { id: "g-train",    title: "Number Train",       level: "1–9",         subject: "Numeracy", emoji: "🚂", component: <NumberTrain /> },
  { id: "g-weights",  title: "Balance the Scale",  level: "10–99",       subject: "Numeracy", emoji: "⚖️", component: <WeightMatcher /> },
  { id: "g-place",    title: "Place Value Builder", level: "10–99",       subject: "Numeracy", emoji: "🏗️", component: <PlaceValue /> },
  { id: "g-bonds",    title: "Number Bonds",       level: "Addition",    subject: "Numeracy", emoji: "🔗", component: <NumberBonds /> },
  { id: "g-market",   title: "Market Math",        level: "Operations",  subject: "Numeracy", emoji: "🛒", component: <MarketMath /> },
  { id: "g-river",    title: "Number River",       level: "Operations",  subject: "Numeracy", emoji: "🌊", component: <NumberRiver /> },
  { id: "g-clock",    title: "Clock Reader",       level: "Life Skills", subject: "Bonus",    emoji: "🕐", component: <ClockReader /> },
  { id: "g-sorting",  title: "Sorting Hat",        level: "Cross-level", subject: "Bonus",    emoji: "🎩", component: <SortingHat /> },
];

const ALL = [...SIMS, ...GAMES];

const SECTIONS = [
  { label: "⚡ Battle Arena",         filter: (i: Item) => i.subject === "Battle",   accent: "from-orange-500 to-red-500",   glow: "shadow-orange-500/40",  ring: "ring-orange-400",   active: "bg-gradient-to-r from-orange-500 to-red-500 text-white" },
  { label: "📦 Numeracy Simulations", filter: (i: Item) => i.subject === "Math",     accent: "from-blue-500 to-indigo-600",  glow: "shadow-blue-500/40",    ring: "ring-blue-400",     active: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" },
  { label: "📜 Literacy Simulations", filter: (i: Item) => i.subject === "Literacy" && SIMS.some(s => s.id === i.id), accent: "from-violet-500 to-purple-600", glow: "shadow-violet-500/40", ring: "ring-violet-400", active: "bg-gradient-to-r from-violet-500 to-purple-600 text-white" },
  { label: "🎮 Literacy Games",       filter: (i: Item) => i.subject === "Literacy" && GAMES.some(g => g.id === i.id), accent: "from-green-500 to-teal-500",   glow: "shadow-green-500/40",   ring: "ring-green-400",    active: "bg-gradient-to-r from-green-500 to-teal-500 text-white" },
  { label: "🔢 Numeracy Games",       filter: (i: Item) => i.subject === "Numeracy", accent: "from-cyan-500 to-blue-500",    glow: "shadow-cyan-500/40",    ring: "ring-cyan-400",     active: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white" },
  { label: "🎁 Bonus",                filter: (i: Item) => i.subject === "Bonus",    accent: "from-pink-500 to-rose-500",    glow: "shadow-pink-500/40",    ring: "ring-pink-400",     active: "bg-gradient-to-r from-pink-500 to-rose-500 text-white" },
];

export default function SimulationsPage() {
  const [activeId, setActiveId] = useState("bundle-builder");
  const active = ALL.find(s => s.id === activeId)!;
  const activeSection = SECTIONS.find(s => s.filter(active)) ?? SECTIONS[1];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">

      {/* Arcade Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 border border-slate-700">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Link href="/resources" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to Training Hub
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/40">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Simulations & Games</h1>
                <p className="text-slate-400 text-sm font-medium">Level-wise interactive tools for students & teachers</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <StatBadge icon="🎮" label="Total Tools" value={ALL.length} color="from-blue-500 to-indigo-600" />
            <StatBadge icon="⭐" label="Simulations" value={SIMS.length} color="from-orange-500 to-red-500" />
            <StatBadge icon="🏆" label="Games" value={GAMES.length} color="from-green-500 to-teal-500" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 items-start">

        {/* Sidebar */}
        <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-1">
          {SECTIONS.map(section => {
            const items = ALL.filter(section.filter);
            return (
              <div key={section.label} className="space-y-1.5">
                <p className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-gradient-to-r ${section.accent} bg-clip-text text-transparent`}>
                  {section.label}
                </p>
                {items.map(item => {
                  const isActive = item.id === activeId;
                  return (
                    <button key={item.id} onClick={() => setActiveId(item.id)}
                      className={cn(
                        "w-full px-3 py-2.5 rounded-2xl text-left transition-all duration-200 flex items-center gap-3 group",
                        isActive
                          ? `${section.active} shadow-lg ${section.glow}`
                          : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      )}>
                      <span className="text-xl shrink-0">{item.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("font-bold text-sm truncate leading-tight", isActive ? "text-white" : "")}>{item.title}</p>
                        <p className={cn("text-[10px] font-semibold truncate", isActive ? "text-white/70" : "text-slate-400")}>Lvl: {item.level}</p>
                      </div>
                      {item.tag && (
                        <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0", isActive ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600")}>
                          {item.tag}
                        </span>
                      )}
                      <ChevronRight className={cn("w-3.5 h-3.5 shrink-0 transition-all", isActive ? "text-white translate-x-0.5" : "opacity-0 group-hover:opacity-40")} />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-3 space-y-5">

          {/* Active game label */}
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r ${activeSection.accent} shadow-lg ${activeSection.glow} text-white`}>
            <span className="text-2xl">{active.emoji}</span>
            <div className="flex-1">
              <p className="font-black text-lg leading-tight">{active.title}</p>
              <p className="text-white/70 text-xs font-semibold">Level: {active.level} · {active.subject}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span className="text-xs font-black">LIVE</span>
            </div>
          </div>

          {/* Game area */}
          <div key={activeId} className="animate-in fade-in zoom-in-95 duration-300">
            {active.component}
          </div>

          {/* Quick-pick related games */}
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5" /> More in this category
            </p>
            <div className="flex gap-2 flex-wrap">
              {ALL.filter(i => i.subject === active.subject && i.id !== activeId).slice(0, 6).map(i => (
                <button key={i.id} onClick={() => setActiveId(i.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all active:scale-95">
                  {i.emoji} {i.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r ${color} shadow-lg text-white`}>
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-white/70">{label}</p>
        <p className="text-xl font-black leading-none">{value}</p>
      </div>
    </div>
  );
}
