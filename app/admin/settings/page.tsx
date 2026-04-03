"use client";

import { useState, useEffect, useTransition } from "react";
import { Save, CheckCircle2, Type, Hash, Variable } from "lucide-react";
import { getSettings, saveSettings } from "@/app/actions";

const DEFAULT_ASSETS = {
  Letters: "क   म   ल   प   र",
  Words: "कर   घर   चल   बस   सर",
  Paragraph: "मीना शाळेत जाते. तिला खेळायला खूप आवडते. तिच्याकडे एक लाल चेंडू आहे. ती मैत्रिणींसोबत बागेत खेळते.",
  Story: "एक होता शेतकरी. तो खूप कष्टाळू होता. त्याच्याकडे एक गाय होती. तो रोज शेतात जात असे आणि खूप काम करत असे. एकदा खूप पाऊस पडला. पीक खूप चांगले आले. शेतकरी खूप आनंदी झाला त्याने गावाला जेवण दिले.",
  Num1to9: "4     7     2     9     5",
  Num10to99: "45    12    89    36    74",
  Num100to999: "456   102   890   365   741",
  AddProblem: "42 + 15 = ?",
  SubProblem: "73 - 28 = ?",
  MulProblem: "14 × 3 = ?",
  DivProblem: "84 ÷ 4 = ?"
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_ASSETS);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then((data) => {
      if (Object.keys(data).length > 0) {
        setSettings({ ...DEFAULT_ASSETS, ...data });
      }
    });
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    startTransition(async () => {
      await saveSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 animate-in fade-in space-y-6 pb-16">
      
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
         <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Testing Configurations</h1>
            <p className="text-slate-500 mt-1">Configure the exact paragraphs and math problems shown on the tablet during assessments.</p>
         </div>
         <button onClick={handleSave} disabled={isPending} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-md flex items-center gap-2">
            {isPending ? "Saving..." : <><Save className="w-5 h-5"/> Save Assets</>}
         </button>
      </div>

      {saved && (
         <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 font-semibold">
            <CheckCircle2 className="w-5 h-5"/> Database successfully updated! Changes are live on the Assessor terminals.
         </div>
      )}

      {/* LITERACY */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
         <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-6 border-b pb-4"><Type className="w-5 h-5 text-orange-500"/> Reading Assets (Marathi/Hindi)</h2>
         <div className="space-y-5">
            <div>
               <label className="text-sm font-bold text-slate-600 mb-2 block">Story (Level 4)</label>
               <textarea rows={3} value={settings.Story} onChange={(e) => handleChange("Story", e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
               <label className="text-sm font-bold text-slate-600 mb-2 block">Paragraph (Level 3)</label>
               <textarea rows={2} value={settings.Paragraph} onChange={(e) => handleChange("Paragraph", e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
               <label className="text-sm font-bold text-slate-600 mb-2 block">Words list (Level 2)</label>
               <input type="text" value={settings.Words} onChange={(e) => handleChange("Words", e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
               <label className="text-sm font-bold text-slate-600 mb-2 block">Letters list (Level 1)</label>
               <input type="text" value={settings.Letters} onChange={(e) => handleChange("Letters", e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
         </div>
      </div>

      {/* NUMERACY */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
         <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-6 border-b pb-4"><Hash className="w-5 h-5 text-indigo-500"/> Math Recognition Grids</h2>
         <div className="space-y-5">
            <div>
               <label className="text-sm font-bold text-slate-600 mb-2 block">100 to 999 Grid</label>
               <input type="text" value={settings.Num100to999} onChange={(e) => handleChange("Num100to999", e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
               <label className="text-sm font-bold text-slate-600 mb-2 block">10 to 99 Grid</label>
               <input type="text" value={settings.Num10to99} onChange={(e) => handleChange("Num10to99", e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
               <label className="text-sm font-bold text-slate-600 mb-2 block">1 to 9 Grid</label>
               <input type="text" value={settings.Num1to9} onChange={(e) => handleChange("Num1to9", e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
         </div>
      </div>

      {/* OPERATIONS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
         <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-6 border-b pb-4"><Variable className="w-5 h-5 text-emerald-500"/> Arithmetic Operations</h2>
         <div className="grid md:grid-cols-2 gap-5">
            <div>
               <label className="text-sm font-bold text-slate-600 mb-2 block">Addition Problem</label>
               <input type="text" value={settings.AddProblem} onChange={(e) => handleChange("AddProblem", e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 rounded-xl px-4 py-3 text-lg font-black tracking-widest outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
               <label className="text-sm font-bold text-slate-600 mb-2 block">Subtraction Problem</label>
               <input type="text" value={settings.SubProblem} onChange={(e) => handleChange("SubProblem", e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 rounded-xl px-4 py-3 text-lg font-black tracking-widest outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
               <label className="text-sm font-bold text-slate-600 mb-2 block">Multiplication Problem</label>
               <input type="text" value={settings.MulProblem} onChange={(e) => handleChange("MulProblem", e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 rounded-xl px-4 py-3 text-lg font-black tracking-widest outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
               <label className="text-sm font-bold text-slate-600 mb-2 block">Division Problem</label>
               <input type="text" value={settings.DivProblem} onChange={(e) => handleChange("DivProblem", e.target.value)}
                         className="w-full bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 rounded-xl px-4 py-3 text-lg font-black tracking-widest outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
         </div>
      </div>

    </div>
  );
}
