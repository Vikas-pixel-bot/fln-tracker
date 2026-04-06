"use client";

import { useState, useTransition } from "react";
import { UploadCloud, File, Activity, Building, CheckCircle2, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import { seedHierarchy } from "@/app/actions";

export default function AdminUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [term, setTerm] = useState("Baseline");
  const [seedResult, setSeedResult] = useState<{ divCount: number; poCount: number; schoolCount: number } | null>(null);
  const [isSeedPending, startSeedTransition] = useTransition();

  function handleSeed() {
    startSeedTransition(async () => {
      const result = await seedHierarchy();
      setSeedResult(result);
    });
  }
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{success: boolean; count?: number; error?: string} | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if(!file) return;
    setIsUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("term", term);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if(data.success) {
        setResult({ success: true, count: data.count });
        setTimeout(() => router.push('/'), 3000);
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch(err: any) {
      setResult({ success: false, error: err.message });
    }
    
    setIsUploading(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
       <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row">
         
         <div className="md:w-1/3 bg-slate-900 text-white p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <Building className="w-64 h-64 -ml-10 -mt-10"/>
            </div>
            <h2 className="text-2xl font-black relative z-10">Admin Bulk Upload Portal</h2>
            <p className="mt-4 text-slate-300 relative z-10">Instantly populate your Pratham tracker dashboards by securely uploading any standard ASER '.xlsx' dataset exported from your collection devices.</p>
         </div>

         <div className="md:w-2/3 p-10">
            {result?.success ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                 <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce"/>
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Upload Successful!</h2>
                 <p className="text-slate-500">Securely processed and inserted <b>{result.count}</b> student assessments directly into your database. Going to dashboard...</p>
              </div>
            ) : (
               <div className="h-full flex flex-col">
                  {/* Drag and Drop Zone */}
                  <div 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl flex flex-col items-center justify-center py-16 px-4 transition-all hover:bg-blue-50 cursor-pointer"
                    onClick={() => document.getElementById('fileUpload')?.click()}
                  >
                    <UploadCloud className="w-12 h-12 text-blue-500 mb-4"/>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Drag & Drop your Excel file here</h3>
                    <p className="text-sm text-slate-500 mt-2 text-center">Supported formats: .xlsx, .csv</p>
                    <input type="file" id="fileUpload" className="hidden" accept=".xlsx, .xls, .csv" onChange={(e) => setFile(e.target.files?.[0] || null)}/>
                  </div>

                  {/* Selected File Details */}
                  {file && (
                    <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-4 relative">
                       <File className="w-6 h-6 text-slate-400"/>
                       <div className="flex-1 overflow-hidden">
                         <p className="text-sm font-bold truncate">{file.name}</p>
                         <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                       </div>
                    </div>
                  )}

                  {/* Term Selector */}
                  {file && (
                    <div className="mt-6 flex flex-col gap-2">
                       <label className="text-sm font-bold text-slate-700">Select Assessment Term</label>
                       <select value={term} onChange={(e) => setTerm(e.target.value)}
                               className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 rounded-xl px-4 py-3 outline-none font-medium text-slate-700">
                          <option value="Baseline">Baseline</option>
                          <option value="Midline">Midline</option>
                          <option value="Endline">Endline</option>
                       </select>
                    </div>
                  )}

                  {/* Errors */}
                  {result?.error && (
                    <div className="mt-6 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
                      <b>Upload Failed:</b> {result.error}
                    </div>
                  )}

                  {/* Seed Hierarchy */}
                  <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-2">
                      <Database className="w-4 h-4 text-indigo-500" /> Load Default Schools &amp; Divisions
                    </p>
                    <p className="text-xs text-slate-500 mb-3">Populates all 4 divisions, 29 project offices, and 497 schools from the master mapping. Safe to run multiple times.</p>
                    {seedResult && (
                      <p className="text-xs text-green-600 font-semibold mb-2">
                        ✓ Added {seedResult.divCount} divisions, {seedResult.poCount} project offices, {seedResult.schoolCount} schools
                      </p>
                    )}
                    <button onClick={handleSeed} disabled={isSeedPending}
                      className="py-2 px-5 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 flex items-center gap-2">
                      {isSeedPending ? <Activity className="animate-spin w-4 h-4" /> : 'Load Schools'}
                    </button>
                  </div>

                  <div className="mt-auto pt-6 flex justify-end">
                    <button onClick={handleUpload} disabled={!file || isUploading}
                            className="py-3 px-8 text-white font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg disabled:opacity-50 flex items-center justify-center min-w-[150px]">
                      {isUploading ? <Activity className="animate-spin w-5 h-5"/> : 'Sync Database'}
                    </button>
                  </div>
               </div>
            )}
         </div>

       </div>
    </div>
  );
}
