import { Play, FileText, Gamepad2, Download, ExternalLink, GraduationCap, ChevronRight, BookOpen, Lightbulb, BoxSelect, MonitorPlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const RESOURCES = [
  {
    title: "ASER Assessment Mastery",
    category: "Training Video",
    duration: "12:45",
    description: "Learn how to conduct 'Level-1' assessments accurately. This guide covers common field mistakes and scoring tips.",
    icon: <Play className="w-5 h-5" />,
    color: "blue",
    image: "/training_video_thumbnail_1775461845160_png_1775461866312.png"
  },
  {
    title: "TaRL Teacher's Manual",
    category: "PDF Guide",
    size: "2.4 MB",
    description: "The complete pedagogical guide for 'Teaching at the Right Level' in primary schools. Print-ready for offline use.",
    icon: <FileText className="w-5 h-5" />,
    color: "orange",
    image: "/pedagogical_manual_thumbnail_1775461870160_png_1775461887685.png",
    link: "/resources/manuals"
  },
  {
    title: "TaRL Learning Games",
    category: "Simulation Tools",
    items: 5,
    description: "Interactive digital manipulatives like 'Bundle Builder' for demonstrating literacy and numeracy concepts in the field.",
    icon: <Gamepad2 className="w-5 h-5" />,
    color: "emerald",
    image: "/classroom_games_thumbnail_1775461891160_png_1775461910776.png",
    link: "/resources/simulations"
  }
];

const VIDEOS = [
  { id: "S6vX_2A-n_8", title: "TaRL Classroom Demo (Level-1)", length: "8:24" },
  { id: "m6E6A2Y77I4", title: "Language Activity: Story Level", length: "5:15" },
  { id: "S9oE66E2E88", title: "Math Activity: Number Recognition", length: "6:40" }
];

export default function ResourcesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest">
          <GraduationCap className="w-4 h-4" /> Teacher Capacity Hub
        </div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Tools for Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 underline decoration-blue-500/30">TaRL Educator</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          Access high-impact training materials, classroom manuals, and creative teaching aids designed by Pratham pedagogy experts.
        </p>
      </div>

      {/* Featured Resource Categories */}
      <div className="grid lg:grid-cols-3 gap-8">
        {RESOURCES.map((res, i) => (
          <div key={i} className="group relative bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col">
            
            {/* Image Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden">
               <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
               <img 
                  src={res.image} 
                  alt={res.title}
                  className="absolute inset-0 object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
               
               {/* Overlay Status */}
               <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white drop-shadow-md">
                 <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    {res.icon} {res.category}
                 </span>
                 <span className="text-xs font-bold">
                    {res.duration || res.size || `${res.items} Games`}
                 </span>
               </div>
            </div>

            {/* Content Container */}
            <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">{res.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                 <Link href={res.link || "#"} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    Start Learning <ChevronRight className="w-4 h-4" />
                 </Link>
                 <button className="p-2.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                    <Download className="w-4 h-4" />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Feed Section */}
      <div className="space-y-10">
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
               <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <MonitorPlay className="w-8 h-8 text-blue-600" /> Pratham TaRL Channel
               </h2>
               <p className="text-slate-500 font-medium">Real classroom demonstrations and activity guides.</p>
            </div>
            <Link href="https://www.youtube.com/@TeachingattheRightLevel" target="_blank" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl flex items-center gap-2 transition-all">
               <Play className="w-4 h-4 fill-current"/> Visit Official Channel
            </Link>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VIDEOS.map((v, i) => (
              <div key={i} className="space-y-4 group">
                 <div className="relative aspect-video rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg">
                    <iframe 
                       src={`https://www.youtube.com/embed/${v.id}`}
                       className="absolute inset-0 w-full h-full"
                       allowFullScreen
                    ></iframe>
                 </div>
                 <div className="px-2">
                    <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{v.title}</h4>
                    <span className="text-xs text-slate-400 font-medium tracking-widest">{v.length} min</span>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Classroom Quick-Guides Section */}
      <div className="bg-slate-900 rounded-[48px] p-12 relative overflow-hidden text-center lg:text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
             <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold tracking-widest uppercase">
                   <Lightbulb className="w-4 h-4" /> Pro Teacher Tip
                </div>
                <h2 className="text-4xl font-black text-white leading-tight">Need a quick refresher for <br/>tomorrow&apos;s Class?</h2>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                   Download our &ldquo;Assessment Cheat-Sheet&rdquo; for at-a-glance level rules and activity targets.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                   <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                      <Download className="w-5 h-5"/> Download Cheat-Sheet
                   </button>
                   <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 flex items-center gap-2">
                      <ExternalLink className="w-5 h-5"/> Visit ASER Portal
                   </button>
                </div>
             </div>
             
             <div className="hidden lg:grid grid-cols-2 gap-4 w-1/3">
                <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 space-y-3 text-white">
                   <BookOpen className="w-8 h-8 text-blue-400" />
                   <span className="text-center text-xs font-bold uppercase tracking-widest opacity-60">Story Level</span>
                </div>
                <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 space-y-3 text-white">
                   <Gamepad2 className="w-8 h-8 text-emerald-400" />
                   <span className="text-center text-xs font-bold uppercase tracking-widest opacity-60">Group Games</span>
                </div>
                <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 space-y-3 text-white md:translate-x-6">
                   <Play className="w-8 h-8 text-orange-400" />
                   <span className="text-center text-xs font-bold uppercase tracking-widest opacity-60">Field Training</span>
                </div>
                <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 space-y-3 text-white md:translate-x-6">
                   <FileText className="w-8 h-8 text-teal-400" />
                   <span className="text-center text-xs font-bold uppercase tracking-widest opacity-60">Admin Guides</span>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}
