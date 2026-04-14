"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import { askPratham } from "@/app/actions/chat";

type Message = { role: "user" | "assistant"; content: string };

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

// Render assistant text — converts basic markdown to styled spans
function BotText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        // Heading: **text** on its own line or ## heading
        if (/^#{1,3}\s/.test(line)) {
          return <p key={i} className="font-black text-slate-900 dark:text-white text-sm mt-2">{line.replace(/^#{1,3}\s/, '')}</p>;
        }
        // Bullet
        if (/^[-•*]\s/.test(line) || /^\d+\.\s/.test(line)) {
          const content = line.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '');
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-[#E8232A] font-black mt-0.5 shrink-0">•</span>
              <span>{renderInline(content)}</span>
            </div>
          );
        }
        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  // Split on **bold** patterns
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part)
      ? <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

const SUGGESTED_QUESTIONS = [
  { q: "What activity works best for a student who can't recognise letters yet?", icon: "📖" },
  { q: "How do I teach matras to a child who mixes up ि and ी?", icon: "✍️" },
  { q: "What does the research say about early reading in mother tongue?", icon: "🔬" },
  { q: "How do I keep 40 students engaged at different levels?", icon: "🏫" },
  { q: "What is the difference between TaRL and traditional teaching?", icon: "💡" },
  { q: "Suggest a number sense activity for a child at ASER Numeracy Level 1", icon: "🔢" },
  { q: "How do I involve parents in their child's reading practice at home?", icon: "👨‍👩‍👧" },
  { q: "What does NEP 2020 say about foundational literacy?", icon: "📜" },
];

export default function PrathamChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  async function send(query: string) {
    if (!query.trim() || loading) return;
    const userMsg: Message = { role: "user", content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const history = [...messages, userMsg].slice(-12); // last 12 for context window
    try {
      const res = await askPratham(query, history.map(m => ({ role: m.role, content: m.content })));
      setMessages(prev => [...prev, { role: "assistant", content: res.content }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[198] sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[200] flex flex-col items-end">
      {/* Chat Panel */}
      {isOpen && (
        <div
          className={[
            "bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col",
            // Mobile: full-width bottom sheet
            "fixed inset-x-0 bottom-0 z-[199] rounded-t-[28px] h-[92dvh]",
            // Desktop: floating card above FAB
            "sm:relative sm:inset-auto sm:bottom-auto sm:z-auto sm:mb-4 sm:w-[360px] md:w-[460px] sm:rounded-[28px] sm:h-auto",
          ].join(" ")}
          style={{ maxHeight: "calc(100dvh - 100px)" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#E8232A] to-[#c41e24] px-5 py-4 flex items-center gap-3 relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-400/20 blur-3xl -mr-16 -mt-16" />
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg ring-2 ring-orange-200/40 shrink-0 relative z-10">
              <PrathamAvatar size={44} />
            </div>
            <div className="relative z-10 flex-1 min-w-0">
              <h4 className="text-white font-black text-base leading-tight">Hi, I'm Pratham!</h4>
              <p className="text-red-100 text-[11px]">Your FLN &amp; education expert 🌟</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-red-200 hover:text-white transition-colors relative z-10 shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="space-y-4 py-2">
                <div className="text-center space-y-2">
                  <PrathamAvatar size={64} className="mx-auto drop-shadow-md" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium px-3">
                    Ask me anything about FLN, early childhood education, TaRL, ASER, teaching strategies, or your mission data.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {SUGGESTED_QUESTIONS.map(({ q, icon }) => (
                    <button key={q} onClick={() => send(q)}
                      className="text-left px-3 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-[11px] font-semibold text-slate-500 hover:text-[#E8232A] transition-all border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                      <span className="text-base shrink-0">{icon}</span>
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 shrink-0 mt-0.5">
                        <PrathamAvatar size={24} />
                      </div>
                    )}
                    <div className={`max-w-[85%] ${msg.role === "user" ? "" : "flex-1 min-w-0"}`}>
                      {msg.role === "user" ? (
                        <div className="px-4 py-2.5 bg-[#E8232A] text-white rounded-2xl rounded-br-sm text-sm font-medium leading-relaxed">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl rounded-bl-sm border border-slate-100 dark:border-slate-700">
                          <BotText text={msg.content} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-7 h-7 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                      <PrathamAvatar size={24} />
                    </div>
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl rounded-bl-sm border border-slate-100 dark:border-slate-700 flex items-center gap-1.5">
                      {[0, 1, 2].map(n => (
                        <div key={n} className="w-2 h-2 bg-[#E8232A] rounded-full animate-bounce"
                          style={{ animationDelay: `${n * 0.18}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            {messages.length > 0 && (
              <button onClick={() => setMessages([])}
                className="w-full mb-2 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest transition-all">
                Clear conversation
              </button>
            )}
            <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm font-medium border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#E8232A]/30 focus:border-[#E8232A] outline-none transition-all"
                placeholder="Ask anything about FLN or education..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()}
                className="p-3 bg-[#E8232A] text-white rounded-xl shadow-md hover:bg-[#c41e24] active:scale-95 transition-all disabled:opacity-40 shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`group flex items-center gap-2 px-3 py-2 rounded-[28px] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-slate-900 dark:bg-slate-800"
            : "bg-gradient-to-r from-[#E8232A] to-[#f97316] hover:from-[#c41e24] hover:to-[#ea6c0a]"
        }`}
      >
        {!isOpen && (
          <span className="text-white text-sm font-black tracking-wide pl-1 hidden sm:inline">
            Ask Pratham!
          </span>
        )}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-white/10" : "bg-white shadow-lg"
        }`}>
          {isOpen ? <X className="w-5 h-5 text-white" /> : <PrathamAvatar size={40} />}
        </div>
      </button>
    </div>
    </>
  );
}
