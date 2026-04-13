"use client";

import { useState, useRef, useEffect } from "react";
import { Search, BookOpen, Lightbulb, X } from "lucide-react";
import { askPratham } from "@/app/actions/chat";

type Message = {
  role: "user" | "assistant";
  content: string;
  summary?: string;
  recommendation?: string | null;
  activitySuggestion?: string | null;
};

function PrathamAvatar({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="32" cy="52" rx="14" ry="9" fill="#E8232A" />
      <path d="M24 46 Q32 50 40 46 L38 53 Q32 56 26 53 Z" fill="#c41e24" />
      <circle cx="32" cy="26" r="15" fill="#FDBCB4" />
      <path d="M17 24 Q17 10 32 11 Q47 10 47 24 Q47 16 32 15 Q17 16 17 24Z" fill="#2D1B00" />
      <circle cx="27" cy="25" r="2.2" fill="#1a1a1a" />
      <circle cx="37" cy="25" r="2.2" fill="#1a1a1a" />
      <circle cx="27.8" cy="24.2" r="0.7" fill="white" />
      <circle cx="37.8" cy="24.2" r="0.7" fill="white" />
      <path d="M26 31 Q32 36 38 31" stroke="#c0736a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <rect x="20" y="44" width="11" height="8" rx="1.5" fill="#F97316" />
      <rect x="20.5" y="44.5" width="10" height="7" rx="1" fill="#FED7AA" />
      <line x1="26" y1="44.5" x2="26" y2="51.5" stroke="#F97316" strokeWidth="0.8" />
      <line x1="22" y1="47" x2="25" y2="47" stroke="#F97316" strokeWidth="0.7" />
      <line x1="22" y1="49" x2="25" y2="49" stroke="#F97316" strokeWidth="0.7" />
      <path d="M49 10 L50.2 13.6 L54 13.6 L51 15.8 L52.2 19.4 L49 17.2 L45.8 19.4 L47 15.8 L44 13.6 L47.8 13.6 Z" fill="#F97316" />
    </svg>
  );
}

const SUGGESTED_QUESTIONS = [
  { q: "What activity should I run for Level 1 literacy students?", icon: "📖" },
  { q: "Compare Baseline vs Endline results", icon: "📊" },
  { q: "How do I handle students stuck at Numeracy Beginner?", icon: "🔢" },
  { q: "Suggest today's session plan for Class 3 Maths", icon: "🗓️" },
  { q: "Which schools need the most support?", icon: "🏫" },
  { q: "What is the TaRL daily 90-minute flow?", icon: "⏱️" },
];

export default function PrathamChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(query: string) {
    if (!query.trim() || loading) return;
    const userMsg: Message = { role: "user", content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    try {
      const res = await askPratham(query, history);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: res.insight || "Sorry, I couldn't understand that.",
        summary: res.summary,
        recommendation: res.recommendation,
        activitySuggestion: res.activitySuggestion,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Something went wrong. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end">
      {/* Chat Panel */}
      {isOpen && (
        <div className="mb-4 w-[360px] md:w-[440px] bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
          style={{ maxHeight: "calc(100dvh - 140px)" }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#E8232A] to-[#c41e24] p-5 flex justify-between items-center relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-400/20 blur-3xl -mr-16 -mt-16" />
            <div className="absolute -bottom-6 -left-4 w-24 h-24 bg-red-800/30 blur-2xl" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl ring-2 ring-orange-300/40">
                <PrathamAvatar size={52} />
              </div>
              <div>
                <h4 className="text-white font-black text-lg tracking-tight">Hi, I'm Pratham!</h4>
                <p className="text-red-100 text-[11px] font-semibold">How may I help you? 🌟</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-red-200 hover:text-white transition-colors relative z-10 p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="space-y-4 py-2 text-center">
                <PrathamAvatar size={72} className="mx-auto drop-shadow-md" />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium px-2">
                  I know TaRL pedagogy, your mission data, and how to use this platform. Ask me anything!
                </p>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {SUGGESTED_QUESTIONS.map(({ q, icon }) => (
                    <button key={q} onClick={() => send(q)}
                      className="text-left px-4 py-3 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl text-[11px] font-bold text-slate-500 hover:text-[#E8232A] transition-all border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                      <span>{icon}</span> {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "user" ? (
                      <div className="max-w-[80%] px-4 py-2.5 bg-[#E8232A] text-white rounded-3xl rounded-br-md text-sm font-medium leading-relaxed">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="max-w-[92%] space-y-2">
                        {msg.summary && (
                          <span className="inline-block px-3 py-0.5 bg-red-50 dark:bg-red-900/30 text-[#E8232A] text-[10px] font-black rounded-full uppercase tracking-widest border border-red-100 dark:border-red-800">
                            {msg.summary}
                          </span>
                        )}
                        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-3xl rounded-bl-md text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                          {msg.content}
                        </div>
                        {msg.recommendation && (
                          <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex gap-2 items-start">
                            <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">{msg.recommendation}</p>
                          </div>
                        )}
                        {msg.activitySuggestion && (
                          <div className="px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 flex gap-2 items-start">
                            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Activity</p>
                              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 leading-relaxed">{msg.activitySuggestion}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-3xl rounded-bl-md flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(n => (
                          <div key={n} className="w-1.5 h-1.5 bg-[#E8232A] rounded-full animate-bounce"
                            style={{ animationDelay: `${n * 0.15}s` }} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">Pratham is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 shrink-0">
            {messages.length > 0 && (
              <button onClick={() => setMessages([])}
                className="w-full mb-2 py-1.5 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all">
                Clear conversation
              </button>
            )}
            <form onSubmit={e => { e.preventDefault(); send(input); }} className="relative flex items-center">
              <input
                type="text"
                className="w-full bg-white dark:bg-slate-900 rounded-2xl px-5 py-3.5 pr-14 text-sm font-medium border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-[#E8232A]/40 shadow-sm outline-none"
                placeholder="Ask Pratham anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()}
                className="absolute right-2 p-2 bg-[#E8232A] text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-40">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 px-3 py-2 rounded-[32px] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-slate-900 dark:bg-slate-800"
            : "bg-gradient-to-r from-[#E8232A] to-[#f97316] hover:from-[#c41e24] hover:to-[#ea6c0a]"
        }`}
      >
        {!isOpen && (
          <span className="text-white text-sm font-black tracking-wide pl-1 hidden md:inline">
            Ask Pratham!
          </span>
        )}
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-500 ${
          isOpen ? "bg-white/10" : "bg-white shadow-xl"
        }`}>
          {isOpen
            ? <X className="w-5 h-5 text-white" />
            : <PrathamAvatar size={40} />
          }
        </div>
      </button>
    </div>
  );
}
