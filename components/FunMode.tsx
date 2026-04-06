"use client";

import { useEffect, useState } from "react";

// Mascot expressions
export function Mascot({ mood }: { mood: 'idle' | 'happy' | 'cheer' | 'think' }) {
  const faces = {
    idle:  { eyes: "◕ ◕", mouth: "◡", color: "bg-yellow-300", bounce: false },
    happy: { eyes: "^ ^",  mouth: "◡◡", color: "bg-yellow-300", bounce: true },
    cheer: { eyes: "★ ★",  mouth: "D",  color: "bg-green-300",  bounce: true },
    think: { eyes: "· ·",  mouth: "~",  color: "bg-blue-200",   bounce: false },
  };
  const f = faces[mood];

  return (
    <div className={`flex flex-col items-center gap-1 transition-all duration-500 ${f.bounce ? "animate-bounce" : ""}`}>
      <div className={`${f.color} rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg border-4 border-white text-2xl select-none`}>
        <span className="tracking-widest text-sm font-bold">{f.eyes}</span>
        <span className="text-lg font-black">{f.mouth}</span>
      </div>
      {mood === 'cheer' && (
        <div className="flex gap-1 text-xl animate-pulse">⭐⭐⭐</div>
      )}
    </div>
  );
}

// Star burst shown after each answer
export function StarBurst({ show, pass }: { show: boolean; pass: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-in zoom-in duration-300">
      <div className={`text-center px-8 py-6 rounded-3xl shadow-2xl border-4 ${pass ? "bg-green-50 border-green-300" : "bg-orange-50 border-orange-300"}`}>
        <div className="text-5xl mb-2">{pass ? "🌟" : "💪"}</div>
        <p className={`text-2xl font-black ${pass ? "text-green-600" : "text-orange-500"}`}>
          {pass ? pickRandom(CHEER_MSGS) : pickRandom(TRY_MSGS)}
        </p>
      </div>
    </div>
  );
}

const CHEER_MSGS = ["Amazing! 🎉", "You got it! ⭐", "Superstar! 🌟", "Brilliant! 🏆", "Fantastic! 🎊"];
const TRY_MSGS  = ["Keep going! 💪", "You can do it!", "Great try! 🤗", "Almost there!", "You're brave! 🦁"];

function pickRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Stars progress bar
export function StarProgress({ earned, total }: { earned: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1 py-2">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`text-2xl transition-all duration-300 ${i < earned ? "opacity-100 scale-110" : "opacity-20"}`}>⭐</span>
      ))}
    </div>
  );
}

// Hook to auto-hide the star burst after 1.2s
export function useStarBurst() {
  const [burst, setBurst] = useState<{ show: boolean; pass: boolean }>({ show: false, pass: false });

  function trigger(pass: boolean) {
    setBurst({ show: true, pass });
    setTimeout(() => setBurst({ show: false, pass }), 1200);
  }

  return { burst, trigger };
}
