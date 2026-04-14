'use client';

import { useState, useEffect } from 'react';

const XP_KEY = 'fln_hub_total_xp';
const STREAK_KEY = 'fln_hub_daily_streak';
const LAST_DATE_KEY = 'fln_hub_last_active';

export function usePoints() {
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);

  // Load initial data
  useEffect(() => {
    const savedXp = localStorage.getItem(XP_KEY);
    const savedStreak = localStorage.getItem(STREAK_KEY);
    const lastDate = localStorage.getItem(LAST_DATE_KEY);

    if (savedXp) {
      const parsedXp = parseInt(savedXp, 10);
      setXp(parsedXp);
      setLevel(Math.floor(Math.sqrt(parsedXp / 100)) + 1);
    }

    if (savedStreak) setStreak(parseInt(savedStreak, 10));

    // Handle Streak Logic
    const today = new Date().toDateString();
    if (lastDate !== today) {
      if (lastDate) {
        const last = new Date(lastDate);
        const diff = (new Date().getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
        if (diff < 2) {
          // Continuous day
          const newStreak = parseInt(savedStreak || '0', 10) + 1;
          setStreak(newStreak);
          localStorage.setItem(STREAK_KEY, newStreak.toString());
        } else {
          // Streak broken
          setStreak(1);
          localStorage.setItem(STREAK_KEY, '1');
        }
      } else {
        setStreak(1);
        localStorage.setItem(STREAK_KEY, '1');
      }
      localStorage.setItem(LAST_DATE_KEY, today);
    }
  }, []);

  const addXP = (amount: number) => {
    const newXp = xp + amount;
    setXp(newXp);
    localStorage.setItem(XP_KEY, newXp.toString());
    
    // Update Level
    const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      // Trigger level up effect (eventually)
    }
  };

  const calculateProgressToNextLevel = () => {
    const currentLevelXp = Math.pow(level - 1, 2) * 100;
    const nextLevelXp = Math.pow(level, 2) * 100;
    const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return {
    xp,
    streak,
    level,
    addXP,
    progress: calculateProgressToNextLevel()
  };
}
