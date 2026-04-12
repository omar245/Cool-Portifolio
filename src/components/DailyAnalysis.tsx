import { Progress } from "@/components/ui/progress";

interface Props {
  percent: number;
  checklistDone: number;
  checklistTotal: number;
  prayersDone: number;
  prayersTotal: number;
  subjectsFilled: number;
  subjectsTotal: number;
  workoutDone: boolean;
}

function getMessage(percent: number): { text: string; emoji: string } {
  if (percent === 100) return { text: "Perfect day! You crushed it!", emoji: "🏆" };
  if (percent >= 80) return { text: "Amazing progress! Almost there!", emoji: "🔥" };
  if (percent >= 60) return { text: "Good job! Keep pushing!", emoji: "💪" };
  if (percent >= 40) return { text: "Decent start. Stay focused!", emoji: "📈" };
  if (percent >= 20) return { text: "Getting started. Don't stop!", emoji: "🚀" };
  return { text: "New day, new opportunities!", emoji: "🌅" };
}

export function DailyAnalysis({
  percent,
  checklistDone,
  checklistTotal,
  prayersDone,
  prayersTotal,
  subjectsFilled,
  subjectsTotal,
  workoutDone,
}: Props) {
  const msg = getMessage(percent);

  return (
    <div className="glass-card p-5 md:p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">📊 Daily Analysis</h2>

      {/* Main progress */}
      <div className="text-center mb-5">
        <p className="text-5xl font-bold text-primary tabular-nums">{percent}%</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {msg.emoji} {msg.text}
        </p>
      </div>

      <div className="progress-glow rounded-full mb-6">
        <Progress value={percent} className="h-3" />
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Checklist" done={checklistDone} total={checklistTotal} />
        <Stat label="Prayers" done={prayersDone} total={prayersTotal} />
        <Stat label="Subjects" done={subjectsFilled} total={subjectsTotal} />
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/30">
          <span className={`h-2 w-2 rounded-full ${workoutDone ? "bg-success" : "bg-muted-foreground"}`} />
          <span className="text-xs text-muted-foreground">Workout</span>
          <span className="ml-auto text-xs font-medium text-foreground">{workoutDone ? "✓" : "—"}</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, done, total }: { label: string; done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/30">
      <span className={`h-2 w-2 rounded-full ${pct === 100 ? "bg-success" : pct > 0 ? "bg-primary" : "bg-muted-foreground"}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="ml-auto text-xs font-medium text-foreground">
        {done}/{total}
      </span>
    </div>
  );
}
