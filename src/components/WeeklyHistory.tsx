import { Link } from "@tanstack/react-router";
import { ArrowLeft, TrendingUp, CheckCircle2 } from "lucide-react";
import type { DayHistory } from "@/hooks/use-productivity-store";

interface Props {
  history: DayHistory[];
}

function getBarColor(percent: number): string {
  if (percent === 100) return "bg-success";
  if (percent >= 70) return "bg-primary";
  if (percent >= 40) return "bg-warning";
  return "bg-destructive";
}

function getBarGlow(percent: number): string {
  if (percent === 100) return "shadow-[0_0_12px_oklch(0.7_0.2_150/30%)]";
  if (percent >= 70) return "shadow-[0_0_12px_oklch(0.7_0.18_250/20%)]";
  return "";
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function formatDayLabel(dateStr: string): { day: string; date: string } {
  const d = new Date(dateStr + "T12:00:00");
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  let day: string;
  if (dateStr === today) day = "Today";
  else if (dateStr === yesterdayStr) day = "Yest.";
  else day = d.toLocaleDateString("en-US", { weekday: "short" });

  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return { day, date };
}

export function WeeklyHistory({ history }: Props) {
  const last7 = getLast7Days();
  const historyMap = new Map(history.map((h) => [h.date, h]));

  const weekData = last7.map((date) => ({
    date,
    entry: historyMap.get(date) || null,
  }));

  const avgPercent = weekData.reduce((sum, d) => sum + (d.entry?.percent || 0), 0) / 7;
  const perfectDays = weekData.filter((d) => d.entry?.percent === 100).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/" className="flex items-center justify-center h-9 w-9 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
          <ArrowLeft className="h-4 w-4 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Weekly History</h1>
          <p className="text-sm text-muted-foreground">Your past 7 days at a glance</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/20">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{Math.round(avgPercent)}%</p>
            <p className="text-xs text-muted-foreground">Avg. Completion</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-success/20">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{perfectDays}</p>
            <p className="text-xs text-muted-foreground">Perfect Days</p>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="glass-card p-5 md:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Completion by Day</h2>

        <div className="flex items-end justify-between gap-2 md:gap-4 h-56">
          {weekData.map(({ date, entry }) => {
            const pct = entry?.percent || 0;
            const label = formatDayLabel(date);
            const isToday = date === new Date().toISOString().slice(0, 10);

            return (
              <div key={date} className="flex flex-col items-center flex-1 h-full">
                {/* Percentage label */}
                <span className={`text-xs font-semibold mb-2 tabular-nums ${pct > 0 ? "text-foreground" : "text-muted-foreground/50"}`}>
                  {pct}%
                </span>

                {/* Bar container */}
                <div className="flex-1 w-full flex items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ease-out ${getBarColor(pct)} ${getBarGlow(pct)} ${
                      isToday ? "ring-2 ring-primary/30 ring-offset-1 ring-offset-background" : ""
                    }`}
                    style={{
                      height: `${Math.max(pct, 4)}%`,
                      minHeight: "4px",
                    }}
                  />
                </div>

                {/* Day label */}
                <div className="mt-3 text-center">
                  <p className={`text-xs font-medium ${isToday ? "text-primary" : "text-foreground"}`}>{label.day}</p>
                  <p className="text-[10px] text-muted-foreground">{label.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day-by-day breakdown */}
      <div className="mt-6 space-y-3">
        {weekData.slice().reverse().map(({ date, entry }) => {
          const label = formatDayLabel(date);
          const pct = entry?.percent || 0;
          return (
            <div key={date} className={`glass-card p-4 flex items-center gap-4 transition-all duration-300 ${pct === 100 ? "glow-success" : ""}`}>
              <div className="min-w-[52px] text-center">
                <p className="text-sm font-semibold text-foreground">{label.day}</p>
                <p className="text-[10px] text-muted-foreground">{label.date}</p>
              </div>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getBarColor(pct)}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className={`text-sm font-bold tabular-nums min-w-[40px] text-right ${
                pct === 100 ? "text-success" : pct >= 70 ? "text-primary" : "text-muted-foreground"
              }`}>
                {pct}%
              </span>
              {entry && (
                <div className="hidden md:flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>📋 {entry.checklistDone}/6</span>
                  <span>🕌 {entry.prayersDone}/5</span>
                  <span>📚 {entry.subjectsFilled}/6</span>
                  <span>{entry.workoutDone ? "💪 ✓" : "💪 —"}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
