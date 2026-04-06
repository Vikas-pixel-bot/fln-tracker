"use client";

import { useState, useEffect, useTransition } from "react";
import { getCohortStats } from "@/app/actions";
import { TrendingUp, ArrowRight, BookOpen, Calculator, Users } from "lucide-react";

const LIT_LABELS = ['Beginner', 'Letter', 'Word', 'Paragraph', 'Story'];
const NUM_LABELS = ['Beginner', 'N 1-9', 'N 10-99', 'N 100-999'];

export default function CohortBenchmarking({ filters, hierarchy }: { filters: any, hierarchy: any[] }) {
  const [startTerm, setStartTerm] = useState("Baseline");
  const [endTerm, setEndTerm] = useState("Midline");
  const [data, setData] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (startTerm === endTerm) return;
    startTransition(async () => {
      const stats = await getCohortStats({ ...filters, startTerm, endTerm });
      setData(stats);
    });
  }, [filters, startTerm, endTerm]);

  if (startTerm === endTerm) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 font-medium text-center">
        Please select different Start and End terms to compare transitions (e.g. Baseline to Midline).
      </div>
    );
  }

  const renderMatrix = (type: 'lit'|'num', labels: string[], transitions: Record<string, number>) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2"></th>
              <th colSpan={labels.length} className="p-2 text-center text-slate-500 font-bold uppercase tracking-widest text-xs border-b border-slate-100 dark:border-slate-800">
                End Level ({endTerm})
              </th>
            </tr>
            <tr>
              <th className="p-2 text-left text-slate-500 font-bold uppercase tracking-widest text-[10px] whitespace-nowrap align-bottom">
                Start Level<br/>({startTerm}) ↓
              </th>
              {labels.map((l, i) => (
                <th key={i} className="p-2 text-center font-bold text-slate-600 dark:text-slate-400 min-w-[80px]">
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labels.map((startLabel, startIdx) => (
              <tr key={startIdx}>
                <td className="p-2 font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  {startLabel}
                </td>
                {labels.map((endLabel, endIdx) => {
                  const count = transitions[`${startIdx}to${endIdx}`] || 0;
                  const isProgress = endIdx > startIdx;
                  const isStagnant = endIdx === startIdx;
                  const isRegressed = endIdx < startIdx;
                  
                  let bgColor = "bg-white dark:bg-slate-950";
                  if (count > 0) {
                    if (isProgress) bgColor = "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
                    if (isStagnant) bgColor = "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
                    if (isRegressed) bgColor = "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
                  }

                  return (
                    <td key={endIdx} className={`p-4 text-center border border-slate-100 dark:border-slate-800 transition-all ${bgColor}`}>
                      {count > 0 ? (
                        <span className="text-lg font-black">{count}</span>
                      ) : (
                        <span className="text-slate-200 dark:text-slate-800 text-xs">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderOpsMatrix = (label: string, stats: any) => {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
        <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex justify-between items-center">
            {label} 
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-full">Transition</span>
        </h4>
        <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Stagnant</p>
                <p className="text-xl font-black text-slate-300">{stats.stagnant}</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 text-center">
                <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Gained</p>
                <p className="text-xl font-black text-emerald-600">{stats.gained}</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 text-center">
                <p className="text-[10px] text-red-600 font-bold uppercase mb-1">Regressed</p>
                <p className="text-xl font-black text-red-600">{stats.regressed}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
                <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Mastered</p>
                <p className="text-xl font-black text-blue-600">{stats.maintained}</p>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Term Selection & Summary */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 w-full bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
             <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Compare From</label>
                <select value={startTerm} onChange={(e) => setStartTerm(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 font-bold text-slate-800 dark:text-white p-0">
                    <option value="Baseline">Baseline</option>
                    <option value="Midline">Midline</option>
                    <option value="Endline">Endline</option>
                </select>
             </div>
             <ArrowRight className="text-slate-300" />
             <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">To Term</label>
                <select value={endTerm} onChange={(e) => setEndTerm(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 font-bold text-slate-800 dark:text-white p-0">
                    <option value="Baseline">Baseline</option>
                    <option value="Midline">Midline</option>
                    <option value="Endline">Endline</option>
                </select>
             </div>
        </div>

        <div className="flex-none bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-500/20 flex items-center gap-4">
            <Users className="w-8 h-8 opacity-50" />
            <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-75 leading-tight">Matched Cohort</p>
                <h4 className="text-3xl font-black">{data?.totalCohort || 0} Students</h4>
            </div>
        </div>
      </div>

      {isPending && (
          <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-full">
            <div className="h-full bg-blue-500 animate-[shimmer_2s_infinite]" />
          </div>
      )}

      {!isPending && data && (
        <>
          <div className={`grid grid-cols-1 xl:grid-cols-2 gap-8 ${isPending ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
              
              {/* Literacy Matrix */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl font-bold">Literacy Progress Matrix</h3>
                  </div>
                  {renderMatrix('lit', LIT_LABELS, data.litTransitions)}
              </div>

              {/* Numeracy Matrix */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <Calculator className="w-6 h-6 text-emerald-500" />
                    <h3 className="text-xl font-bold">Math Progress Matrix</h3>
                  </div>
                  {renderMatrix('num', NUM_LABELS, data.numTransitions)}
              </div>
          </div>

          {/* Math Operations Progress */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-200 dark:border-slate-800 mt-8">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-indigo-500" />
                      <h3 className="text-xl font-bold">Math Operations Progress</h3>
                  </div>
                  <div className="text-xs font-bold text-slate-400">{startTerm} → {endTerm} Mastery Tracking</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {renderOpsMatrix('Addition', data.opsTransitions.addition)}
                  {renderOpsMatrix('Subtraction', data.opsTransitions.subtraction)}
                  {renderOpsMatrix('Multiplication', data.opsTransitions.multiplication)}
                  {renderOpsMatrix('Division', data.opsTransitions.division)}
              </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 mt-8">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <strong>Key:</strong> <span className="text-emerald-600 font-bold">Green Cells</span> represent students who achieved growth. <span className="text-blue-600 font-bold">Blue Cells</span> are stagnant across terms. <span className="text-red-500 font-bold">Red Cells</span> show regression.
              </p>
          </div>
        </>
      )}

    </div>
  );
}
