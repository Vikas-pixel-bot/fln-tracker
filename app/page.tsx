import Link from "next/link";
import { 
  BookOpen, 
  Calculator, 
  ChevronRight, 
  GraduationCap, 
  HelpingHand, 
  Heart, 
  LayoutDashboard, 
  Lightbulb, 
  MapPin, 
  ShieldCheck, 
  Trophy,
  ClipboardPlus
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen -mt-4">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20 dark:opacity-10 pointer-events-none">
          <div className="aspect-square w-[500px] rounded-full bg-gradient-to-br from-blue-600 to-indigo-600" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl mb-6">
              The <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">FLN Journey</span>
            </h1>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              Tracking the foundations of India's future. Foundational Literacy and Numeracy (FLN) is the most critical building block for every child's lifelong learning.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/resources"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Implementation Corner <ClipboardPlus className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Icons quick look */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white">Literacy</h3>
                <p className="text-sm text-slate-500">Read with Meaning</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                <Calculator className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white">Numeracy</h3>
                <p className="text-sm text-slate-500">Basic Arithmetic</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white">Empathy</h3>
                <p className="text-sm text-slate-500">Social Well-being</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                <ShieldCheck className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white">Quality</h3>
                <p className="text-sm text-slate-500">Assured Outcomes</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is FLN Section */}
      <section id="what-is-fln" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="inline-block p-2 px-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm mb-6 uppercase tracking-wider">
                The Foundation
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
                What is Foundational Literacy & Numeracy?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                FLN refers to a child’s ability to read with meaning and solve basic mathematical problems by the end of Grade 3. These are the "gateway skills" that determine a child's entire educational trajectory.
              </p>
              <ul className="space-y-4">
                {[
                  "Learning to Read vs. Reading to Learn",
                  "Gateway to understanding Science, History, and Logic",
                  "The vital inflection point for preventing school dropouts",
                  "Inclusive growth through mother-tongue instruction"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-12">
                 <div className="text-center">
                    <GraduationCap className="w-24 h-24 text-blue-600 mb-4 mx-auto opacity-20" />
                    <p className="font-bold text-slate-400 italic">"If a child doesn't learn to read by Grade 3, they are often left behind for life."</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nipun Bharat & NEP Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 blur-3xl opacity-30 pointer-events-none">
          <div className="aspect-square w-[600px] rounded-full bg-blue-600" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-black mb-8 leading-tight">
                NIPUN Bharat & <br />
                <span className="text-blue-400">NEP 2020 Connection</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                    <Lightbulb className="w-7 h-7 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">NEP 2020: The Vision</h3>
                    <p className="text-slate-300">The National Education Policy 2020 declares achieving universal FLN as the <strong>"Highest Priority"</strong> of the entire education system.</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                    <MapPin className="w-7 h-7 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">NIPUN Bharat: The Mission</h3>
                    <p className="text-slate-300">Launched in 2021, NIPUN Bharat is the national mission aimimg to ensure every child achieves FLN goals by the year <strong>2026-27</strong>.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                    <HelpingHand className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">The Goal</h3>
                    <p className="text-slate-300">Tracking progress school-by-school and child-by-child to ensure no student is left behind in the foundational years.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10 flex flex-col justify-center">
               <div className="text-center space-y-6">
                  <Trophy className="w-20 h-20 text-yellow-500 mx-auto drop-shadow-lg" />
                  <h3 className="text-3xl font-black">2026-27 Mission</h3>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 w-[65%]" />
                  </div>
                  <p className="text-slate-400 text-sm">Universal Proficiency Goal Timeline</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Finale CTA */}
      <section className="py-24 bg-white dark:bg-slate-950 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-10">Ready to track the progress?</h2>
            <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-12 py-5 text-xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl hover:from-blue-700 hover:to-indigo-800 shadow-2xl shadow-blue-500/40 transition-all hover:-translate-y-2 active:translate-y-0"
            >
                Enter Tracker Dashboard <ChevronRight className="ml-2 w-6 h-6" />
            </Link>
        </div>
      </section>

      {/* Footer-like note */}
      <footer className="py-12 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm italic">
            Developed to accelerate literacy & numeracy outcomes in primary education.
        </div>
      </footer>
    </div>
  );
}
