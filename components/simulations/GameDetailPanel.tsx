"use client";

import { X, Users, ListChecks, Swords, Zap, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAudience, type Item } from "@/lib/sim-data";

type GameDetailPanelProps = {
  item: Item | null;
  accent?: { accent: string; glow: string };
  onStart: () => void;
  onClose: () => void;
};

const DEFAULT_ACCENT = { accent: "from-slate-600 to-slate-800", glow: "shadow-slate-500/40" };

function getHtmlGamePath(id: string): string {
  const cleanId = id.toLowerCase().replace(/_/g, '-');
  if (cleanId.includes('market')) return '/games/math-mania-market.html';
  if (cleanId.includes('candy') || cleanId.includes('akshar')) return '/games/akshar-candy.html';
  if (cleanId.includes('duel') || cleanId.includes('battle') || cleanId.includes('race')) return '/games/student-vs-student.html';
  if (cleanId.includes('story')) return '/games/story-reader.html';
  return '/games/math-mania-market.html';
}

// Hotstar/Netflix-style "more info" panel — opens beside (desktop) or below
// (mobile) the game grid so browsing isn't interrupted. Shows the same
// instructions the pre-game intro screen used to show, plus who the game is
// for, so GameWrapper can skip that now-redundant screen when launched here.
export default function GameDetailPanel({ item, accent = DEFAULT_ACCENT, onStart, onClose }: GameDetailPanelProps) {
  if (!item) return null;

  const isBattle = item.subject === "Battle";
  const htmlPath = getHtmlGamePath(item.id);

  return (
    <>
      {/* Mobile backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[149] sm:hidden" onClick={onClose} />

      <div
        className={cn(
          "bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col",
          "fixed inset-x-0 bottom-0 z-[150] rounded-t-[28px] max-h-[85dvh]",
          // bottom-28 clears the "Ask Pratham" chat FAB, which floats at bottom-8 on this breakpoint
          "sm:inset-x-auto sm:bottom-28 sm:top-24 sm:right-4 sm:w-[380px] sm:rounded-3xl sm:max-h-none",
          "animate-in slide-in-from-bottom sm:slide-in-from-right duration-300"
        )}
      >
        {/* Header */}
        <div className={cn("relative shrink-0 px-6 pt-6 pb-8 bg-gradient-to-br text-white", accent.accent)}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shadow-inner mb-3">
            {item.emoji}
          </div>
          <h2 className="text-2xl font-black leading-tight pr-8">{item.title}</h2>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">{item.subject}</span>
            <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">Lvl: {item.level}</span>
            {item.tag && <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">{item.tag}</span>}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-widest">Who it's for</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{getAudience(item)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400">
              <ListChecks className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-widest">What you'll do</span>
            </div>
            <div className="space-y-2">
              {item.instructions.map((line, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA — extra bottom padding on mobile clears the "Ask Pratham" chat FAB */}
        <div className="shrink-0 px-4 pt-4 pb-24 sm:pb-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            onClick={onStart}
            className={cn(
              "w-full py-4 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] bg-gradient-to-r",
              accent.accent
            )}
          >
            {isBattle ? (
              <>Find an Opponent <Swords className="w-5 h-5" /></>
            ) : (
              <>Start Game <Zap fill="white" className="w-5 h-5" /></>
            )}
          </button>

          <a
            href={htmlPath}
            download
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] text-sm"
          >
            <Download className="w-4 h-4" /> Download Offline Game (.html)
          </a>
        </div>
      </div>
    </>
  );
}
