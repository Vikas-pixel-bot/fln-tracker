"use client";
import { useState } from 'react';

const STORIES = [
  {
    title: 'अंड्यातून फुलपाखरू',
    frames: [
      { emoji: '🥚', caption: 'झाडावर अंडे असते' },
      { emoji: '🐛', caption: 'छोटी अळी बाहेर येते' },
      { emoji: '🍃', caption: 'अळी भरपूर पाने खाते' },
      { emoji: '🦋', caption: 'सुंदर फुलपाखरू होते!' },
    ]
  },
  {
    title: 'बी लावणे',
    frames: [
      { emoji: '🌱', caption: 'जमिनीत छोटी बी लावतो' },
      { emoji: '💧', caption: 'रोज पाणी घालतो' },
      { emoji: '🌿', caption: 'हिरवी कोंब येते' },
      { emoji: '🌸', caption: 'सुंदर फूल फुलते!' },
    ]
  },
  {
    title: 'पावसाळा',
    frames: [
      { emoji: '☁️', caption: 'आकाशात काळे ढग येतात' },
      { emoji: '🌧️', caption: 'पाऊस पडायला लागतो' },
      { emoji: '🌈', caption: 'इंद्रधनुष्य दिसते' },
      { emoji: '☀️', caption: 'पुन्हा ऊन पडते!' },
    ]
  },
  {
    title: 'शाळेत जाणे',
    frames: [
      { emoji: '⏰', caption: 'सकाळी लवकर उठतो' },
      { emoji: '🍽️', caption: 'घरी नाश्ता करतो' },
      { emoji: '🎒', caption: 'दप्तर भरतो' },
      { emoji: '🏫', caption: 'शाळेत पोहोचतो!' },
    ]
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function StorySequence() {
  const [stories] = useState(() => shuffle(STORIES));
  const [storyIdx, setStoryIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const story = stories[storyIdx % stories.length];
  const [order, setOrder] = useState<number[]>(() => shuffle([0, 1, 2, 3]));
  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  function dragStart(pos: number) {
    setDragging(pos);
  }

  function drop(pos: number) {
    if (dragging === null || dragging === pos) return;
    const newOrder = [...order];
    const tmp = newOrder[dragging];
    newOrder[dragging] = newOrder[pos];
    newOrder[pos] = tmp;
    setOrder(newOrder);
    setDragging(null);
  }

  function check() {
    const correct = order.every((frameIdx, pos) => frameIdx === pos);
    setFeedback(correct ? 'correct' : 'wrong');
    setChecked(true);
    setTotal(t => t + 1);
    if (correct) setScore(s => s + 1);
  }

  function next() {
    const nextIdx = storyIdx + 1;
    setStoryIdx(nextIdx);
    setOrder(shuffle([0, 1, 2, 3]));
    setChecked(false);
    setFeedback(null);
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-violet-100 shadow-sm space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">गुण: {score}/{total}</span>
        <span className="text-2xl">📖</span>
      </div>

      <div className="text-center">
        <p className="text-slate-500 font-semibold text-sm">गोष्ट क्रमाने लावा — ड्रॅग करा!</p>
        <p className="text-lg font-extrabold text-violet-700 mt-1">{story.title}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {order.map((frameIdx, pos) => {
          const frame = story.frames[frameIdx];
          const isCorrect = frameIdx === pos;
          let cls = 'border-2 border-violet-200 bg-violet-50';
          if (checked) {
            cls = isCorrect ? 'border-2 border-green-400 bg-green-50' : 'border-2 border-red-300 bg-red-50';
          }
          if (dragging === pos) cls += ' opacity-50 scale-95';
          return (
            <div key={pos}
              draggable
              onDragStart={() => dragStart(pos)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => drop(pos)}
              onClick={() => {
                if (dragging !== null && dragging !== pos) { drop(pos); }
                else setDragging(dragging === pos ? null : pos);
              }}
              className={`rounded-2xl p-3 text-center cursor-grab active:cursor-grabbing transition-all ${cls} ${dragging === pos ? 'ring-2 ring-violet-400' : ''}`}>
              <div className="text-4xl">{frame.emoji}</div>
              <p className="text-xs text-slate-500 mt-1 leading-tight">{frame.caption}</p>
              <div className="mt-2 text-xs font-bold text-violet-400">{pos + 1}</div>
            </div>
          );
        })}
      </div>

      {checked && feedback === 'wrong' && (
        <div className="text-xs text-slate-500 text-center">
          बरोबर क्रम: {story.frames.map(f => f.emoji).join(' → ')}
        </div>
      )}

      {!checked ? (
        <button onClick={check}
          className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 transition-all">
          क्रम तपासा ✓
        </button>
      ) : (
        <div className="space-y-3">
          <div className={`text-center text-xl font-extrabold ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
            {feedback === 'correct' ? '📖 उत्तम गोष्ट!' : '❌ क्रम बरोबर नाही'}
          </div>
          <button onClick={next}
            className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 transition-all">
            पुढील गोष्ट →
          </button>
        </div>
      )}
    </div>
  );
}
