import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "daily-productivity-v1";
const STREAK_KEY = "daily-productivity-streak";

export interface ProductivityState {
  checklist: Record<string, boolean>;
  subjects: Record<string, string>;
  prayers: Record<string, boolean>;
  workoutDone: boolean;
  workoutNotes: string;
}

interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
}

const defaultState: ProductivityState = {
  checklist: {
    "study-1": false,
    "study-2": false,
    "study-3": false,
    "programming-1": false,
    "programming-2": false,
    "workout": false,
  },
  subjects: {
    Physics: "",
    Chemistry: "",
    Arabic: "",
    Math: "",
    English: "",
    History: "",
  },
  prayers: {
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  },
  workoutDone: false,
  workoutNotes: "",
};

const defaultStreak: StreakData = { currentStreak: 0, bestStreak: 0, lastCompletedDate: null };

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function isYesterday(dateStr: string): boolean {
  const d = new Date(dateStr + "T12:00:00");
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10);
}

function loadState(): ProductivityState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function loadStreak(): StreakData {
  if (typeof window === "undefined") return defaultStreak;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return defaultStreak;
    const data: StreakData = { ...defaultStreak, ...JSON.parse(raw) };
    // If last completed date is older than yesterday, streak is broken
    if (data.lastCompletedDate && !isYesterday(data.lastCompletedDate) && data.lastCompletedDate !== getToday()) {
      return { ...data, currentStreak: 0 };
    }
    return data;
  } catch {
    return defaultStreak;
  }
}

export function useProductivityStore() {
  const [state, setState] = useState<ProductivityState>(defaultState);
  const [streak, setStreak] = useState<StreakData>(defaultStreak);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setState(loadState());
    setStreak(loadStreak());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    }
  }, [streak, mounted]);

  // Completion stats
  const checklistTotal = Object.keys(state.checklist).length;
  const checklistDone = Object.values(state.checklist).filter(Boolean).length;
  const prayersDone = Object.values(state.prayers).filter(Boolean).length;
  const prayersTotal = Object.keys(state.prayers).length;
  const subjectsFilled = Object.values(state.subjects).filter((v) => v.trim().length > 0).length;
  const subjectsTotal = Object.keys(state.subjects).length;

  const totalTasks = checklistTotal + prayersTotal + subjectsTotal + 1;
  const totalDone = checklistDone + prayersDone + subjectsFilled + (state.workoutDone ? 1 : 0);
  const completionPercent = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  // Update streak when 100% is reached
  useEffect(() => {
    if (!mounted) return;
    const today = getToday();
    if (completionPercent === 100 && streak.lastCompletedDate !== today) {
      setStreak((s) => {
        const wasYesterday = s.lastCompletedDate ? isYesterday(s.lastCompletedDate) : false;
        const wasToday = s.lastCompletedDate === today;
        if (wasToday) return s;
        const newCurrent = wasYesterday || s.lastCompletedDate === null ? s.currentStreak + 1 : 1;
        const newBest = Math.max(s.bestStreak, newCurrent);
        return { currentStreak: newCurrent, bestStreak: newBest, lastCompletedDate: today };
      });
    }
  }, [completionPercent, mounted, streak.lastCompletedDate]);

  const toggleChecklist = useCallback((key: string) => {
    setState((s) => ({
      ...s,
      checklist: { ...s.checklist, [key]: !s.checklist[key] },
    }));
  }, []);

  const setSubject = useCallback((subject: string, value: string) => {
    setState((s) => ({
      ...s,
      subjects: { ...s.subjects, [subject]: value },
    }));
  }, []);

  const togglePrayer = useCallback((prayer: string) => {
    setState((s) => ({
      ...s,
      prayers: { ...s.prayers, [prayer]: !s.prayers[prayer] },
    }));
  }, []);

  const toggleWorkout = useCallback(() => {
    setState((s) => ({ ...s, workoutDone: !s.workoutDone }));
  }, []);

  const setWorkoutNotes = useCallback((notes: string) => {
    setState((s) => ({ ...s, workoutNotes: notes }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
    // Don't reset streak data — only daily state
  }, []);

  return {
    state,
    mounted,
    streak,
    toggleChecklist,
    setSubject,
    togglePrayer,
    toggleWorkout,
    setWorkoutNotes,
    reset,
    checklistDone,
    checklistTotal,
    prayersDone,
    prayersTotal,
    subjectsFilled,
    subjectsTotal,
    completionPercent,
  };
}
