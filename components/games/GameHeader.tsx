'use client';

import React from 'react';
import { usePoints } from '@/lib/points-store';
import { Trophy, Star, Zap, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameHeaderProps {
  title: string;
  score: number;
  total: number;
  levelLabel?: string;
}

export default function GameHeader({ title, score, total, levelLabel }: GameHeaderProps) {
  const { xp, streak, level, progress } = usePoints();

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-6 shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between relative z-10">
        
        {/* Game Title & Local Score */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <h2 className="text-xl font-black text-white">{title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Session Score</span>
            <span className="text-2xl font-black text-white tabular-nums">
              {score}<span className="text-slate-500 text-sm ml-1">/ {total}</span>
            </span>
          </div>
        </div>

        {/* Global Progress */}
        <div className="flex flex-wrap gap-4 items-center">
          
          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-xl">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <div className="text-[10px] font-black uppercase text-orange-500 leading-none">
                {streak} Day Streak
              </div>
            </div>
          )}

          {/* Level Circle */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={175.9}
                strokeDashoffset={175.9 - (175.9 * progress) / 100}
                strokeLinecap="round"
                className="text-blue-500 transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span className="text-[10px] font-black text-slate-500 uppercase">Lvl</span>
              <span className="text-lg font-black text-white">{level}</span>
            </div>
          </div>

          {/* XP & Level Badge */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-blue-400 uppercase tracking-tighter">Total XP</span>
              <span className="text-2xl font-black text-white tabular-nums">{xp}</span>
            </div>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">
              Next Rank: {level + 1}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
