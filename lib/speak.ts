"use client";

let voicesReady = false;
const pendingQueue: Array<() => void> = [];

if (typeof window !== 'undefined') {
  const init = () => {
    voicesReady = true;
    pendingQueue.forEach(fn => fn());
    pendingQueue.length = 0;
  };
  if (window.speechSynthesis.getVoices().length > 0) {
    init();
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', init, { once: true });
  }
}

function getBestVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined') return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(v => v.lang === 'mr-IN') ||
    voices.find(v => v.lang.startsWith('mr')) ||
    voices.find(v => v.lang === 'hi-IN') ||
    voices.find(v => v.lang.startsWith('hi')) ||
    voices[0] ||
    null
  );
}

export function speakLetter(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  const doSpeak = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice();
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? 'hi-IN';
    u.rate = 0.7;
    u.pitch = 1.1;
    u.volume = 1;
    if (onEnd) u.onend = onEnd;
    window.speechSynthesis.speak(u);
  };

  if (voicesReady) {
    doSpeak();
  } else {
    pendingQueue.push(doSpeak);
  }
}
