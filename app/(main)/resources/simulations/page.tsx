"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Zap, Trophy, Gamepad2, ChevronRight, Eye, EyeOff, X, RefreshCw, Share2, Check, ShoppingBag, Download } from "lucide-react";

function getGameDownloadPath(id: string): string {
  return `/api/download-game?id=${encodeURIComponent(id)}`;
}

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePoints } from "@/lib/points-store";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { hasRole } from "@/lib/checkAccess";

import { SIMS, GAMES, ALL, Item } from "@/lib/sim-data";
import BattleMatchmaker from "@/components/simulations/BattleMatchmaker";
import GameWrapper from "@/components/games/GameWrapper";
import LevelUpModal from "@/components/games/LevelUpModal";
import StudentTrackerOverlay from "@/components/simulations/StudentTrackerOverlay";
import GameDetailPanel from "@/components/simulations/GameDetailPanel";
import AvatarStoreModal from "@/components/AvatarStoreModal";

const SECTIONS = [
  // Language Pathways
  { label: "🔤 Akshargandh (Beginner)", filter: (i: Item) => i.pathway === "akshargandh", accent: "from-emerald-400 to-teal-500", glow: "shadow-emerald-500/40", ring: "ring-emerald-400", active: "bg-gradient-to-r from-emerald-400 to-teal-500 text-white" },
  { label: "🌸 Pushpgandh (Advanced)", filter: (i: Item) => i.pathway === "pushpgandh", accent: "from-pink-400 to-rose-500", glow: "shadow-pink-500/40", ring: "ring-pink-400", active: "bg-gradient-to-r from-pink-400 to-rose-500 text-white" },
  { label: "📖 Shabdgandh (Intermediate)", filter: (i: Item) => i.pathway === "shabdgandh", accent: "from-violet-500 to-purple-600", glow: "shadow-violet-500/40", ring: "ring-violet-400", active: "bg-gradient-to-r from-violet-500 to-purple-600 text-white" },
  
  // Math Pathways
  { label: "🔢 Pankti (Beginner Math)", filter: (i: Item) => i.pathway === "pankti", accent: "from-blue-400 to-cyan-500", glow: "shadow-blue-500/40", ring: "ring-blue-400", active: "bg-gradient-to-r from-blue-400 to-cyan-500 text-white" },
  { label: "⏳ Samay (Intermediate Math)", filter: (i: Item) => i.pathway === "samay", accent: "from-amber-400 to-orange-500", glow: "shadow-orange-500/40", ring: "ring-amber-400", active: "bg-gradient-to-r from-amber-400 to-orange-500 text-white" },
  { label: "🔥 Mashaal (Advanced Math)", filter: (i: Item) => i.pathway === "mashaal", accent: "from-red-500 to-rose-600", glow: "shadow-red-500/40", ring: "ring-red-400", active: "bg-gradient-to-r from-red-500 to-rose-600 text-white" },

  // Holistic & Extras
  { label: "⚡ Battle Arena", filter: (i: Item) => i.pathway === "arena", accent: "from-orange-500 to-red-500", glow: "shadow-orange-500/40", ring: "ring-orange-400", active: "bg-gradient-to-r from-orange-500 to-red-500 text-white" },
  { label: "❤️ सामाजिक-भावनिक (SEL) & Health", filter: (i: Item) => i.pathway === "sel_health", accent: "from-rose-400 to-pink-500", glow: "shadow-rose-500/40", ring: "ring-rose-400", active: "bg-gradient-to-r from-rose-400 to-pink-500 text-white" },
  { label: "🎈 Early Graders & Fun", filter: (i: Item) => i.pathway === "early_graders", accent: "from-fuchsia-400 to-purple-500", glow: "shadow-fuchsia-500/40", ring: "ring-fuchsia-400", active: "bg-gradient-to-r from-fuchsia-400 to-purple-500 text-white" },
];

function SimulationsContent() {
  const { data: session } = useSession();
  const isAdmin = hasRole(session, "admin");
  const userSchoolId = (session?.user as any)?.schoolId ?? undefined;
  const { xp, level, badge, showLevelUp, newLevelReached, dismissLevelUp, coins } = usePoints();
  const { t } = useLanguage();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [startedFromPanel, setStartedFromPanel] = useState(false);
  const [showMatchmaker, setShowMatchmaker] = useState(false);
  const [battleContext, setBattleContext] = useState<any>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [isPortrait, setIsPortrait] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showStore, setShowStore] = useState(false);

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/arcade/play/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  const [scale, setScale] = useState(1);
  const [dismissPortraitWarning, setDismissPortraitWarning] = useState(false);
  const [forceLandscape, setForceLandscape] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load from URL
  useEffect(() => {
    const gameId = searchParams.get('id');
    if (gameId) {
      const found = ALL.find(s => s.id === gameId);
      if (found) {
        setActiveId(gameId);
      }
    } else {
      setActiveId(null);
    }
  }, [searchParams]);

  const updateUrl = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set('id', id);
    } else {
      params.delete('id');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 768);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Load hidden IDs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('arcade_hidden_sims');
    if (saved) setHiddenIds(JSON.parse(saved));

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      // Ideal size is 1152x648 (16:9 large)
      const targetW = 1152;
      const targetH = 648;
      const sW = width / targetW;
      const sH = height / targetH;
      const finalScale = Math.min(sW, sH, 1);
      setScale(finalScale);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [activeId]);

  const toggleVisibility = (id: string) => {
    const next = hiddenIds.includes(id) 
      ? hiddenIds.filter(x => x !== id) 
      : [...hiddenIds, id];
    setHiddenIds(next);
    localStorage.setItem('arcade_hidden_sims', JSON.stringify(next));
  };

  const handleSimSelect = (id: string) => {
    const item = ALL.find(i => i.id === id);
    if (item?.subject === 'Battle') {
      setShowMatchmaker(true);
    }
    setActiveId(id);
    setBattleContext(null);
    updateUrl(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLibrary = () => {
    setActiveId(null);
    setBattleContext(null);
    setShowMatchmaker(false);
    setStartedFromPanel(false);
    updateUrl(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setDismissPortraitWarning(false);
    setForceLandscape(false);
    if (screen.orientation && (screen.orientation as any).unlock) {
      (screen.orientation as any).unlock();
    }
  };

  const handleStartFromPanel = () => {
    if (!previewId) return;
    setStartedFromPanel(true);
    handleSimSelect(previewId);
    setPreviewId(null);
  };

  const closeArena = () => {
    setBattleContext(null);
    setShowMatchmaker(false);
    handleBackToLibrary();
  };

  const active = activeId ? ALL.find(s => s.id === activeId) : null;
  const activeSection = active ? (SECTIONS.find(s => s.filter(active)) ?? SECTIONS[0]) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">

      {/* Arcade Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 border border-slate-700">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Link href="/resources" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" /> {t('Back to Classroom Implementation')}
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/40">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">{t('Simulations & Games') || 'Simulations & Games'}</h1>
                <p className="text-slate-400 text-sm font-medium">{t('Level-wise interactive tools for students & teachers') || 'Level-wise interactive tools for students & teachers'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <StatBadge icon="⚡" label={t("Your XP")} value={xp} color="from-amber-400 to-orange-500" shadow="shadow-orange-500/40" />
            <StatBadge icon="🆙" label={t("Level")} value={level} color="from-indigo-500 to-blue-600" shadow="shadow-indigo-500/40" />
            <StatBadge icon={badge.emoji} label={t("Badge")} value={badge.name} color={badge.color} shadow="shadow-indigo-500/40" />
            <StatBadge icon="🪙" label={t("Coins")} value={coins} color="from-yellow-400 to-amber-500" shadow="shadow-yellow-500/40" />
            <button 
              onClick={() => setShowStore(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all shadow-lg border border-white/10"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold tracking-wide">Avatar Store</span>
            </button>
          </div>
        </div>
      </div>

      {!active ? (
        /* ================= LIBRARY VIEW ================= */
        <>
        <div className="space-y-12 animate-in fade-in zoom-in-95 duration-300">
          {SECTIONS.map(section => {
            const items = ALL.filter(section.filter).filter(i => isAdmin || !hiddenIds.includes(i.id));
            if (items.length === 0) return null;
            
            return (
              <div key={section.label} className="space-y-4">
                <div className="flex items-center gap-3 border-b-2 border-slate-100 dark:border-slate-800 pb-3">
                  <h2 className={`text-2xl font-black bg-gradient-to-r ${section.accent} bg-clip-text text-transparent`}>
                    {section.label}
                  </h2>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    {items.length}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {items.map(item => {
                    const isHidden = hiddenIds.includes(item.id);
                    return (
                      <div key={item.id} className="relative group h-full">
                        <button
                          onClick={() => setPreviewId(item.id)}
                          className={cn(
                            "w-full h-full flex flex-col p-4 rounded-2xl border-2 transition-all duration-300 text-left bg-white dark:bg-slate-800/80 hover:-translate-y-1 hover:shadow-xl",
                            isHidden ? "opacity-50 grayscale border-slate-200" : `border-transparent hover:${section.ring} hover:border-transparent focus:ring-2 focus:${section.ring}`,
                            previewId === item.id && `ring-2 ${section.ring} -translate-y-1 shadow-xl`
                          )}
                        >
                          <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center text-3xl shadow-inner bg-gradient-to-br ${section.accent} text-white`}>
                            {item.emoji}
                          </div>
                          <div className="flex-1 space-y-1">
                            <h3 className="font-bold text-slate-800 dark:text-white leading-tight">{item.title}</h3>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Lvl: {item.level}</p>
                          </div>
                          {item.tag && !isHidden && (
                            <span className="inline-block mt-3 text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 w-fit">
                              {item.tag}
                            </span>
                          )}
                          {isHidden && (
                            <span className="inline-block mt-3 text-[10px] font-black px-2 py-0.5 rounded bg-red-100 text-red-600 w-fit">
                              HIDDEN
                            </span>
                          )}
                        </button>
                        
                        {/* Card Actions Overlay */}
                        <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={(e) => handleShare(item.id, e)}
                            className={cn(
                              "p-2 rounded-full shadow-lg backdrop-blur-md transition-all",
                              copiedId === item.id ? "bg-green-500 text-white" : "bg-white/80 text-slate-400 hover:text-orange-500"
                            )}
                            title="Share Game Link"
                          >
                            {copiedId === item.id ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                          </button>

                          {isAdmin && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleVisibility(item.id); }}
                              className="p-2 text-slate-400 hover:text-blue-500 bg-white/80 backdrop-blur-md rounded-full shadow-lg"
                              title={isHidden ? "Show Game" : "Hide Game"}
                            >
                              {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <GameDetailPanel
          item={previewId ? (ALL.find(i => i.id === previewId) ?? null) : null}
          accent={previewId ? SECTIONS.find(s => s.filter(ALL.find(i => i.id === previewId)!)) : undefined}
          onStart={handleStartFromPanel}
          onClose={() => setPreviewId(null)}
        />
        </>
      ) : (
        /* ================= ACTIVE GAME VIEW ================= */
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
          
          <button 
            onClick={handleBackToLibrary}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white text-sm font-bold bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl hover:shadow-md transition-all w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> {t('Back to Library') || 'Back to Library'}
          </button>
          
          {/* Active game header label */}
          <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl bg-gradient-to-r ${activeSection?.accent} shadow-xl ${activeSection?.glow} text-white`}>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl drop-shadow-md">
               {active.emoji}
            </div>
            <div className="flex-1">
              <p className="font-black text-2xl leading-tight drop-shadow-sm">{active.title}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-black tracking-widest uppercase shadow-sm">Level: {active.level}</span>
                <span className="bg-black/20 px-2 py-0.5 rounded text-[11px] font-black tracking-widest uppercase shadow-sm">{active.subject}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={getGameDownloadPath(active.id)}
                download
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white rounded-2xl px-4 py-2 text-xs font-black backdrop-blur-sm shadow-md transition-all active:scale-95"
                title="Download single-file HTML game for offline play"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Download HTML</span>
              </a>
              <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm shadow-inner">
                 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,1)]" />
                 <span className="text-sm font-black tracking-widest text-white/90">LIVE</span>
              </div>
            </div>
          </div>

          {/* Game area */}
          <div className="relative @container">
            {/* Orientation Tip (Dismissible) */}
            {isPortrait && !dismissPortraitWarning && !forceLandscape && (
              <div className="md:hidden absolute top-4 left-4 right-4 z-50 bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-2xl space-y-4 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                    <RefreshCw className="w-6 h-6 text-white animate-spin-slow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-black leading-tight">बाजार आणि गेम्ससाठी फोन फिरवा!</p>
                    <p className="text-slate-400 text-[11px] leading-snug">Rotate your phone to Landscape for the best experience.</p>
                  </div>
                  <button 
                    onClick={() => setDismissPortraitWarning(true)}
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <button 
                  onClick={async () => {
                    try {
                      // Attempt real rotation lock
                      if (document.documentElement.requestFullscreen) {
                        await document.documentElement.requestFullscreen().catch(() => {});
                      }
                      if (screen.orientation && (screen.orientation as any).lock) {
                        await (screen.orientation as any).lock('landscape').catch(() => {
                           // Fallback to virtual rotation
                           setForceLandscape(true);
                        });
                      } else {
                        // Fallback for iOS
                        setForceLandscape(true);
                      }
                    } catch (e) {
                      console.log("Rotation lock failed", e);
                      setForceLandscape(true);
                    }
                    setDismissPortraitWarning(true);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  आडवा करा आणि खेळा (Rotate & Play)
                </button>
              </div>
            )}
            
            <div 
              ref={containerRef} 
              className={cn(
                "bg-white dark:bg-slate-900/40 rounded-[2rem] p-1 md:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative transition-all duration-500 min-h-[400px] flex items-center justify-center",
                forceLandscape ? "fixed inset-0 z-[9999] bg-slate-950 rounded-none border-none p-0 flex items-center justify-center overflow-auto" : "overflow-auto"
              )}
              style={forceLandscape ? {
                width: '100vh',
                height: '100vw',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(90deg)',
              } : {}}
            >
              {!battleContext && (
                <StudentTrackerOverlay 
                  schoolId={userSchoolId || "mock-school-id"} 
                  classNum={3} 
                  gameSlug={active.id} 
                />
              )}
              {forceLandscape && (
                <button 
                  onClick={() => setForceLandscape(false)}
                  className="absolute top-4 right-4 z-[10000] p-4 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md border border-white/20"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
              <div 
                className={cn(
                  "w-full h-full transform-gpu transition-transform duration-300 origin-top flex items-center justify-center shrink-0",
                  forceLandscape ? "origin-center" : "origin-top"
                )}
                style={{ 
                  transform: forceLandscape 
                    ? `scale(${Math.min(window.innerHeight / 1152, window.innerWidth / 648)})` 
                    : `scale(${isPortrait ? (containerRef.current?.clientWidth || 390) / 1152 : scale})`,
                  width: activeId ? '1152px' : '100%',
                  height: activeId ? (isPortrait && !forceLandscape ? 'auto' : 'auto') : '100%',
                  minHeight: activeId ? '648px' : 'auto'
                }}
              >
              <GameWrapper
                title={active.title}
                emoji={active.emoji}
                instructions={active.instructions}
                accentColor={active.accentColor as any}
                skipIntro={startedFromPanel}
              >
                {active.component({ 
                  player1: battleContext?.p1, 
                  player2: battleContext?.p2,
                  schoolId: battleContext?.schoolId,
                  classNum: battleContext?.classNum,
                  onClose: closeArena
                })}
              </GameWrapper>
              </div>
            </div>
          </div>

          <BattleMatchmaker
            isOpen={showMatchmaker}
            onClose={() => setShowMatchmaker(false)}
            subject={active.battleSubject ?? 'literacy'}
            level={active.battleLevel ?? 1}
            gameTitle={active.title}
            userSchoolId={userSchoolId}
            isAdmin={isAdmin}
            onMatchComplete={(p1: string, p2: string, schoolId: string, classNum: number) => {
              setBattleContext({ p1, p2, schoolId, classNum });
              setShowMatchmaker(false);
            }}
          />
        </div>
      )}
      <AvatarStoreModal isOpen={showStore} onClose={() => setShowStore(false)} />
      <LevelUpModal
        isOpen={showLevelUp && !activeId}
        level={newLevelReached}
        onClose={dismissLevelUp}
      />
    </div>
  );
}

function StatBadge({ icon, label, value, color, shadow }: { icon: string; label: string; value: number | string; color: string; shadow?: string }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r ${color} ${shadow} shadow-lg text-white`}>
      <span className="text-2xl drop-shadow-sm">{icon}</span>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-white/70">{label}</p>
        <p className="text-xl font-black leading-none drop-shadow-sm">{value}</p>
      </div>
    </div>
  );
}

export default function SimulationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse">Loading Arcade...</p>
        </div>
      </div>
    }>
      <SimulationsContent />
    </Suspense>
  );
}