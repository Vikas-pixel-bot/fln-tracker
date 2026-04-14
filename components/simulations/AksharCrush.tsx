"use client";

import { useState, useCallback, useRef } from "react";
import { usePoints } from "@/lib/points-store";
import GameHeader from "@/components/games/GameHeader";
import { cn } from "@/lib/utils";

// ─── Matra Categories ─────────────────────────────────────────────────────────
const CATS = [
  {
    label: "अ", name: "शुद्ध",
    bg: "bg-orange-400", border: "border-orange-600", text: "text-white",
    pool: ["क","ख","ग","घ","च","छ","ज","झ","ट","ठ","ड","त","थ","द","न","प","फ","ब","म","र","ल","व","स","ह"],
  },
  {
    label: "आ", name: "आ-मात्रा",
    bg: "bg-red-400", border: "border-red-600", text: "text-white",
    pool: ["का","खा","गा","घा","चा","जा","झा","ता","था","दा","ना","पा","फा","बा","मा","रा","ला","वा","सा","हा"],
  },
  {
    label: "इ", name: "इ-मात्रा",
    bg: "bg-sky-500", border: "border-sky-700", text: "text-white",
    pool: ["कि","खि","गि","चि","जि","ति","थि","दि","नि","पि","बि","मि","रि","लि","वि","सि","हि"],
  },
  {
    label: "ई", name: "ई-मात्रा",
    bg: "bg-violet-500", border: "border-violet-700", text: "text-white",
    pool: ["की","खी","गी","ची","जी","ती","थी","दी","नी","पी","बी","मी","री","ली","वी","सी","ही"],
  },
  {
    label: "उ", name: "उ-मात्रा",
    bg: "bg-emerald-500", border: "border-emerald-700", text: "text-white",
    pool: ["कु","खु","गु","चु","जु","तु","थु","दु","नु","पु","बु","मु","रु","लु","वु","सु","हु"],
  },
  {
    label: "ए", name: "ए-मात्रा",
    bg: "bg-yellow-400", border: "border-yellow-600", text: "text-gray-900",
    pool: ["के","खे","गे","चे","जे","ते","थे","दे","ने","पे","बे","मे","रे","ले","वे","से","हे"],
  },
  {
    label: "ओ", name: "ओ-मात्रा",
    bg: "bg-pink-500", border: "border-pink-700", text: "text-white",
    pool: ["को","खो","गो","चो","जो","तो","थो","दो","नो","पो","बो","मो","रो","लो","वो","सो","हो"],
  },
] as const;

const ROWS = 7, COLS = 6, MOVES_START = 30;
type CatIdx = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Cell = { id: number; syl: string; cat: CatIdx };

let uid = 1;
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function rndCat(avoid = -1): CatIdx {
  let c = Math.floor(Math.random() * CATS.length) as CatIdx;
  while (c === avoid) c = Math.floor(Math.random() * CATS.length) as CatIdx;
  return c;
}

function rndCell(avoid = -1): Cell {
  const cat = rndCat(avoid);
  const pool = CATS[cat].pool as readonly string[];
  return { id: uid++, syl: pool[Math.floor(Math.random() * pool.length)], cat };
}

function safeCell(g: (Cell | null)[][], r: number, c: number): Cell {
  let cell = rndCell();
  for (let i = 0; i < 30; i++) {
    const hMatch = c >= 2 && g[r][c - 1]?.cat === cell.cat && g[r][c - 2]?.cat === cell.cat;
    const vMatch = r >= 2 && g[r - 1]?.[c]?.cat === cell.cat && g[r - 2]?.[c]?.cat === cell.cat;
    if (!hMatch && !vMatch) return cell;
    cell = rndCell();
  }
  return cell;
}

function mkGrid(): Cell[][] {
  const g: (Cell | null)[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      g[r][c] = safeCell(g, r, c);
  return g as Cell[][];
}

function findMatches(g: Cell[][]): Set<string> {
  const s = new Set<string>();
  // horizontal
  for (let r = 0; r < ROWS; r++) {
    let c = 0;
    while (c < COLS - 2) {
      if (g[r][c].cat === g[r][c + 1].cat && g[r][c].cat === g[r][c + 2].cat) {
        let e = c + 2;
        while (e + 1 < COLS && g[r][e + 1].cat === g[r][c].cat) e++;
        for (let i = c; i <= e; i++) s.add(`${r},${i}`);
        c = e + 1;
      } else c++;
    }
  }
  // vertical
  for (let c = 0; c < COLS; c++) {
    let r = 0;
    while (r < ROWS - 2) {
      if (g[r][c].cat === g[r + 1][c].cat && g[r][c].cat === g[r + 2][c].cat) {
        let e = r + 2;
        while (e + 1 < ROWS && g[e + 1][c].cat === g[r][c].cat) e++;
        for (let i = r; i <= e; i++) s.add(`${i},${c}`);
        r = e + 1;
      } else r++;
    }
  }
  return s;
}

function dropAndFill(g: Cell[][], matched: Set<string>): Cell[][] {
  const next: Cell[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  for (let c = 0; c < COLS; c++) {
    let w = ROWS - 1;
    for (let r = ROWS - 1; r >= 0; r--)
      if (!matched.has(`${r},${c}`)) next[w--][c] = g[r][c];
    for (let r = w; r >= 0; r--) next[r][c] = rndCell();
  }
  return next;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AksharCrush({ onExit }: { onExit?: () => void }) {
  const { addXP } = usePoints();
  const [grid, setGrid] = useState<Cell[][]>(mkGrid);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [flash, setFlash] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [moves, setMoves] = useState(MOVES_START);
  const [gameOver, setGameOver] = useState(false);
  const dragRef = useRef<{ r: number; c: number; x: number; y: number } | null>(null);
  const didSwipe = useRef(false);

  const processChain = useCallback(async (startGrid: Cell[][]) => {
    let g = startGrid;
    let chain = 0;
    while (true) {
      const matched = findMatches(g);
      if (!matched.size) break;
      chain++;
      setCombo(chain);
      const points = matched.size * 10 * chain;
      setScore(s => s + points);
      addXP(Math.ceil(points / 10)); // 1 XP per 10 points
      setFlash(matched);
      await sleep(400);
      g = dropAndFill(g, matched);
      setFlash(new Set());
      setGrid(g.map(row => [...row]));
      await sleep(280);
    }
    setCombo(0);
  }, []);

  const doSwap = useCallback(async (r1: number, c1: number, r2: number, c2: number) => {
    if (busy || gameOver) return;
    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return;
    setBusy(true);
    setSelected(null);
    const g = grid.map(row => [...row]);
    [g[r1][c1], g[r2][c2]] = [g[r2][c2], g[r1][c1]];
    if (!findMatches(g).size) {
      // Invalid swap — no match formed
      setBusy(false);
      return;
    }
    setGrid(g);
    setMoves(m => {
      const n = m - 1;
      if (n <= 0) setTimeout(() => setGameOver(true), 900);
      return n;
    });
    await processChain(g);
    setBusy(false);
  }, [busy, gameOver, grid, processChain]);

  const handleTap = (r: number, c: number) => {
    if (didSwipe.current) { didSwipe.current = false; return; }
    if (busy || gameOver) return;
    if (!selected) { setSelected([r, c]); return; }
    const [sr, sc] = selected;
    if (sr === r && sc === c) { setSelected(null); return; }
    if (Math.abs(sr - r) + Math.abs(sc - c) !== 1) { setSelected([r, c]); return; }
    doSwap(sr, sc, r, c);
  };

  const onPtrDown = (e: React.PointerEvent<HTMLButtonElement>, r: number, c: number) => {
    dragRef.current = { r, c, x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPtrUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    const { r, c, x, y } = dragRef.current;
    dragRef.current = null;
    const dx = e.clientX - x, dy = e.clientY - y;
    if (Math.abs(dx) < 14 && Math.abs(dy) < 14) return; // tap — let onClick handle
    didSwipe.current = true;
    let tr = r, tc = c;
    if (Math.abs(dx) > Math.abs(dy)) tc += dx > 0 ? 1 : -1;
    else tr += dy > 0 ? 1 : -1;
    if (tr >= 0 && tr < ROWS && tc >= 0 && tc < COLS) doSwap(r, c, tr, tc);
  };

  const restart = () => {
    setGrid(mkGrid());
    setSelected(null);
    setFlash(new Set());
    setBusy(false);
    setScore(0);
    setCombo(0);
    setMoves(MOVES_START);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center gap-3 p-3 pb-8 select-none" style={{ touchAction: "none" }}>
      <GameHeader title="अक्षर कँडी (Akshar Crush)" score={score} total={moves} />
      
      {/* Matra legend */}
      <div className="flex gap-1 flex-wrap justify-center max-w-sm">
        {CATS.map((cat, i) => (
          <span key={i} className={cn(
            "px-2 py-0.5 rounded-full text-[11px] font-bold border",
            cat.bg, cat.text, cat.border,
          )}>
            {cat.label} = {cat.name}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div
        className="rounded-2xl border-2 border-slate-300 shadow-2xl bg-slate-200 p-1"
        style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 4 }}
      >
        {grid.flatMap((row, r) =>
          row.map((cell, c) => {
            const key = `${r},${c}`;
            const isFlash = flash.has(key);
            const isSel = selected?.[0] === r && selected?.[1] === c;
            const cat = CATS[cell.cat];
            return (
              <button
                key={cell.id}
                onClick={() => handleTap(r, c)}
                onPointerDown={e => onPtrDown(e, r, c)}
                onPointerUp={e => onPtrUp(e)}
                className={cn(
                  "w-12 h-12 rounded-xl border-2 font-bold text-base",
                  "transition-all duration-200 flex items-center justify-center leading-none",
                  cat.bg, cat.border, cat.text,
                  isSel && "ring-4 ring-white ring-offset-1 scale-110 brightness-110 z-10 relative",
                  isFlash && "scale-0 opacity-0",
                )}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {cell.syl}
              </button>
            );
          })
        )}
      </div>

      <p className="text-[11px] text-slate-400 text-center max-w-xs">
        एकाच मात्रेचे ३ अक्षर एका रांगेत आणा • टॅप किंवा स्वाइप करा
      </p>

      {/* Game Over */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-xs w-full">
            <div className="text-6xl mb-3">{score >= 500 ? "🏆" : score >= 200 ? "⭐" : "🎮"}</div>
            <div className="text-2xl font-bold text-slate-800 mb-1">खेळ संपला!</div>
            <div className="text-5xl font-bold text-indigo-600 mb-1">{score}</div>
            <div className="text-sm text-slate-400 mb-6">गुण मिळवले</div>
            <button
              onClick={restart}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-lg transition-colors"
            >
              पुन्हा खेळा 🔄
            </button>
            {onExit && (
              <button onClick={onExit} className="mt-3 text-slate-400 text-sm hover:text-slate-600 w-full py-2">
                बाहेर पडा
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
