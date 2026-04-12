import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Dumbbell, Coffee, Moon, Gamepad2, Code, Sun } from "lucide-react";
import type { ReactNode } from "react";

interface ScheduleBlock {
  start: string; // "HH:MM"
  end: string;
  label: string;
  icon: ReactNode;
  type: "study" | "break" | "workout" | "programming" | "relax" | "sleep" | "routine";
}

const SCHEDULE: ScheduleBlock[] = [
  { start: "08:00", end: "08:30", label: "Wake up + prayer + breakfast", icon: <Sun className="h-4 w-4" />, type: "routine" },
  { start: "08:30", end: "10:30", label: "Study (2 hours)", icon: <BookOpen className="h-4 w-4" />, type: "study" },
  { start: "10:30", end: "11:00", label: "Break", icon: <Coffee className="h-4 w-4" />, type: "break" },
  { start: "11:00", end: "13:00", label: "Study (2 hours)", icon: <BookOpen className="h-4 w-4" />, type: "study" },
  { start: "13:00", end: "14:00", label: "Rest + lunch + prayer", icon: <Coffee className="h-4 w-4" />, type: "break" },
  { start: "14:00", end: "16:00", label: "Study (2 hours)", icon: <BookOpen className="h-4 w-4" />, type: "study" },
  { start: "16:00", end: "17:00", label: "Programming (1 hour)", icon: <Code className="h-4 w-4" />, type: "programming" },
  { start: "17:00", end: "18:00", label: "Workout + shower", icon: <Dumbbell className="h-4 w-4" />, type: "workout" },
  { start: "18:00", end: "19:00", label: "Programming (1 hour)", icon: <Code className="h-4 w-4" />, type: "programming" },
  { start: "19:00", end: "22:00", label: "Relax + anime", icon: <Gamepad2 className="h-4 w-4" />, type: "relax" },
  { start: "22:30", end: "23:30", label: "Sleep", icon: <Moon className="h-4 w-4" />, type: "sleep" },
];

const TYPE_STYLES: Record<string, { bg: string; border: string; dot: string; text: string }> = {
  study:       { bg: "bg-primary/10",   border: "border-primary/40",   dot: "bg-primary",          text: "text-primary" },
  programming: { bg: "bg-accent/10",    border: "border-accent/40",    dot: "bg-accent",           text: "text-accent" },
  workout:     { bg: "bg-success/10",   border: "border-success/40",   dot: "bg-success",          text: "text-success" },
  break:       { bg: "bg-warning/10",   border: "border-warning/40",   dot: "bg-warning",          text: "text-warning" },
  relax:       { bg: "bg-chart-2/10",   border: "border-chart-2/40",   dot: "bg-chart-2",          text: "text-chart-2" },
  sleep:       { bg: "bg-chart-5/10",   border: "border-chart-5/40",   dot: "bg-chart-5",          text: "text-chart-5" },
  routine:     { bg: "bg-chart-4/10",   border: "border-chart-4/40",   dot: "bg-chart-4",          text: "text-chart-4" },
};

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function getCurrentBlockIndex(): number {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < SCHEDULE.length; i++) {
    const s = timeToMinutes(SCHEDULE[i].start);
    const e = timeToMinutes(SCHEDULE[i].end);
    if (mins >= s && mins < e) return i;
  }
  return -1;
}

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function StudySchedule() {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    function update() {
      setActiveIndex(getCurrentBlockIndex());
    }
    update();
    const id = setInterval(update, 30_000); // check every 30s
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/" className="flex items-center justify-center h-9 w-9 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Study Schedule</h1>
          <p className="text-sm text-muted-foreground">Your daily blueprint for success</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[23px] top-3 bottom-3 w-px bg-border" />

        <div className="space-y-3">
          {SCHEDULE.map((block, i) => {
            const isActive = i === activeIndex;
            const isPast = activeIndex > -1 && i < activeIndex;
            const style = TYPE_STYLES[block.type];

            return (
              <div
                key={i}
                className={`relative flex items-start gap-4 pl-2 transition-all duration-500 ${
                  isActive ? "scale-[1.02]" : isPast ? "opacity-50" : ""
                }`}
              >
                {/* Timeline dot */}
                <div className={`relative z-10 mt-4 flex items-center justify-center`}>
                  <div className={`h-3 w-3 rounded-full transition-all duration-500 ${style.dot} ${
                    isActive ? "ring-4 ring-offset-2 ring-offset-background" : ""
                  }`}
                  style={isActive ? { ringColor: style.dot } : undefined}
                  />
                  {isActive && (
                    <div className={`absolute h-3 w-3 rounded-full ${style.dot} animate-ping`} />
                  )}
                </div>

                {/* Card */}
                <div
                  className={`flex-1 glass-card p-4 border transition-all duration-500 ${style.border} ${
                    isActive ? `${style.bg} shadow-lg` : "hover:bg-secondary/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${style.bg} ${style.text}`}>
                        {block.icon}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                          {block.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(block.start)} — {formatTime(block.end)}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        Now
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
