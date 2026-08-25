"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Users, Target, Play } from 'lucide-react';
import WarliBorder from '@/components/warli/WarliBorder';
import { LotbConfig, DEFAULT_LOTB_CONFIG } from "@/lib/lotb_config";
import { cn } from '@/lib/utils';

export default function MSMSPage() {
  const [config, setConfig] = useState<LotbConfig>(DEFAULT_LOTB_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lotb')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch LOTB config", err);
        setLoading(false);
      });
  }, []);

  // Icons mapping for cohorts based on ID
  const iconMap: Record<string, React.ElementType> = {
    "t1-4": BookOpen,
    "t5-7": Users,
    "t8-12": Users,
    "english": BookOpen,
    "supt": Target
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      
      {/* Header */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 pt-16 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <Link href="/about-lotb" className="inline-flex items-center text-slate-500 hover:text-orange-500 mb-8 transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-orange-600 dark:text-orange-500 font-bold uppercase tracking-widest text-xs mb-1">
                Project Detail
              </h2>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                माझी शाळा, माझा स्वाभिमान
              </h1>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mb-8">
            In collaboration with the Tribal Development Department of Maharashtra, MSMS is a holistic school development program reaching 500 Ashramschools. Our targeted capacity-building cohorts ensure specialized, high-impact engagement at every level of the ecosystem.
          </p>

          <Link
            href="/dashboards"
            className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-2xl transition-all hover:-translate-y-1 shadow-sm"
          >
            View Program Implementation Dashboards 
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard ml-2 text-amber-500"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          </Link>
        </div>
      </section>

      {/* Cohorts Grid */}
      <section className="py-16 max-w-4xl mx-auto px-4 space-y-8">
        
        <div className="mb-10">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            Capacity Building Cohorts
          </h2>
          <p className="text-slate-500 mt-2">Select an intervention to launch the dedicated platform module.</p>
        </div>

        {config.msmsCohorts.map((cohort) => {
          const Icon = iconMap[cohort.id] || Users;
          const isActive = cohort.status === 'active';

          if (isActive) {
            return (
              <div key={cohort.id} className="bg-white dark:bg-slate-800 rounded-[32px] border-2 border-orange-400 shadow-xl overflow-hidden group">
                <div className="md:flex items-stretch">
                  <div className="md:w-2/5 bg-slate-100 dark:bg-slate-900 relative min-h-[200px] border-r border-slate-100 dark:border-slate-700">
                    {!cohort.imageUrl && (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-bold uppercase tracking-widest bg-orange-900/5">
                        [ Image Placeholder ]
                      </div>
                    )}
                    {cohort.imageUrl && <img src={cohort.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />}
                  </div>
                  
                  <div className="md:w-3/5 p-8 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-xs font-bold mb-4 w-max">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                      </span>
                      Active Intervention
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
                      <Icon className="w-6 h-6 text-orange-500" />
                      {cohort.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                      {cohort.description}
                    </p>
                    
                    <Link 
                      href={cohort.interventionUrl || "#"}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto self-start px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5"
                    >
                      <Play className="w-4 h-4 fill-current" /> The Intervention
                    </Link>
                  </div>
                </div>
              </div>
            );
          }

          // Inactive Cohort
          return (
            <div key={cohort.id} className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden opacity-75 grayscale-[0.3]">
              <div className="md:flex items-stretch">
                <div className="md:w-2/5 bg-slate-100 dark:bg-slate-900 relative min-h-[160px] border-r border-slate-100 dark:border-slate-700">
                  {!cohort.imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                      [ Image Placeholder ]
                    </div>
                  )}
                  {cohort.imageUrl && <img src={cohort.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />}
                </div>
                <div className="md:w-3/5 p-8 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-3">
                    <Icon className="w-5 h-5 text-slate-400" />
                    {cohort.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {cohort.description}
                  </p>
                  <button disabled className="px-6 py-3 bg-slate-100 dark:bg-slate-700/50 text-slate-400 font-bold rounded-xl cursor-not-allowed w-max flex items-center gap-2">
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          );
        })}

      </section>
      
      <WarliBorder height={32} className="warli-ink opacity-50 mt-12" />
    </div>
  );
}
