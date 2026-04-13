"use client";
import { useState } from 'react';
import { speakLetter } from '@/lib/speak';
import { ChevronLeft, ChevronRight, Volume2, BookOpen, RotateCcw } from 'lucide-react';

type Question = { q: string; options: string[]; answer: number };
type Story = {
  id: string;
  title: string;
  emoji: string;
  level: string;
  pages: string[];   // each page is one paragraph (2-3 sentences)
  questions: Question[];
};

const STORIES: Story[] = [
  {
    id: 'amba',
    title: 'आंब्याचे झाड',
    emoji: '🥭',
    level: 'सोपी',
    pages: [
      'आमच्या घराजवळ एक मोठे आंब्याचे झाड आहे. ते खूप जुने झाड आहे. आजोबांनी ते लावले होते.',
      'उन्हाळ्यात झाडावर खूप आंबे येतात. आंबे पिवळे आणि गोड असतात. त्यांचा वास खूप छान येतो.',
      'आम्ही झाडाखाली बसतो. सावलीत बसून आम्ही खेळतो. कधी कधी जेवणही तिथेच करतो.',
      'आई आंब्याचे लोणचे बनवते. ती आंब्याचा रस पण करते. रस पिण्यात खूप मजा येते.',
    ],
    questions: [
      { q: 'झाड कोणी लावले होते?', options: ['आईने', 'आजोबांनी', 'बाबांनी', 'शेजाऱ्यांनी'], answer: 1 },
      { q: 'उन्हाळ्यात झाडावर काय येते?', options: ['फुले', 'आंबे', 'पाने', 'पक्षी'], answer: 1 },
      { q: 'आई आंब्यापासून काय बनवते?', options: ['भाजी', 'लोणचे आणि रस', 'दही', 'चटणी'], answer: 1 },
    ],
  },
  {
    id: 'paus',
    title: 'पाऊस',
    emoji: '🌧️',
    level: 'सोपी',
    pages: [
      'पावसाळ्यात काळे ढग येतात. आकाश गडद होते. वारा जोराने वाहू लागतो.',
      'सर्र सर्र पाऊस पडतो. झाडे आणि शेत हिरवे होतात. जमीन ओली होते.',
      'मुले छत्री घेऊन शाळेत जातात. काही मुले पावसात भिजतात. त्यांना खूप मजा येते.',
      'बेडूक डरायला लागतात. नदी तुडुंब भरते. शेतकरी खूश होतात.',
    ],
    questions: [
      { q: 'पावसाळ्यात आकाश कसे होते?', options: ['निळे', 'लाल', 'गडद', 'पांढरे'], answer: 2 },
      { q: 'मुले शाळेत काय घेऊन जातात?', options: ['पुस्तक', 'छत्री', 'डबा', 'खेळणे'], answer: 1 },
      { q: 'पाऊस पाहून कोण खूश होतात?', options: ['मुले', 'शेतकरी', 'बेडूक', 'सर्व'], answer: 1 },
    ],
  },
  {
    id: 'aai',
    title: 'माझी आई',
    emoji: '👩‍👧',
    level: 'सोपी',
    pages: [
      'माझी आई सकाळी लवकर उठते. ती आमच्यासाठी चहा आणि नाश्ता बनवते. ती खूप मेहनत करते.',
      'आई आमच्यासाठी जेवण बनवते. ती भाजी, पोळी आणि आमटी करते. जेवण खूप चविष्ट असते.',
      'शाळेसाठी आई आम्हाला तयार करते. ती दप्तर भरून देते. आम्हाला वेळेत शाळेत पाठवते.',
      'रात्री आई आम्हाला गोष्टी सांगते. तिचा आवाज खूप गोड आहे. आईशिवाय घर नाही.',
    ],
    questions: [
      { q: 'आई सकाळी काय बनवते?', options: ['भाजी', 'चहा आणि नाश्ता', 'लोणचे', 'दही'], answer: 1 },
      { q: 'आई शाळेसाठी काय भरून देते?', options: ['डबा', 'दप्तर', 'छत्री', 'पाणी'], answer: 1 },
      { q: 'रात्री आई काय करते?', options: ['झोपते', 'स्वयंपाक करते', 'गोष्टी सांगते', 'गाणे गाते'], answer: 2 },
    ],
  },
  {
    id: 'sasa',
    title: 'ससा आणि कासव',
    emoji: '🐢',
    level: 'मध्यम',
    pages: [
      'एक ससा आणि एक कासव होते. ससा खूप वेगाने पळत असे. कासव हळूहळू चालत असे.',
      'एकदा दोघांमध्ये शर्यत ठरली. सशाला खूप अभिमान होता. त्याला वाटले तो नक्की जिंकेल.',
      'शर्यत सुरू झाली. ससा खूप वेगाने पळाला. मध्येच तो थकला आणि झोपला.',
      'कासव हळूहळू चालत राहिले. ते कधीही थांबले नाही. शेवटी कासव आधी पोहोचले आणि जिंकले.',
    ],
    questions: [
      { q: 'ससा का जिंकला नाही?', options: ['त्याला त्रास होता', 'तो झोपला', 'तो हरवला', 'तो घाबरला'], answer: 1 },
      { q: 'शर्यत कोणी जिंकली?', options: ['सशाने', 'दोघांनी', 'कासवाने', 'कोणीच नाही'], answer: 2 },
      { q: 'या गोष्टीतून काय शिकतो?', options: ['वेग महत्त्वाचा', 'सातत्य महत्त्वाचे', 'झोप महत्त्वाची', 'काही नाही'], answer: 1 },
    ],
  },
  {
    id: 'shala',
    title: 'माझी शाळा',
    emoji: '🏫',
    level: 'मध्यम',
    pages: [
      'मी रोज शाळेत जातो. शाळा आमच्या गावात आहे. शाळेची इमारत मोठी आणि सुंदर आहे.',
      'शाळेत माझे खूप मित्र आहेत. आम्ही वर्गात एकत्र बसतो. एकमेकांना मदत करतो.',
      'सर आम्हाला गणित, मराठी आणि इतर विषय शिकवतात. त्यांचे शिकवणे खूप छान आहे. आम्ही लक्षपूर्वक ऐकतो.',
      'दुपारच्या सुट्टीत आम्ही खेळतो. क्रिकेट, लपाछपी आणि भोवरा खेळतो. शाळेत खूप मजा येते.',
    ],
    questions: [
      { q: 'शाळा कुठे आहे?', options: ['शहरात', 'गावात', 'डोंगरावर', 'नदीजवळ'], answer: 1 },
      { q: 'दुपारच्या सुट्टीत काय करतात?', options: ['झोपतात', 'जेवतात', 'खेळतात', 'अभ्यास करतात'], answer: 2 },
      { q: 'सर काय शिकवतात?', options: ['फक्त गणित', 'गणित, मराठी आणि इतर विषय', 'फक्त मराठी', 'फक्त चित्रकला'], answer: 1 },
    ],
  },
];

function TappableText({ text, onWordTap }: { text: string; onWordTap: (w: string) => void }) {
  const words = text.split(' ');
  return (
    <span>
      {words.map((word, i) => (
        <span key={i}>
          <button
            onClick={() => onWordTap(word.replace(/[।,?!]/g, ''))}
            className="hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-700 rounded px-0.5 transition-colors active:scale-95 cursor-pointer"
          >
            {word}
          </button>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

type Phase = 'list' | 'reading' | 'quiz' | 'result';

export default function StoryReader() {
  const [phase, setPhase] = useState<Phase>('list');
  const [story, setStory] = useState<Story | null>(null);
  const [pageIdx, setPageIdx] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizChosen, setQuizChosen] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);

  function startStory(s: Story) {
    setStory(s);
    setPageIdx(0);
    setPhase('reading');
  }

  function speakPage(text: string) {
    if (speaking) return;
    setSpeaking(true);
    speakLetter(text, () => setSpeaking(false));
  }

  function speakWord(word: string) {
    speakLetter(word);
  }

  function nextPage() {
    if (!story) return;
    if (pageIdx < story.pages.length - 1) {
      setPageIdx(p => p + 1);
    } else {
      setQuizIdx(0);
      setQuizAnswers([]);
      setQuizChosen(null);
      setQuizFeedback(null);
      setPhase('quiz');
    }
  }

  function prevPage() {
    if (pageIdx > 0) setPageIdx(p => p - 1);
  }

  function answerQuiz(optIdx: number) {
    if (quizFeedback || !story) return;
    setQuizChosen(optIdx);
    const correct = optIdx === story.questions[quizIdx].answer;
    setQuizFeedback(correct ? 'correct' : 'wrong');
    const newAnswers = [...quizAnswers, optIdx];
    setTimeout(() => {
      if (quizIdx < story.questions.length - 1) {
        setQuizIdx(i => i + 1);
        setQuizChosen(null);
        setQuizFeedback(null);
        setQuizAnswers(newAnswers);
      } else {
        setQuizAnswers(newAnswers);
        setPhase('result');
      }
    }, 1200);
  }

  function reset() {
    setPhase('list');
    setStory(null);
    setPageIdx(0);
    setSpeaking(false);
  }

  // ─── Story List ───────────────────────────────────────────────
  if (phase === 'list') {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-rose-500" />
          <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg">पुष्पगंध — कथावाचन</h3>
        </div>
        <p className="text-slate-500 text-sm">एक गोष्ट निवडा आणि वाचण्यास सुरुवात करा.</p>
        <div className="space-y-3">
          {STORIES.map(s => (
            <button key={s.id} onClick={() => startStory(s)}
              className="w-full flex items-center gap-4 p-4 bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800/30 transition-all text-left active:scale-[0.98]">
              <span className="text-4xl shrink-0">{s.emoji}</span>
              <div className="flex-1">
                <p className="font-black text-slate-800 dark:text-slate-100 text-base">{s.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.pages.length} पाने • {s.questions.length} प्रश्न</p>
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded-full shrink-0 ${
                s.level === 'सोपी' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>{s.level}</span>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Reading ──────────────────────────────────────────────────
  if (phase === 'reading' && story) {
    const isLast = pageIdx === story.pages.length - 1;
    const progress = ((pageIdx + 1) / story.pages.length) * 100;

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-rose-100 shadow-sm">
        {/* Story header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 flex items-center gap-3">
          <button onClick={reset} className="text-white/70 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-2xl">{story.emoji}</span>
          <div className="flex-1">
            <h3 className="text-white font-black text-base leading-tight">{story.title}</h3>
            <p className="text-rose-100 text-[11px] font-semibold">पान {pageIdx + 1} / {story.pages.length}</p>
          </div>
          <button onClick={() => speakPage(story.pages[pageIdx])}
            disabled={speaking}
            className={`p-2 rounded-xl transition-all ${speaking ? 'bg-white/20 text-white/50' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
            <Volume2 className={`w-5 h-5 ${speaking ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-rose-100 dark:bg-rose-900/30">
          <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>

        {/* Page content */}
        <div className="p-8 min-h-[200px] flex flex-col justify-center">
          <p className="text-slate-800 dark:text-slate-100 text-xl font-semibold leading-loose text-center">
            <TappableText text={story.pages[pageIdx]} onWordTap={speakWord} />
          </p>
          <p className="text-center text-[11px] text-slate-400 mt-4 font-semibold">
            💡 कोणताही शब्द दाबा — त्याचा उच्चार ऐका
          </p>
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 flex justify-between items-center gap-4">
          <button onClick={prevPage} disabled={pageIdx === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 transition-all text-sm">
            <ChevronLeft className="w-4 h-4" /> मागे
          </button>
          <button onClick={nextPage}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 transition-all text-sm shadow-md">
            {isLast ? '📝 प्रश्न सोडवा' : 'पुढे'} {!isLast && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  }

  // ─── Quiz ─────────────────────────────────────────────────────
  if (phase === 'quiz' && story) {
    const q = story.questions[quizIdx];
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{story.emoji}</span>
            <span className="font-black text-slate-700 dark:text-slate-200">{story.title}</span>
          </div>
          <span className="text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
            प्रश्न {quizIdx + 1}/{story.questions.length}
          </span>
        </div>

        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-5 border border-rose-100 dark:border-rose-800/30">
          <p className="text-slate-800 dark:text-slate-100 font-bold text-lg leading-snug">{q.q}</p>
        </div>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let cls = 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-rose-50 hover:border-rose-300';
            if (quizChosen === i) {
              cls = quizFeedback === 'correct'
                ? 'bg-green-100 border-2 border-green-400 text-green-800 scale-[1.02]'
                : 'bg-red-100 border-2 border-red-400 text-red-800';
            } else if (quizFeedback === 'wrong' && i === q.answer) {
              cls = 'bg-green-100 border-2 border-green-400 text-green-800';
            }
            return (
              <button key={i} onClick={() => answerQuiz(i)}
                className={`w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all duration-200 text-sm ${cls}`}>
                <span className="font-black text-slate-400 mr-2">{String.fromCharCode(2309 + i)}.</span> {opt}
              </button>
            );
          })}
        </div>

        {quizFeedback && (
          <div className={`text-center text-lg font-extrabold animate-bounce ${quizFeedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
            {quizFeedback === 'correct' ? '✅ शाब्बास! बरोबर उत्तर!' : `❌ बरोबर उत्तर: "${q.options[q.answer]}"`}
          </div>
        )}
      </div>
    );
  }

  // ─── Result ───────────────────────────────────────────────────
  if (phase === 'result' && story) {
    const correct = quizAnswers.filter((a, i) => a === story.questions[i].answer).length;
    const pct = Math.round((correct / story.questions.length) * 100);
    const medal = pct === 100 ? '🏆' : pct >= 66 ? '🌟' : '💪';

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-rose-100 shadow-sm text-center space-y-5">
        <div className="text-6xl animate-bounce">{medal}</div>
        <h3 className="font-black text-2xl text-slate-800 dark:text-slate-100">{story.title}</h3>
        <p className="text-slate-500 font-semibold">
          {story.questions.length} पैकी{' '}
          <span className="text-rose-600 font-black text-xl">{correct}</span> बरोबर!
        </p>

        <div className="h-4 bg-rose-100 rounded-full overflow-hidden mx-4">
          <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-1000 rounded-full"
            style={{ width: `${pct}%` }} />
        </div>

        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-4 border border-rose-100 dark:border-rose-800/30 space-y-2">
          {story.questions.map((q, i) => (
            <div key={i} className="flex items-start gap-2 text-left text-sm">
              <span>{quizAnswers[i] === q.answer ? '✅' : '❌'}</span>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">{q.q}</p>
                {quizAnswers[i] !== q.answer && (
                  <p className="text-green-600 text-xs font-bold mt-0.5">बरोबर: {q.options[q.answer]}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => { setPageIdx(0); setPhase('reading'); }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-rose-600 bg-rose-50 border-2 border-rose-200 hover:bg-rose-100 transition-all text-sm">
            <RotateCcw className="w-4 h-4" /> पुन्हा वाच
          </button>
          <button onClick={reset}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 transition-all text-sm shadow-md">
            <BookOpen className="w-4 h-4" /> दुसरी गोष्ट
          </button>
        </div>
      </div>
    );
  }

  return null;
}
