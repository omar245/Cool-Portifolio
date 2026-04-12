import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "daily-productivity-v1";

export interface ProductivityState {
  checklist: Record<string, boolean>;
  subjects: Record<string, string>;
  prayers: Record<string, boolean>;
  workoutDone: boolean;
  workoutNotes: string;
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

export function useProductivityStore() {
  const [state, setState] = useState<ProductivityState>(defaultState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setState(loadState());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, mounted]);

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
  }, []);

  // Completion stats
  const checklistTotal = Object.keys(state.checklist).length;
  const checklistDone = Object.values(state.checklist).filter(Boolean).length;
  const prayersDone = Object.values(state.prayers).filter(Boolean).length;
  const prayersTotal = Object.keys(state.prayers).length;
  const subjectsFilled = Object.values(state.subjects).filter((v) => v.trim().length > 0).length;
  const subjectsTotal = Object.keys(state.subjects).length;

  const totalTasks = checklistTotal + prayersTotal + subjectsTotal + 1; // +1 for workout
  const totalDone = checklistDone + prayersDone + subjectsFilled + (state.workoutDone ? 1 : 0);
  const completionPercent = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  return {
    state,
    mounted,
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
