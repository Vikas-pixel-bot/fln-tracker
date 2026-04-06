"use client";
import { useState } from 'react';

const STORIES = [
  {
    title: 'The Hungry Caterpillar',
    frames: [
      { emoji: '🥚', caption: 'An egg on a leaf' },
      { emoji: '🐛', caption: 'A tiny caterpillar hatches' },
      { emoji: '🍎', caption: 'It eats lots of food' },
      { emoji: '🦋', caption: 'A beautiful butterfly!' },
    ]
  },
  {
    title: 'Plant a Seed',
    frames: [
      { emoji: '🌱', caption: 'A small seed in the soil' },
      { emoji: '💧', caption: 'Water the seed every day' },
      { emoji: '🌿', caption: 'A green sprout appears' },
      { emoji: '🌸', caption: 'A flower blooms!' },
    ]
  },
  {
    title: 'Rainy Day',
    frames: [
      { emoji: '☁️', caption: 'Dark clouds in the sky' },
      { emoji: '🌧️', caption: 'Rain starts falling' },
      { emoji: '🌈', caption: 'Rainbow after the rain' },
      { emoji: '☀️', caption: 'Sunny day again!' },
    ]
  },
  {
    title: 'Going to School',
    frames: [
      { emoji: '⏰', caption: 'Wake up early morning' },
      { emoji: '🍽️', caption: 'Eat breakfast at home' },
      { emoji: '🎒', caption: 'Pack your school bag' },
      { emoji: '🏫', caption: 'Arrive at school!' },
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
        <span className="text-sm font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">Score: {score}/{total}</span>
        <span className="text-2xl">📖</span>
      </div>

      <div className="text-center">
        <p className="text-slate-500 font-semibold text-sm">Put the story in order — drag to swap!</p>
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
          Correct order: {story.frames.map(f => f.emoji).join(' → ')}
        </div>
      )}

      {!checked ? (
        <button onClick={check}
          className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 transition-all">
          Check Order ✓
        </button>
      ) : (
        <div className="space-y-3">
          <div className={`text-center text-xl font-extrabold ${feedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
            {feedback === 'correct' ? '📖 Perfect story!' : '❌ Not quite right'}
          </div>
          <button onClick={next}
            className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90 transition-all">
            Next Story →
          </button>
        </div>
      )}
    </div>
  );
}
