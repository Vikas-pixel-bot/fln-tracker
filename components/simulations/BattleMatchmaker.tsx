'use client';
import { useState, useEffect } from 'react';
import { Users, School, GraduationCap, Search, Swords, CheckCircle2, UserCircle2, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { getMatchCandidates, getSchools } from '@/app/actions';

interface BattleMatchmakerProps {
  isOpen: boolean;
  onClose: () => void;
  subject: 'literacy' | 'numeracy';
  level: number;
  gameTitle: string;
  onMatchComplete: (p1: any, p2: any, schoolId: string, classNum: number) => void;
  userSchoolId?: string;
  isAdmin?: boolean;
}

export default function BattleMatchmaker({
  isOpen,
  onClose,
  subject,
  level,
  gameTitle,
  onMatchComplete,
  userSchoolId,
  isAdmin
}: BattleMatchmakerProps) {
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState(userSchoolId || '');
  const [classNum, setClassNum] = useState<number>(3);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [matching, setMatching] = useState(false);
  const [player1, setPlayer1] = useState<any>(null);
  const [player2, setPlayer2] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch schools if admin
  useEffect(() => {
    if (isAdmin) {
      getSchools().then(setSchools);
    }
  }, [isAdmin]);

  // Fetch candidates when school/class changes
  useEffect(() => {
    if (selectedSchoolId && classNum) {
      setMatching(true);
      getMatchCandidates(selectedSchoolId, classNum, subject, level)
        .then(res => {
          setCandidates(res);
          // Auto-match first two if available
          if (res.length >= 2 && !player1 && !player2) {
            setPlayer1(res[0]);
            setPlayer2(res[1]);
          }
        })
        .finally(() => setMatching(false));
    }
  }, [selectedSchoolId, classNum, subject, level]);

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStart = () => {
    if (player1 && player2 && selectedSchoolId) {
      onMatchComplete(player1, player2, selectedSchoolId, classNum);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-xl h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Swords className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Battle Setup</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{gameTitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <School className="w-3 h-3" /> Select School
              </label>
              {isAdmin ? (
                <select 
                  value={selectedSchoolId} 
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className="w-full bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-orange-500 transition-all font-bold"
                >
                  <option value="">Choose School...</option>
                  {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              ) : (
                <div className="w-full bg-slate-800/50 rounded-xl px-4 py-2.5 text-sm text-white font-bold border border-slate-700/50">
                  {userSchoolId ? "Your School" : "No School Assigned"}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <GraduationCap className="w-3 h-3" /> Class
              </label>
              <select 
                value={classNum} 
                onChange={(e) => setClassNum(Number(e.target.value))}
                className="w-full bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-orange-500 transition-all font-bold"
              >
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Class {n}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Candidate List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Match Status */}
          <div className="flex items-center justify-center gap-8 py-6 bg-slate-800/30 rounded-3xl border border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-orange-500/5 animate-pulse" />
            <PlayerCard player={player1} label="PLAYER 1" active={!!player1} color="blue" />
            <div className="text-xl font-black text-slate-600 italic z-10 px-4 py-1 bg-slate-900 rounded-full border border-slate-800">VS</div>
            <PlayerCard player={player2} label="PLAYER 2" active={!!player2} color="red" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" /> Eligible Students
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 font-bold ml-1">
                  Level {level}
                </span>
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800 border-none rounded-xl pl-9 pr-4 py-1.5 text-xs text-white w-40 focus:w-56 transition-all"
                />
              </div>
            </div>

            {matching ? (
              <div className="py-12 flex flex-col items-center gap-3 text-slate-500">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold uppercase tracking-widest">Finding matches...</p>
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="py-12 text-center bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-800">
                <p className="text-sm font-bold text-slate-500">No students match this level in Class {classNum}</p>
                <p className="text-xs text-slate-600 mt-1">Please ensure assessments are updated.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredCandidates.map(c => {
                  const isP1 = player1?.id === c.id;
                  const isP2 = player2?.id === c.id;
                  return (
                    <button 
                      key={c.id} 
                      onClick={() => {
                        if (isP1) setPlayer1(null);
                        else if (isP2) setPlayer2(null);
                        else if (!player1) setPlayer1(c);
                        else if (!player2) setPlayer2(c);
                      }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 group",
                        isP1 ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10" :
                        isP2 ? "bg-red-600/10 border-red-500 shadow-lg shadow-red-500/10" :
                        "bg-slate-800/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                          isP1 ? "bg-blue-600 text-white" :
                          isP2 ? "bg-red-600 text-white" :
                          "bg-slate-700 text-slate-400 group-hover:bg-slate-600"
                        )}>
                          {c.name[0]}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">{c.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{c.gender} · Age {c.age || '?'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isP1 && <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">PLAYER 1</span>}
                        {isP2 && <span className="text-[10px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">PLAYER 2</span>}
                        {!isP1 && !isP2 && <CheckCircle2 className="w-5 h-5 text-slate-700 group-hover:text-slate-500 transition-colors" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md space-y-4">
          {!player1 || !player2 ? (
            <div className="flex items-center gap-3 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/20 text-orange-400 text-sm">
              <Users className="w-5 h-5 shrink-0" />
              <p className="font-bold">Select two students at level {level} to begin the battle.</p>
            </div>
          ) : (
            <button 
              onClick={handleStart}
              className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-3xl shadow-2xl shadow-orange-500/40 transform transition-all active:scale-95 space-y-1 group"
            >
              <div className="flex items-center justify-center gap-3 text-xl">
                START 2V2 BATTLE <Swords className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              </div>
              <p className="text-[10px] text-white/60 font-black tracking-[4px] uppercase">{player1.name} VS {player2.name}</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player, label, active, color }: { player: any, label: string, active: boolean, color: 'blue' | 'red' }) {
  const colorStyles = color === 'blue' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-red-600 shadow-red-500/20';
  const textStyles = color === 'blue' ? 'text-blue-400 border-blue-500/20' : 'text-red-400 border-red-500/20';
  
  return (
    <div className={cn("flex flex-col items-center gap-2 group z-10", active ? "scale-110" : "opacity-30")}>
      <span className={cn("text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full border", active ? textStyles : "text-slate-500 border-transparent")}>
        {label}
      </span>
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl transition-all",
        active ? colorStyles : "bg-slate-700"
      )}>
        {active ? player.name[0] : <UserCircle2 className="w-8 h-8 opacity-20" />}
      </div>
      <p className="text-xs font-black text-white text-center max-w-[80px] truncate">
        {active ? player.name : "Waiting..."}
      </p>
    </div>
  );
}
