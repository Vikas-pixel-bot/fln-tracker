export const dynamic = 'force-dynamic';
import { getStudentProfile } from "@/app/actions";
import { User, BookOpen, Calculator, MapPin, Calendar, Lightbulb, GraduationCap, Flame, ArrowRight, Clock, ShieldCheck, TrendingUp, Minus, TrendingDown } from "lucide-react";
import Link from "next/link";

const LEVEL_LABELS_LIT = ['Beginner', 'Letter', 'Word', 'Paragraph', 'Story'];
const LEVEL_LABELS_NUM = ['Beginner', 'Num 1-9', 'Num 10-99', 'Num 100-999', 'Addition', 'Subtraction', 'Multiplication', 'Division'];

function getLiteracyActivity(level: number) {
  switch (level) {
    case 0: return { title: "Picture Reading & Sounds", desc: "Use storytelling and picture cards. Ask the student to point to familiar objects and practice recognizing native environmental sounds." };
    case 1: return { title: "Letter Tracing", desc: "Use sand or finger-tracing for Letters. Engage in mind-mapping where the child connects a recognized letter to 3 physical objects." };
    case 2: return { title: "Word Building Games", desc: "Play 'Read-around-the-circle'. Use basic word tiles to form simple 3-letter combinations and practice rhyming words." };
    case 3: return { title: "Stop-and-Ask Reading", desc: "Have the student read short paragraphs aloud. Implement 'Stop-and-Ask' to check their active comprehension instead of just reading speed." };
    case 4: return { title: "Independent Library", desc: "The student is advanced! Assign independent reading time and have them write or vocalize short moral summaries of the stories." };
    default: return { title: "Testing Required", desc: "Please conduct an assessment to generate TaRL activities." };
  }
}

function getNumeracyActivity(level: number) {
  switch (level) {
    case 0: return { title: "Physical Object Counting", desc: "Use stones, sticks, or seeds. Have the student group them and sing number songs to build foundational quantity concepts." };
    case 1: return { title: "Number Flashcards 1-9", desc: "Use visual flashcards. Ask the student to draw lines matching the written number to the correct amount of drawn dots." };
    case 2: return { title: "Bundle Counting (Tens)", desc: "Introduce the concept of '10s' by physically tying 10 sticks into a bundle. Practice jumping on a drawn number line." };
    case 3: return { title: "Expanded Form (Hundreds)", desc: "Use currency play (fake money). Teach them that 125 is one 100-note, two 10-notes, and five 1-coins." };
    case 4: return { title: "Carry-over Games", desc: "Practice addition using visual carry-over grids. Use word problems involving buying fruits to make it practical." };
    case 5: return { title: "Borrowing Roleplay", desc: "Set up a fake shop. Introduce subtraction borrowing mechanics visually using the sticks and bundles from Level 2." };
    case 6: return { title: "Repeated Grouping", desc: "Teach multiplication as repeated addition. Arrange stones in arrays (e.g. 3 rows of 4) and practice table recitation." };
    case 7: return { title: "Equal Sharing Challenges", desc: "The student is advanced! Play games where they must divide a large pile of items equally among 4 friends." };
    default: return { title: "Testing Required", desc: "Please conduct an assessment to generate TaRL activities." };
  }
}

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const student = await getStudentProfile(resolvedParams.id);
  
  if (!student) return <div className="p-10 text-center text-slate-500">Student not found.</div>;

  const latestAssessment = student.assessments[0]; // Ordered by date desc
  const litLevel = latestAssessment?.literacyLevel ?? -1;
  const numLevel = latestAssessment?.numeracyLevel ?? -1;

  const litTaRL = getLiteracyActivity(litLevel);
  const numTaRL = getNumeracyActivity(numLevel);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in zoom-in-95 duration-500">
       
       <Link href="/students" className="text-sm font-bold flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors">
         ← Back to Directory
       </Link>

       {/* Header Profile Card */}
       <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-900/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <User className="w-10 h-10"/>
            </div>
            <div className="flex-1 text-center sm:text-left">
               <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{student.name}</h1>
               <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"><MapPin className="w-4 h-4"/> {student.school.name}</span>
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full"><GraduationCap className="w-4 h-4"/> Class {student.class}</span>
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Gender: {student.gender}</span>
               </div>
            </div>
            <div>
               <Link href="/assessments/live" className="whitespace-nowrap px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 transform hover:-translate-y-1">
                 <Flame className="w-5 h-5"/> Test Now
               </Link>
            </div>
          </div>
       </div>

       {/* TaRL Interventions */}
       {latestAssessment ? (
         <div className="space-y-6">
           <div className="flex items-center gap-3 px-2">
             <Lightbulb className="w-6 h-6 text-yellow-500"/>
             <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Recommended TaRL Activities</h2>
           </div>

           <div className="grid md:grid-cols-2 gap-6">
              {/* Literacy Recommendation */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-900 dark:to-slate-900 border border-orange-100 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
                 <div className="flex items-center gap-3 text-orange-600 dark:text-orange-400 mb-6 font-bold uppercase tracking-wider text-sm">
                   <BookOpen className="w-5 h-5"/> Literacy Intervention
                 </div>
                 <div className="space-y-4">
                   <div className="flex items-baseline gap-2">
                     <span className="text-slate-500 font-medium">Current Level:</span>
                     <span className="text-xl font-black text-slate-800 dark:text-white bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">{LEVEL_LABELS_LIT[litLevel]}</span>
                   </div>
                   <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-300 pt-4">{litTaRL.title}</h3>
                   <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{litTaRL.desc}</p>
                 </div>
              </div>

              {/* Numeracy Recommendation */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
                 <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-6 font-bold uppercase tracking-wider text-sm">
                   <Calculator className="w-5 h-5"/> Numeracy Intervention
                 </div>
                 <div className="space-y-4">
                   <div className="flex items-baseline gap-2">
                     <span className="text-slate-500 font-medium">Current Level:</span>
                     <span className="text-xl font-black text-slate-800 dark:text-white bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">{LEVEL_LABELS_NUM[numLevel]}</span>
                   </div>
                   <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 pt-4">{numTaRL.title}</h3>
                   <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{numTaRL.desc}</p>
                 </div>
              </div>
           </div>

            {/* Audit Trail Timeline */}
            <div className="mt-12 space-y-6">
               <div className="flex items-center justify-between px-2">
                 <h3 className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-blue-500"/> Assessment Audit Trail
                 </h3>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reliability Feed</span>
               </div>

               <div className="relative ml-4 pl-8 border-l-2 border-slate-100 dark:border-slate-800 space-y-8 py-4">
                  {student.assessments.map((a: any, idx: number) => {
                    const prevA = student.assessments[idx + 1];
                    const litGrowth = prevA ? a.literacyLevel - prevA.literacyLevel : 0;
                    const numGrowth = prevA ? a.numeracyLevel - prevA.numeracyLevel : 0;

                    return (
                      <div key={a.id} className="relative group">
                         {/* Timeline Dot */}
                         <div className="absolute -left-[41px] top-4 w-4 h-4 bg-white dark:bg-slate-900 border-4 border-blue-500 rounded-full z-10 group-hover:scale-125 transition-transform"></div>
                         
                         <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                               <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                     <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">{a.term}</span>
                                     <span className="text-slate-900 dark:text-white font-bold">{a.assessorName}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                     <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(a.date).toLocaleDateString()}</span>
                                     <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  {/* Literacy Result */}
                                  <div className="flex flex-col items-end">
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Literacy</span>
                                     <div className="flex items-center gap-2">
                                        <span className="bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-lg text-xs font-black">
                                           {LEVEL_LABELS_LIT[a.literacyLevel]}
                                        </span>
                                        {litGrowth > 0 && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                                        {litGrowth === 0 && idx < student.assessments.length - 1 && <Minus className="w-4 h-4 text-slate-300" />}
                                        {litGrowth < 0 && <TrendingDown className="w-4 h-4 text-red-500" />}
                                     </div>
                                  </div>
                                  {/* Numeracy Result */}
                                  <div className="flex flex-col items-end border-l border-slate-100 dark:border-slate-800 pl-4">
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Numeracy</span>
                                     <div className="flex items-center gap-2">
                                        <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-lg text-xs font-black">
                                           {LEVEL_LABELS_NUM[a.numeracyLevel]}
                                        </span>
                                        {numGrowth > 0 && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                                        {numGrowth === 0 && idx < student.assessments.length - 1 && <Minus className="w-4 h-4 text-slate-300" />}
                                        {numGrowth < 0 && <TrendingDown className="w-4 h-4 text-red-500" />}
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>

         </div>
       ) : (
         <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
            <h3 className="text-xl font-bold text-slate-400">No Assessments Yet</h3>
            <p className="text-slate-500 mt-2">Test this student to generate personalized TaRL curriculum recommendations.</p>
         </div>
       )}
    </div>
  );
}
